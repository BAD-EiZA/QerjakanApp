import prisma from "@/app/libs/prismadb";
import getCurrentUser from "../user/getCurrentUser";



export interface IListingsParams {
    serviceStatus?: string;
  }


export default async function getMyServices(params: IListingsParams){
    try {
        const currentUser = await getCurrentUser()
        const {
          serviceStatus,
        } = params;
        let query: any = {
            sellerId: currentUser?.id
        };
        if(serviceStatus){
            query.serviceStatus = serviceStatus;
        }
        const services = await prisma.service.findMany({
            where: query,
            
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        const safeServices = services.map((service) => ({
            ...service,
            createdAt: service.createdAt.toISOString(),
        }))
        return safeServices
    } catch (error: any) {
        throw new Error(error);
    }
}