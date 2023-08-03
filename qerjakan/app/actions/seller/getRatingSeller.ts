import prisma from "@/app/libs/prismadb";
import getCurrUser from "../user/getCurrUser";

interface IParams {
  profileId?: string;
  serviceId?: string;
  userId?: string;
}

export default async function getRatingSellerById(params: IParams) {
  try {
    const { profileId, userId } = params;
    let query: any = {};
    if (profileId) {
      query.sellerId = profileId;
    }
    
    const servicez = await prisma.service.findFirst({
      where: query,

      include: {
        user: {
          select: {
            name: true,
            image: true,
            services: {
              select: {
                id: true,
              },
            },
          },
        },
        serviceRating: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!servicez) {
      return null;
    }

    return {
      ...servicez,

      user: {
        name: servicez.user.name || null,
        image: servicez.user.image || null,
      },
      serviceRating: {
        rating:
          servicez.serviceRating.length === 0
            ? 0
            : servicez.serviceRating.reduce(
                (sum, review) => sum + review.rating,
                0
              ) / servicez.user.services.length,
      },
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
