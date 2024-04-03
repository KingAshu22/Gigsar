"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

function CategorySearch() {

  useEffect(()=>{
    getCategoryList()
  },[])

  const getCategoryList=()=>{
    
  }
  return (
    <div className='mb-10 items-center px-5 flex flex-col gap-2'>
        <h2 className='font-bold
        text-4xl tracking-wide'>
            Search <span className='text-primary'>Singers</span></h2>
        <h2 className='text-gray-500 text-xl'>Search & Book Singers in few clicks</h2>

        <div className="flex w-full mt-3 max-w-sm items-center space-x-2">
      <Input type="text" placeholder="Search..." />
      <Button type="submit">
        <Search className='h-4 w-4 mr-2'/>
        Search</Button>
    </div>
        
        {/* Display List of Category  */}
        <div className='grid grid-cols-4 mt-5 md:grid-cols-4 lg:grid-cols-4 '>
          <Link href={'/artist/singer'} className='flex flex-col text-center items-center
          p-5 bg-blue-50 m-2 rounded-lg cursor-pointer
          gap-2 hover:scale-110 transition-all ease-in-out'>
            <Image src="/artist-type/singer.svg"
            alt='icon'
            width={40}
            height={40}/>
            <label className='text-primary text-sm'>Singer</label>
          </Link>
          <Link href={'/artist/live-band'} className='flex flex-col text-center items-center
          p-5 bg-blue-50 m-2 rounded-lg cursor-pointer
          gap-2 hover:scale-110 transition-all ease-in-out'>
            <Image src="/artist-type/band.svg"
            alt='icon'
            width={40}
            height={40}/>
            <label className='text-primary text-sm'>Bands</label>
          </Link>
          <Link href={'/artist/musician'} className='flex flex-col text-center items-center
          p-5 bg-blue-50 m-2 rounded-lg cursor-pointer
          gap-2 hover:scale-110 transition-all ease-in-out'>
            <Image src="/artist-type/musician.svg"
            alt='icon'
            width={40}
            height={40}/>
            <label className='text-primary text-sm'>Musician</label>
          </Link>
          <Link href={'/artist/dj'} className='flex flex-col text-center items-center
          p-5 bg-blue-50 m-2 rounded-lg cursor-pointer
          gap-2 hover:scale-110 transition-all ease-in-out'>
            <Image src="/artist-type/dj.svg"
            alt='icon'
            width={40}
            height={40}/>
            <label className='text-primary text-sm'>DJ</label>
          </Link>
        </div>
    </div>
  )
}

export default CategorySearch