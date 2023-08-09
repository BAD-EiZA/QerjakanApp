import { autoDeleteOrder } from "@/app/actions/auto/autodeleteorder";
import prisma from "@/app/libs/prismadb";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 500 }
    );
  }

  const {
    signature_key,
    order_id,
    payment_type,
    gross_amount,
    status_code,
    transaction_status,
  } = await req.json();
  const verifySignature = crypto
    .createHash("sha512")
    .update(
      `${order_id}${status_code}${gross_amount}SB-Mid-server-9943tHP6RMmOoxXEaX9j06fo`
    )
    .digest("hex");

  if (verifySignature !== signature_key) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 500 });
  }
  if (!order_id) {
    return NextResponse.json({ message: "Invalid order id" }, { status: 500 });
  }

  const getTrans = await prisma.transaction.findFirst({
    where: {
      id: order_id,
    },
    include: {
      service: {
        include: {
          user: true,
        },
      },
      user: true,
    },
  });
  if (!getTrans) {
    return NextResponse.json({ message: "Transaction Not Found" });
  }
  if (!getTrans.service.user.name) {
    return NextResponse.json({ message: "Transaction Not Found" });
  }
  if (!getTrans.user.name) {
    return NextResponse.json({ message: "Transaction Not Found" });
  }

  const updateTrans = await prisma.transaction.update({
    where: {
      id: order_id,
    },
    data: {
      status: transaction_status,
      gross_amount: Number(gross_amount),
      updatedAt: new Date(),
      payment_type: payment_type,
    },
  });

  if (!updateTrans) {
    return NextResponse.json({ message: "Transaction not found" });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: updateTrans.userId,
    },
  });

  

  if (transaction_status === "capture" || transaction_status === "settlement") {
    
    await prisma.order.create({
      data: {
        orderid: String(order_id),
        service: {
          connect: {
            id: getTrans?.service.id,
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
        price: Number(gross_amount),
        revisionCount: getTrans.service.revisions,
        deliverDaysCount: getTrans.service.deliveryTime,
        sellerId: getTrans?.service.sellerId,
        sellerName: getTrans.service.user.name,
        buyerName: getTrans.buyerName,
        payment_type: payment_type,
      },
    });
    await prisma.notification.createMany({
      data: [
        {
          body:
            "You have a new incoming order by user " +
            getTrans.buyerName,
          userId: getTrans?.service.sellerId,
          NotifRole: "Seller",
          keyId: String(order_id),
          NotifType: "Transaction",
        },
        {
          body:
            "Your payment has been verified on the order " +
            getTrans.service.title + ", please wait for confirmation from the seller",
          userId: getTrans.userId,
          NotifRole: "Buyer",
          keyId: String(order_id),
          NotifType: "Transaction",
        },
      ],
    });
    await prisma.companyBalance.update({
      where: {
        id: "648149e28e485a3300f4b519",
      },
      data: {
        balance: { increment: Number(gross_amount) },
      },
    });
    const comBalance = await prisma.companyBalance.findUnique({
      where: {
        id: "648149e28e485a3300f4b519",
      },
    });
    if (!comBalance) {
      return NextResponse.json({ message: "Company not found" });
    }
    if (!comBalance.balance) {
      return NextResponse.json({ message: "Company not found" });
    }
    await prisma.companyTransaction.create({
      data: {
        userId: updateTrans.userId,
        status: "settlement",
        amount: Number(gross_amount),
        payment_type: "midtrans",
        InOutStatus: "payment",
        final_balance: comBalance.balance,
      },
    });
    setTimeout(async() => {
     await autoDeleteOrder(String(order_id))
    }, 10 * 60 * 1000)
    
  }

  return NextResponse.json({message: "kadal"});
};
