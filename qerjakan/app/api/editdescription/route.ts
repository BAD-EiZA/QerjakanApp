import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/user/getCurrentUser";

export async function PATCH(request: Request) {
  const currUser = await getCurrentUser();
  if (!currUser) {
    return NextResponse.json({ message: "Not Authorized", statusCode: 401 });
  }
  const body = await request.json();
  const { description } = body;

  const getUser = await prisma.user.findFirst({
    where: {
      id: currUser.id,
    },
  });
  const updateProfile = await prisma.profile.update({
    where: {
      userId: getUser?.id,
    },
    data: {
      description: description,
    },
  });

  return NextResponse.json({
    message: "Your Description Has Been Updated",
    data: updateProfile,
    statusCode: 200,
  });
}
