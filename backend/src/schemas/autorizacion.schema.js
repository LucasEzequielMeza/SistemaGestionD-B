import { z } from 'zod';


export const registerSchema = z.object({

    nombre: z.string({
        required_error: 'El nombre es requerido',
        invalid_type_error: 'El nombre debe ser un texto'
    })
    .trim()
    .min(3, {
        message: 'El nombre debe tener al menos 3 caracteres'
    })
    .max(50, {
        message: 'El nombre no puede superar los 50 caracteres'
    }),

    apellido: z.string({
        required_error: 'El apellido es requerido',
        invalid_type_error: 'El apellido debe ser un texto'
    })
    .trim()
    .min(3, {
        message: 'El apellido debe tener al menos 3 caracteres'
    })
    .max(50, {
        message: 'El apellido no puede superar los 50 caracteres'
    }),

    mail: z.string({
        required_error: 'El correo electrónico es requerido',
        invalid_type_error: 'El correo electrónico debe ser un texto'
    })
    .trim()
    .toLowerCase()
    .email({
        message: 'El correo electrónico no es válido'
    })
    .max(100, {
        message: 'El correo electrónico no puede superar los 100 caracteres'
    }),

    contraseña: z.string({
        required_error: 'La contraseña es requerida',
        invalid_type_error: 'La contraseña debe ser un texto'
    })
    .min(8, {
        message: 'La contraseña debe tener al menos 8 caracteres'
    })
    .max(72, {
        message: 'La contraseña no puede superar los 72 caracteres'
    })
    .regex(/[A-Z]/, {
        message: 'La contraseña debe contener al menos una letra mayúscula'
    })
    .regex(/[a-z]/, {
        message: 'La contraseña debe contener al menos una letra minúscula'
    })
    .regex(/[0-9]/, {
        message: 'La contraseña debe contener al menos un número'
    })
    .regex(/[!@#$%^&*(),.?":{}|<>_\-\\[\]\/+=;'`~]/, {
        message: 'La contraseña debe contener al menos un carácter especial'
    })

}).strict();


export const loginSchema = z.object({

    mail: z.string({
        required_error: 'El correo electrónico es requerido',
        invalid_type_error: 'El correo electrónico debe ser un texto'
    })
    .trim()
    .toLowerCase()
    .email({
        message: 'El correo electrónico no es válido'
    }),

    contraseña: z.string({
        required_error: 'La contraseña es requerida',
        invalid_type_error: 'La contraseña debe ser un texto'
    })
    .min(8, {
        message: 'La contraseña debe tener al menos 8 caracteres'
    })
    .max(72, {
        message: 'La contraseña no puede superar los 72 caracteres'
    })

}).strict();