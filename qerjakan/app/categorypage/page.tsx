import getServices, { IListingsParams } from "../actions/service/getServices";
import ClientOnly from "../components/ClientOnly";
import CategoryPageClient from "./CategoryPageClient";




interface HomeProps {
    searchParams: IListingsParams;
  }
  
  const CategoryPage = async ({ searchParams }: HomeProps) => {
    const services = await getServices(searchParams);
    if(!services){
        return null
    }
  return (
    <ClientOnly>
        <CategoryPageClient dataService={services}/>
    </ClientOnly>
  )
}

export default CategoryPage