import {  useEffect } from 'react'
import { signOut } from '@/helpers/auth'


export default function Logout() {
  useEffect(()=> {
    signOut().then(window.location.href= "/")
  }, [])
  
  
}