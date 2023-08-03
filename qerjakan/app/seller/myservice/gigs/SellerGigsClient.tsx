"use client";

import { useRouter } from "next/navigation";

import { SafeOrder, SafeService, SafeUser } from "../../../types/index";
import { Order, Service, User } from "@prisma/client";
import { format } from "date-fns";
import {AiOutlineEllipsis, AiFillEdit, AiTwotoneDelete} from "react-icons/ai"
import { useState } from "react";
import Breadcrumbs from "@/app/components/Breadcumbs";
import GigStatus from "@/app/components/mygigstatus/mygigstatus";
import useAddServiceModal from "@/app/hooks/useAddServiceModal";
interface MyOrderProps {
  service: SafeService[];
}

function SellerGigsClient({ service } : MyOrderProps) {
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();
  const serviceModal = useAddServiceModal();
  
  return (
    <div className="max-w-[1640px] py-4 grid lg:grid-cols-6 lg:px-8">
      <div className=" rounded-lg px-0 lg:px-6 py-2 lg:py-0 ">
        <div className=" text-2xl py-2 font-bold">My Services</div>
        <div className=" border border-black md:cursor-pointer    rounded-lg">
          <h3
            onClick={() => router.push("/seller/myservice/dashboard")}
            className=" hover:bg-green-500 hover:rounded-md py-2 hover:text-white flex justify-between items-center md:pr-0 pr-5 pl-4 group"
          >
            Dashboard
          </h3>
          <h3
            onClick={() => router.push("/seller/myservice/gigs")}
            className=" bg-green-500 rounded-md py-2  text-white flex justify-between items-center md:pr-0 pr-5 pl-4 group"
          >
            Gigs
          </h3>
          <h3
            onClick={() => router.push("/seller/myservice/transaction")}
            className=" hover:bg-green-500 hover:rounded-md py-2 hover:text-white flex justify-between items-center md:pr-0 pr-5 pl-4 group"
          >
            Transaction
          </h3>
          <h3
            onClick={() => router.push("/seller/myservice/complain")}
            className=" hover:bg-green-500 hover:rounded-md py-2 hover:text-white flex justify-between items-center md:pr-0 pr-5 pl-4 group"
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
          <div className="w-full rounded-lg h-full pb-3">
            <div className="flex justify-between">
              <GigStatus />
              <div className="py-2 px-4 md:cursor-pointer " onClick={serviceModal.onOpen}>
                <h2 className="hover:bg-green-400 hover:rounded-md py-2 text-xs border-black hover:text-white flex border rounded-md justify-between items-center pr-5 px-4 group">(+) Create New Gigs</h2>
              </div>

            </div>

          </div>

          <div className="overflow-x-auto px-4">
            <table className="table table-sm">
              <thead className="text-center text-black ">
                <tr>
                  <th className="border border-black">Gigs ID</th>
                  <th className="border border-black">Gigs Created</th>
                  <th className="border border-black">Gigs Title</th>
                  <th className="border border-black">Price</th>
                  <th className="border border-black">Delivery (Days)</th>
                  <th className="border border-black">Revision</th>
                  <th className="border border-black">Status</th>
                  <th className="border border-black">Others</th>
                </tr>
              </thead>
              <tbody className="text-center border-none">
                {service.map((Gigs: any) => (
                  <tr key={Gigs.id}>
                    <td className="text-xs">{Gigs.id}</td>
                    <td className="text-xs">
                      {format(new Date(Gigs.createdAt), "PPPP")}
                    </td>
                    <td className="text-xs capitalize">
                      {Gigs.title}
                    </td>
                    <td className="text-xs">${Gigs.price}</td>
                    <td className="text-xs">
                      {Gigs.deliveryTime} Days
                    </td>
                    <td className="text-xs">
                      {Gigs.revisions}
                    </td>
                    <td className="text-xs capitalize">
                      {Gigs.serviceStatus === 'active' && <h2 className="gap-1 py-2 text-xs flex justify-between items-center pr-5 px-4 group"><span className="text-green-500">•</span>{Gigs.serviceStatus}</h2>}
                      {Gigs.serviceStatus === 'paused' && <h2 className="gap-1 py-2 text-xs flex justify-between items-center pr-5 px-4 group"><span className="text-orange-500">•</span>{Gigs.serviceStatus}</h2>}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => router.push(`/editgigs/${Gigs.id}`)} className=" bg-blue-500 rounded-md px-1 py-1">
                          <span className="text-xs text-white"><AiFillEdit /></span>
                        </button>
                        <button className=" bg-red-500 rounded-md px-1 py-1">
                          <span className="text-xs text-white"><AiTwotoneDelete /></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    // <div className="max-w-[1640px] m-auto py-4 ">
    //         <div className="">
    //             <h1 className=" mx-12 text-5xl font-semibold">Order</h1>
    //         </div>
    //         <div className="">
    //             <GigsStatus/>
    //         </div>
    //         <div className="overflow-x-auto">
    //             <div className="table table-compact w-full text-center  ">
    //                 <thead>
    //                     <tr>
    //                         <th>Order ID</th>
    //                         <th>Buyer ID</th>
    //                         <th>Order Time</th>
    //                         <th>Price</th>
    //                         <th>Status</th>
    //                         <th>Action</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {order.map((myor: any) => (
    //                     <tr>
    //                         <td>{myor.id}</td>
    //                         <td>{myor.buyerId}</td>
    //                         <td>{myor.createdAt}</td>
    //                         <td>IDR {myor.price}</td>
    //                         <td>{myor.orderStatus}</td>
    //                         {myor.orderStatus === 'active' && <td>Active</td>}
    //                         {myor.orderStatus === 'pending' && <td>
    //                             <div className="">
    //                                 <button onClick={() => handleAccept(String(myor.id))} className="btn btn-xs btn-outline btn-primary">Accept</button>
    //                                 <button onClick={() => handleDeny(String(myor.id), myor.price)} className="btn btn-xs btn-outline btn-accent">Tolak</button>
    //                             </div>
    //                             </td>}
    //                         {myor.orderStatus === 'complete' &&<td>Approved by Buyer</td>}
    //                         {myor.orderStatus === 'denied' &&<td>Denied</td>}
    //                         {myor.orderStatus === 'refund' && <td>Refunded by User</td>}
    //                     </tr>
    //                     ))}
    //                 </tbody>
    //             </div>
    //         </div>
    //     </div>
  );
}

export default SellerGigsClient;
