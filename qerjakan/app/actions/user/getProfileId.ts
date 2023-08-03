import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";


interface IParams {
  profileId?: string;
  serviceId?: string;
  userId?: string;
}


export default async function getProfileById(params: IParams) {
  try {
    const { profileId, serviceId, userId } = params;

    let query: any = {};
        if (profileId) {
            query.userId = profileId;
        }
        if(userId){
            query.userId = userId;
        }
    const currentUser = await getCurrentUser()
    const profile = await prisma.profile.findUnique({
      where: query,
      include: {
        user: true,
      }
    });
    if (!profile) {
      return null;
    }
    return {
      ...profile,
      user: {
        ...profile.user,
        createdAt: profile.user.createdAt.toString(),
        updatedAt: profile.user.updatedAt.toString(),
        emailVerified: 
          profile.user.emailVerified?.toString() || null,
      },
      
      
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
