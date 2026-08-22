import React, {
    createContext,
    useState,
    useContext,
    useEffect
} from 'react';

import axios from "../Api/axios.js";

export const ContextoAutorizacion = createContext();

export const useAuth = () => {

    const context = useContext(ContextoAutorizacion);

    if (!context) {
        throw new Error(
            'useAuth debe utilizarse dentro de AuthProvider'
        );
    }

    return context;
};


export function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(null);
    const [estaAutorizado, setEstaAutorizado] = useState(false);
    const [erroresBackEnd, setErroresBackEnd] = useState(null);
    const [cargando, setCargando] = useState(true);


    // Verificar sesión al cargar la aplicación
    useEffect(() => {

        const verificarSesion = async () => {

            try {

                const response = await axios.get('/profile');

                setUsuario(response.data.usuario);
                setEstaAutorizado(true);

            } catch (error) {
                
                if (error.response?.status !== 401) {
                    console.error(
                        'Error al verificar la sesión:',
                        error
                    );
                }

                setUsuario(null);
                setEstaAutorizado(false);

            } finally {

                setCargando(false);
            }
        };

        verificarSesion();

    }, []);

    const register = async (data) => {
        try {

            setErroresBackEnd(null);

            const response = await axios.post(
                '/register',
                data
            );

            const { usuario } = response.data;

            if (!usuario) {
                throw new Error(
                    'No se recibió correctamente el usuario'
                );
            }

            setUsuario(usuario);
            setEstaAutorizado(true);

            return usuario;

        } catch (error) {

            console.error(
                'Error al registrar el usuario:',
                error
            );

            setErroresBackEnd([
                error.response?.data?.error ||
                error.message ||
                'Error desconocido'
            ]);

            return null;
        }
    };

    const login = async (data) => {
        try {

            setErroresBackEnd(null);

            const response = await axios.post(
                '/login',
                data
            );

            const { usuario } = response.data;

            if (!usuario) {
                throw new Error(
                    'No se recibió correctamente el usuario'
                );
            }

            setUsuario(usuario);
            setEstaAutorizado(true);

            return usuario;

        } catch (error) {

            console.error(
                'Error al iniciar sesión:',
                error
            );

            setErroresBackEnd([
                error.response?.data?.error ||
                error.message ||
                'Error desconocido'
            ]);

            return null;
        }
    };

    const logout = async () => {
        try {

            await axios.post('/logout');

        } catch (error) {

            console.error(
                'Error al cerrar sesión:',
                error
            );

        } finally {

            setUsuario(null);
            setEstaAutorizado(false);
            setErroresBackEnd(null);
        }
    };


    return (
        <ContextoAutorizacion.Provider
            value={{
                usuario,
                estaAutorizado,
                erroresBackEnd,
                cargando,
                register,
                login,
                logout
            }}
        >
            {children}
        </ContextoAutorizacion.Provider>
    );
}