import { authSlice, clearErrorMessage, onLogin, onLogout } from "../../../src/store/auth/authSlice";
import { authenticatedState, initialState } from "../../fixtures/authState";
import { testUserCredentials } from "../../fixtures/testUser";

describe('Pruebas en authSlice', () => {
    test('Debe de regresar el estado inicial', () => {
        expect(authSlice.getInitialState()).toEqual(initialState);
    });

    test('Debe de regresar un login', () => {
        const state = authSlice.reducer( initialState, onLogin(testUserCredentials) );
        expect(state).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined
        })
    });

    test('Debe de realizar el logout', () => {
        const state = authSlice.reducer( authenticatedState, onLogout() );
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined
        });
    });

    test('Debe de realizar el logout', () => {
        const errorMessage = 'Credenciales no validas';
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage) );
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: errorMessage
        });
    });

    test('Debe de limpiar el mensaje de error', () => {
        const errorMessage = 'Credenciales no validas';
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage) );
        const newState = authSlice.reducer( state, clearErrorMessage() );
        expect(newState.errorMessage).toBe(undefined);
    });
})