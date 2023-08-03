import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/user/getCurrentUser";

export async function GET() {
  const currentUser = await getCurrentUser();
  
  const countNotifUpdates = await prisma.notification.findMany({
    where: {
        userId: currentUser?.id,
        NotifType: "Updates"
    },
  })
  return NextResponse.json(countNotifUpdates);
}
