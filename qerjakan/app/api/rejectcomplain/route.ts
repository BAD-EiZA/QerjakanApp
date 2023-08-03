import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 500 }
    );
  }
  const { id, orderId } = await req.json();

  const getOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
        service: true
    }
  });
  if (!getOrder) {
    return NextResponse.json({ message: "Order  Not Found" }, { status: 400 });
  }

  const getComplain = await prisma.complainAdmin.findFirst({
    where: {
      id: id,
    },
  });

  if (!getComplain) {
    return NextResponse.json({
      message: "Complain not found",
      statusCode: 400,
    });
  }
  await prisma.complainAdmin.update({
    where: {
      id: getComplain.id,
    },
    data: {
      complainStatus: "Rejected",
    },
  });
  const getBuyer = await prisma.user.findFirst({
    where: {
      id: getOrder.buyerId,
    },
  });
  await prisma.notification.createMany({
    data: [
      {
        body: "Your Complain Is Rejected by Admin.",
        NotifRole: "Buyer",
        NotifType: "Updates",
        userId: getOrder.buyerId,
      },
      {
        body: "The complaint submitted by " + getBuyer?.name + " on the " + getOrder.service.title +" order has been rejected by the admin",
        NotifRole: "Seller",
        NotifType: "Updates",
        userId: getOrder.sellerId,
      },
    ],
  });
  return NextResponse.json({
    message: "Success to Reject Complain",
    data: {},
    status: 200,
  });
};
