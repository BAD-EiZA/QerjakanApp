"use client";
import { SafeService } from "@/app/types";
import { Reviews } from "@prisma/client";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import React, { memo, useEffect, useState } from "react";

interface CardProps {
  coverImg?: string;
  userImg?: string;
  userName?: string;
  price?: string;
  rating?: string;
  title?: string;
  data: SafeService;
  averageRating?: number;
  redirectUrl?: string;
}

const ServiceCard: React.FC<CardProps> = ({
  coverImg,
  userImg,
  userName,
  price,
  title,
  averageRating,
  redirectUrl,
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/detailgigs/${redirectUrl}`)}
      className="border shadow-lg rounded-lg hover:scale-105 duration-300"
    >
      <Image
        height={480}
        width={480}
        src={coverImg || ""}
        alt=""
        className="w-full h-[180px] md:h-[240px] object-cover rounded-t-lg"
      />
      {/* <img
          src={coverImg || ""}
          alt=""
          className="w-full h-[180px] md:h-[240px] object-cover rounded-t-lg"
        /> */}

      <div className="border flex items-center px-2 py-2 m-auto">
        <Image
          alt=""
          width={480}
          height={480}
          className="h-[30px] w-[30px] rounded-full"
          src={userImg || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
        />
        {/* <img
            src={userImg || ""}
            alt=""
            className="h-[30px] w-[30px] rounded-full"
          /> */}
        <div className="flex flex-col ml-2">
          <span className=" font-medium text-black">{userName}</span>
        </div>
      </div>

      <div className="flex border flex-col justify-between px-2 py-4">
        <p className="font-bold">{title}</p>
      </div>
      <div className="flex justify-between px-2 py-4">
        <div className="bg-lime-500 text-white p-1 rounded-full flex items-center gap-1">
          <span className="mx-auto px-1">{averageRating?.toString()}</span>
          <div className=" mb-0.5">
            <FaStar size={14} />
          </div>
        </div>

        <p>Price ${price}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
