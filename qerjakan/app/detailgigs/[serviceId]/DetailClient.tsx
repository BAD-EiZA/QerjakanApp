"use client";
import {
  SafeCurrentUser,
  SafeProfile,
  SafeService,
  SafeUser,
} from "@/app/types";
import { FaStar } from "react-icons/fa";
import {
  Profile,
  Reviews,
  Service,
  User,
  UserBankAccount,
} from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useLoginModal from "@/app/hooks/useLoginModal";
import { AiOutlineClose } from "react-icons/ai";

interface DetailProps {
  service: Service & {
    user: User;
  };
  averageRating: number | { rating: number }[] | null;
  currprofiles:
    | (Profile & {
        user: SafeCurrentUser;
      })
    | null;
  curruser: SafeCurrentUser | null;
  review: Reviews[];
}

const DetailClient: React.FC<DetailProps> = ({
  service,
  currprofiles,
  curruser,
  averageRating,
  review,
}) => {
  const [isLoading, setIsloading] = useState(false);
  const [isBalance, setIsBalance] = useState(true)
  const [orderId, setOrderId] = useState("");
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [services, setServices] = useState(service);
  const loginModal = useLoginModal();


  if (!curruser) {
    return (
      <div className="max-w-[1640px] m-auto py-4">
        <div className="max-w-[1140px] m-auto  grid lg:grid-cols-3 lg:gap-6 pt-4">
          <div className="  px-2 lg:col-span-2">
            <div className="">
              <h1 className=" text-2xl font-bold">{service.title}</h1>
            </div>
            <div className=" flex  pt-2">
              <Image
                alt="User Image"
                src={service.user.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                className="h-[30px] w-[30px] rounded-full"
                width={30}
                height={30}
              />

              <div className="flex flex-col ml-3">
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/seller/profile/${service.user.id}`)
                  }
                >
                  <span className=" font-semibold text-black ">
                    {service.user.name}
                  </span>
                </div>

                <span className="text-xs font-semibold flex gap-1">
                  {averageRating?.toString()} <FaStar />
                </span>
              </div>
            </div>
            <div className=" bg-slate-200 lg:mt-4 ">
              <img
                src={service.image || ""}
                alt=""
                className=" w-full max-h-[400px] object-contain"
              />
            </div>
            <div className=" hidden lg:grid">
              <div className=" lg:mt-11">
                <h1 className=" text-xl font-bold">About This Gig</h1>
                <h1 className=" text-lg">{service.description}</h1>
              </div>
              <hr />
              <div className="mt-4">
                <div className="flex justify-between">
                  <h1 className=" text-xl font-bold">About The Seller</h1>
                </div>

                <div className="pt-4 flex">
                  <Image
                    alt="User Image"
                    className="h-[50px] w-[50px] lg:h-[80px] lg:w-[80px] rounded-full"
                    src={service.user.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                    width={50}
                    height={50}
                  />

                  <div className="flex flex-col ml-3">
                    <span className=" font-semibold text-black">
                      {service.user.name}
                    </span>
                    <div className="flex">
                      <span className=" font-semibold text-black">
                        {service.user.email}
                      </span>
                    </div>
                    <div className="flex">
                      <span className=" font-semibold text-black">Rating</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border mt-4 mb-4">
                <div className="flex justify-between px-8 py-4">
                  <div className="flex flex-col">
                    <span className=" font-semibold text-black">From</span>
                    <div className="flex">
                      <span className=" font-light text-black">
                        {currprofiles?.country}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className=" font-semibold text-black">Language</span>
                    <div className="flex">
                      <span className=" font-light text-black">
                        {currprofiles?.language}
                      </span>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="px-8 py-4">
                  <p>{currprofiles?.description}</p>
                </div>
              </div>

              {review.map((listReview: any) => (
                <div
                  key={listReview}
                  className="flex flex-col gap-5 py-4 px-4 mb-2 border"
                >
                  <div className="flex items-center ">
                    <Image
                      alt=""
                      src={listReview.user.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                      width={480}
                      height={480}
                      className=" h-[50px] w-[50px] lg:h-[60px] lg:w-[60px] rounded-full"
                    />
                    <div className="flex flex-col ml-3">
                      <div className="flex gap-3 ">
                        <span className=" font-semibold text-black">
                          {listReview.user.name}
                        </span>
                        <div>
                          <span className="flex items-center">
                            <FaStar className="text-yellow-400" size={13} />{" "}
                            {listReview.rating}{" "}
                          </span>
                        </div>
                      </div>

                      <div className="flex">
                        <span className=" font-semibold text-black">
                          {listReview.user.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className=" text-base font-semibold">
                    {listReview.reviewText}
                  </div>
                  <div className="flex gap-2">
                    {listReview.image.map((img: any) => (
                      <div key={img} className=" flex">
                        <Image
                          alt=""
                          src={img || ""}
                          width={480}
                          height={480}
                          className="w-[125px] h-[128px] border rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="">
            <div className="border-2 md:top-[102px] sticky">
              <div className="border-b-2 border-b-lime-400 flex justify-center">
                <h1 className=" text-2xl font-bold ">Basic</h1>
              </div>
              <div className="border py-2 px-4">
                <h1 className=" font-bold">${service.price}</h1>
              </div>
              <div className="border px-4">
                <h1 className=" text-lg font-semibold">{service.title}</h1>
                <h1 className=" text-sm font-normal"> {service.description}</h1>
                <h1 className=" text-xs font-light">
                  {" "}
                  {service.deliveryTime} Days Delivery
                </h1>
              </div>
              <div className="border flex justify-center p-6">
              <button
                  className="btn btn-wide"
                  onClick={() => loginModal.onOpen()}
                >
                  Checkout
                </button>
              </div>
              

              {/* Open the modal using ID.showModal() method */}
            </div>

            <div className=" lg:hidden px-2">
              <div className=" lg:mt-11">
                <h1 className=" text-xl font-bold">About This Gig</h1>
                <h1 className=" text-lg">{service.description}</h1>
              </div>
              <hr />
              <div className="border">
                <h1 className=" text-xl font-bold">About The Seller</h1>
                <div className="pt-4 flex">
                  <Image
                    alt="User Image"
                    src={service.user.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                    className="h-[50px] w-[50px] lg:h-[80px] lg:w-[80px] rounded-full"
                    width={50}
                    height={50}
                  />

                  <div className="flex flex-col ml-3">
                    <span className=" font-semibold text-black">
                      {service.user.name}
                    </span>
                    <div className="flex">
                      <span className=" font-semibold text-black">
                        {service.user.email}
                      </span>
                    </div>
                    <div className="flex">
                      <span className=" font-semibold text-black">Rating</span>
                    </div>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
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
  const Autodeletetransaction = async (order_id:string, prevBalance: number) => {
    try {
      setIsloading(true);
      await fetch("/api/autodeletetransactionuser", { method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: order_id,
        prevBalance: prevBalance
      }), })
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
  const handleOnClick = async () => {
    // if (!curruser.userBalance) {
    //   return "";
    // }
    setIsloading(true);
    const final = service.price - curruser.userBalance;
    if (active === true) {
      if (curruser.userBalance >= final) {
        Swal.fire({
          title: "Are you sure want to use balance?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, continue to pay",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await fetch("/api/balanceCheckout", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: service.id,
                price: service.price,
              }),
            })
              .then((res) => res.json())
              .then((res) => {
                if (res.redirect_url) {
                  //open new tab
                  window.open(res.redirect_url, "_blank");
                  setOrderId(res.order_id);
                } else {
                  Swal.fire({
                    icon: "success",
                    title: "Checkout Success",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  router.refresh();
                }
              })
              .catch(() => {
                console.log("Error");
              })
              .finally(() => {
                setIsloading(false);
              });
          }
        });
      } else {
        await fetch("/api/payment/request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: service.id,
            price: final,
            isBalance: isBalance
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.redirect_url) {
              //open new tab
              window.open(res.redirect_url, "_blank");
              setOrderId(res.order_id);
              setTimeout(()=> Autodeletetransaction(res.order_id, res.getPreviousBalance), 5 * 60 * 1000);
            } else {
              Swal.fire({
                icon: "success",
                title: "Checkout Success",
                showConfirmButton: false,
                timer: 1500,
              });
              router.refresh();
            }
          })
          .catch(() => {
            console.log("Error");
          })
          .finally(() => {
            setIsloading(false);
          });
      }
    } else {
      await fetch("/api/payment/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: service.id,
          price: service.price,
        }),
      })
        .then((res) => res.json().then((res) => {
          if (res.redirect_url) {
            //open new tab
            window.open(res.redirect_url, "_blank");
            setOrderId(res.order_id);
          } else {
            console.log(res,"_blank")
          }
        }))
        
        .catch(() => {
          console.log("Error");
        })
        .finally(() => {
          setIsloading(false);
        });
    }
  };

  const lastPrice = () => {
    
    if (active === true) {
      const final = service.price - curruser.userBalance;
      if (final < 0) {
        return 0;
      }
      return final;
    } else {
      return service.price;
    }
  };
  const lastBalance = () => {
    if (!curruser.userBalance) {
      return "";
    }
    if (active === true) {
      const finalSaldo = curruser.userBalance - service.price;
      if (finalSaldo < 0) {
        return 0;
      }
      return finalSaldo;
    }
  };

  return (
    <div className="max-w-[1640px] m-auto py-4">
      <div className="max-w-[1140px] m-auto  grid lg:grid-cols-3 lg:gap-6 pt-4">
        <div className="  px-2 lg:col-span-2">
          <div className="">
            <h1 className=" text-2xl font-bold">{service.title}</h1>
          </div>
          <div className=" flex  pt-2">
            <Image
              alt="User Image"
              src={service.user.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
              className="h-[30px] w-[30px] rounded-full"
              width={30}
              height={30}
            />

            <div className="flex flex-col ml-3">
              <div
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/seller/profile/${service.user.id}`)
                }
              >
                <h1 className="font-semibold text-black">
                  {service.user.name}
                </h1>
              </div>
              <span className="text-xs font-semibold flex gap-1">
                {averageRating?.toString()} <FaStar />
              </span>
            </div>
          </div>
          <div className=" bg-slate-200 lg:mt-4 ">
            <img
              src={service.image || ""}
              alt=""
              className=" w-full max-h-[400px] object-contain"
            />
          </div>
          <div className=" hidden lg:grid">
            <div className=" lg:mt-11">
              <h1 className=" text-xl font-bold">About This Gig</h1>
              <h1 className=" text-lg">{service.description}</h1>
            </div>
            <hr />
            <div className="mt-4">
              <div className="flex justify-between">
                <h1 className=" text-xl font-bold">About The Seller</h1>
                {curruser.id !== service.sellerId && (
                  <button
                    className="btn btn-xs btn-primary"
                    onClick={() => handleChat(String(service.sellerId))}
                  >
                    Contact Me
                  </button>
                )}
              </div>

              <div className="pt-4 flex">
                <Image
                  alt="User Image"
                  className="h-[50px] w-[50px] lg:h-[80px] lg:w-[80px] rounded-full"
                  src={service.user.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                  width={50}
                  height={50}
                />

                <div className="flex flex-col ml-3">
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/seller/profile/${service.user.id}`)
                    }
                  >
                    <h1 className="font-semibold text-black">
                      {service.user.name}
                    </h1>
                  </div>
                  <div className="flex">
                    <span className=" font-semibold text-black">
                      {service.user.email}
                    </span>
                  </div>
                  <div className="flex">
                    <span className=" font-semibold text-black">Rating</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border mt-4 mb-4">
              <div className="flex justify-between px-8 py-4">
                <div className="flex flex-col">
                  <span className=" font-semibold text-black">From</span>
                  <div className="flex">
                    <span className=" font-light text-black">
                      {currprofiles?.country}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className=" font-semibold text-black">Language</span>
                  <div className="flex">
                    <span className=" font-light text-black">
                      {currprofiles?.language.map((lg: any) => (
                        <div key={lg} className="">
                          {lg}
                        </div>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
              <hr />
              <div className="px-8 py-4">
                <p>{currprofiles?.description}</p>
              </div>
            </div>

            {review.map((listReview: any) => (
              <div
                key={listReview}
                className="flex flex-col gap-5 py-4 px-4 mb-2 border"
              >
                <div className="flex items-center ">
                  <Image
                    alt=""
                    src={listReview.user.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                    width={480}
                    height={480}
                    className=" h-[50px] w-[50px] lg:h-[60px] lg:w-[60px] rounded-full"
                  />
                  <div className="flex flex-col ml-3">
                    <div className="flex gap-3 ">
                      <span className=" font-semibold text-black">
                        {listReview.user.name}
                      </span>
                      <div>
                        <span className="flex items-center">
                          <FaStar className="text-yellow-400" size={13} />{" "}
                          {listReview.rating}{" "}
                        </span>
                      </div>
                    </div>

                    <div className="flex">
                      <span className=" font-semibold text-black">
                        {listReview.user.email}
                      </span>
                    </div>
                  </div>
                </div>
                <div className=" text-base font-semibold">
                  {listReview.reviewText}
                </div>
                <div className="flex gap-2">
                  {listReview.image.map((img: any) => (
                    <div key={img} className=" flex">
                      <Image
                        alt=""
                        src={img || ""}
                        width={480}
                        height={480}
                        className="w-[125px] h-[128px] border rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="">
          <div className="border-2 md:top-[102px] sticky">
            <div className="border-b-2 border-b-lime-400 flex justify-center">
              <h1 className=" text-2xl font-bold ">Basic</h1>
            </div>
            <div className="border py-2 px-4">
              <h1 className=" font-bold">${service.price}</h1>
            </div>
            <div className="border px-4 py-4">
              <h1 className=" text-lg font-semibold">{service.title}</h1>
              <h1 className=" text-sm font-normal"> {service.description}</h1>
              <h1 className=" text-xs font-light">
                {" "}
                {service.deliveryTime} Days Delivery
              </h1>
            </div>
            <div className="border flex justify-center p-6">
              {curruser.id !== service.sellerId && (
                <button
                  className="btn btn-wide"
                  onClick={() => (window as any).descCheckout.showModal()}
                >
                  Checkout
                </button>
              )}
              {curruser.id === service.sellerId && (
                <button
                  className="btn btn-wide"
                  onClick={() => router.push("/seller/myservice/dashboard")}
                >
                  Toko Saya
                </button>
              )}
            </div>

            {/* Open the modal using ID.showModal() method */}

            <dialog
              id="descCheckout"
              className="modal modal-bottom sm:modal-middle"
            >
              <form method="dialog" className="modal-box">
                <div className="flex justify-between">
                <h3 className="font-bold text-lg">Checkout Detail</h3>
                <button onClick={()=> (window as any).descCheckout.close()}><AiOutlineClose/></button>
                </div>
                
                <div className=" pt-6">
                  <div className=" flex pt-4">
                    <Image
                      alt="User Image"
                      className="h-[20px] w-[20px] rounded-full"
                      src={service.user.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                      height={20}
                      width={20}
                    />

                    <div className="flex flex-col ml-3">
                      <span className=" font-semibold text-black">
                        {service.user.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <p className="py-4 px-8">{service.title}</p>
                    <p className="py-4">${service.price}</p>
                  </div>
                  <div className="flex justify-between">
                    {curruser.userBalance > 0 && (
                      <div className="flex px-8">
                        <input
                          type="checkbox"
                          checked={active}
                          onClick={() =>
                            active ? setActive(false) : setActive(true)
                          }
                          className="checkbox checkbox-success"
                        />
                        <p className="ml-2">Pay with Balance</p>
                      </div>
                    )}
                    {active && <p className="">- ${service.price}</p>}
                  </div>
                  {active && (
                    <p className="py-2 ml-16 text-xs text-gray-400">
                      (Remaining Balance: ${lastBalance()})
                    </p>
                  )}
                  <hr />
                  <div className="flex justify-between py-4">
                    <p>Total bill :</p>
                    <p>${lastPrice()}</p>
                  </div>

                  <div className="modal-action">
                    {/* if there is a button in form, it will close the modal */}
                    <button
                      onClick={() => handleOnClick()}
                      className="btn w-full"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </form>
            </dialog>
          </div>

          <div className=" lg:hidden px-2">
            <div className=" lg:mt-11">
              <h1 className=" text-xl font-bold">About This Gig</h1>
              <h1 className=" text-lg">{service.description}</h1>
            </div>
            <hr />
            <div className="border">
              <h1 className=" text-xl font-bold">About The Seller</h1>
              <div className="pt-4 flex">
                <Image
                  alt="User Image"
                  src={service.user.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                  className="h-[50px] w-[50px] lg:h-[80px] lg:w-[80px] rounded-full"
                  width={50}
                  height={50}
                />

                <div className="flex flex-col ml-3">
                  <span className=" font-semibold text-black">
                    {service.user.name}
                  </span>
                  <div className="flex">
                    <span className=" font-semibold text-black">
                      {service.user.email}
                    </span>
                  </div>
                  <div className="flex">
                    <span className=" font-semibold text-black">Rating</span>
                  </div>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailClient;
