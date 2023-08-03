import getServices, { IListingsParams } from "@/app/actions/service/getServices";
import ClientOnly from "@/app/components/ClientOnly";
import GigStatus from "../components/mygigstatus/mygigstatus";
import getMyServices from "../actions/service/getMyService";
import useAddServiceModal from "../hooks/useAddServiceModal";
import GigClient from "./GigsClient";
import Image from "next/image";
import getCurrUser from "../actions/user/getCurrUser";
import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic'


interface GigProps {
    searchParams: IListingsParams
};

const MyGigs = async ({ searchParams }: GigProps) => {
    const getService = await getServices(searchParams)
    const getmyService = await getMyServices(searchParams)
    const getUser = await getCurrUser()
    if(!getUser){
        return redirect('/')
    }
    return(
        <ClientOnly>
            
            <div className="max-w-[1640px] m-auto py-4 ">
                <div className="">
                    <h1 className=" mx-12 text-5xl font-semibold">Gigs</h1>
                </div>
                
                <div className="">
                    <GigStatus/>
                </div>
                <GigClient/>
                <div className="overflow-x-auto ">
                    <div className="table  -z-10 table-compact w-full text-center">
                        <thead>
                            <tr>
                                <th>Gig ID</th>
                                <th>Image</th> 
                                <th>Title</th> 
                                <th>Created At</th> 
                                <th>Price</th> 
                                <th>Delivery Time</th> 
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getmyService.map((serv:any) => (
                                <tr key={serv.id}>
                                <td>{serv.id}</td>
                                <td>
                                    <div className="flex items-center">
                                        <Image 
                                        alt="Service Image"
                                        className="mask mask-squircle w-12 h-12 mx-auto"
                                        src={serv.image || ''}
                                        width={12}
                                        height={12}/>
                                        
                                    </div>
                                </td>
                                <td>
                                    {serv.title}
                                </td>
                                <td>{serv.createdAt}</td>
                                <td>IDR {serv.price}</td>
                                <td>{serv.deliveryTime} Days</td>
                                <td className=" uppercase">{serv.serviceStatus}</td>
                            </tr>
                                ))}
                                
                        </tbody>
                    </div>
                </div>
            </div>
        </ClientOnly>
        
    )
}

export default MyGigs;