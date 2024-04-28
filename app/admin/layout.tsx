import React, { ReactNode } from 'react'

interface Props{
    children: ReactNode
}

const Adminlayout = ({ children }: Props) => {
    return (
        <div className='p-8'>
            {/* <AdminMenu /> */}
            {children}
        </div>
    )
}

export default Adminlayout