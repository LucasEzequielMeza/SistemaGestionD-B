import { forwardRef } from 'react'
import React from 'react'

export const Input = forwardRef((props, ref) => {

    return (
        <input
            ref={ref}
            className="bg-[#701D2D] border border-white/20 rounded-md px-3 py-2 block my-2 w-full text-white placeholder:text-white/60 focus:outline-none focus:border-white/50"
            {...props}
        />
    );
});

export default Input