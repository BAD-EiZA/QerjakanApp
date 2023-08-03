import prisma from "@/app/libs/prismadb";
import getCurrUser from "../user/getCurrUser";

interface IParams {
  profileId?: string;
  serviceId?: string;
  userId?: string;
}
export default async function getServiceSellerById(params: IParams) {
  try {
    const { profileId, userId } = params;
    let query: any = {};
    if (profileId) {
      query.sellerId = profileId;
    }
    if (userId) {
      query.userId = userId;
    }
    const CurrUser = await getCurrUser();
    if (!CurrUser) {
      return null;
    }
    const services = await prisma.service.findMany({
      where: query,

      include: {
        user: {
          select: {
            name: true,
            image: true,
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

    if (!services) {
      return null;
    }

    const safeServices = services.map((service) => ({
      ...service,
      serviceRating: {
        rating:
          service.serviceRating.length === 0
            ? 0
            : service.serviceRating.reduce(
                (sum, review) => sum + review.rating,
                0
              ) / service.serviceRating.length,
      },
      user: {
        ...service.user,
      },
    }));
    return safeServices;
  } catch (error: any) {
    throw new Error(error);
  }
}
