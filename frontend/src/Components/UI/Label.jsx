import React from 'react'

function Label({children, htmlFor}) {

    return (
        <label
            className="block text-sm font-medium text-white"
            htmlFor={htmlFor}
        >
            {children}
        </label>
    )
}

export default Label