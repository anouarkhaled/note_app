import {Navigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import api from '../api';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants';
import { useState, useEffect } from 'react';
function ProtectedRoute({children}){

    useEffect(()=>{
        auth().catch(error=>(setIsAuthorized(false)));
    },[]);
        
    const [isAuthorized,setIsAuthorized]=useState(null);
    const refreshToken=async()=>{
       const refreshToken=localStorage.getItem(REFRESH_TOKEN);
       try{
        const response=await api.post('/api/token/refresh/',
            {refresh:refreshToken,    
            });
        if (response.status===200){
           localStorage.setItem(ACCESS_TOKEN,response.data.access);
           setIsAuthorized(true);
       }
       else{
        setIsAuthorized(false);
         }
        }
       catch(error){
        console.error('Error refreshing token:',error);
        setIsAuthorized(false);
       }

    }
    const auth = async()=>{
        const accessToken=localStorage.getItem(ACCESS_TOKEN);
        if(!accessToken){
            setIsAuthorized(false);
            return;
        }
        const decodedToken=jwtDecode(accessToken);
        const tokenExp=decodedToken.exp;
        const now=Date.now()/1000;
        if(tokenExp<now){
                await refreshToken();
            }
            else{
             setIsAuthorized(true);
            }
    }


    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }
    return isAuthorized ? children : <Navigate to="/login" />;

}
export default ProtectedRoute;
