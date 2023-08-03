"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  let currentLink = "";
  const pathname = usePathname();
  if(!pathname){
    return null
  }
  const crumbs = pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb) => {
      currentLink += `/${crumb}`;

      return (
        <div
          className="ml-4 inline-block max-w-6xl text-xs text-black capitalize after:content-['/'] first:mr-0 last:after:content-none"
          key={crumb}
        >
          <a className="mr-3 hover:underline">
            {crumb}
          </a>
          {/* <Link href={currentLink} className="mr-3 hover:underline">
            {crumb}
          </Link> */}
        </div>
      );
    });
  return <div>{crumbs}</div>;
}
