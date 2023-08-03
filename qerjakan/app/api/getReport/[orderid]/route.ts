import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb";

export async function GET(req: NextApiRequest, res: NextApiResponse, orderid:string) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    

    if (!orderid || typeof orderid !== 'string') {
      throw new Error('Invalid ID');
    }

    const notifications = await prisma.report.findMany({
      where: {
        orderid: orderid,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });


    return res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}