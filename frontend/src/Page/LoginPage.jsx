import React from 'react'
import Card from "../Components/UI/Card"
import Input from "../Components/UI/Input"
import Button from '../components/UI/Button';
import Label from '../components/UI/Label';
import axios from "../Api/axios.js"
import {Link, useNavigate} from "react-router-dom"
import {useForm} from "react-hook-form"


function LoginPage() {

  const {register, handleSubmit} = useForm ();
  
  const onSubmit = handleSubmit(async (data) => {
    try {
      const respuesta = await axios.post("/login", data);

      console.log(respuesta.data);

    } catch (error) {
      console.error(error);
    }
  })


return (
    <div className='h-[calc(100vh-8rem)] flex items-center justify-center'>
      <Card>
        <h1 className='text-2xl font-bold text-white flex items-center justify-center'>Iniciar Sesión</h1>
        <form onSubmit={onSubmit}>
          <Label htmlFor='mail'>Mail</Label>
          <Input
            type='email'
            placeholder='Ingrese su usuario'
            {...register('mail', {
              required: true,
            })}
          />
          <Label htmlFor='contraseña'>Contraseña</Label>
          <Input
            type='password'
            placeholder='Ingrese su contraseña'
            {...register('contraseña', {
              required: true,
            })}
          />
          <div className="flex justify-center mt-4">
            <Button type="submit">
              Iniciar sesion
            </Button>
          </div>
        </form>
        <div className='flex justify-between my-4'>
          <p className='text-center text-gray-400'>
            ¿No tienes una cuenta? <Link className='font-bold' to='/register'>Regístrate aquí</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage