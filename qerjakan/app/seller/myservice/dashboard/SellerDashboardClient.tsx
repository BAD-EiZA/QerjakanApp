"use client";

import { SafeService } from "@/app/types";
import Breadcrumbs from "@/app/components/Breadcumbs";
import ServiceCard from "@/app/components/servicecard/servicecard";
import { useRouter } from "next/navigation";
interface MyOrderProps {
  service: SafeService[];
}

function SellerDashboardClient({ service } : MyOrderProps) {
  const router = useRouter();
  return (
    <div className="max-w-[1640px] py-4 grid lg:grid-cols-6 lg:px-8">
      <div className=" rounded-lg px-0 lg:px-6 py-2 lg:py-0 ">
        <div className=" text-2xl py-2 font-bold">My Services</div>
        <div className=" border border-black md:cursor-pointer     rounded-lg">
          <h3
            onClick={() => router.push("/seller/myservice/dashboard")}
            className=" bg-green-500 rounded-md py-2  text-white flex justify-between items-center md:pr-0 pr-5 pl-4 group"
          >
            Dashboard
          </h3>
          <h3
            onClick={() => router.push("/seller/myservice/gigs")}
            className=" hover:bg-green-500 hover:rounded-md py-2  hover:text-white flex justify-between items-center md:pr-0 pr-5 pl-4 group"
          >
            Gigs
          </h3>
          <h3
            onClick={() => router.push("/seller/myservice/transaction")}
            className=" hover:bg-green-500 hover:rounded-md py-2  hover:text-white flex justify-between items-center md:pr-0 pr-5 pl-4 group"
          >
            Transaction
          </h3>
          <h3
            onClick={() => router.push("/seller/myservice/complain")}
            className=" hover:bg-green-500 hover:rounded-md py-2  hover:text-white flex justify-between items-center md:pr-0 pr-5 pl-4 group"
          >
            Complain
          </h3>
          <h3
            onClick={() => router.push("/seller/myservice/refund")}
            className=" hover:bg-green-500 hover:rounded-md py-2  hover:text-white flex justify-between items-center md:pr-0 pr-5 pl-4 group"
          >
            Refund Request
          </h3>
        </div>
      </div>
      <div className="lg:col-span-5 rounded-lg px-4 lg:px-2 lg:mt-12 py-2  border border-black">
        <div className="flex flex-col pb-2">
          <Breadcrumbs />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-4 px-4 ">
            {service.map((myservice: any) => (
              <ServiceCard
                key={myservice.id}
                data={myservice}
                coverImg={myservice.image}
                userImg={myservice.user.image}
                title={myservice.title}
                userName={myservice.user.name}
                price={myservice.price} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboardClient;
