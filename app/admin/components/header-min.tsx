import React from 'react'
import Menu from '../../components/menu'


interface TitleProps {
    title: string;
}


const HeaderMin: React.FC<TitleProps> = ({ title }) => {
  return (
    <div className='flex items-center gap-6 pb-16'>
        <Menu adminPage={true}/>
        <h2 className='z-5 uppercase tracking-wider font-bold max-[700px]:text-xl'>{title}</h2>
    </div>
  )
}

export default HeaderMin
