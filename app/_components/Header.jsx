"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  

function Header() {
    const Menu=[
        {
            id:1,
            name:'Home',
            path:'/'
        },
        {
            id:2,
            name:'Explore',
            path:'/explore'
        },
        {
            id:3,
            name:'Contact Us',
            path:'/'
        },
    ]
  return (
    <div className='flex items-center 
    justify-between p-4 shadow-sm'>
        <div className='flex items-center gap-10'>
        <Link href="/"><h1 className='font-bold text-4xl text-primary'>Gigsar</h1></Link>
            <ul className='md:flex gap-8 hidden'>
                {Menu.map((item,index)=>(
                    <Link href={item.path} key={index}>
                    <li className='hover:text-primary
                    cursor-pointer hover:scale-105
                    transition-all ease-in-out'>{item.name}</li>
                    </Link>
                ))}
            </ul>
        </div>
        
    </div>
  )
}

export default Header