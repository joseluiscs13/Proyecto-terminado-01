import { useDispatch, useSelector } from "react-redux"
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store/auth/authSlice";
import { mdApi } from "../api";

export const useAuthStore = () => {
    const {status, user, errorMessage} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const data = {
        uid: '576769be61efe80a9f534a8',
        name: 'Angel',
    }

    const startLogin = async({email, password}) => {
        dispatch( onChecking() );

        // Llegar al backend
        try {
            const {data} = await mdApi.post('/auth', {email, password});
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({name: data.name, uid: data.uid}) );
            // console.log("Se mando info al backend, Login")
        } catch (error) {
            dispatch( onLogout('Credenciales incorrectas') );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }

    const startRegister = async({email, password, name}) => {
        dispatch( onChecking() );

        // Llegar al backend
        try {
            const {data} = await mdApi.post('/auth/new', {email, password, name});
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({name: data.name, uid: data.uid}) );
            // console.log("Se mando info al backend, Register");
        } catch (error) {
            dispatch( onLogout(error.response.data?.msg || '--') );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }

    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if(!token) return dispatch( onLogout() );

        try {
            const {data} = await calendarApi.get('auth/renew');
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({name: data.name, uid: data.uid}) );
            // console.log("Se mando info al backend, CheckAuth")
        } catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch( onLogout() );
    }

    return {
        //* Properties
        errorMessage,
        status,
        user,

        //* Methods
        startLogin,
        startRegister,
        startLogout,
        checkAuthToken,
    }
}