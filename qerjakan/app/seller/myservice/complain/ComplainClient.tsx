"use client";

import Breadcrumbs from "@/app/components/Breadcumbs";
import { ComplainAdmin } from "@prisma/client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface ComplainProps {
  data: ComplainAdmin[];
}

const ComplainSellerClient: React.FC<ComplainProps> = ({ data }) => {
  const router = useRouter();
  return (
    <div className="max-w-[1640px] py-4 grid lg:grid-cols-6 lg:px-8">
      <div className="rounded-lg px-0 lg:px-6 py-2 lg:py-0 ">
        <div className=" text-2xl py-2 font-bold">My Services</div>
        <div className=" border border-black  md:cursor-pointer   rounded-lg">
          <h3
            onClick={() => router.push("/seller/myservice/dashboard")}
            className=" hover:bg-green-500 hover:rounded-md py-2 hover:text-white flex justify-between items-center md:pr-0 pr-5 pl-4 group"
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
            className=" bg-green-500 rounded-md py-2  text-white flex justify-between items-center md:pr-0 pr-5 pl-4 group"
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
      <div className="lg:col-span-5 rounded-lg px-4 lg:px-2 lg:mt-12 py-2 h-96  border border-black">
        <div className="flex flex-col pb-2 ">
          <Breadcrumbs />
          <div className="overflow-x-auto py-4">
            <table className="table table-sm">
              <thead className="text-center text-black ">
                <tr className=" text-center">
                  <th>Order ID</th>
                  <th>Service Name</th>
                  <th>Description</th>
                  <th>Complain Type</th>
                  <th>Image</th>
                  <th>Buyer Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="text-center border-none">
                {data.map((Complain: any) => (
                  <tr key={Complain.id}>
                    <td>{Complain.order.id}</td>
                    <td>{Complain.order.service.title}</td>
                    <td>{Complain.description}</td>
                    <td>{Complain.complainType}</td>
                    <td>
                      <a href={Complain.image}>
                        <button className="btn btn-xs bg-success " ><span className="text-white">Open Image</span></button>
                      </a>
                    </td>
                    <td>{Complain.order.buyerName}</td>
                    
                    <td>
                      {Complain.complainStatus === "Pending" && (
                        <h3 className="text-center">
                          <span className="text-orange-500 mx-1">•</span>
                          {Complain.complainStatus}
                        </h3>
                      )}
                      {Complain.complainStatus === "Accepted" && (
                        <h3 className="">
                          <span className="text-green-500 mx-1">•</span>
                          {Complain.complainStatus}
                        </h3>
                      )}
                      {Complain.complainStatus === "Rejected" && (
                        <h3 className="">
                          <span className="text-red-500 mx-1">•</span>
                          {Complain.complainStatus}
                        </h3>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplainSellerClient;
