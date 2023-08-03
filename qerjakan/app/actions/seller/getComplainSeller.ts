import prisma from "@/app/libs/prismadb"
import getCurrUser from "../user/getCurrUser"


export default async function getComplainSeller() {
    try {
        const curruser = await getCurrUser()
        if(!curruser){
            return null
        }
        const getOrder = await prisma.order.findFirst({
            where: {
                sellerId: curruser.id
            }
        })
        if(!getOrder){
            return null
        }
        const getComplain = await prisma.complainAdmin.findMany({
            where: {
                orderId: getOrder.id
            },
            include: {
                order: {
                    select: {
                        buyerName: true,
                        price: true,
                        id: true,
                        service: {
                            select: {
                                title: true
                            }
                        }

                    }
                }
            }
        })
        const safeComplain = getComplain.map((complain:any) => ({
            ...complain,
            
            order: {
                ...complain.order,
                service: {
                    title: complain.order.service.title
                }
            }
            

        }))
        return safeComplain

    } catch (error) {
        
    }
}