import React, {useEffect} from 'react'
import Card from "../UI/Card"
import Input from "../UI/Input"
import Button from "../UI/Button"
import Label from "../UI/Label"
import Textarea from '../UI/Textarea'
import {useForm} from "react-hook-form"
import {useNavigate, useParams} from "react-router-dom"
import { useRecordatorio } from '../../Context/RecordatorioContexto'

function RecordatorioForm() {

  const {register, handleSubmit, formState: {errors}, setValue} = useForm();

  const navigate = useNavigate();

  const {
    editarRecordatorio, 
    crearRecordatorio,
    obtenerRecordatorioPorId,
    recordatorioError
  } = useRecordatorio();

  const params = useParams();

  const onSubmit = handleSubmit(async (data) => {
    let respuesta;
    
    if (params.id) {
      respuesta = await editarRecordatorio(data, params.id)
    } else {
      respuesta = await crearRecordatorio(data)
    }

    if (respuesta) {
    navigate('/recordatorios');
    }
  });

  useEffect(() => {
    if (params.id) {
      obtenerRecordatorioPorId(params.id).then((recordatorioItem) =>{
        setValue('descripcion', recordatorioItem.descripcion);
        setValue( 'fecha_evento', recordatorioItem.fecha_evento?.slice(0, 10) );
        setValue( 'hora_evento', recordatorioItem.hora_evento?.slice(0, 5) );
        setValue('minutos_antes', recordatorioItem.minutos_antes)
      })
    }
  }, [params.id])


  return (
    <div>
      <Card>
        {recordatorioError.map((error, i) => (
          <p key={i} className="text-red-500">
            {error.message || error.error || error}
          </p>
        ))}

        <h2 className='text-3xl font-bold text-white my-4 flex items-center justify-center'>
          {params.id ? "Editar recordatorio" : "crear recordatorio"}
        </h2>

        <form onSubmit={onSubmit}>
          <Label htmlFor="descripcion">Descripcion</Label>
          <Textarea 
            {...register('descripcion', {
              required: 'La descripción es requerida'
          })}/> 
          {errors.descripcion && (
            <p className="text-red-500">
              {errors.descripcion.message}
            </p>
          )}

          <Label htmlFor="fecha_evento">Fecha del Recordatorio</Label>
          <Input type="date"
              {...register('fecha_evento', {
                  required: 'La fecha es requerida'
              })}
          />
          {errors.fecha_evento && (
            <p className="text-red-500">
              {errors.fecha_evento.message}
            </p>
          )}

          <Label htmlFor="hora_evento">Hora del Recordatorio</Label>
          <Input type="time"
              {...register('hora_evento', {
                  required: 'La hora es requerida'
              })}
          />
          {errors.hora_evento && (
            <p className="text-red-500">
              {errors.hora_evento.message}
            </p>
          )}

          <Label htmlFor="hora_evento">Aviso del recordatorio</Label>
          <select {
            ...register('minutos_antes', {
              required: 'Debe seleccionar cuando recibir el aviso'
            })}>
              <option value="5">5 minutos antes</option>
              <option value="10">10 minutos antes</option>
              <option value="15">15 minutos antes</option>
            </select>
            {errors.minutos_antes && (
              <p className="text-red-500">
                {errors.hora_evento.message}
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

export default RecordatorioForm