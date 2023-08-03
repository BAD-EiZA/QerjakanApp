import ClientOnly from "@/app/components/ClientOnly"
import getSellerOrder, {IListingsParams} from "@/app/actions/seller/getSellerOrder";
import SellerOrderClient from "./SellerOrderClient";
import getCurrUser from "@/app/actions/user/getCurrUser";
import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic'
interface MyOrderProps {
    searchParams: IListingsParams
};


const MyOrder = async ({ searchParams }: MyOrderProps) => {
    const getOrder = await getSellerOrder(searchParams);
    const getUser = await getCurrUser()
    if(!getUser){
        return redirect("/")
    }
    return (
        <ClientOnly>
            <SellerOrderClient
            order={getOrder}/>
        </ClientOnly>
    )
}
export default MyOrder