import getCurrentUser from "@/app/actions/user/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
    if (req.method !== "PATCH") {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 500 })
    }
    const getCurrUser = await getCurrentUser()
    if(!getCurrUser){
        return NextResponse.json({message: "You are not logged in, please log in", statusCode: 401})
    }
    const {id, price} = await req.json()
    const getOrder = await prisma.order.findUnique({
        where: {
            id
        },
        include: {
            service: true
        }
    })
    if (!getOrder) {
        return NextResponse.json({ message: 'Transaction not found' })
    }
    await prisma.user.update({
        where: {
            id: getOrder.buyerId
        },
        data: {
            userBalance: {increment: price}
        }
    })
    await prisma.order.update({
        where: {
            id
        },
        data: {
            orderStatus: 'denied'
        }
    })
    await prisma.transaction.update({
        where: {
            id
        },
        data: {
            status: "refund"
        }
    })
    await prisma.notification.create({
        data:{
            body: "Your order " + getOrder.service.title + " has been denied by the seller",
            userId: getOrder.buyerId,
            NotifRole: "Buyer",
            NotifType: 'Transaction'
        }
    })
    return NextResponse.json({message: "The order is rejected", statusCode: 200})
}