import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTramite } from '../Context/TramiteContexto'
import Card from '../Components/UI/Card'

function DashboardPage() {

    const { obtenerResumenDashboard } = useTramite()

    const navigate = useNavigate()

    const [resumen, setResumen] = useState({
        tramites_activos: 0,
        tramites_completos: 0,
        documentacion_pendiente: 0,
        tramites_baja: 0,
        tramites_reactivar: 0
    })

    useEffect(() => {
        const cargarDashboard = async () => {
            const datos = await obtenerResumenDashboard()
            if (datos) {
                setResumen(datos)
            }
        }
        cargarDashboard()
    }, [])

    return (
        <div>
            <h1 className="text-4xl text-black font-bold my-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                <Card className="cursor-pointer hover:bg-zinc-800 transition">
                    <div onClick={() => navigate('/tramites')}>
                        <h2 className="text-lg font-bold text-white">Trámites activos</h2>
                        <p className="text-3xl font-bold text-white mt-2">
                            {resumen.tramites_activos}
                        </p>
                    </div>
                </Card>

                <Card className="cursor-pointer hover:bg-zinc-800 transition">
                    <div onClick={() => navigate('/tramites/finalizados')}>
                        <h2 className="text-lg font-bold text-white">Trámites completos</h2>
                        <p className="text-3xl font-bold text-white mt-2">
                            {resumen.tramites_completos}
                        </p>
                    </div>
                </Card>

                <Card className="cursor-pointer hover:bg-zinc-800 transition">
                    <div onClick={() => navigate('/tramites/reactivar')}>
                        <h2 className="text-lg font-bold text-white">En reactivar</h2>
                        <p className="text-3xl font-bold text-white mt-2">
                            {resumen.tramites_reactivar}
                        </p>
                    </div>
                </Card>

                <Card className="cursor-pointer hover:bg-zinc-800 transition">
                    <div onClick={() => navigate('/tramites/baja')}>
                        <h2 className="text-lg font-bold text-white">Trámites de baja</h2>
                        <p className="text-3xl font-bold text-white mt-2">
                            {resumen.tramites_baja}
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default DashboardPage