import getServiceById from "@/app/actions/service/getServiceId";
import ClientOnly from "@/app/components/ClientOnly";
import DetailClient from "./DetailClient";
import getProfileById from "@/app/actions/user/getProfileId";
import getCurrentUser from "@/app/actions/user/getCurrentUser";
import getCurrUser from "@/app/actions/user/getCurrUser";
import getReviewById from "@/app/actions/service/getReviewById";
import getReviewService from "@/app/actions/service/getReviewService";
import { redirect } from "next/navigation";

interface IParams {
    serviceId?: string;
    userId?: string;
}

const Services = async ({ params }: { params: IParams }) => {
    const ServiceId = await getServiceById(params)
    const currUser = await getCurrUser()
    const getReview = await getReviewById(params)
    const getServiceReview = await getReviewService(params)
    if(!ServiceId){
        return null
    }
    
    const profileId = await getProfileById({userId: ServiceId.sellerId})
    return (
        <ClientOnly>
            <DetailClient
            service={ServiceId}
            currprofiles={profileId}
            curruser={currUser}
            averageRating={getReview}
            review={getServiceReview}
            />
        </ClientOnly>
    )
}

export default Services