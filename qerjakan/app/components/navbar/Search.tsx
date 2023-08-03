'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import qs from "query-string";
const Search = () => {
    const [searchInput, setSearchInnput] = useState('')
    const router = useRouter();
    const params = useSearchParams();
    const handleClick = useCallback(() => {
        let currentQuery = {};
    
        if (params) {
          currentQuery = qs.parse(params.toString());
        }
    
        const updatedQuery: any = {
          ...currentQuery,
          serviceName: searchInput,
        };
    
        if (params?.get("serviceName") === searchInput) {
          delete updatedQuery.serviceName;
        }
        const url = qs.stringifyUrl(
          {
            url: "/searchproduct/",
            query: updatedQuery,
          },
          { skipNull: true }
        );
    
        router.push(url);
      }, [router, searchInput]);
    return (
        <div className="form-control">
            <div className="input-group">
                <input onChange={(e)=> setSearchInnput(e.target.value)} type="text" placeholder="Search" className="input input-bordered h-8 w-28 sm:w-80 lg:w-80  xl:w-80 2xl:w-96" />
                <button onClick={()=> handleClick()} className="btn btn-square btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
            </div>
         </div>
    )
}

export default Search;