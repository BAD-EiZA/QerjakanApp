"use client";
import { Order, Report, Service } from "@prisma/client";
import Image from "next/image";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

interface DetailProps {
  report: Report & {
    order: Order & {
      service: Service;
    };
  };
}

const ReportClient: React.FC<DetailProps> = ({ report }) => {
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();
  const handleRevision = async () => {
    setIsloading(true);
    try {
      Swal.fire({
        title: "Are you sure want to revision?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await fetch("/api/revision", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: report.id,
            }),
          })
            .then((res) => res.json().then((res)=> {
              if(res.statusCode === 200){
                Swal.fire({
                  icon: "success",
                  title: res.message,
                  showConfirmButton: false,
                  timer: 1500,
                });
                router.refresh();
              }
              else if(res.statusCode === 401){
                Swal.fire({
                  icon: "success",
                  title: res.message,
                  showConfirmButton: false,
                  timer: 1500,
                });
                router.push('/')
              }
              else{
                Swal.fire({
                  icon: "success",
                  title: res.message,
                  showConfirmButton: false,
                  timer: 1500,
                });
                router.refresh()
              }
            }))
            .catch(() => {
              console.log("Error");
            })
            .finally(() => {
              
              setIsloading(false);
            });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeliver = async () => {
    setIsloading(true);
    try {
      Swal.fire({
        title: "Are you sure want to accept the submission?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await fetch("/api/acceptSubmission", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: report.id,
            }),
          })
            .then((res) => res.json().then((res)=> {
              if(res.statusCode === 200){
                Swal.fire({
                  icon: "success",
                  title: res.message,
                  showConfirmButton: false,
                  timer: 1500,
                });
                router.refresh();
              }
              else if(res.statusCode === 401){
                Swal.fire({
                  icon: "success",
                  title: res.message,
                  showConfirmButton: false,
                  timer: 1500,
                });
                router.push('/')
              }
              else{
                Swal.fire({
                  icon: "success",
                  title: res.message,
                  showConfirmButton: false,
                  timer: 1500,
                });
                router.refresh()
              }
            }))

            .catch(() => {
              console.log("Error");
            })
            .finally(() => {
              
              setIsloading(false);
            });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-[1640px] m-auto py-4">
      <div className="max-w-[1140px] m-auto border p-4 grid lg:grid-cols-3 lg:gap-6 pt-4">
        <div className="lg:col-span-2">
          <div className=" max-w-[1140px]">
            <div className=" flex justify-between">
              <p className="text-2xl font-bold">{report.order.sellerName}</p>
              <p className=" text-2xl font-thin">
                {format(new Date(report.createdAt), "PPPP")}
              </p>
            </div>
            <div className="">
              <div className="divider font-extralight text-sm">
                Report Image
              </div>
            </div>
            {/* <div className=" pb-3">
              <p className="text-2xl font-semibold">Image</p>
              
            </div> */}

            <div className=" w-full mx-auto ">
              <div className="w-full h-[440px] carousel ">
                {report.imageReport.map((img: any) => (
                  <div key={img} className=" carousel-item w-full">
                    <img
                      src={img}
                      className="w-full"
                      alt="Tailwind CSS Carousel component"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="">
              <div className="divider font-extralight text-sm">
                Report Description
              </div>
            </div>
            <div className="">
              <p className="text-2xl font-semibold">Description</p>
              <p className=" capitalize">{report.description}</p>
            </div>
            <div className="">
              <div className="divider font-extralight text-sm">Report Link</div>
            </div>
            <div className="">
              <p className="text-2xl font-semibold">Link</p>
              <p className="">{report.linkReport}</p>
            </div>
          </div>
        </div>
        <div className="">
          <div className="border-2 md:top-[102px] sticky">
            <div className=" flex justify-center py-2">
              <h1 className=" text-2xl font-bold ">Submission</h1>
            </div>
            <div className="py-2 px-4">
              <h1 className=" font-semibold">
                Status :{" "}
                <span className=" capitalize">{report.reportStatus}</span>
              </h1>
            </div>
            <div className="py-2 px-4">
              <h1 className=" font-semibold">
                Date Deliver :{" "}
                <span>{format(new Date(report.createdAt), "PPPP")}</span>
              </h1>
            </div>
            <div className="py-2 px-4">
              <h1 className=" font-semibold">
                Title : <span>{report.order.service.title}</span>
              </h1>
            </div>
            <div className=" py-2 px-4">
              <h1 className=" font-semibold">
                Remaining Revision : <span>{report.order.revisionCount}</span>
              </h1>
            </div>

            <div className=" flex justify-center gap-2 py-2">
              {report.reportStatus === "pending" && (
                <>
                  <button className="btn" onClick={() => handleDeliver()}>
                    Accept
                  </button>
                  {report.order.revisionCount !== 0 && (
                    <>
                      <button className="btn" onClick={() => handleRevision()}>
                        Revision
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportClient;
