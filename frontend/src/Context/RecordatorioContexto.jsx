import React, {createContext, useContext, useState} from 'react'
import axios from '../Api/axios.js'

export const RecordatorioContexto = createContext();

export const useRecordatorio = () => {

  const context = useContext(RecordatorioContexto);

  if (!context) {
    throw new Error (
      "useRecodatorio debe utilizarse dentro del RecordatorioProvider"
    )
  }

  return context;

}

export function RecordatorioProvider ({children}) {

  const [recordatorios, setRecordatorios] = useState([]);
  const [recordatorio, setRecordatorio] = useState([]);
  const [recordatorioError, setRecordatorioError] = useState([]);

  const obtenerRecordatorios = async () => {
    try {
      const respuesta = await axios.get('/recordatorios');
      setRecordatorios(respuesta.data)
    } catch (error) {
      if (error.response) {
        setRecordatorioError([error.response.data])
      }
    }
  }

  const obtenerRecordatorioPorId = async (id) => {

    try {
      const respuesta = await axios.get(`/recordatorios/${id}`)
      setRecordatorio(respuesta.data)
      return respuesta.data
    } catch (error) {
      if (error.response) {
        setRecordatorioError([error.response.data])
      }
    }
  }

  const crearRecordatorio = async (data) => {
    try {
      const respuesta = await axios.post('/recordatorios', data);
      setRecordatorios([...recordatorios, respuesta.data]);
      return respuesta.data
    } catch (error) {
      if (error.response) {
        setRecordatorioError([error.response.data])
      }
    }
  }

  const editarRecordatorio = async (data, id) => {
    try {
      const respuesta = await axios.put(`/recordatorios/${id}`, data);
      return respuesta.data;
    } catch (error) {
      if (error.response) {
        setRecordatorioError([error.response.data])
      }
    }
  }

  const eliminarRecordatorio = async (id) => {
    try {
        const respuesta = await axios.delete(`/recordatorios/${id}`);
        setRecordatorios(
            recordatorios.filter(
                (recordatorio) => recordatorio.id !== id
            )
        );
        return respuesta.data;
    } catch (error) {
        if (error.response) {
            setRecordatorioError([error.response.data]);
        }
    }
  }

  const finalizarRecordatorio = async (id, data) => {
    try {
      const respuesta = await axios.put(`/recordatorios/${id}/finalizar`, data);
      return respuesta.data;
    } catch (error) {
      if (error.response) {
        setRecordatorioError([error.response.data])
      }
    }
  }
  
  return (
    <RecordatorioContexto.Provider
    value={{
      recordatorios,
      recordatorio, 
      recordatorioError,
      obtenerRecordatorios,
      obtenerRecordatorioPorId,
      crearRecordatorio,
      editarRecordatorio,
      eliminarRecordatorio,
      finalizarRecordatorio
    }}>
      {children}
    </RecordatorioContexto.Provider>
  )

}