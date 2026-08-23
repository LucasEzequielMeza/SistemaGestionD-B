import React from "react"
import Card from "../Components/UI/Card"
import Input from "../Components/UI/Input"
import Label from "../Components/UI/Label"
import Button from "../Components/UI/Button"
import {useForm} from "react-hook-form"
import {Link, useNavigate} from "react-router-dom"
import { useAuth } from "../Context/ContextoAutorizacion.jsx"

function RegisterPage() {

  const {register: registerContexto, erroresBackEnd} = useAuth()

  const navigate = useNavigate()

  const {register,
    handleSubmit, 
    formState: { errors }
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const usuario = await registerContexto(data)
    if (usuario) {
      navigate("/tramites")
    }
  });

  return (
    <div className='h-[calc(100vh-8rem)] flex items-center justify-center'>
      <Card>
        <h1 className='text-2xl font-bold text-white flex items-center justify-center'>Registro</h1>

        {erroresBackEnd?.length > 0 && (
          <div className="mt-4 mb-4 rounded-md bg-red-500/10 border border-red-500 p-3">

            {erroresBackEnd.map((error, index) => (
              <p
                key={index}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </p>
            ))}

          </div>
        )}

        <form onSubmit={onSubmit}>

          <Label htmlFor="nombre">Nombre</Label>
          <Input {...register("nombre", { required: true})} type="text" placeholder="Ingresar nombre" />
          {
            errors.nombre && <p className="text-red-500">El nombre es requerido</p>
          }

          <Label htmlFor="apellido">Apellido</Label>
          <Input {...register("apellido", { required: true})} type="text" placeholder="Ingresar apellido" />
          {
            errors.apellido && <p className="text-red-500">El apellido es requerido</p>
          }

          <Label htmlFor="email">Mail</Label>
          <Input {...register("mail", { required: true})} type="email" placeholder="Correo electrónico" />
          {
            errors.mail && <p className="text-red-500">El correo es requerido</p>
          }

          <Label htmlFor="contraseña">Contraseña</Label>
          <Input {...register("contraseña", { required: true})} type="password" placeholder="Contraseña" />
          {
            errors.contraseña && <p className="text-red-500">La contraseña es requerida</p>
          }

          <div className="flex justify-center mt-4">
            <Button type="submit">
              Crear cuenta
            </Button>
          </div>
        </form>
        <div className='flex justify-between my-4'>
          <p className="text-center text-gray-400">
            ¿Tienes una cuenta? <Link className='font-bold' to="/iniciar-sesion">Ingresa aquí</Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default RegisterPage