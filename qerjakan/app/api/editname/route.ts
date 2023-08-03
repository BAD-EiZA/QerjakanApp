import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/user/getCurrentUser";

export async function PATCH(request: Request,){
    
    const currUser = await getCurrentUser()
        const body = await request.json();
        const {
            name,

        } = body
        const updateProfile = await prisma.user.update({
            where: {
                id: currUser?.id
            },
            data: {
                name
            }
        });

        return NextResponse.json(updateProfile);

}