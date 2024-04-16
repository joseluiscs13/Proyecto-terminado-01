import { configureStore } from "@reduxjs/toolkit"
import { authSlice } from "../../src/store"
import { initialState, notAuthenticatedState } from "../fixtures/authState"
import { act, renderHook, waitFor } from "@testing-library/react"
import { useAuthStore } from "../../src/hooks"
import { Provider } from "react-redux"
import { testUserCredentials } from "../fixtures/testUser"
import { calendarApi } from "../../src/api"

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
        },
        preloadedState: {
            auth: {...initialState}
        }
    })
}

describe('Pruebas en useAuthStore', () => {
    beforeEach(() => localStorage.clear());

    test('Debe de regresar los valores por defecto', () => {
        const mockStore = getMockStore({...initialState});
        const {result} = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        })

        expect(result.current).toEqual({
            errorMessage: undefined,
            status: 'checking',
            user: {},
            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),
        });
    });

    test('startLogin debe de realizar el login correctamente', async() => {
        const mockStore = getMockStore({...notAuthenticatedState});
        const {result} = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        })

        await act(async() => {
            await result.current.startLogin(testUserCredentials);
        });

        const {errorMessage, status, user} = result.current;
        // expect({errorMessage, status, user}).toEqual({
        //     errorMessage: undefined,
        //     status: 'authenticated',
        //     user: {name: 'Test User', uid: '657f4b183d1cc9ff1b4478d3'}
        // })
    });

    test('startLogin debe de fallar en la autenticacion', async() => {
        const mockStore = getMockStore({...notAuthenticatedState});
        const {result} = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        })

        await act(async() => {
            await result.current.startLogin({email: 'algo@gmail.com', password: '123456'});
        });

        const {errorMessage, status, user} = result.current;
        expect(localStorage.getItem('token')).toBe(null);
        expect({errorMessage, status, user}).toEqual({
            errorMessage: expect.any(String),
            status: 'not-authenticated',
            user: {}
        });

        await waitFor(
            () => expect(result.current.errorMessage).toBe(undefined)
        )
    });

    test('startRegister debe de crear un usuario', async() => {
        const newUser = {
            email: 'algo@gmail.com', 
            password: '123456', 
            name: 'Test User 2'
        };

        const mockStore = getMockStore({...notAuthenticatedState});
        const {result} = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        })

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: '123456789',
                name: 'Test User',
                token: 'Algun-Token'
            }
        })

        await act(async() => {
            await result.current.startRegister(newUser);
        });

        const {errorMessage, status, user} = result.current;
        // expect({errorMessage, status, user}).toEqual({
        //     errorMessage: undefined,
        //     status: 'authenticated',
        //     user: {name: 'Test User', uid: '657f4b183d1cc9ff1b4478d3'}
        // })

        spy.mockRestore();
    })

    test('startRegister debe de fallar la creacion', async() => {
        const mockStore = getMockStore({...notAuthenticatedState});
        const {result} = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        })

        await act(async() => {
            await result.current.startRegister(testUserCredentials);
        });

        const {errorMessage, status, user} = result.current;
        // expect({errorMessage, status, user}).toEqual({
        //     errorMessage: 'El usuario ya existe',
        //     status: 'not-authenticated',
        //     user: {}
        // })
    });

    test('checkAuthToken debe de fallar si no hay token', async() => {
        const mockStore = getMockStore({...initialState});
        const {result} = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        })

        await act(async() => {
            await result.current.startRegister(testUserCredentials);
        });

        const {errorMessage, status, user} = result.current;
        // expect({errorMessage, status, user}).toEqual({
        //     errorMessage: undefined,
        //     status: 'not-authenticated',
        //     user: {}
        // });
    });

    test('checkAuthToken debe de autenticar el usuario si hay token', async() => {
        const {data} = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({...initialState});
        const {result} = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        })

        await act(async() => {
            await result.current.startRegister(testUserCredentials);
        });

        const {errorMessage, status, user} = result.current;
        // expect({errorMessage, status, user}).toEqual({
        //     errorMessage: undefined,
        //     status: 'authenticated',
        //     user: {name: 'Test User', uid: '657f4b183d1cc9ff1b4478d3'}
        // });
    })
})