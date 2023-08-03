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
            id
        },
        data: {
            orderStatus: "refund"
        }
    })
    await prisma.user.update({
        where: {
            id: urOrder.buyerId
        },
        data: {
            userBalance: {increment: urOrder.price}
        }
        
    })
    const getTrans = await prisma.transaction.findFirst({
        where: {
            id: urOrder.orderid,
            buyerName: urOrder.buyerName
        }
    })
    await prisma.transaction.update({
        where: {
            id: getTrans?.id
        },
        data: {
            status: "refund",
            updatedAt: new Date(),
        }
    })
    await prisma.notification.create({
        data: {
            body: "Your refund request has been approved by the seller, your funds will be sent to your account balance",
            NotifRole: "Buyer",
            NotifType: "Updates",
            userId: urOrder.buyerId
        }
    })


    return NextResponse.json({message: "Success to refund Order", statusCode: 200})
}