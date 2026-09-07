import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTramite } from '../../Context/TramiteContexto'
import axios from '../../Api/axios.js'
import Card from '../UI/Card'
import Button from '../UI/Button'
import DocumentosTramite from './DocumentosTramite'

function TramiteDetalle() {

    const { id } = useParams()
    const navigate = useNavigate()

    const { tramite, obtenerTramitePorId, tramiteError } = useTramite()

    const [documentos, setDocumentos] = useState([])
    const [cargandoDocumentos, setCargandoDocumentos] = useState(true)

    useEffect(() => {
        obtenerTramitePorId(id)
        obtenerDocumentos()
    }, [id])

    const obtenerDocumentos = async () => {

        try {
            setCargandoDocumentos(true)
            const respuesta = await axios.get(`/documentos/tramite/${id}`)
            setDocumentos(respuesta.data)

        } catch (error) {
            console.error('Error al obtener los documentos:', error)
            setDocumentos([])
        } finally {
            setCargandoDocumentos(false)
        }
    }

    if (!tramite) {
        return (
            <div className="flex justify-center mt-10">
                <p>Cargando trámite...</p>
            </div>
        )
    }

    return (

        <div>
            <div className="flex items-center justify-between my-6">
                <h1 className="text-4xl font-bold text-zinc-950">
                    Detalle del trámite
                </h1>
                <Button onClick={() => navigate('/tramites')}>
                    Volver
                </Button>
            </div>
            {tramiteError.length > 0 && (
                <div className="mb-4">
                    {tramiteError.map((error, index) => (

                        <p key={index} className="text-red-500">
                            {error.message || error.error || error}
                        </p>

                    ))}
                </div>
            )}
            <div className="mt-6">
                {cargandoDocumentos ? (
                    <Card>
                        <p>Cargando documentos...</p>
                    </Card>
                ) : (
                    <DocumentosTramite
                        documentos={documentos}
                        setDocumentos={setDocumentos}
                    />

                )}
            </div>
        </div>

    )

}

export default TramiteDetalle