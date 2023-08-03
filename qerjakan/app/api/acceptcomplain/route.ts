import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 500 }
    );
  }
  const { orderId, id } = await req.json();

  const getOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
  });
  if (!getOrder) {
    return NextResponse.json({ message: "Order  Not Found" }, { status: 400 });
  }
  await prisma.order.update({
    where: {
      id: getOrder.id,
    },
    data: {
      orderStatus: "refund",
    },
  });
  const getBuyer = await prisma.user.findFirst({
    where: {
      id: getOrder.buyerId,
    },
  });
  await prisma.user.update({
    where: {
      id: getBuyer?.id,
    },
    data: {
      userBalance: { increment: getOrder.price },
    },
  });
  await prisma.companyBalance.update({
    where: {
      id: "648149e28e485a3300f4b519",
    },
    data: {
      balance: { increment: -getOrder.price },
    },
  });
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
      complainStatus: "Accepted",
    },
  });
  await prisma.notification.createMany({
    data: [
      {
        body: "Your Complain Is Accepted by Admin.",
        NotifRole: "Buyer",
        NotifType: "Updates",
        userId: getOrder.buyerId,
      },
      {
        body: "You have a complaint from " + getBuyer?.name + " that has been approved by the admin, the balance has been returned to the buyer",
        NotifRole: "Seller",
        NotifType: "Updates",
        userId: getOrder.sellerId,
      },
    ],
  });
  return NextResponse.json({
    message: "Success to Accept Complain",
    data: {},
    status: 200,
  });
};
