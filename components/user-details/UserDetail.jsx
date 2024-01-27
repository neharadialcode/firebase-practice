import { useEffect, useState } from "react";
import { realTimeDB } from "../db/firebase";
import { ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

const UserDetails = () => {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
  };
  const [studentData, setStudentData] = useState(initialState);
  const [getData, setGetdata] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (studentData.firstName && studentData.email) {
      set(ref(realTimeDB, `users/` + uuidv4()), studentData);
      setStudentData(initialState);
    }
  };
  // useEffect(() => {
  //   const postListRef = ref(realTimeDB, "users/");
  //   console.log(postListRef, "postListRef");
  // }, []);
  return (
    <div className="h-screen flex flex-col justify-center items-center max-w-[700px] mx-auto">
      <form action="" onSubmit={(e) => onSubmitHandler(e)}>
        <input
          onChange={(e) =>
            setStudentData({ ...studentData, firstName: e.target.value })
          }
          className="border-[1px] border-purple-700 w-full m-1 p-4"
          type="text"
          name=""
          id=""
          placeholder="First Name"
          value={studentData.firstName}
        />
        <input
          onChange={(e) =>
            setStudentData({ ...studentData, lastName: e.target.value })
          }
          className="border-[1px] border-purple-700 w-full m-1 p-4"
          type="text"
          name=""
          id=""
          placeholder="Last Name"
          value={studentData.lastName}
        />
        <input
          onChange={(e) =>
            setStudentData({ ...studentData, email: e.target.value })
          }
          className="border-[1px] border-purple-700 w-full m-1 p-4"
          type="text"
          name=""
          id=""
          placeholder="Email"
          value={studentData.email}
        />
        <input
          onChange={(e) =>
            setStudentData({ ...studentData, address: e.target.value })
          }
          className="border-[1px] border-purple-700 w-full m-1 p-4"
          type="text"
          name=""
          id=""
          placeholder="Address"
          value={studentData.address}
        />

        <div className="text-center">
          <button className="bg-purple-700 text-white py-2 px-10 hover:bg-purple-500 transition-all duration-200 ease-in-out rounded-lg mt-4 text-lg">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDetails;
