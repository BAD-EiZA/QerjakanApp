import "./globals.css";
import { Nunito } from "next/font/google";
import Navbar from "./components/navbar/Navbar";
import RegisterModal from "./components/modals/RegisterModal";
import LoginModal from "./components/modals/LoginModal";
import ClientOnly from "./components/ClientOnly";
import ImageModal from "./components/modals/ImageModal";
import VerifyModal from "./components/modals/VerifyModal";
import AddServiceModal from "./components/modals/AddServiceModal";
import Footer from "./components/footer/footer";
import getCurrUser from "./actions/user/getCurrUser";
import getBankUser from "./actions/user/getAccountBank";
import getTransactionNotif from "./actions/common/getTransactionNotif";
import ForgotModal from "./components/modals/ForgotPasswordModal";

export const metadata = {
  title: "Qerjakan UMNT",
  description: "Qerjakan by Eiza",
};
const font = Nunito({
  subsets: ["latin"],
});
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrUser();
  const userBank = await getBankUser();
  const countTransaction = await getTransactionNotif();
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <RegisterModal />
          <LoginModal />
          <ImageModal />
          <VerifyModal />
          <ForgotModal />
          <AddServiceModal />
          <Navbar
            currentUser={currentUser}
            userBank={userBank}
            dataTransaction={countTransaction}
            
          />
        </ClientOnly>
        <div>{children}</div>
        <ClientOnly>
          <Footer />
        </ClientOnly>
      </body>
    </html>
  );
}
