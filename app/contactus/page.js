"use client"
import Contact from '@/components/contactus'
import { useRouter } from 'next/navigation'
import React from 'react'

function contactuspage() {
  const router = useRouter();
  return (
    <Contact/>
  )
}

export default contactuspage