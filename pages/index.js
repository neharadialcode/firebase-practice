import Image from "next/image";
import { Inter } from "next/font/google";
import TableData from "@/components/student-table/TableData";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <TableData />
    </>
  );
}
