import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/user/getCurrentUser";

export const POST = async (req: NextRequest) => {
    if (req.method !== "POST") {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 500 })
    }
    const {inputValue} = await req.json()
    const currUser = await getCurrentUser();
    if(!currUser){
        return NextResponse.json({ message: 'Invalid order id' }, { status: 500 })
    }
    if(!currUser.userBalance){
        return NextResponse.json({ message: 'Invalid order id' }, { status: 500 })
    }

    if (inputValue <= currUser.userBalance){
        await prisma.user.update({
            where: {
                id: currUser.id
            },
            data: {
                userBalance: {increment: -Number(inputValue)}
            }
        })
        await prisma.companyBalance.update({
            where: {
                id: "648149e28e485a3300f4b519"
            },
            data: {
                balance: {increment: -Number(inputValue)}
            }
        })
        const comBalance = await prisma.companyBalance.findUnique({
            where: {
                id: "648149e28e485a3300f4b519"
            }
        })
        if(!comBalance){
            return NextResponse.json({ message: 'Invalid Company Balance id' }, { status: 500 })
        }
        if(!comBalance.balance){
            return NextResponse.json({ message: 'Invalid Company Balance' }, { status: 500 })
        }
        await prisma.companyTransaction.create({
            data: {
                userId: currUser.id,
                amount: -Number(inputValue),
                payment_type: "bank",
                status: "pending",
                InOutStatus: "payout",
                final_balance: Number(comBalance.balance)
            }
        })
        return NextResponse.json({})
    }
    else{
        return NextResponse.json({ message: 'User balance error' }, { status: 500 })
    }
    
}