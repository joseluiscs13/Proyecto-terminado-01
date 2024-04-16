import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage } from "../auth";
import { useAuthStore } from "../hooks";
import { useEffect } from "react";
import { MusicDetectPage } from "../md-app/pages/MusicDetectPage";

export const AppRouter = () => {
    // const authStatus = 'not-authenticated'; //'authenticated' 
    const {status,checkAuthToken} = useAuthStore();

    useEffect(() => {
      checkAuthToken();
    }, [])
    
    if(status === 'checking'){
      return (
        <h3 style={{color: "white"}}>Cargando...</h3>
      )
    }

  return (
    <Routes>
        {
            (status === 'not-authenticated') 
            ? (
                <>
                  <Route path="/auth/*" element={<LoginPage/>}/>
                  <Route path="/*" element={<Navigate to="/auth/login"/>}/>
                </>
              )
            : (
                <>
                  <Route path="/" element={<MusicDetectPage/>}/>
                  <Route path="/*" element={<Navigate to="/"/>}/>
                </>
              )
        }

    </Routes>
  )
}
