import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SupabaseProvider from "./provider/supabase";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { ModalProvider } from "@/context/ModalContext";
import "./globals.css";
import dynamic from "next/dynamic";
const EnlargeImage = dynamic(() => import("../components/Modal/EnlargeImage"));
const Share = dynamic(() => import("../components/Modal/Share"));
const Repost = dynamic(() => import("../components/Modal/Repost"));
const Comment = dynamic(() => import("../components/Modal/Comment"));
const Account = dynamic(() => import("../components/Modal/Account"));
const CreateCommunity = dynamic(
  () => import("../components/Modal/CreateCommunity")
);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eva Social",
  description: "Decentralized Social Media Platform built on a blockchain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={inter.className}>
        <div className="w-full h-full flex justify-center items-center relative bg-background">
          <div className="xl:max-w-[80vw] w-full h-full flex relative">
            {/* Left Sidebar For Navigation */}
            <ModalProvider>
              <LeftSidebar />
              <SupabaseProvider>
                <main className="min-w-[40vw] sticky top-0 flex w-full lg:w-auto max-w-[100%] lg:max-w-[50%]  h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px]  border-gray-600">
                  {children}
                </main>
                <EnlargeImage />
                <Share />
                <Repost />
                <Comment />
                <Account />
                <CreateCommunity />
              </SupabaseProvider>
              <RightSidebar />
            </ModalProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
