import getCurrentUser from "../user/getCurrentUser";
import prisma from "@/app/libs/prismadb"


export interface IListingsParams {
    service?: string;
}


const getServiceDashboard = async() => {
    const currUser = await getCurrentUser();
    if(!currUser){
        return [];
    }
    try {
        const service = await prisma.service.findMany({
            orderBy: {
                createdAt: "desc"
            },
            where: {
                sellerId: currUser.id
            },
            include: {
                user: true
            }
        })

        const safeservice = service.map((myservice:any) => ({
            ...myservice,
            createdAt: myservice.createdAt.toISOString(),
            user: {
                ...myservice.user
            }
        }))
        return safeservice
    } catch (error:any) {
        throw new Error(error);
    }
}

export default getServiceDashboard;