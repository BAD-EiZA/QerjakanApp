"use client";

import { useRouter } from "next/navigation";
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";

const Logo = () => {
  const router = useRouter();
  return (
    <>
    <div className="flex items-center">
        <div className="cursor-pointer visible md:invisible">
          <AiOutlineMenu size={30} />
        </div>
        <div onClick={() => router.push("/")}>
          <button>
            <a className="text-2xl sm:text-3xl lg:text-4xl px-2">
              Qerja<span className="font-bold">Kan.</span>
            </a>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-gray-200 rounded-full flex items-center px-2 w-[200px] sm:w-[400px] lg:w-[500px]">
        <AiOutlineSearch size={25} />
        <input
          className="bg-transparent p-2 w-full focus:outline-none"
          type="text"
          placeholder="Search service"
        />
      </div>
    </>
      
    
  );
};

export default Logo;
