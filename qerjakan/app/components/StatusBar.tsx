"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface StatusBoxProps {
  value?: string;
  label?: string;
}

const StatusBar: React.FC<StatusBoxProps> = ({ value, label }) => {
  const router = useRouter();
  const params = useSearchParams();
  const handleClick = useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      serviceStatus: value,
    };

    if (params?.get("serviceStatus") === value) {
      delete updatedQuery.serviceStatus;
    }
    const url = qs.stringifyUrl(
      {
        url: "mygigs/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [label, router, params, value]);
  return (
    <div onClick={handleClick}>
      {label === "Active" && (
        <h2 className=" gap-1 hover:bg-green-400 hover:rounded-md py-2 text-xs border-black hover:text-white flex border rounded-md justify-between items-center pr-5 px-4 group">
          <span className="text-green-500">•</span> {label}
        </h2>
      )}
      {label === "Paused" && (
        <h2 className=" gap-1 hover:bg-orange-400 hover:rounded-md py-2 text-xs border-black hover:text-white flex border rounded-md justify-between items-center pr-5 px-4 group">
          <span className="text-orange-500">•</span> {label}
        </h2>
      )}
    </div>
  );
};

export default StatusBar;
