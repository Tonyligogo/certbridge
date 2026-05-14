import React from 'react'
import Navbar from './components/navbar'

export default function PublicSiteLayout({children}:{children: React.ReactNode}) {
  return (
    <div className='bg-slate-50 min-h-screen flex flex-col'>
        <Navbar/>
        <main className='flex-1'>
        {children}
        </main>
    </div>
  )
}