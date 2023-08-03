import getCurrentUser from "@/app/actions/user/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";
import shortUUID from "short-uuid";



export const POST = async (req: NextRequest) => {
    if (req.method !== "POST") {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
    }
    const {price, id} = await req.json()
    try {
        const currUser = await getCurrentUser()
        if (!currUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }
        if (!currUser.userBalance) {
            return NextResponse.json({ message: 'User Balance Null' }, { status: 401 })
        }
        if (!currUser.name) {
            return NextResponse.json({ message: 'User Balance Null' }, { status: 401 })
        }
        const serviceCur = await prisma.service.findFirst({
            where: {
                id
            }
        })
        if (!serviceCur) {
            return NextResponse.json({ message: 'Package not found' }, { status: 404 })
        }
        const order_id = "qerjakan-id-" + shortUUID.generate();
        
        if(currUser.userBalance >= price) {
            await prisma.user.update({
                where: {
                    id: currUser.id
                },
                data: {
                    userBalance: {increment: -price}
                }
            })
            await prisma.transaction.create({
                data:{
                    id: String(order_id),
                    amount: serviceCur.price,
                    gross_amount: price,
                    service: {
                        connect: {
                            id: serviceCur.id
                        }
                    },
                    buyerName: String(currUser.name) ,
                    status: 'settlement',
                    payment_type: 'balance',
                    user: {
                        connect: {
                            id: currUser.id
                        }
                    }
                    
                }
            })
            const getTrans = await prisma.transaction.findFirst({
                where: {
                    id : order_id
                },
                include: {
                    service: {
                        include: {
                            user: true
                        }
                    },
                    user: true
                }
            })
            if(!getTrans){
                return NextResponse.json({ message: 'Transaction Not Found' })
            }
            if(!getTrans.service.user.name){
                return NextResponse.json({ message: 'Transaction Not Found' })
            }
            if(!getTrans.user.name){
                return NextResponse.json({ message: 'Transaction Not Found' })
            }
            await prisma.order.create({
                data: {
                    orderid: String(order_id),
                    service: {
                        connect: {
                            id: getTrans?.service.id
                        }
                    },
                    user: {
                        connect: {
                            id: currUser.id
                        }
                    },
                    price: Number(price),
                    sellerId: getTrans?.service.sellerId,
                    revisionCount: getTrans.service.revisions,
                    deliverDaysCount: getTrans.service.deliveryTime,
                    sellerName: getTrans.service.user.name,
                    buyerName: String(currUser.name),
                    payment_type: "User Balance"
                }
            })
            return NextResponse.json({ order_id })
        }
        else {
            return NextResponse.error();
        }
        
        
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}