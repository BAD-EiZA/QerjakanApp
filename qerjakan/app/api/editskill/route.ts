import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/user/getCurrentUser";

export async function PATCH(request: Request) {
  const currUser = await getCurrentUser();
  if (!currUser) {
    return NextResponse.json({
      message: "You are not logged in, please log in",
      statusCode: 401,
    });
  }
  const body = await request.json();
  const { skill } = body;
  const getProfile = await prisma.profile.findFirst({
    where: {
      userId: currUser.id,
    },
  });
  if (!getProfile) {
    return;
  }
  const skillToAdd = skill.filter(
    (tag: any) => !getProfile.skill.includes(tag)
  );
  if (skillToAdd.length === 0) {
    return NextResponse.json({
      message: "Your skill already added",

      statusCode: 400,
    });
  } else {
    const updatedProfile = await prisma.profile.update({
      where: {
        id: getProfile.id,
      },
      data: {
        skill: {
          set: [...getProfile.skill, ...(skill as string[])],
        },
      },
    });

    return NextResponse.json({
      message: "Success Edit Skill",
      data: updatedProfile,
      statusCode: 200,
    });
  }

}
