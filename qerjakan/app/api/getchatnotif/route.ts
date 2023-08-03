import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/user/getCurrentUser";

export async function GET() {
  const currentUser = await getCurrentUser();
  
  const countNotif = await prisma.notification.count({
    where:{
        userId: currentUser?.id,
        NotifType: "Chat"
    }
  })
  return NextResponse.json(countNotif);
}
