import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/user/getCurrentUser";

export async function PATCH(request: Request) {
  try {
    const currUser = await getCurrentUser();
    if (!currUser) {
      return NextResponse.json({
        message: "You are not logged in, please log in",
        statusCode: 401,
      });
    }
    const body = await request.json();
    const {
      description,
      skill,
      country,
      language,
      college_name,
      college_title,
      college_major,
    } = body;
    console.log("pella", skill);
    console.log("perka", language);
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
    const languageToAdd = language.filter(
      (lag: any) => !getProfile.language.includes(lag)
    );
    if (!language || (language.length === 0 && !skill) || skill.length === 0) {
      const updatedProfile = await prisma.profile.update({
        where: {
          id: getProfile.id,
        },
        data: {
          description,
          country: country.value,
          college_name: college_name.value,
          college_major: college_major.value,
          college_title: college_title.value,
        },
      });

      return NextResponse.json({
        message: "Success Edit Profile",
        data: updatedProfile,
        statusCode: 200,
      });
    }
    if (!language || language.length === 0) {
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
            description,
            skill: {
              set: [...getProfile.skill, ...(skill as string[])],
            },

            country: country.value,
            college_name: college_name.value,
            college_major: college_major.value,
            college_title: college_title.value,
          },
        });

        return NextResponse.json({
          message: "Success Edit Skill",
          data: updatedProfile,
          statusCode: 200,
        });
      }
    }
    if (!skill || skill.length === 0) {
      if (languageToAdd.length === 0) {
        return NextResponse.json({
          message: "Your language already added",

          statusCode: 400,
        });
      } else {
        const updatedProfile = await prisma.profile.update({
          where: {
            id: getProfile.id,
          },
          data: {
            description,

            language: {
              set: [...getProfile.language, ...(language as string[])],
            },
            country: country.value,
            college_name: college_name.value,
            college_major: college_major.value,
            college_title: college_title.value,
          },
        });

        return NextResponse.json({
          message: "Success Edit Language",
          data: updatedProfile,
          statusCode: 200,
        });
      }
    }

    const updatedProfile = await prisma.profile.update({
      where: {
        id: getProfile.id,
      },
      data: {
        description,
        skill: {
          set: [...getProfile.skill, ...(skill as string[])],
        },
        language: {
          set: [...getProfile.language, ...(language as string[])],
        },
        country: country.value,
        college_name: college_name.value,
        college_major: college_major.value,
        college_title: college_title.value,
      },
    });

    return NextResponse.json({
      message: "Success Edit Profile",
      data: updatedProfile,
      statusCode: 200,
    });
  } catch (error) {}
}
