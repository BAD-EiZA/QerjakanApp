// Objective:
// The objective of the function is to retrieve a list of orders belonging to the current user, based on the provided order status.

// Inputs:
// - params: an object containing optional orderStatus string.

// Flow:
// 1. The function calls getCurrentUser() to retrieve the current user.
// 2. If currentUser is not found, the function returns a console log message.
// 3. The function constructs a query object based on the currentUser's id and the provided orderStatus (if any).
// 4. The function calls prisma.order.findMany() with the constructed query object, including related service, user, and report data, and ordering by createdAt in descending order.
// 5. The function maps the resulting orderList to a safeOrder array, replacing underscores in payment_type and formatting createdAt to ISO string.
// 6. The function returns the safeOrder array.

// Outputs:
// - safeOrder: an array of orders belonging to the current user, with related service, user, and report data, formatted for safe display.

// Additional aspects:
// - The function handles errors by logging to console and returning an error message object.
// - The function relies on the getCurrentUser() function to retrieve the current user.

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "../user/getCurrentUser";

export interface IListingsParams {
  orderStatus?: string;
}

export default async function getMyOrder(params: IListingsParams) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("Failed to get user. Please try again later.");
  }
  const { orderStatus } = params;
  let query: any = {
    buyerId: currentUser.id,
  };
  if (orderStatus) {
    query.orderStatus = orderStatus;
  }
  const orderList = await prisma.order.findMany({
    where: query,
    include: {
      service: {
        select: {
          deliveryTime: true,
          id: true,
          title: true,
          revisions: true,
          image:true,
          serviceRating: true
        }
      },
      user: true,
      report: true,
      complain: true
      
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const safeOrder = orderList.map((order:any) => ({
    ...order,
    
    service: {
      ...order.service,
      
    },
    user: {
      ...order.user,
    },
    
    
  }));
  return safeOrder;
}
