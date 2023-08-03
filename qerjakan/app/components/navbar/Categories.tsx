'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
import { 
  GiBarn, 
  GiBoatFishing, 
  GiCactus, 
  GiCastle, 
  GiCaveEntrance, 
  GiForestCamp, 
  GiIsland,
  GiWindmill
} from 'react-icons/gi';
import { FaSkiing } from 'react-icons/fa';
import { BsSnow } from 'react-icons/bs';
import { IoDiamond } from 'react-icons/io5';
import { MdOutlineVilla } from 'react-icons/md';

import CategoryBar from "../CategoryBar";
import Container from '../Container';
import useAllCategories from '@/app/hooks/useCategories';
import useSubCat from '@/app/hooks/useSubCat';



const Categories = () => {
  const params = useSearchParams();
  const subcategoryId = params?.get('subcategoryId');
  const categoryId = params?.get('categoryId');
  const pathname = usePathname();
  const isMainPage = pathname === '/';
  const {data: allCat = []} = useAllCategories()
  const {data: allSub = []} = useSubCat()
  const optionCat = allCat.map((cat:any) => ({
    value: cat.category_name,
    label: cat.category_name,
  }))
  const optionSub = allSub.map((sub:any) => ({
    value: sub.id,
    label: sub.subcategory_name
  }))

  if (!isMainPage) {
    return null;
  }

  return (
    <div className='flex max-w-[1640px]  mx-auto border flex-col items-center px-20'>
      {allCat.map((cat:any) => (
        <>
        {cat.subcategory.map((sub:any) => (
          <CategoryBar
          label={cat.category_name}
          value2={cat.id}
          sublabel={sub.subcategory_name}
          key={sub.id}
          />
        ))}
        </>
        
      ))}
      
        
      
      
      
      
    </div>
      
        
    
  );
}
 
export default Categories;