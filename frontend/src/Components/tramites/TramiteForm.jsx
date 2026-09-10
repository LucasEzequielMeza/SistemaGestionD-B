import React, {useEffect, useState} from 'react'
import Card from '../UI/Card'
import Input from '../UI/Input'
import Label from '../UI/Label'
import Button from '../UI//Button'
import {useForm} from 'react-hook-form'
import {useNavigate, useParams} from 'react-router-dom'
import {useTramite} from '../../Context/TramiteContexto'


function TramiteForm() {

  const {register, handleSubmit, formState: {errors}, setValue} = useForm({
    defaultValues: {
        tipo_tramite_id: "",
        intervencion_policial: "no"
    }
  });

  const [tiposTramite, setTiposTramite] = useState([])

  const [errorNumeroCarpeta, setErrorNumeroCarpeta] = useState("");

  const navigate = useNavigate();

  const {
    actualizarTramite, 
    crearTramite,
    obtenerTramitePorId,
    tramiteError,
    obtenerTiposTramite,
    limpiarTramiteError
  } = useTramite();

  const params = useParams();

  const onSubmit = handleSubmit(async (data) =>{

    limpiarTramiteError();
    setErrorNumeroCarpeta("");

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
            setValue('intervencion_policial',
                tramiteItem.intervencion_policial ? "si" : "no"
            );
        });
    }
}, [params.id]);

  useEffect(() => {
      obtenerTiposTramite().then((data) => {
          setTiposTramite(data);

          if (!params.id) {

            const tipoLES = data.find((tipo) => tipo.codigo === "LES");

            if (tipoLES) {
                setValue("tipo_tramite_id", tipoLES.id);
            }
          }  
      });
  }, []);

  useEffect(() => {

    if (tramiteError.length > 0) {

        setErrorNumeroCarpeta(
            tramiteError[0].error || tramiteError[0].message || tramiteError[0]
        );

        const temporizador = setTimeout(() => {
            setErrorNumeroCarpeta("");
        }, 10000);

        return () => clearTimeout(temporizador);
    }

  }, [tramiteError]);


  return (
    <div>
      <Card>
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
          {errorNumeroCarpeta && (
              <p className="text-red-500">
                  {errorNumeroCarpeta}
              </p>
          )}
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

            {errors.intervencion_policial && (
                <p className="text-red-500">
                    {errors.intervencion_policial.message}
                </p>
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