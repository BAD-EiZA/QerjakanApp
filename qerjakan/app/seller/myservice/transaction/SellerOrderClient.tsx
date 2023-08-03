"use client";

import { useRouter } from "next/navigation";
import SellerOrderStatus from "@/app/components/sellerorderstatus/sellerorderstatus";
import { SafeOrder, SafeUser } from "../../../types/index";
import { Order, Service, User } from "@prisma/client";
import { format } from "date-fns";
import { AiOutlineEllipsis, AiOutlineClose } from "react-icons/ai";
import { useEffect, useState } from "react";
import Breadcrumbs from "@/app/components/Breadcumbs";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { BsChevronDown } from "react-icons/bs";
import ImageUpload from "@/app/components/inputs/ImageUpload";
import Input from "@/app/components/inputs/Input";
import axios from "axios";
import ImageMultiple from "@/app/components/inputs/ImageMultiple";
import { setTimeout } from "timers";
interface MyOrderProps {
  order: SafeOrder[];
}

function SellerOrderClient({ order }: MyOrderProps) {
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [dataOrder, setDataOrder] = useState(order);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      linkReport: "",
      imageReport: [],
      orderid: "",
      description: "",
    },
  });

  const imageReport = watch("imageReport");
  const orderid = watch("orderid");
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsloading(true);

    const res = axios
      .post("/api/sellerreport", data)
      .then((res) => {
        if (res.data.statusCode === 200) {
          Swal.fire({
            icon: "success",
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          reset();
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
            title: "Oops...",
            text: "Something went wrong!",
          });
          reset();
          router.refresh();
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  const handleChat = async (id: string) => {
    setIsloading(true);
    await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
      }),
    })
      .then((res) =>
        res.json().then((res) => {
          if (res.statusCode === 200) {
            router.push(`/conversation/${res.data.id}`);
          } else if (res.statusCode === 401) {
            Swal.fire({
              icon: "error",
              title: res.message,
              showConfirmButton: false,
              timer: 1500,
            });
            router.push("/");
          }
        })
      )
      .catch(() => {
        console.log("Error");
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  const AutoCompleteOrder = async (id: any) => {
    try {
      setIsloading(true);
      await fetch("/api/autocompleteorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      })
        .then((res) =>
          res.json().then((res) => {
            router.refresh();
          })
        )
        .catch(() => {
          console.log("error");
        })
        .finally(() => {
          setIsloading(false);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const handleAccept = async (id: string, price: string, day: number) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success mx-1",
        cancelButton: "btn btn-danger mx-1",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        text: "Accept the order?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Accept",
        cancelButtonText: "Reject",
        reverseButtons: true,
        width: 280,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          setIsloading(true);
          await fetch("/api/acceptOrder", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
            }),
          })
            .then((res) =>
              res.json().then((res) => {
                if (res.statusCode === 200) {
                  swalWithBootstrapButtons.fire(
                    "You accept the order!",
                    "The order now is active!",
                    "success"
                  );
                  setTimeout(
                    () => AutoCompleteOrder(id),
                    day * 24 * 60 * 60 * 1000
                  );
                }
                else if(res.statusCode === 401){
                  Swal.fire({
                    icon: "error",
                    title: res.message,
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  router.push("/");
                }
                else{
                  Swal.fire({
                    icon: "error",
                    title: res.message,
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  router.refresh()
                }
              })
            )
            .catch(() => {
              console.log("Error");
            })
            .finally(() => {
              router.refresh();
              setIsloading(false);
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          setIsloading(true);
          await fetch("/api/denyOrder", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
              price: price,
            }),
          }).then((res)=> res.json().then((res)=> {
            if(res.statusCode === 200){
              swalWithBootstrapButtons.fire(
                "You reject the order!",
                res.message,
                "info"
              );
            }
            else if(res.statusCode === 401){
              Swal.fire({
                icon: "error",
                title: res.message,
                showConfirmButton: false,
                timer: 1500,
              });
              router.push("/");
            }
          }))
            .catch(() => {
              console.log("Error");
            })
            .finally(() => {
              
              router.refresh();
              setIsloading(false);
            });
        }
      });
  };
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  console.log("image", imageReport)
  return (
    <div className="max-w-[1640px] py-4 grid lg:grid-cols-6 lg:px-8">
      <div className=" rounded-lg px-0 lg:px-6 py-2 lg:py-0 ">
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
            className=" bg-green-500 rounded-md py-2  text-white flex justify-between items-center md:pr-0 pr-5 pl-4 group"
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
      <div className="lg:col-span-5 rounded-lg px-4 lg:px-2 lg:mt-12 py-2 h-96  border border-black">
        <div className="flex flex-col pb-2 ">
          <Breadcrumbs />
          <div className="w-full rounded-lg h-full pb-3">
            <SellerOrderStatus />
          </div>

          <div className="overflow-x-auto h-64 px-4">
            <table className="table table-sm">
              <thead className="text-center text-black ">
                <tr>
                  <th className="border border-black">Order ID</th>
                  <th className="border border-black">Order Date</th>
                  <th className="border border-black">Product Title</th>
                  <th className="border border-black">Buyer</th>
                  <th className="border border-black">Time Remaining</th>
                  <th className="border border-black">Revision</th>
                  <th className="border border-black">Status</th>
                  <th className="border border-black">Others</th>
                </tr>
              </thead>
              <tbody className="text-center border-none">
                {dataOrder.map((SellerOrder: any) => (
                  <tr key={SellerOrder.id}>
                    <td className="text-xs">{SellerOrder.id}</td>
                    <td className="text-xs">
                      {format(new Date(SellerOrder.createdAt), "PPPP")}
                    </td>
                    <td className="text-xs capitalize">
                      {SellerOrder.service.title}
                    </td>
                    <td className="text-xs">{SellerOrder.buyerName}</td>
                    <td className="text-xs">
                      {SellerOrder.service.deliveryTime} Days
                    </td>
                    <td className="text-xs">{SellerOrder.revisionCount}</td>
                    <td className="text-xs capitalize">
                      {SellerOrder.orderStatus === "active" && (
                        <h3 className="">
                          <span className="text-blue-500 mx-1">•</span>
                          {SellerOrder.orderStatus}
                        </h3>
                      )}
                      {SellerOrder.orderStatus === "denied" && (
                        <h3 className="">
                          <span className="text-red-500 mx-1">•</span>
                          {SellerOrder.orderStatus}
                        </h3>
                      )}
                      {SellerOrder.orderStatus === "pending" && (
                        <h3 className="">
                          <span className="text-orange-500 mx-1">•</span>
                          {SellerOrder.orderStatus}
                        </h3>
                      )}
                      {SellerOrder.orderStatus === "refund" && (
                        <h3 className="">
                          <span className="text-purple-500 mx-1">•</span>
                          {SellerOrder.orderStatus}
                        </h3>
                      )}
                      {SellerOrder.orderStatus === "complete" && (
                        <h3 className="">
                          <span className="text-green-500 mx-1">•</span>
                          {SellerOrder.orderStatus}
                        </h3>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {SellerOrder.orderStatus === "pending" && (
                          <button
                            onClick={() =>
                              handleAccept(
                                String(SellerOrder.id),
                                SellerOrder.price,
                                SellerOrder.deliverDaysCount
                              )
                            }
                            className=" bg-green-500 rounded-md px-1 py-1"
                          >
                            <span className="text-xs text-white">Action</span>
                          </button>
                        )}
                        {SellerOrder.orderStatus === "denied" && (
                          <button
                            onClick={() => router.push("/conversation")}
                            className=" bg-blue-500 rounded-md px-2 py-1 w-full"
                          >
                            <span className="text-xs text-white">Chat</span>
                          </button>
                        )}
                        {SellerOrder.orderStatus === "refund" && (
                          <button
                            // onClick={() =>
                            //   handleAccept(
                            //     String(SellerOrder.id),
                            //     SellerOrder.price
                            //   )
                            // }
                            className=" bg-purple-500 rounded-md px-1 py-1"
                          >
                            <span className="text-xs text-white">Action</span>
                          </button>
                        )}
                        {SellerOrder.orderStatus === "complete" && (
                          <button
                            onClick={() => router.push("/conversation")}
                            className=" bg-blue-500 rounded-md px-2 py-1"
                          >
                            <span className="text-xs text-white">Chat</span>
                          </button>
                        )}
                        {SellerOrder.orderStatus === "active" && (
                          <button className=" bg-blue-500 rounded-md px-2 py-1">
                            <span
                              onClick={() =>
                                handleChat(String(SellerOrder.buyerId))
                              }
                              className="text-xs text-white"
                            >
                              Chat
                            </span>
                          </button>
                        )}
                        <div className="dropdown dropdown-bottom dropdown-end">
                          <label
                            tabIndex={0}
                            className="btn btn-xs btn-outline btn-accent lg:btn-xs lg:btn-outline lg:btn-accent lg:h-full"
                          >
                            <AiOutlineEllipsis />
                          </label>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu p-2 my-1 bg-slate-100 rounded-box w-40 z-20"
                          >
                            {SellerOrder.orderStatus !== "denied" && SellerOrder.orderStatus !== "pending" ? (
                              <>
                              {SellerOrder.onReview === false && (
                              <>
                                {SellerOrder.isCompleted === false && (
                                  <li>
                                    <label
                                      htmlFor={SellerOrder.id}
                                      onClick={() =>
                                        setCustomValue(
                                          "orderid",
                                          SellerOrder.id
                                        )
                                      }
                                      className=""
                                    >
                                      Submission
                                    </label>
                                  </li>
                                )}
                              </>
                            )}
                              </>
                            ):(
                              <></>
                            )}  
                            

                            <li>
                              <a>Report</a>
                            </li>
                          </ul>
                        </div>
                        <input
                          type="checkbox"
                          id={SellerOrder.id}
                          className="modal-toggle"
                        />
                        <div className="modal">
                          <div className="modal-box">
                            <div className="flex justify-between">
                              <h3 className="font-bold text-lg">
                                Send Progress
                              </h3>
                              <label
                                htmlFor={SellerOrder.id}
                                className=" cursor-pointer my-2"
                              >
                                <AiOutlineClose />
                              </label>
                            </div>

                            <div className="pb-4">
                              <h3 className="font-semibold text-slate-400 text-sm">
                                Send Image
                              </h3>
                              <ImageMultiple
                                onChange={(value) =>
                                  setCustomValue("imageReport", value)
                                }
                                value={imageReport}
                              />
                            </div>
                            <div className="pb-4">
                              <input
                                type="text"
                                onChange={(e) =>
                                  setCustomValue("linkReport", e.target.value)
                                }
                                placeholder="Link URL"
                                className="input input-bordered input-primary w-full max-w-lg"
                              />
                            </div>

                            <textarea
                              className="textarea textarea-bordered textarea-md w-full max-w-lg"
                              onChange={(e) =>
                                setCustomValue("description", e.target.value)
                              }
                              placeholder="Description"
                            ></textarea>
                            <div className="modal-action">
                              <label htmlFor={SellerOrder.id} className="btn">
                                Close
                              </label>
                              <button
                                className="btn"
                                onClick={handleSubmit(onSubmit)}
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
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
    //             <SellerOrderStatus/>
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

export default SellerOrderClient;
