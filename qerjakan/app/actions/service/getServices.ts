import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
  subcategoryId?: string;
  categoryId?: string;
  serviceStatus?: string;
  sellerName?: string;
  serviceName?: string
}

export default async function getServices(params: IListingsParams) {
  try {
    const { subcategoryId, categoryId, serviceStatus, sellerName, serviceName } = params;
    let query: any = { serviceStatus: "active" };
    if (subcategoryId) {
      query.subcategoryId = subcategoryId;
      query.serviceStatus = "active";
    }
    if (categoryId) {
      query.categoryId = categoryId;
      query.serviceStatus = "active";
    }
    if (serviceStatus) {
      query.serviceStatus = serviceStatus;
    }
    if(serviceName){
      query = {
        OR: [
          {
            user: {
              name: {
                contains: serviceName,
                mode: "insensitive"
              }
            }
          },
          {
            title: {
              contains: serviceName,
              mode: "insensitive"
            }
          }
        ]
      }
    }
    if(sellerName){
      query.user = {
        name: {
          contains: sellerName,
          mode: "insensitive"
        }
      }
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
    
    const safeServices = services.map((service) => ({
      ...service,
      serviceRating: {
        rating: service.serviceRating.length === 0 ? 0 : service.serviceRating.reduce((sum,review) => sum + review.rating, 0) / service.serviceRating.length
      },
      
    }));
    // const totalReviews = services.length;
    // if (totalReviews === 0) {
    //   return 0; 
    // }

    // const totalRating = review.reduce((sum, review) => sum + review.rating, 0);
    // const averageRating = totalRating / totalReviews;
    return safeServices;
  } catch (error: any) {
   return []
  }
}
