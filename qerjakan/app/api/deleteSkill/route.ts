import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/user/getCurrentUser";

export async function POST(request: NextRequest) {
  try {
    const { deleteSkill } = await request.json();
    const getUser = await getCurrentUser();
    if (!getUser) {
      return NextResponse.json({ message: "Not authorized", statusCode: 401 });
    }

    const getProfile = await prisma.profile.findFirst({
      where: {
        userId: getUser.id,
      },
    });
    const updatedSkills = getProfile?.skill.filter(
      (skill) => skill !== deleteSkill
    );
    const updateSkill = await prisma.profile.update({
      where: {
        id: getProfile?.id,
      },
      data: {
        skill: updatedSkills,
      },
    });
    return NextResponse.json({
      message: "Delete Skill Success",
      data: updateSkill,
      statusCode: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error give Review", statusCode: 500 });
  }
}
