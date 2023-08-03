'use client'

import StatusSellerOrderBar from "../SellerOrderStatus"


const SellerOrderStatus = () => {
    const statusOrder = [
        {
            label: 'Active',
            status: 'active'
        },
        {
            label: 'Waiting',
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
        <div className="flex max-w-[1640px]  mx-auto flex-col items-start py-2 px-2">
            <div className=" justify-between hidden md:flex">
                {statusOrder.map((stat:any) => (
                    <div key={stat.status} className="px-2 md:cursor-pointer group ">
                        <StatusSellerOrderBar
                        label={stat.label}
                        value={stat.status}
                        key={stat.status}/>
                    </div>
                    
                ))}
            </div>
        </div>
    )
}

export default SellerOrderStatus