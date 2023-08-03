import getReviewById from "./actions/service/getReviewById";
import getServices, { IListingsParams } from "./actions/service/getServices";
import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import Category from "./components/categories/categories";
import Trusted from "./components/featured/featured";
import Hero from "./components/hero/hero";
import Categories from "./components/navbar/Categories";
import ServiceCard from "./components/servicecard/servicecard";
import useAllCategories from "./hooks/useCategories";

export const dynamic = "force-dynamic";
interface HomeProps {
  searchParams: IListingsParams;
}

const Home = async ({ searchParams }: HomeProps) => {
  const services = await getServices(searchParams);

  return (
    <ClientOnly>
      <div>
        <Category />
        <Hero />

        <Trusted />
        <div className="max-w-[1640px] m-auto py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 px-2">
            {services.map((ser: any) => (
              <ServiceCard
              data={ser}
                key={ser.id}
                redirectUrl={ser.id}
                coverImg={ser.image}
                averageRating={
                  ser.serviceRating.length === 0 ? 0 : ser.serviceRating.rating
                }
                userImg={ser.user.image}
                title={ser.title}
                userName={ser.user.name}
                price={ser.price}
              />
            ))}
          </div>
        </div>
      </div>
    </ClientOnly>
  );
};
export default Home;
