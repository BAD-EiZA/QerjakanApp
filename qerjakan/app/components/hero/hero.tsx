'use client'
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react'

const Hero = () => {

  return ( 
    <div className='max-w-[1640px] mx-auto'>
        <div className='max-h-[800px] relative -z-10'>
            {/* <div className='absolute w-full h-full text-gray-200 max-h-[600px] bg-black/40 flex flex-col justify-center'>
                
            </div> */}
            <img className='w-full max-h-[800px] object-cover' src="https://images-ext-1.discordapp.net/external/st6GLe2w4cX696n9P7SCzADuLUH385xDkJaK6sT1tq4/https/umbrellacreative.com.au/wp-content/uploads/2020/01/hide-the-pain-harold-why-you-should-not-use-stock-photos-1024x683.jpg?width=1050&height=700" alt="/" />
        </div>
    </div>
  )
}

export default Hero