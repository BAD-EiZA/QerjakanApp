import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/user/getCurrentUser";
import getCurrUser from "@/app/actions/user/getCurrUser";

export async function POST(request: Request) {
  const getUser = await getCurrUser()
  if(!getUser){
    return NextResponse.json({message: "You are not logged in, please log in", statusCode: 401})
  }
  const body = await request.json();
  const { image, description, complainType, orderId } = body;
  const getOrder = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      complain: true,
      service: true,
    },
  });
  if (!getOrder) {
    return NextResponse.json({ message: "Order Not Found" }, { status: 400 });
  }
  const sendreport = await prisma.complainAdmin.create({
    data: {
      order: {
        connect: {
          id: getOrder.id,
        },
      },
      description: String(description),
      complainType: String(complainType),
      image: image,
      complainStatus: "Pending",
    },
  });
  await prisma.notification.createMany({
    data: [
      {
        body:
          "You have made a complaint on the " +
          getOrder.service.title +
          " order, please wait for the admin's approval to proceed",
        NotifRole: "Buyer",
        NotifType: "Updates",
        userId: getOrder.buyerId,
      },
      {
        body:
          "You have complaints from " +
          getOrder.buyerName +
          " on the " +
          getOrder.service.title +
          " order",
        NotifRole: "Seller",
        NotifType: "Updates",
        userId: getOrder.sellerId,
      },
    ],
  });

  return NextResponse.json({
    ...sendreport,
    message: "Success to send complain",
    statusCode: 200,
  });
}
