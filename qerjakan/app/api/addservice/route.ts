import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/user/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const {
    title,
    description,
    image,
    price,
    deliveryTime,
    subCategoryId,
    revisions,
  } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });
  if (!subCategoryId) {
    return NextResponse.error();
  }

  const subCategory = await prisma.subCategory.findUnique({
    where: { id: subCategoryId.value },
    include: { category: true },
  })

  let service;
  try {
    service = await prisma.service.create({
      data: {
        title,
        description,
        image,
        subcategoryId: subCategoryId.value,
        categoryId: subCategory?.categoryId as string,
        revisions: parseInt(revisions),
        price: parseInt(price),
        deliveryTime: parseInt(deliveryTime),
        sellerId: currentUser.id,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }

  return NextResponse.json(service);
}
