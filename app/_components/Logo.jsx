import React from 'react'
import Image from 'next/image'

function Logo() {
  return (
    <div className='flex items-center gap-2'>
        <Image src={"/logo.png"} alt='logo'  width={30} height={30}></Image>
        <h2 className='font-bold text-xl'>Workspace</h2>
    </div>
  )
}

export default Logo