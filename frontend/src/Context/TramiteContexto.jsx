import React, {createContext, useContext, useState} from "react";
import axios from "../Api/axios.js";

export const TramiteContexto = createContext();

export const useTramite = () => {

    const context = useContext(TramiteContexto);

    if (!context) {
        throw new Error(
            "useTramite debe utilizarse dentro de TramiteProvider"
        );
    }

    return context;
};


export function TramiteProvider({ children }) {

    const [tramites, setTramites] = useState([]);
    const [tramite, setTramite] = useState(null);
    const [tramiteError, setTramiteError] = useState([])


    const obtenerTramites = async () => {
        try {
            const respuesta = await axios.get('/tramites');
            setTramites(respuesta.data)
        } catch (error) {
            if (error.response) {
                setTramiteError([error.response.data])
            }
        }
    };


    const obtenerTramitePorId = async (id) => {
        try {
            const respuesta = await axios.get(`/tramites/${id}`);
            setTramite(respuesta.data);
            return respuesta.data
        } catch (error) {
            if (error.response) {
                setTramiteError([error.response.data])
            }
        }
    };

    const buscarTramite = async (search) => {
        try {
            const respuesta = await axios.get('/tramites/buscar', {
                params: {
                    search
                }
            })
            
            return respuesta.data;
        } catch (error) {
                        if (error.response) {
                setTramiteError([error.response.data])
            }
        }
    }

    const obtenerTiposTramite = async () => {
        try {
            const respuesta = await axios.get('/tramites/tipos-tramite');
            return respuesta.data
        } catch (error) {
            if (error.response) {
                setTramiteError([error.response.data])
            }
        }
    }

    const crearTramite = async (data) => {
        try {
            const respuesta = await axios.post('/tramites', data);
            setTramites([...tramites, respuesta.data]);
            return respuesta.data;
        } catch (error) {
            if (error.response) {
                setTramiteError([error.response.data]);
            }
        }
    };


    const actualizarTramite = async (id, data) => {
        try {
            const respuesta = await axios.put(`/tramites/${id}`, data);
            return respuesta.data
        } catch (error) {
            if (error.response) {
                setTramiteError([error.response.data])
            }
        }
    };

    const enviarReactivarTramite = async (id, data) => {
        try {
            const respuesta = await axios.put(`/tramites/${id}/enviar-reactivar`, data);
            return respuesta.data
        } catch (error) {
            if (error.response) {
                setTramiteError([error.response.data])
            }
        }
    }

    const reactivarTramite = async (id, data) => {
        try {
            const respuesta = await axios.put(`/tramites/${id}/reactivar`, data);
            return respuesta.data
        } catch (error) {
            if (error.response) {
                setTramiteError([error.response.data])
            }
        }
    }

    const reactivarTramiteEnBaja = async (id, data) => {
        try {
            const respuesta = await axios.put(`/tramites/${id}/reactivar-baja`, data);
            return respuesta.data
        } catch (error) {
            if (error.response) {
                setTramiteError([error.response.data])
            }
        }
    }

    const darDeBajaTramite = async (id, data) => {
        try {
            const respuesta = await axios.put(`/tramites/${id}/baja`, data);
            return respuesta.data
        } catch (error) {
            if (error.response) {
                setTramiteError([error.response.data])
            }
        }
    }

    const obtenerTramitesPorEstado = async (estado) => {
        try {
            const respuesta = await axios.get(`/tramites/estado/${estado}`);
            return respuesta.data;
        } catch (error) {
            if (error.response) {
                setTramiteError([error.response.data]);
            }
        }
    };


    return (
        <TramiteContexto.Provider
            value={{
                tramites,
                tramite,
                tramiteError,
                obtenerTramites,
                obtenerTramitePorId,
                buscarTramite,
                obtenerTiposTramite,
                crearTramite,
                actualizarTramite,
                enviarReactivarTramite,
                reactivarTramite,
                darDeBajaTramite,
                obtenerTramitesPorEstado,
                reactivarTramiteEnBaja
            }}
        >
            {children}
        </TramiteContexto.Provider>
    );
}