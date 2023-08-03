import prisma from "@/app/libs/prismadb";
import getCurrentUser from "../user/getCurrentUser";

export interface IListingsParams {
    orderStatus?: string;
}

export default async function getSellerOrder(params: IListingsParams){
    try {
        const currentUser = await getCurrentUser()
        const {orderStatus} = params;
        let query: any = {
            sellerId: currentUser?.id
        };
        if(orderStatus){
            query.orderStatus = orderStatus;
        }
        const orderList = await prisma.order.findMany({
            where: query,
            include: {
                service: {
                    include: {
                        user: true
                    }
                },
                

            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        const safeOrder = orderList.map((order) => ({
            ...order,
            createdAt: order.createdAt.toISOString(),
            service: {
                ...order.service,
                user: {
                    ...order.service.user
                }
            }
        }))
        return safeOrder
    } catch (error: any) {
        throw new Error(error);
    }
}

