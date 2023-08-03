'use client';

import qs from 'query-string';
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import useAllCategories from '../hooks/useCategories';

interface CategoryBoxProps {
  value?: string;
  value2?: string;
  label?: string;
  sublabel?: string;
  selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  label,
  value,
  selected,
  value2,
  sublabel
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const {data: allCat = []} = useAllCategories()
  const handleClick = useCallback(() => {
    let currentQuery = {};
    
    if (params) {
      currentQuery = qs.parse(params.toString())
    }

    const updatedQuery: any = {
      ...currentQuery,
      subcategoryId: value,
      categoryId: value2,
    }

    if (params?.get('subcategoryId') === value) {
      delete updatedQuery.subcategoryId;
    }
    if (params?.get('categoryId') === value2) {
      delete updatedQuery.categoryId;
    }
    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery
    }, { skipNull: true });

    router.push(url);
  }, [label, router, params, value, value2]);

  return ( 
    
    
      <div className="px-3 text-left md:cursor-pointer group">
        
                        <h2 onClick={handleClick} className=" hover:border-b border-b-green-500 py-2 flex justify-between items-center md:pr-0 pr-5 group">
                            {label}
                        </h2>
                        <div>
                          
                            <div className="absolute top-28 hidden group-hover:block hover:block">
                                <div className="py-3">
                                    <div className=" shadow-xl w-4 h-4 left-3 absolute mt-1 bg-white rotate-45"></div>
                                </div>
                                <div className="bg-white shadow-xl p-4 grid grid-cols-1">
                                    <div>
                                        
                                          <li className="text-sm text-gray-600 my-2.5">
                                          <h3 onClick={handleClick}  className="hover:text-primary">{sublabel}</h3>
                                        </li>
                                       
                                            
                                       
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
    
    
    
   );
}
 
export default CategoryBox;