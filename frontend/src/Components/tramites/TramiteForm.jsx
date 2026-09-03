import React, {useEffect, useState} from 'react'
import Card from '../UI/Card'
import Input from '../UI/Input'
import Label from '../UI/Label'
import Button from '../UI//Button'
import {useForm} from 'react-hook-form'
import {useNavigate, useParams} from 'react-router-dom'
import {useTramite} from '../../Context/TramiteContexto'


function TramiteForm() {

  const {register, handleSubmit, formState: {errors}, setValue, watch} = useForm();

  const [tiposTramite, setTiposTramite] = useState([])

  const navigate = useNavigate();

  const huboIntervencionPolicial = watch("intervencion_policial");

  const {
    actualizarTramite, 
    crearTramite,
    obtenerTramitePorId,
    tramiteError,
    obtenerTiposTramite
  } = useTramite();

  const params = useParams();

  const onSubmit = handleSubmit(async (data) =>{
    let respuesta;

    if (params.id) {
      respuesta = await actualizarTramite(params.id, data);
    } else {
      respuesta = await crearTramite(data);
    }

    if (respuesta) {
      navigate('/tramites');
    }
  })

  useEffect(() => {
    if (params.id) {
        obtenerTramitePorId(params.id).then((tramiteItem) => {
            setValue('tipo_tramite_id', tramiteItem.tipo_tramite_id);
            setValue('numero_carpeta', tramiteItem.numero_carpeta);
            setValue('nombre_cliente', tramiteItem.nombre_cliente);
        });
    }
}, [params.id]);

  useEffect(() => {
      obtenerTiposTramite().then((data) => {
          setTiposTramite(data);
      });
  }, []);


  return (
    <div>
      <Card>
        {tramiteError.map((error, i) => (
          <p key={i} className='text-red-500'>
              {error.message || error.error || error}
          </p>
        ))}
        <h2 className='text-3xl font-bold text-white my-4 flex items-center justify-center'>
          {params.id ? "Editar tramite" : "Crear tramite"}
        </h2>
         <form onSubmit={onSubmit}>
          <Label htmlFor="tipo_tramite_id">Tipo de tramite</Label>
            <select className="bg-zinc-800 px-3 py-2 block my-2 w-full text-white"
              {...register("tipo_tramite_id", {
                required: "El tipo de trámite es requerido"
              })}
            >
              {tiposTramite.map((tipo) => (
                <option key={tipo.id} value={tipo.id}  className="bg-zinc-800 text-white">
                  {tipo.codigo}
                </option>
              ))}
          </select>
          {errors.tipo_tramite_id && (
              <p className='text-red-500'>
                  El tipo de tramite es requerido
              </p>
          )}
          <Label htmlFor="numero_carpeta">Numero de carpeta</Label>
          <Input type="text" {...register('numero_carpeta', { required: true })} />
          {errors.numero_carpeta && (
            <p className='text-red-500'>El numero de carpeta es requerido</p>
          )}
          <Label htmlFor="nombre_cliente">Nombre del cliente</Label>
          <Input type="text" {...register('nombre_cliente', { required: true })} />
          {errors.nombre_cliente && (
            <p className='text-red-500'>El nombre del cliente es requerido</p>
          )}
            <Label htmlFor="intervencion_policial">
              ¿Hubo intervención policial?
            </Label>
            <select
              className="bg-zinc-800 px-3 py-2 block my-2 w-full text-white"
              {...register("intervencion_policial", {
                required: "Debe indicar si hubo intervención policial"
              })}
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
            {huboIntervencionPolicial === "si" && (
              <>
                <Label htmlFor="documentacion_policial">
                  Documentación policial
                </Label>

                <select
                  className="bg-zinc-800 px-3 py-2 block my-2 w-full text-white"
                  {...register("documentacion_policial", {
                    required: "Debe seleccionar la documentación"
                  })}
                >
                  <option value="declaracion_testimonial">
                    Declaración testimonial
                  </option>

                  <option value="denuncia_penal">
                    Denuncia penal
                  </option>
                </select>
              </>
            )}
          <Button type="submit">
              {params.id ? "Actualizar" : "Crear"}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default TramiteForm