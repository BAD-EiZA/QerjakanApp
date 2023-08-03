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

const SubCategoryBars: React.FC<CategoryBoxProps> = ({ label, value }) => {
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
      subcategoryId: value,
    };

    if (params?.get("subcategoryId") === value) {
      delete updatedQuery.subcategoryId;
    }
    const url = qs.stringifyUrl(
      {
        url: "/categorypage/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [label, router, params, value]);

  return (
    <div>
      <li className="text-sm text-gray-600 my-2.5">
        <a onClick={handleClick} className="hover:text-primary">
          {label}
        </a>
      </li>
    </div>
  );
};

export default SubCategoryBars;
