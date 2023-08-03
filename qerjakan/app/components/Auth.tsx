'use client'

import React, { useEffect } from 'react'
import { SafeCurrentUser } from '../types'
import { redirect, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'


interface AuthProps {
    session: SafeCurrentUser
    children: React.ReactNode;
}
const AuthComponent:React.FC<AuthProps> = ({
    session,children
}) => {
    const router = useRouter()
    useEffect(()=> {
        if(!session){
            redirect("/")
            Swal.fire({
                icon: 'warning',
                title: 'Please Login to your account',
                showConfirmButton: false,
                timer: 1500
              }).then(()=> router.push("/"))
        }
        console.log()
    },[router, session])
    
  return (
    <>{children}</>
  )
}

export default AuthComponent