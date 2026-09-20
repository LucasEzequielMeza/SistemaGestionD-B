import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/ContextoAutorizacion'
import Button from '../Components/UI/Button'

export default function PerfilPage() {
    const { usuario } = useAuth()
    const navigate = useNavigate()

    if (!usuario) {
        return null
    }

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <h1 className="text-3xl font-bold text-black text-center mb-6">
                Mi perfil
            </h1>

            <div className="bg-[#5A1725] text-white rounded-md p-6">
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-white/60 text-center mb-2">
                            Nombre completo
                        </p>
                        <p className="font-semibold text-center mb-2">
                            {usuario.nombre} {usuario.apellido}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-white/60 text-center mb-2">
                            Correo electrónico
                        </p>
                        <p className="font-semibold text-center">
                            {usuario.mail}
                        </p>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/20 text-center">
                    <Button
                        onClick={() => navigate('/perfil/cambiar-contraseña')}
                    >
                        Cambiar contraseña
                    </Button>
                </div>
            </div>
        </div>
    )
}