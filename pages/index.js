import UserDetails from "@/components/user-details/UserDetail";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      {/* <TableData /> */}
      <UserDetails />
    </>
  );
}
