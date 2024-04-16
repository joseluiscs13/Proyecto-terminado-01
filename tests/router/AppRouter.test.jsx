import { render, screen } from "@testing-library/react";
import { useAuthStore } from "../../src/hooks"
import { AppRouter } from "../../src/router/AppRouter";
import { MemoryRouter } from "react-router-dom";

jest.mock('../../src/hooks/useAuthStore');

describe('Pruebas en <AppRouter/>', () => {
    const mockCheckAuthToken = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    test('Debe de mostrar la pantalla de carga y llamar checkAuthToken', () => {
        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockCheckAuthToken
        })

        render(<AppRouter/>);
        expect(screen.getByText('Cargando...')).toBeTruthy();
        expect(mockCheckAuthToken).toHaveBeenCalled();
    })

    test('Debe de mostrar el login en caso de no estar autenticado', () => {
        useAuthStore.mockReturnValue({
            status: 'not-authenticated',
            checkAuthToken: mockCheckAuthToken
        })

        const {container} = render(
            <MemoryRouter>
                <AppRouter/>
            </MemoryRouter>
        );

        expect(screen.getByText('Ingreso')).toBeTruthy();
        expect(container).toMatchSnapshot();
    });

    test('Debe de mostrar el calendario si estamos autenticados', () => {
        useAuthStore.mockReturnValue({
            status: 'authenticated',
            checkAuthToken: mockCheckAuthToken
        })

        const {container} = render(
            <MemoryRouter>
                <AppRouter/>
            </MemoryRouter>
        );
    });
})