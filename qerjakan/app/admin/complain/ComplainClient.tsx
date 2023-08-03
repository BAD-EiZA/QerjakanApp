"use client";

import { SafeOrder } from "@/app/types";
import { ComplainAdmin, Order } from "@prisma/client";
import { green } from "@mui/material/colors";
import Image from "next/image";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
interface ComplainProps {
  data: ComplainAdmin[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
        <Box sx={{ p: 3 }}>
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

const ComplainClient: React.FC<ComplainProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleAcceptComplain = async (orderId: string, id: string) => {
    setIsloading(true);
    await fetch("/api/acceptcomplain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
        id: id,
      }),
    })
      .then((res) =>
        res.json().then((res) => {
          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Accept Complain Success",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: res.message,
            });
          }
        })
      )
      .catch(() => {
        console.log("Error");
      })
      .finally(() => {
        setIsloading(false);
        router.refresh();
      });
  };
  const handleRejectComplain = async (orderId: string, id: string) => {
    setIsloading(true);
    await fetch("/api/rejectcomplain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
        id: id,
      }),
    })
      .then((res) =>
        res.json().then((res) => {
          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Reject Complain Success",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: res.message,
            });
          }
        })
      )
      .catch(() => {
        console.log("Error");
      })
      .finally(() => {
        setIsloading(false);
        router.refresh();
      });
  };
  const textColors = green[500];
  const theme = createTheme({
    palette: {
      primary: {
        main: green[500],
      },
    },
  });
  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="max-w-[1640px] m-auto py-4">
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                textColor="primary"
                indicatorColor="primary"
                centered
              >
                <Tab label="On Review" {...a11yProps(0)} />
                <Tab label="Accepted" {...a11yProps(1)} />
                <Tab label="Rejected" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <div className="overflow-x-auto">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr className=" text-center">
                      <th>Order ID</th>
                      <th>Description</th>
                      <th>Complain Type</th>
                      <th>Image</th>
                      <th>Seller Name</th>
                      <th>Buyer Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((complain: any) => (
                      <>
                        {complain.complainStatus === "Pending" && (
                          <tr className="hover text-center">
                            <th>{complain.order.id}</th>
                            <td>{complain.description}</td>
                            <td>{complain.complainType}</td>
                            <td>
                              <a href={complain.image}>
                                <button className="btn btn-xs">
                                  Open Image
                                </button>
                              </a>
                            </td>
                            <td>{complain.order.sellerName}</td>
                            <td>{complain.order.buyerName}</td>
                            <td>
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() =>
                                    handleAcceptComplain(
                                      complain.order.id,
                                      complain.id
                                    )
                                  }
                                  className="btn btn-xs btn-primary "
                                >
                                  Accept
                                </button>
                                <button
                                  className="btn btn-xs btn-error"
                                  onClick={() =>
                                    handleRejectComplain(
                                      complain.order.id,
                                      complain.id
                                    )
                                  }
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                    {/* row 1 */}
                  </tbody>
                </table>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <div className="overflow-x-auto">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr className=" text-center">
                      <th>Order ID</th>
                      <th>Description</th>
                      <th>Complain Type</th>
                      <th>Image</th>
                      <th>Seller Name</th>
                      <th>Buyer Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((complain: any) => (
                      <>
                        {complain.complainStatus === "Accepted" && (
                          <tr className="hover text-center">
                            <th>{complain.order.id}</th>
                            <td>{complain.description}</td>
                            <td>{complain.complainType}</td>
                            <td>
                              <a href={complain.image}>
                                <button className="btn btn-xs">
                                  Open Image
                                </button>
                              </a>
                            </td>
                            <td>{complain.order.sellerName}</td>
                            <td>{complain.order.buyerName}</td>
                            <td>{complain.complainStatus}</td>
                          </tr>
                        )}
                      </>
                    ))}
                    {/* row 1 */}
                  </tbody>
                </table>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
            {data.map((complain: any) => (
                      <>
                        {complain.complainStatus === "Rejected" && (
                          <tr className="hover text-center">
                            <th>{complain.order.id}</th>
                            <td>{complain.description}</td>
                            <td>{complain.complainType}</td>
                            <td>
                              <a href={complain.image}>
                                <button className="btn btn-xs">
                                  Open Image
                                </button>
                              </a>
                            </td>
                            <td>{complain.order.sellerName}</td>
                            <td>{complain.order.buyerName}</td>
                            <td>{complain.complainStatus}</td>
                          </tr>
                        )}
                      </>
                    ))}
            </CustomTabPanel>
          </Box>
        </div>
      </ThemeProvider>
    </>
  );
};

export default ComplainClient;
