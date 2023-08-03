'use client';
import useAllCategories from '@/app/hooks/useCategories';
import React from 'react'

const Footer = () => {
    const {data: allCat = []} = useAllCategories()
  return (
    <div className="border max-w-[1640px] flex justify-center mx-auto px-10 py-5">
      <div className="container">
        
        
        <div className="flex items-center justify-center py-3">
          <div className=" w-max flex items-center gap-5">
            <h2>©2023, UMN Technology</h2>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Footer