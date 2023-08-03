import getServices, { IListingsParams } from "../actions/service/getServices";
import ClientOnly from "../components/ClientOnly";
import SearchProductClient from "./SearchProductClient";



interface HomeProps {
    searchParams: IListingsParams;
  }
  
  const SearchProductPage = async ({ searchParams }: HomeProps) => {
    const services = await getServices(searchParams);
    if(!services){
        return null
    }
  return (
    <ClientOnly>
        <SearchProductClient dataService={services}/>
    </ClientOnly>
  )
}

export default SearchProductPage