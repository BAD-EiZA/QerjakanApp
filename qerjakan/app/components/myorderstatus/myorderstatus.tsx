'use client'

import StatusMyOrderBar from "../StatusOrder"


const MyOrderStatus = () => {
    const statusOrder = [
        {
            label: 'Active',
            status: 'active'
        },
        {
            label: 'Pending',
            status: 'pending'
        },
        
        {
            label: 'Denied',
            status: 'denied'
        },
        {
            label: 'Complete',
            status: 'complete'
        },
        {
            label: 'Refund',
            status: 'refund'
        }

    ]
    return(
        <div className="flex max-w-[1640px]   flex-col">
            <div className=" mx-2">
                {statusOrder.map((stat:any) => (
                    <div key={stat.status} className=" text-left md:cursor-pointer group">
                        <StatusMyOrderBar
                        label={stat.label}
                        value={stat.status}/>
                    </div>
                    
                ))}
            </div>
        </div>
    )
}

export default MyOrderStatus