import prisma from "@/app/libs/prismadb";



interface IParams {
  gigsId?: string;
}


export default async function getGigById(params: IParams) {
  try {    
    const { gigsId } = params;
    const service = await prisma.service.findFirst({
        where: {
            id: gigsId
        }
    })

    if (!service) {
      return null;
    }

    return {
        ...service
    }
    
  } catch (error: any) {
    throw new Error(error);
  }
}
