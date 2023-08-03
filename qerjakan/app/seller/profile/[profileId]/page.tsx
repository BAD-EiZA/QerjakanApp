import ClientOnly from "@/app/components/ClientOnly";
import SellerProfileClient from "./SellerProfileClient";
import getProfileSellerById from "@/app/actions/seller/getProfileSellerId";
import getServiceSellerById from "@/app/actions/seller/getServicesProfileSeller";
import getRatingSellerById from "@/app/actions/seller/getRatingSeller";
import getCurrUser from "@/app/actions/user/getCurrUser";
import AuthComponent from "@/app/components/Auth";
import { redirect } from "next/navigation";


interface IParams {
    profileId?: string;
  }

  const SellerProfiles = async ({ params }: { params: IParams }) => {
    const getProfile = await getProfileSellerById(params)
    const getService = await getServiceSellerById(params)
    const getRating = await getRatingSellerById(params)
    const  getUser = await getCurrUser()
    if(!getUser){
        return redirect('/')
    }
    if(!getProfile){
        return "kadal"
    }
    if(!getService){
        return []
    }if(!getRating){
        return "kidil"
    }
    return (
        <AuthComponent session={getUser}>
            <ClientOnly>
                <SellerProfileClient dataProfile={getProfile} dataService={getService} dataRatingSeller={getRating}/>
            </ClientOnly>
        </AuthComponent>
        
    )
  }

  export default SellerProfiles