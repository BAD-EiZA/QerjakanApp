"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface StatusBoxProps {
  value?: string;
  label?: string;
}

const StatusMyOrderBar: React.FC<StatusBoxProps> = ({ value, label }) => {
  const router = useRouter();
  const params = useSearchParams();
  const handleClick = useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      orderStatus: value,
    };

    if (params?.get("orderStatus") === value) {
      delete updatedQuery.orderStatus;
    }
    if (params?.get("orderStatus") === "dashboard") {
      delete updatedQuery.orderStatus;
    }
    const url = qs.stringifyUrl(
      {
        url: "myorder/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [label, router, params, value]);
  return (
    <div onClick={handleClick}>
      <h2 className="  hover:bg-green-500 hover:rounded-md py-2  hover:text-white flex justify-between items-center md:pr-0 pr-5 pl-2 group">
        {label}
      </h2>
    </div>
  );
};

export default StatusMyOrderBar;
