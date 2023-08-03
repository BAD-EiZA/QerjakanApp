"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import useAllCategories from "../hooks/useCategories";

interface CategoryBoxProps {
  value?: string;
  label?: string;
}

const CategoryBars: React.FC<CategoryBoxProps> = ({ label, value }) => {
  const router = useRouter();
  const params = useSearchParams();
  const { data: allCat = [] } = useAllCategories();
  const handleClick = useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      categoryId: value,
    };

    if (params?.get("categoryId") === value) {
      delete updatedQuery.categoryId;
    }
    const url = qs.stringifyUrl(
      {
        url: "/categorypage/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [label, router, value]);

  return (
    <div onClick={handleClick}>
      <h2 className=" hover:border-b-green-500 py-2 flex justify-between items-center md:pr-0 pr-5 group">
        {label}
      </h2>
    </div>
  );
};

export default CategoryBars;
