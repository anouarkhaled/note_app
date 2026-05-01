import React from 'react'
import { BrowserRouter as Router, Routes, Route ,Navigate, BrowserRouter} from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import NotFound from './pages/Notfound';
import ProtectedRoute from './components/ProtectedRoute';
function logout(){
    localStorage.clear()
    return <Navigate to="/login" /> 
}
function RegisterAndLogout(){
  localStorage.clear()
  return <Navigate to="/register" />
}

function App() {

  return (

  
<BrowserRouter>
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/logout" element={<RegisterAndLogout/>} />
      <Route path="*" element={<NotFound/>} />
      <Route path="/logout" element={<logout/>} />
    </Routes>
</BrowserRouter>
  ) 
}

export default App
