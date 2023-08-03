'use client';
import qs from 'query-string';
import useAllCategories from "@/app/hooks/useCategories";
import Link from "next/link";
import { useSearchParams,useRouter} from "next/navigation";
import { useCallback, useState } from "react";
import CategoryBars from '../CategoryBars';
import SubCategoryBars from '../SubCategoryBar';

const Category = () => {
    
    const {data: allCat = []} = useAllCategories()
    return (
        <div className="flex max-w-[1640px]  mx-auto border-t flex-col items-center px-20">
            <div className=" justify-between hidden md:flex">
                {allCat.map((cat:any) => (
                    <div key={cat.id} className="px-3 text-left md:cursor-pointer group">
                       <CategoryBars
                       label={cat.category_name}
                       value={cat.id}
                       key={cat.id}/>
                        <div>
                            <div className="absolute top-28 z-50 hidden group-hover:block hover:block">
                                <div className="py-4">
                                    <div className=" shadow-xl w-4 h-4 left-3 absolute mt-1 bg-white rotate-45"></div>
                                </div>
                                <div className="bg-white shadow-xl p-4 grid grid-cols-1">
                                    <div>
                                        {cat.subcategory.map((sub:any) => (
                                            <SubCategoryBars
                                            label={sub.subcategory_name}
                                            value={sub.id}
                                            key={sub.id}/>
                                            
                                        ))}
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                
            </div>
        </div>
    )
}

export default Category