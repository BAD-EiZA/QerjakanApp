import getCurrUser from "@/app/actions/user/getCurrUser";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
    if (req.method !== "PATCH") {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 500 })
    }
    const getUser = await getCurrUser()
    if(!getUser){
        return NextResponse.json({message: "You are not logged in, please log in", statusCode: 401})
    }
    const {id} = await req.json()
    const urOrder =  await prisma.order.findUnique({
        where: {
            id
        },
    })
    if(!urOrder){
        return NextResponse.json({ message: 'Order Not Found', statusCode: 404 })
    }
    await prisma.order.update({
        where: {
            id: urOrder.id
        },
        data: {
            orderStatus: "request_refund",
            hasRefund: true
        }
    })

    await prisma.notification.createMany({
        data: [
            {
                body: "Your refund request was successful, please wait for the seller's approval",
                userId: urOrder.buyerId,
                NotifRole: "Buyer",
                NotifType: "Updates"
            },
            {
                body: "You have a new refund request from " + urOrder.buyerName ,
                userId: urOrder.sellerId,
                NotifRole: "Seller",
                NotifType: "Updates"
            }

        ]
    })

    


    return NextResponse.json({message: "Success to request refund", statusCode: 200})
}