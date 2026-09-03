import React, {createContext, useState, useContext, useEffect, useRef} from 'react';
import axios from "../Api/axios.js";
import { useNavigate } from 'react-router-dom';

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

    const navigate = useNavigate();

    const temporizadorError = useRef(null)

    const mostrarError = (error) => {

        if (temporizadorError.current) { 

            clearTimeout(temporizadorError.current); 

        }

        const errores = error.response?.data?.errors;

        if (errores) {

            const mensajes = Object.values(errores).flat();

            setErroresBackEnd(mensajes);

        } else {

            setErroresBackEnd([
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                'Error desconocido'
            ]);
        }

        temporizadorError.current = setTimeout(() => { 
            
            setErroresBackEnd(null); 
            
            temporizadorError.current = null;

        }, 8000);
    };


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

            mostrarError(error);

            return null;
        }
    };

    const login = async (data) => {
        try {
            setErroresBackEnd(null);

            // Inicio sesión y obtengo la cookie de autenticación
            const response = await axios.post('/login', data);

            const { usuario } = response.data;

            if (!usuario) {
                throw new Error('No se recibió correctamente el usuario');
            }

            // Obtengo el perfil completo del usuario
            const perfil = await axios.get('/profile');

            setUsuario(perfil.data.usuario);
            setEstaAutorizado(true);

            return perfil.data.usuario;

        } catch (error) {
            console.error('Error al iniciar sesión:', error);

            mostrarError(error);

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
            navigate('/iniciar-sesion');
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