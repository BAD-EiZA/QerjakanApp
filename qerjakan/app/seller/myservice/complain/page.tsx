import ClientOnly from "@/app/components/ClientOnly"
import getSellerOrder, {IListingsParams} from "@/app/actions/seller/getSellerOrder";
import getComplainSeller from "@/app/actions/seller/getComplainSeller";
import ComplainSellerClient from "./ComplainClient";
import getCurrUser from "@/app/actions/user/getCurrUser";
import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic'



const ComplainPageSeller = async () => {
    const getComplainData = await getComplainSeller();
    const getUser = await getCurrUser()
    if(!getComplainData){
        return "kadal"
    }
    if(!getUser){
        return redirect('/')
    }

    return (
        <ClientOnly>
            <ComplainSellerClient data={getComplainData}/>
        </ClientOnly>
    )
}
export default ComplainPageSeller