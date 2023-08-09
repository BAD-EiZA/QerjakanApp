
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
    if (req.method !== "POST") {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
    }
    try {
        const currentTime = new Date(Date.now() - 1 * 60 * 1000)
        const deleteUUID = await prisma.forgotPasswordToken.deleteMany({
            where: {
                createdAt: {
                    lte: currentTime,
                },
                tokenType: "ForgotPassword"
            }
        })
        return NextResponse.json({ message: 'Delete Token Success', data: deleteUUID }, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error delete token' }, { status: 500 });
    }
}