import prisma from "@/app/libs/prismadb";

export default async function getComplain(){
    try {
        const getComplain = await prisma.complainAdmin.findMany({
            include: {
                order: {
                    select: {
                        id: true,
                        buyerId: true,
                        sellerId: true,
                        buyerName: true,
                        sellerName: true
                    }
                }
            }
        })

        const safeComplain = getComplain.map((complain:any) => ({
            ...complain,
            
            order: {
                ...complain.order
            }
            

        }))

        return safeComplain
    } catch (error) {
        return []
    }
}