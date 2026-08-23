export const validateSchema = (schema) => {

    return (req, res, next) => {

        const resultado = schema.safeParse(req.body);

        if (!resultado.success) {

            const errores = {};

            resultado.error.issues.forEach((error) => {

                const campo = error.path[0];

                if (!errores[campo]) {
                    errores[campo] = [];
                }

                errores[campo].push(error.message);
            });

            return res.status(400).json({
                message: 'Error de validación',
                errors: errores
            });
        }

        req.body = resultado.data;

        next();
    };
};