"use client";

import Container from "@/app/components/Container";
import Avatar from "@/app/components/navbar/Avatar";
import useImageModal from "@/app/hooks/useImageModal";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useNameModal from "@/app/hooks/useNameModal";
import useSkillModal from "@/app/hooks/useSkillModal";
import { SafeUser, SafeService, SafeCurrentUser } from "@/app/types";
import { Profile, Service, User, UserBankAccount } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import BioComponent from "@/app/components/profile/bio/BioComponent";
import PrivacyComponent from "@/app/components/profile/privacy/PrivacyComponent";
import BankComponent from "@/app/components/profile/bank/BankComponent";

interface ProfileClientProps {
  currentUser: SafeCurrentUser | null;
  currentProfile: Profile
  userBank: UserBankAccount | null
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
        <Box>
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
const ProfileClient: React.FC<ProfileClientProps> = ({
  currentUser,
  currentProfile,
  userBank
}) => {
  const imageModal = useImageModal();
  const [value, setValues] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValues(newValue);
  };
  return (
    <Container>
      <div
        className="
        
         py-10
         
        px-8 
        w-full
        gap-8
        flex
      "
      >
        <section>
          <div className=" w-96 ">
            <div className="border-2 sticky top-9">
              <div className=" card bg-base-300 shadow-xl">
                <figure className="px-10 pt-10 ">
                  <div className="avatar indicator">
                    <button
                      onClick={imageModal.onOpen}
                      className="indicator-item badge badge-primary-content"
                    >
                      <AiFillEdit />
                    </button>
                    <div className="w-24 rounded-full">
                      <Avatar src={currentUser?.image} />
                    </div>
                  </div>
                </figure>
                <div className="card-body items-center text-center">
                  <div className="indicator">
                    <h3 className="card-title grid bg-base-300 place-items-center">
                      {currentUser?.name}
                    </h3>
                  </div>
                  <h3 className="">{currentUser?.email}</h3>
                </div>
                <Box sx={{ width: "100%" }}>
                  <Box>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                      orientation="vertical"
                    >
                      <Tab label="Bio" {...a11yProps(0)} />

                      <Tab label="Privacy" {...a11yProps(1)} />
                      <Tab label="Bank" {...a11yProps(2)} />
                    </Tabs>
                  </Box>
                </Box>
              </div>
            </div>

            {/* <div className="card w-96 bg-base-300 shadow-xl mt-8">
              <div className="card-body">
                <div className="indicator">
                  <h2 className="card-title">Description</h2>
                  <button
                    onClick={descModal.onOpen}
                    className="indicator-item  badge  badge-primary-content"
                  >
                    Edit
                  </button>
                </div>
                <p>{currentProfile?.description}</p>
                <div className="divider"></div>
                <div className="indicator">
                  <h2 className="card-title">Country</h2>
                  <button
                    onClick={countryModal.onOpen}
                    className="indicator-item  badge  badge-primary-content"
                  >
                    Edit
                  </button>
                </div>
                <p>{currentProfile?.country}</p>
                <div className="divider"></div>
                <div className="indicator">
                  <h2 className="card-title">Language</h2>
                  <button
                    onClick={languageModal.onOpen}
                    className="indicator-item  badge  badge-primary-content"
                  >
                    Edit
                  </button>
                </div>
                <p>{currentProfile?.language}</p>
                <p>{currentProfile?.language_level}</p>
                <div className="divider"></div>
                <div className="indicator">
                  <h2 className="card-title">Skills</h2>
                  <button
                    onClick={skillModal.onOpen}
                    className="indicator-item  badge  badge-primary-content"
                  >
                    Edit
                  </button>
                </div>
                <p>{currentProfile?.skill}</p>
                <div className="divider"></div>
                <div className="indicator">
                  <h2 className="card-title">Education</h2>
                  <button
                    onClick={educationModal.onOpen}
                    className="indicator-item  badge  badge-primary-content"
                  >
                    Edit
                  </button>
                </div>

                <p>{currentProfile?.college_name}</p>
                <p>{currentProfile?.college_title}</p>
                <p>{currentProfile?.college_major}</p>
              </div>
            </div> */}
          </div>
        </section>

        <section>
          <div className="flex w-full">
            <CustomTabPanel value={value} index={0}>
              <BioComponent currentProfile={currentProfile} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <PrivacyComponent currentUser={currentUser} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <BankComponent currentUser={currentUser} userBank={userBank} />
            </CustomTabPanel>
          </div>
        </section>
      </div>
    </Container>
  );
};

export default ProfileClient;
