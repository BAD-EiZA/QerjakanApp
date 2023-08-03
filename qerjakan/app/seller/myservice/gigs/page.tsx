import ClientOnly from "@/app/components/ClientOnly"

import getServiceDashboard, {IListingsParams} from "@/app/actions/seller/getMyGigs"
import SellerGigsClient from "./SellerGigsClient";
import getCurrUser from "@/app/actions/user/getCurrUser";
import { redirect } from "next/navigation";
interface MyDashboardProps {
    searchParams: IListingsParams
};

const MyGigs = async ({ searchParams }: MyDashboardProps) => {
    const dashboard = await getServiceDashboard();
    const getUser = await getCurrUser()
    if(!getUser){
        return redirect("/")
    }
    return(
        <ClientOnly>
            <SellerGigsClient service={dashboard}/>
        </ClientOnly>
    )
}

export default MyGigs