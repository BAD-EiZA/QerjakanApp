"use client";

import { useRouter } from "next/navigation";
import Select from "react-select";
import MyOrderStatus from "../components/myorderstatus/myorderstatus";
import { SafeMyOrder, SafeOrder, SafeUser } from "../types";
import { FaStar } from "react-icons/fa";
import { Order, Report, Service, User } from "@prisma/client";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  AiFillCloseCircle,
  AiFillCheckCircle,
  AiOutlineClose,
} from "react-icons/ai";
import { AiFillCaretDown, AiFillShop } from "react-icons/ai";
import { BsChevronDown, BsShop } from "react-icons/bs";
import Swal from "sweetalert2";
import Image from "next/image";
import useReports from "../hooks/useReport";
import axios from "axios";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import ImageMultiple from "../components/inputs/ImageMultiple";
import ImageUpload from "../components/inputs/ImageUpload";
interface MyOrderProps {
  order: SafeMyOrder[];
}

const MyOrderClient: React.FC<MyOrderProps> = ({ order }) => {
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);
  const [rating, SetRating] = useState(0);
  const [orderIdCom, SetOrderIdCom] = useState("");
  const [image, setImageComplain] = useState("");
  const [description, setDescriptionComplain] = useState("");
  const [complainType, setTypeComplain] = useState<any>("");
  const complainTypeMap = [
    {
      label: "Poor service quality",
      value: "Poor service quality",
    },
    {
      label: "Late or non-delivery",
      value: "Late or non-delivery",
    },
    {
      label: "Communication issues",
      value: "Communication issues",
    },
    {
      label: "Misleading advertising",
      value: "Misleading advertising",
    },
    {
      label: "Unprofessional behavior",
      value: "Unprofessional behavior",
    },
  ];
  const safeMapComplain = complainTypeMap.map((complain: any) => ({
    label: complain.label,
    value: complain.value,
  }));
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      rating: 0,
      image: [],
      reviewText: "",
      serviceId: "",
      buyerId: "",
    },
  });

  const imager = watch("image");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const handleComplain = async (id: string) => {
    Swal.fire({
      title: "Are you sure want to complain?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Send Complain!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsloading(true);
        await fetch("/api/sendcomplain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: id,
            image: image,
            description: description,
            complainType: complainType,
          }),
        })
          .then((res) =>
            res.json().then((res) => {
              if (res.statusCode === 200) {
                Swal.fire({
                  icon: "success",
                  title: res.message,
                  showConfirmButton: false,
                  timer: 1500,
                });
                router.refresh();
              } else if (res.statusCode === 401) {
                Swal.fire({
                  icon: "error",
                  title: res.message,
                  showConfirmButton: false,
                  timer: 1500,
                });
                router.push("/");
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: res.message,
                });
                router.refresh();
              }
            })
          )
          .catch(() => {
            console.log("Error");
          })
          .finally(() => {
            window.location.reload();
            setIsloading(false);
          });
      }
    });
  };
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    Swal.fire({
      title: "Are you sure want to review?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, review order",
    }).then(async(result) => {
      if (result.isConfirmed) {
        setIsloading(true);

        const res = axios
          .post("/api/addReview", data)
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
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500,
              });
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
            window.location.reload();
          });
      }
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
  const handleRefund = async (id: string) => {
    Swal.fire({
      title: "Are you sure to refund?",
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
          .patch("/api/requestRefund", { id: id })
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
    <div className="max-w-[1640px] m-auto py-4 grid lg:grid-cols-4 lg:px-12">
      <div className=" rounded-lg mx-2 py-2 lg:py-0 ">
        <div className=" border py-2    rounded-lg">
          {/** Header**/}
          <div className=" text-2xl py-2 px-4 font-bold">My Order</div>
          <h3
            onClick={() => router.push("/myorder")}
            className="mx-2 hover:bg-green-500 hover:rounded-md py-2  hover:text-white flex justify-between items-center md:pr-0 pr-5 pl-2 group"
          >
            Dashboard
          </h3>
          <MyOrderStatus />
        </div>
      </div>

      <div className="lg:col-span-3 rounded-lg mx-2 ">
        {order.map((myorder: any) => (
          <>
            <div key={myorder.id} className="">
              <div className="flex flex-col pb-2">
                <div className="w-full border rounded-lg h-full py-4">
                  <div className="flex justify-between px-4 lg:px-8">
                    {myorder.orderStatus === "pending" && (
                      <span className=" text-xs  lg:text-base text-gray-400 capitalize font-semibold">
                        •{" "}
                        <span className="text-xs lg:text-base text-gray-400 capitalize font-semibold">
                          {myorder.orderStatus}
                        </span>{" "}
                        <span className=" lg:text-gray-500">|</span>{" "}
                        <span className="   lg:text-base font-light text-gray-500">
                          {" "}
                          {format(new Date(myorder.createdAt), "PPPP p")}
                        </span>
                      </span>
                    )}
                    {myorder.orderStatus === "active" && (
                      <span className=" text-xs  lg:text-base text-blue-400 capitalize font-semibold">
                        •{" "}
                        <span className="text-xs lg:text-base text-blue-400 capitalize font-semibold">
                          {myorder.orderStatus}
                        </span>{" "}
                        <span className=" lg:text-gray-500">|</span>{" "}
                        <span className="   lg:text-base font-light text-gray-500">
                          {" "}
                          {format(new Date(myorder.createdAt), "PPPP p")}
                        </span>
                      </span>
                    )}
                    {myorder.orderStatus === "complete" && (
                      <span className=" text-xs  lg:text-base text-green-400 capitalize font-semibold">
                        •{" "}
                        <span className="text-xs lg:text-base text-green-400 capitalize font-semibold">
                          {myorder.orderStatus}
                        </span>{" "}
                        <span className=" lg:text-gray-500">|</span>{" "}
                        <span className="   lg:text-base font-light text-gray-500">
                          {" "}
                          {format(new Date(myorder.createdAt), "PPPP p")}
                        </span>
                      </span>
                    )}
                    {myorder.orderStatus === "denied" && (
                      <span className=" text-xs  lg:text-base text-red-400 capitalize font-semibold">
                        •{" "}
                        <span className="text-xs lg:text-base text-red-400 capitalize font-semibold">
                          {myorder.orderStatus}
                        </span>{" "}
                        <span className=" lg:text-gray-500">|</span>{" "}
                        <span className="   lg:text-base font-light text-gray-500">
                          {" "}
                          {format(new Date(myorder.createdAt), "PPPP p")}
                        </span>
                      </span>
                    )}
                    {myorder.orderStatus === "refund" && (
                      <span className=" text-xs  lg:text-base text-yellow-400 capitalize font-semibold">
                        •{" "}
                        <span className="text-xs lg:text-base text-yellow-400 capitalize font-semibold">
                          {myorder.orderStatus}
                        </span>{" "}
                        <span className=" lg:text-gray-500">|</span>{" "}
                        <span className="   lg:text-base font-light text-gray-500">
                          {" "}
                          {format(new Date(myorder.createdAt), "PPPP p")}
                        </span>
                      </span>
                    )}
                    <div className=""></div>
                    <span className="text-xs lg:text-base text-gray-500 font-light">
                      <span className="hidden lg:block lg:text-base">
                        Order Number:{" "}
                        <span className="italic">{myorder.id}</span>
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex w-full px-4 lg:px-8">
                      <Image
                        alt="Service Image"
                        className="w-[125px] h-[128px] border rounded-lg my-3"
                        src={myorder.service.image || ""}
                        width={125}
                        height={128}
                      />

                      <div className="flex flex-col pl-4 my-1">
                        <div className=" flex  pt-2 pb-1">
                          <BsShop className="mt-2" />
                          <div className="flex flex-col ml-2 cursor-pointer" onClick={()=> router.push(`/seller/profile/${myorder.sellerId}`)}>
                            <span className=" text-base font-light mt-1 text-black">
                              {myorder.sellerName}
                            </span>
                          </div>
                        </div>
                        <span className=" text-base lg:text-lg font-bold capitalize text-black">
                          {myorder.service.title}
                        </span>
                        <div className="hidden lg:block">
                          <span className="text-base font-semibold">
                            Packpage:
                          </span>
                        </div>
                        <div className="hidden lg:block">
                          <ul className="list-disc ml-6">
                            <li>
                              {myorder.service.deliveryTime} Days Delivery
                            </li>
                            <li>{myorder.service.revisions} Times Revision</li>
                          </ul>
                        </div>

                        <div className=" lg:hidden flex flex-col">
                          <p className=" text-base">Total Price </p>
                          <p className="text-lg font-bold">$ {myorder.price}</p>
                        </div>
                        {/* {myorder.orderStatus === 'pending' && <span className=" text-md" > Status:  <span className="text-md text-gray-400">{myorder.orderStatus}</span></span>}
                      {myorder.orderStatus === 'complete' && <span className=" text-md" > Status:  <span className="text-md text-green-400">{myorder.orderStatus}</span></span>}
                      {myorder.orderStatus === 'denied' && <span className=" text-md" > Status:  <span className="text-md text-red-400">{myorder.orderStatus}</span></span>}
                      {myorder.orderStatus === 'refund' && <span className=" text-md" > Status:  <span className="text-md text-yellow-400">{myorder.orderStatus}</span></span>}                       */}
                      </div>
                    </div>

                    <div className="hidden lg:block lg:relative w-1/3 mr-20">
                      <div className="flex flex-col mt-10 px-2 p-4  border-l">
                        <p className=" text-base ml-8">Total Price </p>
                        <p className="text-lg font-bold ml-8">
                          $ {myorder.price}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className=" flex justify-end px-7 w-full py-1 gap-4">
                    <label
                      htmlFor={myorder.id + "2"}
                      className="btn btn-sm btn-success  text-white lg:btn lg:btn-success  lg:text-white"
                    >
                      Detail Transaction
                    </label>
                    {/* <button className="btn  btn-success  text-white" onClick={()=>(window as any).$trans.showModal()}>Detail Transcation</button> */}
                    <div className="dropdown dropdown-bottom dropdown-end">
                      <label
                        tabIndex={0}
                        className="btn btn-sm btn-outline btn-accent lg:btn lg:btn-outline lg:btn-accent"
                      >
                        <BsChevronDown />
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu   p-2 my-1 bg-slate-100 rounded-box w-40 z-20"
                      >
                        {myorder.orderStatus !== "denied" && (
                          <li>
                            <label htmlFor={myorder.id + "3"} className="">
                              Progress
                            </label>
                          </li>
                        )}

                        <li>
                          <a
                            onClick={() => handleChat(String(myorder.sellerId))}
                          >
                            Chat
                          </a>
                        </li>
                        {myorder.orderStatus === "active" && (
                          <>
                            {myorder.hasRefund !== true && (
                              <li>
                                <a
                                  onClick={() =>
                                    handleRefund(String(myorder.id))
                                  }
                                >
                                  Refund
                                </a>
                              </li>
                            )}
                          </>
                        )}
                        {myorder.orderStatus === "complete" && (
                          <>
                            {myorder.reviewed === false && (
                              <li>
                                <label
                                  onClick={() => {
                                    setCustomValue(
                                      "serviceId",
                                      myorder.service.id
                                    );
                                    setCustomValue("buyerId", myorder.buyerId);
                                  }}
                                  htmlFor={myorder.service.id}
                                  className=""
                                >
                                  Review
                                </label>
                              </li>
                            )}
                          </>
                        )}

                        {myorder.orderStatus === "active" && (
                          <>
                            {myorder.complain.length === 0 && (
                              <li>
                                <label
                                  htmlFor={myorder.id}
                                  className=" cursor-pointer my-2"
                                >
                                  Complain
                                </label>
                              </li>
                            )}
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <input type="checkbox" id={myorder.id} className="modal-toggle" />
              <div className="modal sm:modal-middle modal-bottom">
                <div className="modal-box">
                  <div className="flex justify-between pb-2">
                    <span className="font-semibold text-lg">Complain</span>
                    <label
                      htmlFor={myorder.id}
                      className=" cursor-pointer my-2"
                    >
                      <AiOutlineClose />
                    </label>
                  </div>
                  <div className="pb-4">
                    <Select
                      placeholder="Type"
                      isClearable
                      options={safeMapComplain}
                      value={complainType.value}
                      onChange={(value) => setTypeComplain(value.value)}
                      formatOptionLabel={(option: any) => (
                        <div
                          className="
          flex flex-row items-center gap-3"
                        >
                          <div>{option.label}</div>
                        </div>
                      )}
                    />
                  </div>
                  <div className="pb-4">
                    <h3 className="font-semibold text-slate-400 text-sm">
                      Send Image
                    </h3>
                    <ImageUpload
                      onChange={(e) => setImageComplain(e)}
                      value={image}
                    />
                  </div>

                  <textarea
                    className="textarea textarea-bordered textarea-md w-full max-w-lg"
                    onChange={(e) => setDescriptionComplain(e.target.value)}
                    placeholder="Comment"
                  ></textarea>
                  <div className="modal-action">
                    <button
                      className="btn"
                      onClick={() => handleComplain(myorder.id)}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                id={myorder.service.id}
                className="modal-toggle"
              />
              <div className="modal sm:modal-middle modal-bottom">
                <div className="modal-box">
                  <div className="flex justify-between">
                    <span className="font-semibold text-lg">Review</span>
                    <label
                      htmlFor={myorder.service.id}
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
                      onChange={(value) => setCustomValue("image", value)}
                      value={imager}
                    />
                  </div>
                  <textarea
                    className="textarea textarea-bordered textarea-md w-full max-w-lg"
                    onChange={(e) =>
                      setCustomValue("reviewText", e.target.value)
                    }
                    placeholder="Comment"
                  ></textarea>
                  <div className="flex gap-1 justify-center">
                    <span className="font-semibold text-slate-400 text-base">
                      Rating:{" "}
                    </span>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <FaStar
                        size={20}
                        key={num}
                        className={`cursor-pointer ${
                          rating >= num ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => {
                          SetRating(num);
                          setCustomValue("rating", num);
                        }}
                      />
                    ))}
                  </div>
                  <div className="modal-action">
                    <button className="btn" disabled={rating == 0} onClick={handleSubmit(onSubmit)}>
                      Submit
                    </button>
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                id={myorder.id + "3"}
                className="modal-toggle"
              />
              <div className="modal sm:modal-middle modal-bottom">
                <div className="modal-box">
                  <div className="flex justify-between">
                    <span className="font-semibold text-lg">Progress</span>
                    <label
                      htmlFor={myorder.id + "3"}
                      className=" cursor-pointer my-2"
                    >
                      <AiOutlineClose />
                    </label>
                  </div>
                  {myorder.report.map((orders: any) => (
                    <div key={orders} className="w-full my-2">
                      {orders.length === 0 ? (
                        <div>Tidak ada progress</div>
                      ) : (
                        <div className="flex flex-col">
                          <div
                            className="w-full h-full border rounded-lg cursor-pointer"
                            onClick={() =>
                              router.push(`/detailreport/${orders.id}`)
                            }
                          >
                            <div className="flex justify-between px-4 py-2 border-b bg-green-400 rounded-t-lg text-white">
                              <p className="capitalize">
                                {orders.reportStatus}
                              </p>
                              <p>
                                {format(new Date(orders.createdAt), "PPPP")}
                              </p>
                            </div>
                            <div className="flex w-full px-1 py-4">
                              {orders.imageReport.map((img: any) => (
                                <div
                                  key={img}
                                  className="flex justify-center mx-auto"
                                >
                                  <Image
                                    alt="Service Image"
                                    className="w-[125px] h-[128px] border rounded-lg"
                                    src={img || ""}
                                    width={125}
                                    height={128}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Put this part before </body> tag */}
              <input
                type="checkbox"
                id={myorder.id + "2"}
                className="modal-toggle"
              />
              <div className="modal sm:modal-middle modal-bottom">
                <div className="modal-box">
                  <div className="flex justify-between">
                    {/* <h3 className="font-bold text-base">Detail Transaction</h3> */}
                    {myorder.orderStatus === "pending" && (
                      <span className="text-sm lg:text-base text-gray-400 capitalize font-semibold">
                        •{" "}
                        <span className="text-sm lg:text-base text-gray-400 capitalize font-semibold">
                          {myorder.orderStatus}
                        </span>{" "}
                      </span>
                    )}
                    {myorder.orderStatus === "active" && (
                      <span className="text-sm lg:text-base text-blue-400 capitalize font-semibold">
                        •{" "}
                        <span className="text-sm lg:text-base text-blue-400 capitalize font-semibold">
                          {myorder.orderStatus}
                        </span>{" "}
                      </span>
                    )}
                    {myorder.orderStatus === "complete" && (
                      <span className="text-base text-green-400 capitalize font-semibold">
                        •{" "}
                        <span className="text-base text-green-400 capitalize font-semibold">
                          {myorder.orderStatus}
                        </span>{" "}
                      </span>
                    )}
                    {myorder.orderStatus === "denied" && (
                      <span className="text-base text-red-400 capitalize font-semibold">
                        •{" "}
                        <span className="text-base text-red-400 capitalize font-semibold">
                          {myorder.orderStatus}
                        </span>{" "}
                      </span>
                    )}
                    {myorder.orderStatus === "refund" && (
                      <span className="text-base text-yellow-400 capitalize font-semibold">
                        •{" "}
                        <span className="text-base text-yellow-400 capitalize font-semibold">
                          {myorder.orderStatus}
                        </span>{" "}
                      </span>
                    )}
                    <span className="text-xs lg:text-base font-light text-gray-500">
                      {myorder.id}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-xs lg:text-base font-light text-gray-500">
                      {" "}
                      {format(new Date(myorder.createdAt), "PPPP p")}
                    </span>
                  </div>

                  <div className=" flex pt-4">
                    <BsShop className="mt-0.5" />
                    <div className="flex flex-col ml-3">
                      <span className=" font-semibold text-black">
                        {myorder.sellerName}
                      </span>
                    </div>
                  </div>
                  <p className="py-1 px-8 font-bold capitalize">
                    {myorder.service.title}
                  </p>
                  <div className="px-8 pb-3">
                    <span className="text-base font-semibold">Packpage:</span>
                    <ul className="list-disc ml-8">
                      <li>{myorder.service.deliveryTime} Days Delivery</li>
                      <li>{myorder.service.revisions} Times Revision</li>
                    </ul>
                  </div>

                  <p className=" text-base ml-8">
                    Total Price:{" "}
                    <span className="text-base font-bold">
                      $ {myorder.price}
                    </span>{" "}
                  </p>
                  <p className=" text-base ml-8">
                    Payment Type:{" "}
                    <span className="text-base font-bold capitalize">
                      {myorder.payment_type}
                    </span>{" "}
                  </p>
                  <div className="modal-action">
                    <label
                      htmlFor={myorder.id + "2"}
                      className="btn  btn-success  text-white"
                    >
                      Close
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
    // <div className="max-w-[1640px] m-auto py-4 ">
    //         <div className="">
    //             <h1 className=" mx-12 text-5xl font-semibold">My Order</h1>
    //         </div>
    //         <div className="">
    //             <MyOrderStatus/>
    //         </div>
    //         <div className="overflow-x-auto">
    //             <div className="table table-compact w-full text-center ">
    //                 <thead>
    //                     <tr>
    //                         <th>Order ID</th>
    //                         <th>Service ID</th>
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
    //                         <td>{myor.serviceId}</td>
    //                         <td>{myor.createdAt}</td>
    //                         <td>IDR {myor.price}</td>
    //                         <td>{myor.orderStatus}</td>
    //                         {myor.orderStatus === 'active' &&
    //                         <>
    //                             <td>
    //                                 <button className="btn btn-xs btn-outline btn-primary">Complete</button>
    //                                 <button onClick={() => handleRefund(String(myor.id))} className="btn btn-xs btn-outline btn-primary">Refund</button>
    //                             </td>

    //                         </>
    //                         }
    //                         {myor.orderStatus === 'pending' && <td>Waiting Approval</td>}
    //                         {myor.orderStatus === 'complete' &&<td><a onClick={() => router.push(`/reviews/${myor.serviceId}`)}>Reviews</a></td>}
    //                         {myor.orderStatus === 'denied' && <td>Denied by Seller</td>}
    //                         {myor.orderStatus === 'refund' && <td>Refund by User</td>}
    //                     </tr>
    //                     ))}

    //                 </tbody>
    //             </div>
    //         </div>
    //     </div>
  );
};

export default MyOrderClient;
