import getCurrentUser from "@/app/actions/user/getCurrentUser";
import ProfileClient from "./ProfileClient";
import ClientOnly from "@/app/components/ClientOnly";
import getProfileById from "@/app/actions/user/getProfileId";
import getServiceById from "@/app/actions/service/getServiceId";
import getCurrUser from "@/app/actions/user/getCurrUser";
import { redirect } from "next/navigation";
import Swal from "sweetalert2";
import getBankUser from "@/app/actions/user/getAccountBank";

interface IParams {
  profileId?: string;
}

const Profiles = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  const currUser = await getCurrUser();
  const userBank = await getBankUser();
  const currentProfile = await getProfileById(params);
  if (!currUser) {
    return redirect('/')
  }
  if(!currentProfile){
    return []
  }
  
  return (
    <ClientOnly>
      <ProfileClient currentUser={currUser} currentProfile={currentProfile} userBank={userBank} />
    </ClientOnly>
  );
};

export default Profiles;
