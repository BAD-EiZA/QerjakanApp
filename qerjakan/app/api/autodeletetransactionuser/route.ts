import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
    const {order_id, prevBalance} = await req.json()
    const findTransaction = await prisma.transaction.findFirst({
        where: {
            id: String(order_id)
        },
        include: {
            user: {
                select: {
                    id: true
                }
            }
        }
    })
    if(!findTransaction){
        return NextResponse.json({message: "Transsaction Not Found"})
    }
    if(findTransaction?.status != "settlement"){
        const currentTime = new Date(Date.now() - 5 * 60 * 1000);

        await prisma.user.update({
            where: {
                id: findTransaction?.userId
            },
            data: {
                userBalance: {increment: prevBalance}
            }
        })
        await prisma.transaction.deleteMany({
            where: {
                id: findTransaction?.id,
                createdAt: {
                    lte: currentTime
                }
            }
        })

        return NextResponse.json({message: "Success to auto delete transaction"})
        
    }

    return NextResponse.json({message: "Already Paid"})
}