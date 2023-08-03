import prisma from "@/app/libs/prismadb";
import getCurrentUser from "../user/getCurrentUser";



export default async function getSellerOrderRefund(){
    try {
        const currentUser = await getCurrentUser()
        
        const orderList = await prisma.order.findMany({
            where: {
                sellerId: currentUser?.id,
                orderStatus: "request_refund"
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                service: {
                    select: {
                        title: true,
                        category: {
                            select: {
                                category_name: true
                            }
                        }
                    }
                }
            }
        })
        const safeOrder = orderList.map((order) => ({
            ...order,
            createdAt: order.createdAt.toISOString(),
            service: {
                ...order.service,
                category: {
                    ...order.service.category
                }
            }
            
        }))
        return safeOrder
    } catch (error: any) {
        throw new Error(error);
    }
}

