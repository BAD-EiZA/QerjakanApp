"use client";

import Breadcrumbs from "@/app/components/Breadcumbs";
import { SafeOrder } from "@/app/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";

interface RefundProps {
  orderData: SafeOrder[];
}

const SellerRefundClient: React.FC<RefundProps> = ({ orderData }) => {
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();
  const handleAcceptRefund = async (id: string) => {
    Swal.fire({
      title: "Are you sure to accept request?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsloading(true);
        const res = axios
          .patch("/api/acceptRefundOrder", { id: id })
          .then((res) => {
            if (res.data.statusCode === 200) {
              Swal.fire({
                icon: "success",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500,
              });
              router.refresh();
            } else if (res.data.statusCode === 401) {
              Swal.fire({
                icon: "error",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500,
              });
              router.push("/");
            } else {
              Swal.fire({
                icon: "error",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500,
              });
              router.refresh();
            }
          })
          .catch((error) => {
            console.log("error", error.error);
          })
          .finally(() => {
            router.refresh();
            setIsloading(false);
          });
      }
    });
  };
  const handleRejectRefund = async (id: string) => {
    Swal.fire({
      title: "Are you sure to reject request?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsloading(true);
        const res = axios
          .patch("/api/rejectRefundOrder", { id: id })
          .then((res) => {
            if (res.data.statusCode === 200) {
              Swal.fire({
                icon: "success",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500,
              });
              router.refresh();
            } else if (res.data.statusCode === 401) {
              Swal.fire({
                icon: "error",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500,
              });
              router.push("/");
            } else {
              Swal.fire({
                icon: "error",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500,
              });
              router.refresh();
            }
          })
          .catch(() => {
            console.log("error");
          })
          .finally(() => {
            router.refresh();
            setIsloading(false);
          });
      }
    });
  };
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
            className=" hover:bg-green-500 hover:rounded-md py-2  hover:text-white flex justify-between items-center md:pr-0 pr-5 pl-4 group"
          >
            Complain
          </h3>
          <h3
            onClick={() => router.push("/seller/myservice/refund")}
            className=" bg-green-500 rounded-md py-2  text-white flex justify-between items-center md:pr-0 pr-5 pl-4 group"
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
                  <th>Category</th>
                  <th>Price</th>
                  <th>Buyer Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="text-center border-none">
                {orderData.map((Orders: any) => (
                  <tr key={Orders.id}>
                    <td>{Orders.id}</td>
                    <td>{Orders.service.title}</td>
                    <td>{Orders.service.category.category_name}</td>
                    <td>{Orders.price}</td>
                    <td>{Orders.buyerName}</td>
                    <td>{Orders.orderStatus}</td>

                    <td>
                      <div className="flex gap-2 justify-center">
                        <button
                          className="btn btn-xs btn-primary "
                          onClick={() => handleAcceptRefund(Orders.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => handleRejectRefund(Orders.id)}
                        >
                          Reject
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
  );
};

export default SellerRefundClient;
