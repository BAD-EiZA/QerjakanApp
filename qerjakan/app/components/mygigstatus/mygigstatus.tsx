'use client'

import { statusMap } from "@/app/hooks/useStatus"
import StatusBar from "../StatusBar"

const GigStatus = () => {
    return(
        <div className="flex max-w-[1640px]  flex-col items-start py-2 px-2">
            <div className=" justify-between hidden md:flex">
                {statusMap.map((stat:any) => (
                    <div key={stat.id} className="px-2 md:cursor-pointer group">
                        <StatusBar 
                        label={stat.label}
                        value={stat.status}
                        key={stat.status}/>
                    </div>
                    
                ))}
            </div>
        </div>
    )
}

export default GigStatus