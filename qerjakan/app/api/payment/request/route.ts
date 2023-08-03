import getCurrentUser from "@/app/actions/user/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { stringify, v4 as uuidv4 } from 'uuid';
import shortUUID from "short-uuid";
import { includes } from "lodash";
export const POST = async (req: NextRequest) => {
    const {id, price} = await req.json()
    const currUser = await getCurrentUser()
    if (!currUser) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    if (!currUser.name) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const serviceCur = await prisma.service.findFirst({
        where: {
            id
        }
    })
    if (!serviceCur) {
        return NextResponse.json({ message: 'Service not found' }, { status: 404 })
    }

    const order_id = "qerjakan-id-" + shortUUID.generate();
    
    
    const body = {
        "payment_type": "gopay",
        "transaction_details": {
            "order_id": order_id,
            "gross_amount": price
        },
        "customer_details": {
            email: currUser.email
        },
        
    }
    const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions"|| '',
    {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': "Basic " +
                Buffer.from("SB-Mid-server-9943tHP6RMmOoxXEaX9j06fo").toString("base64")
            },
            body: JSON.stringify(body)
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
            
            status: 'pending',
            payment_type: 'midtrans',
            buyerName: currUser.name,
            user: {
                connect: {
                    id: currUser.id
                }
            },
        },
        
    })

    const resJson = await response.json()
    return NextResponse.json({  ...resJson, order_id })
    

    
}