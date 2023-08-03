import prisma from "@/app/libs/prismadb";
import getCurrUser from "../user/getCurrUser";



interface IParams {
  profileId?: string;
  serviceId?: string;
  userId?: string;
}


export default async function getProfileSellerById(params: IParams) {
  try {
    const { profileId,userId } = params;

    let query: any = {};
        if (profileId) {
            query.userId = profileId;
        }
        if(userId){
            query.userId = userId;
        }
    const currentUser = await getCurrUser()
    const profile = await prisma.profile.findUnique({
      where: query,
      include: {
        user: {
            select: {
                image: true,
                name: true,
            }
        }
      }
    });
    if (!profile) {
      return null;
    }
    return {
      ...profile,
      user: {
        ...profile.user,
        image: profile.user.image || null,
        name: profile.user.name || null
        
      }
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
