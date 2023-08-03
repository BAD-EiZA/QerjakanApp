"use client";

import Image from "next/image";
import { FaStar } from "react-icons/fa";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Profile, Reviews, Service, User } from "@prisma/client";
import { SafeCurrentUser } from "@/app/types";
import { useState } from "react";
import ServiceCard from "@/app/components/servicecard/servicecard";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface SellerProps {
  dataService: Service[];
  dataProfile: Profile & {
    user: {
      image: string | null;
      name: string | null;
    };
  };
  dataRatingSeller: Service & {
    user: {
      image: string | null;
      name: string | null;
    };
    serviceRating: {
      rating: number;
    };
  };
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box >
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const SellerProfileClient: React.FC<SellerProps> = ({
  dataProfile,
  dataService,
  dataRatingSeller,
}) => {
  const [value, setValue] = useState(0);
const [isLoading, setIsloading] = useState(false)
const router = useRouter()
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleChat = async (id: string) => {
    setIsloading(true);
    await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
      }),
    })
      .then((res) =>
        res.json().then((res) => {
          if (res.statusCode === 200) {
            router.push(`/conversation/${res.data.id}`);
          } else if (res.statusCode === 401) {
            Swal.fire({
              icon: "error",
              title: res.message,
              showConfirmButton: false,
              timer: 1500,
            });
            router.push("/");
          }
        })
      )
      .catch(() => {
        console.log("Error");
      })
      .finally(() => {
        setIsloading(false);
      });
  };
  const theme = createTheme({
    palette: {
      primary: {
        main: green[500],
      },
    },
  });
  return (
    <div className="max-w-[1640px] m-auto  py-4 px-5 lg:px-64 border">
      <div className=" flex">
        <Image
          alt=""
          width={720}
          height={720}
          className="h-[50px] w-[50px] rounded-full"
          src={
            dataProfile.user.image ||
            "https://media.tenor.com/dq64kD_obpEAAAAd/seele-honkai-impact.gif"
          }
        />

        <div className="flex flex-col ml-3">
          <span className=" font-semibold text-black">
            {dataProfile.user.name}
          </span>
          <span className="text-lg font-semibold flex gap-1">
            <FaStar size={22} /> {dataRatingSeller.serviceRating.rating}{" "}
            <span className="mx-2">|</span>
            <button onClick={()=> handleChat(dataProfile.userId)} className="btn btn-xs btn-warning">Contact Me</button>
          </span>
        </div>
      </div>
      <div className="my-2">
        <p className="font-semibold">About:</p>
        <p>{dataProfile.description}</p>
      </div>
      <ThemeProvider theme={theme}>
        <div className="w-full">
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Services" {...a11yProps(0)} />
                <Tab label="Info" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <div className=" w-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
                  {dataService.map((ser: any) => (
                    <ServiceCard
                      data={ser}
                      key={ser.id}
                      redirectUrl={ser.id}
                      coverImg={ser.image}
                      averageRating={
                        ser.serviceRating.length === 0
                          ? 0
                          : ser.serviceRating.rating
                      }
                      userImg={ser.user.image}
                      title={ser.title}
                      userName={ser.user.name}
                      price={ser.price}
                    />
                  ))}
                </div>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <div className="py-2">
                <div className="pb-2">
                  <p className="font-semibold">Country: </p>
                  <p>{dataProfile.country}</p>
                </div>
                <div className="pb-2">
                  <p className="font-semibold">Skill: </p>
                  <p>{dataProfile.skill}</p>
                </div>
                <div className="pb-2">
                  <p className="font-semibold">Language: </p>
                  {dataProfile.language.map((lg:any) => (
                    <p key={lg}>{lg}</p>
                  ))}
                  
                 
                </div>
                <div>
                  <p className="font-semibold">College</p>
                  <p>{dataProfile.college_name}</p>
                  <p>{dataProfile.college_title}</p>
                  <p>{dataProfile.college_major}</p>
                </div>
              </div>
            </CustomTabPanel>
          </Box>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default SellerProfileClient;
