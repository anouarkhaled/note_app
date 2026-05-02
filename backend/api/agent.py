import os
from typing import TypedDict
from langchain_core.messages import HumanMessage
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt


class AgentState(TypedDict):
    user_input: str
    title: str
    content: str


def generate_step(state: AgentState) -> AgentState:
    llm = ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0.3,
        api_key=os.getenv("GROQ_API_KEY"),
    )

    from pydantic import BaseModel

    class NoteSchema(BaseModel):
        title: str
        content: str

    structured_llm = llm.with_structured_output(NoteSchema)

    from langchain_core.messages import SystemMessage
    result = structured_llm.invoke([
        SystemMessage(content=(
            "You are a note-taking assistant. "
            "Generate a concise title (max 10 words) and well-structured content."
        )),
        HumanMessage(content=state["user_input"]),
    ])

    return {**state, "title": result.title, "content": result.content}


def human_review(state: AgentState) -> AgentState:
    interrupt({"title": state["title"], "content": state["content"]})
    return state


def save_note(state: AgentState) -> AgentState:
    return state


memory = MemorySaver()


def build_graph():
    graph = StateGraph(AgentState)
    graph.add_node("generate", generate_step)
    graph.add_node("human_review", human_review)
    graph.add_node("save", save_note)
    graph.set_entry_point("generate")
    graph.add_edge("generate", "human_review")
    graph.add_edge("human_review", "save")
    graph.add_edge("save", END)
    return graph.compile(checkpointer=memory, interrupt_before=["human_review"])


agent_graph = build_graph()


def start_agent(user_input: str, thread_id: str) -> dict:
    config = {"configurable": {"thread_id": thread_id}}
    agent_graph.invoke(
        {"user_input": user_input, "title": "", "content": ""},
        config=config,
    )
    state = agent_graph.get_state(config)
    interrupted = state.next and "human_review" in state.next
    if interrupted:
        current = state.values
        return {"status": "pending", "title": current["title"], "content": current["content"]}
    return {"status": "done"}


def confirm_agent(thread_id: str, user, confirmed: bool):
    from .models import Note
    config = {"configurable": {"thread_id": thread_id}}
    if not confirmed:
        return None
    agent_graph.invoke(None, config=config)
    state = agent_graph.get_state(config)
    values = state.values
    return Note.objects.create(
        title=values["title"],
        content=values["content"],
        author=user,
    )
