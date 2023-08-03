import ClientOnly from "@/app/components/ClientOnly"
import SellerDashboard from "./SellerDashboardClient"
import getServiceDashboard, {IListingsParams} from "@/app/actions/seller/getMyGigs"
import getCurrUser from "@/app/actions/user/getCurrUser";
import { redirect } from "next/navigation";


const MyDashboard = async () => {
    const dashboard = await getServiceDashboard();
    const getUser = await getCurrUser()
    if(!getUser){
        return redirect("/")
    }
    return(
        <ClientOnly>
            <SellerDashboard service={dashboard}/>
        </ClientOnly>
    )
}

export default MyDashboard