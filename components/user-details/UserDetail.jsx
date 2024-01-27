import { useEffect, useState } from "react";
import { realTimeDB } from "../db/firebase";
import { ref, set, get } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

const UserDetails = () => {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    imgUrl: "",
  };
  const [studentData, setStudentData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [delBtnIndex, setDelBtnindex] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [getData, setGetdata] = useState([]);

  // GET BLOB URL  =============================************===============*****==================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setStudentData({ ...studentData, imgUrl: blobUrl });
    }
  };
  // ONSUBMIT STORED DATA  =============================************===============*****==================

  const onSubmitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (studentData.firstName && studentData.email) {
      await set(ref(realTimeDB, `users/` + uuidv4()), studentData);
      setLoading(false);
      setStudentData(initialState);
    }
  };
  // GET STORED DATA  =============================************===============*****==================
  const fetchData = async () => {
    try {
      const postListRef = ref(realTimeDB, "users/");
      const snapshot = await get(postListRef);
      const data = [];
      snapshot.forEach((obj) => {
        data.push({ id: obj.key, ...obj.val() });
      });
      setGetdata(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [loading, delLoading]);

  // TO DELETE ANY VALUE FROM LIST==============**************************==================**********============

  const deleteValue = async (id) => {
    setDelBtnindex(id);
    try {
      setDelLoading(true);
      const userRef = ref(realTimeDB, `users/${id}`);
      await set(userRef, null);
      setDelLoading(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center max-w-[700px] mx-auto">
      <form action="" onSubmit={(e) => onSubmitHandler(e)} className="pb-10">
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
          className="border-[1px] border-purple-700 w-full mt-1 mx-1 mb-6 p-4"
          type="text"
          name=""
          id=""
          placeholder="Address"
          value={studentData.address}
        />
        <label
          htmlFor="image"
          className="border-[1px] border-purple-700 bg-purple-700 text-white font-bold cursor-pointer w-full m-1 p-4"
        >
          upload profile image
          <input
            onChange={handleImageChange}
            className="border-[1px] border-purple-700 w-full m-1 p-4"
            type="file"
            name=""
            hidden
            id="image"
            placeholder="Address"
          />
        </label>

        <div className="text-center">
          <button className="bg-purple-700 text-white py-2 px-10 hover:bg-purple-500 transition-all duration-200 ease-in-out rounded-lg mt-4 text-lg">
            Submit
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-2xl text-blue-600">....loading</p>
      ) : (
        <table>
          {getData.length > 0 &&
            getData.map((obj, i) => (
              <tr>
                <td className="border-[1px] border-blue-700 px-5">
                  {obj.imgUrl ? (
                    <img
                      className="w-[50px] h-[50px] rounded-full object-cover"
                      src={obj.imgUrl}
                      alt="profile"
                    />
                  ) : (
                    <div className="w-[50px] h-[50px] rounded-full bg-purple-700"></div>
                  )}
                </td>
                <td className="border-[1px] border-blue-700 px-5">
                  {obj.firstName}
                </td>
                <td className="border-[1px] border-blue-700 px-5">
                  {obj.email}
                </td>
                <td className="border-[1px] border-blue-700 px-5">
                  <button
                    onClick={() => deleteValue(obj.id)}
                    className="text-white bg-red-600 w-[150px] px-4 py-1 my-1 rounded-lg"
                  >
                    {delLoading && delBtnIndex === obj.id
                      ? ".....loading"
                      : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
        </table>
      )}
    </div>
  );
};

export default UserDetails;
