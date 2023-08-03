"use client";

import React from "react";
import { SafeService } from "../types";
import ServiceCard from "../components/servicecard/servicecard";
import { Reviews, Service } from "@prisma/client";
import { AiOutlineSearch } from "react-icons/ai";
import Category from "../components/categories/categories";

interface SearchProps {
  dataService: Service[];
}
const SearchProductClient: React.FC<SearchProps> = ({ dataService }) => {
  return (
    <>
    <Category />
    <div className="max-w-[1640px] m-auto py-12 px-10">
      
      <div className="px-2">
        <div className="flex">
          <AiOutlineSearch size={40} />
          <p className="text-4xl font-bold">Result</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-4">
          {dataService.map((ser: any) => (
            <ServiceCard
              data={ser}
              key={ser.id}
              redirectUrl={ser.id}
              coverImg={ser.image}
              averageRating={
                ser.serviceRating.length === 0 ? 0 : ser.serviceRating.rating
              }
              userImg={ser.user.image}
              title={ser.title}
              userName={ser.user.name}
              price={ser.price}
            />
          ))}
        </div>
      </div>
    </div>
    </>
    
  );
};

export default SearchProductClient;
