"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface StatusSellerBoxProps {
  value?: string;
  label?: string;
}

const StatusSellerOrderBar: React.FC<StatusSellerBoxProps> = ({
  value,
  label,
}) => {
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
      delete updatedQuery.serviceStatus;
    }
    const url = qs.stringifyUrl(
      {
        url: "seller/myservice/transaction",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [label, router, params, value]);
  return (
    <div onClick={handleClick}>
      {label === "Waiting" && (
        <h2 className=" gap-1 hover:bg-orange-400 hover:rounded-md py-2 text-xs border-black hover:text-white flex border rounded-md justify-between items-center pr-5 px-4 group">
          <span className="text-orange-500">•</span> {label}
        </h2>
      )}
      {label === "Active" && (
        <h2 className=" gap-1 hover:bg-blue-400 hover:rounded-md py-2 text-xs border-black hover:text-white flex border rounded-md justify-between items-center pr-5 px-4 group">
          <span className="text-blue-500">•</span> {label}
        </h2>
      )}
      {label === "Denied" && (
        <h2 className=" gap-1  hover:bg-red-400 hover:rounded-md py-2 text-xs border-black hover:text-white flex border rounded-md justify-between items-center pr-5 px-4 group">
          <span className="text-red-500">•</span>
          {label}
        </h2>
      )}
      {label === "Complete" && (
        <h2 className=" gap-1 hover:bg-green-400 hover:rounded-md py-2 text-xs border border-black rounded-md hover:text-white flex justify-between items-center pr-5 px-4 group">
          <span className="text-green-500">•</span>
          {label}
        </h2>
      )}
      {label === "Refund" && (
        <h2 className=" gap-1  hover:bg-purple-400 hover:rounded-md py-2 text-xs border border-black rounded-md  hover:text-white flex justify-between items-center pr-5 px-4 group">
          <span className="text-purple-500">•</span>
          {label}
        </h2>
      )}
      {/* <h2  className="  hover:bg-green-500 hover:rounded-md py-2  hover:text-white flex justify-between items-center pr-5 px-4 group">
            {label}
        </h2> */}
    </div>
  );
};

export default StatusSellerOrderBar;
