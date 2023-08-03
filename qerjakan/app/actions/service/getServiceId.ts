import prisma from "@/app/libs/prismadb";



interface IParams {
  serviceId?: string;
}


export default async function getServiceById(params: IParams) {
  try {    
    const { serviceId } = params;
    const service = await prisma.service.findUnique({
      where: {
        id: serviceId
      },
      include: {
        user: true,
        serviceRating:true
        
      }
    });

    if (!service) {
      return null;
    }

    return {
      ...service,
      user: {
        ...service.user,

      },
    }
    
  } catch (error: any) {
    throw new Error(error);
  }
}
