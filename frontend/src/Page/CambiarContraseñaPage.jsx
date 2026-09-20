import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../Api/axios.js'
import Input from '../Components/UI/Input'
import Button from '../Components/UI/Button'

function CambiarContraseñaPage() {
    const navigate = useNavigate()

    const [datos, setDatos] = useState({
        contraseñaActual: '',
        nuevaContraseña: '',
        repetirContraseña: ''
    })

    const [errores, setErrores] = useState({
        contraseñaActual: '',
        nuevaContraseña: '',
        repetirContraseña: '',
        general: ''
    })

    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(false)

    useEffect(() => {
        if (!mensaje) {
            return
        }

        const temporizador = setTimeout(() => {
            setMensaje('')
        }, 8000)

        return () => clearTimeout(temporizador)
    }, [mensaje])

    useEffect(() => {
        if (!errores.general) {
            return
        }

        const temporizador = setTimeout(() => {
            setErrores((erroresActuales) => ({
                ...erroresActuales,
                general: ''
            }))
        }, 8000)

        return () => clearTimeout(temporizador)
    }, [errores.general])

    const manejarCambio = (e) => {
        const { name, value } = e.target

        setDatos({
            ...datos,
            [name]: value
        })

        setErrores((erroresActuales) => ({
            ...erroresActuales,
            [name]: '',
            general: ''
        }))
    }

    const manejarSubmit = async (e) => {
        e.preventDefault()

        setErrores({
            contraseñaActual: '',
            nuevaContraseña: '',
            repetirContraseña: '',
            general: ''
        })

        setMensaje('')
        setCargando(true)

        try {
            const respuesta = await axios.put(
                '/usuarios/password',
                datos
            )

            setMensaje(respuesta.data.message)

            setDatos({
                contraseñaActual: '',
                nuevaContraseña: '',
                repetirContraseña: ''
            })

        } catch (error) {
            if (error.response?.data?.errors) {
                const erroresBackEnd = error.response.data.errors

                setErrores({
                    contraseñaActual: erroresBackEnd.contraseñaActual?.[0] || '',
                    nuevaContraseña: erroresBackEnd.nuevaContraseña?.[0] || '',
                    repetirContraseña: erroresBackEnd.repetirContraseña?.[0] || '',
                    general: ''
                })
            } else {
                setErrores({
                    contraseñaActual: '',
                    nuevaContraseña: '',
                    repetirContraseña: '',
                    general: error.response?.data?.error ||
                        'Ocurrió un error al cambiar la contraseña'
                })
            }
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-3xl font-bold text-black text-center mb-6">
                Cambiar contraseña
            </h1>

            <div className="bg-[#5A1725] rounded-md p-6 text-white">
                <form onSubmit={manejarSubmit} className="space-y-5">

                    <div>
                        <label className="block text-gray-300 mb-2">Contraseña actual</label>
                        <Input
                            type="password"
                            name="contraseñaActual"
                            value={datos.contraseñaActual}
                            onChange={manejarCambio}
                        />
                        {errores.contraseñaActual && (
                            <p className="text-red-300 text-sm mt-2">
                                {errores.contraseñaActual}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Nueva contraseña</label>
                        <Input
                            type="password"
                            name="nuevaContraseña"
                            value={datos.nuevaContraseña}
                            onChange={manejarCambio}
                        />
                        {errores.nuevaContraseña && (
                            <p className="text-red-300 text-sm mt-2">
                                {errores.nuevaContraseña}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Repetir nueva contraseña</label>
                        <Input
                            type="password"
                            name="repetirContraseña"
                            value={datos.repetirContraseña}
                            onChange={manejarCambio}
                        />
                        {errores.repetirContraseña && (
                            <p className="text-red-300 text-sm mt-2">
                                {errores.repetirContraseña}
                            </p>
                        )}
                    </div>
                    {errores.general && (
                        <p className="text-red-300 text-sm">
                            {errores.general}
                        </p>
                    )}

                    {mensaje && (
                        <p className="text-green-300 text-sm">
                            {mensaje}
                        </p>
                    )}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="submit"
                            disabled={cargando}
                        >
                            {cargando
                                ? 'Cambiando...'
                                : 'Cambiar contraseña'
                            }
                        </Button>

                        <Button type="button" onClick={() => navigate('/perfil')}>
                            Cancelar
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default CambiarContraseñaPage