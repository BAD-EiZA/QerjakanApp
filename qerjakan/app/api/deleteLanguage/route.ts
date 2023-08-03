import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/user/getCurrentUser";

export async function POST(request: NextRequest) {
  try {
    const { deleteLanguage } = await request.json();
    const getUser = await getCurrentUser();
    if (!getUser) {
      return NextResponse.json({ message: "Not authorized", statusCode: 401 });
    }

    const getProfile = await prisma.profile.findFirst({
      where: {
        userId: getUser.id,
      },
    });
    const updatedLanguage = getProfile?.language.filter(
      (language) => language !== deleteLanguage
    );
    const updateSkill = await prisma.profile.update({
      where: {
        id: getProfile?.id,
      },
      data: {
        language: updatedLanguage
      },
    });
    return NextResponse.json({
      message: "Delete Language Success",
      data: updateSkill,
      statusCode: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error give Review", statusCode: 500 });
  }
}
