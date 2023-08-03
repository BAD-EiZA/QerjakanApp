import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/user/getCurrentUser";

export async function GET() {
  const currentUser = await getCurrentUser();
  if(!currentUser) {
    return ""
  }
  const countNotifTransaction = await prisma.notification.findMany({
    where:{
        userId: currentUser.id,
        NotifType: "Transaction"
    },
    
  })

  
  return NextResponse.json(countNotifTransaction);
}
