"use client";

import useTransactionNotif from "@/app/hooks/useUpdateTransaction";
import clsx from "clsx";
import { useCallback, useState } from "react";
import { AiFillBell } from "react-icons/ai";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
import useUpdateNotif from "@/app/hooks/useUpdateNotif";
import Loader from "../Loader";

interface NotifProps {
  TransactionCount: number | never[];
}

function Notifications({ TransactionCount }: NotifProps) {
  const [active, SetActive] = useState(false);
  const [dataTransaction, setDataTransaction] = useState(false);
  const [dataUpdates, setDataUpdates] = useState(false);

  const router = useRouter();
  const { data: transactions = [], isLoading } =
    useTransactionNotif(dataTransaction);
  const { data: updates = [], isValidating } = useUpdateNotif(dataUpdates);

  const HandleFetchData = async () => {
    if (!active) {
      SetActive(true);
      setDataTransaction(false);
      setDataUpdates(true);
    } else {
      SetActive(false);
      setDataTransaction(true)
      setDataUpdates(false);
    }
  };

  const handleNotificationUpdate = useCallback(
    async (id: string, type: string) => {
      try {
        const response = await axios.post(
          `/api/notification/common/updates/${id}`,
          {
            id: id,
          }
        );
        if (response) {
          if (type === "Seller") {
            router.push("/seller/myservice/transaction");
          } else {
            router.push("/myorder");
          }
        } else {
          console.error("Error updating notification:");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error",
        });
      }
    },
    [router]
  );

  return (
    <div>
      <div className="dropdown dropdown-bottom dropdown-end">
        <label tabIndex={1} className=" cursor-pointer">
          <div className="indicator">
            {TransactionCount !== 0 && (
              <span className="indicator-item badge badge-secondary">
                {TransactionCount}
              </span>
            )}
            <div className="">
              <AiFillBell onClick={() => setDataTransaction(true)} size={20} />
            </div>
          </div>
        </label>
        <ul
          tabIndex={1}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-fit px-2"
        >
          <div className="flex justify-evenly ">
            <div className="tabs">
              <li
                onClick={() => HandleFetchData()}
                className={clsx(
                  !active ? "tab tab-bordered tab-active" : "tab"
                )}
              >
                Transaction
              </li>
              {/* <li className="tab tab-bordered"> Updates</li> */}
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="tabs">
              <li
                onClick={() => HandleFetchData()}
                className={clsx(active ? "tab tab-bordered tab-active" : "tab")}
              >
                Updates
              </li>
              {/* <li className="tab tab-bordered"> Updates</li> */}
            </div>
          </div>
          <div className=" py-1">
            {!active ? (
              <div className="px-2 overflow-y-scroll h-24">
                {isLoading ? (
                  <>
                    <Loader />
                  </>
                ) : (
                  <>
                    {transactions.length === 0 ? (
                      <>
                        <h1>Dont Have Notification</h1>
                      </>
                    ) : (
                      <>
                        {transactions.map((trans: any) => (
                          <>
                            <div className="hover:bg-green-200 rounded-lg py-1 ">
                              <a
                                onClick={() =>
                                  handleNotificationUpdate(
                                    trans.id,
                                    trans.NotifRole
                                  )
                                }
                              >
                                <p className="py-1 capitalize text-xs px-2">
                                  {trans.body}
                                </p>
                              </a>
                            </div>
                          </>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="px-2 overflow-y-scroll h-24">
                {isValidating ? (
                  <>
                    <Loader />
                  </>
                ) : (
                  <>
                    {updates.length === 0 ? (
                      <>
                        <h1>Dont Have Notification</h1>
                      </>
                    ) : (
                      <>
                        {updates.map((update: any) => (
                          <>
                            <div className="hover:bg-green-200 rounded-lg py-1 ">
                              <a
                                onClick={() =>
                                  handleNotificationUpdate(
                                    update.id,
                                    update.NotifRole
                                  )
                                }
                              >
                                <p className="py-1 capitalize text-xs px-2">
                                  {update.body}
                                </p>
                              </a>
                            </div>
                          </>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
}

export default Notifications;
