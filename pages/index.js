import Image from "next/image";
import { Inter } from "next/font/google";
import TableData from "@/components/student-table/TableData";
import UserDetails from "@/components/user-details/UserDetail";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <TableData />
      <UserDetails />
    </>
  );
}
