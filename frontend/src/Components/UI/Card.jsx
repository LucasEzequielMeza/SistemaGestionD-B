import React from 'react'

function Card({children, className}) {

    return (
        <div className={`bg-[#5A1725] p-6 rounded-md text-white ${className || ''}`}>
            {children}
        </div>
    )
}

export default Card