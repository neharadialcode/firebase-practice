import { useEffect, useState } from "react";
import { realTimeDB, storage } from "../db/firebase";
import { ref, set, get } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import {
  ref as dbImgRef,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";

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
  const [error, setError] = useState(false);
  const [delBtnIndex, setDelBtnindex] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [getData, setGetdata] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  // GET BLOB URL  =============================************===============*****==================

  const imagesListRef = dbImgRef(storage, "images/" + uuidv4());
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgLoading(true);
      const uploadTask = await uploadBytes(imagesListRef, file);
      const imageUrl = await getDownloadURL(uploadTask.ref);
      if (imageUrl) {
        setStudentData({ ...studentData, imgUrl: imageUrl });
        setImagePreview(imageUrl);
        setImgLoading(false);
      } else {
        setStudentData({ ...studentData, imgUrl: "" });
        setImgLoading(false);
      }
    }
  };
  console.log(studentData.imgUrl, "imageUrl");
  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageList((prev) => [...prev, url]);
        });
      });
    });
    console.log(imageList, "abc");
  }, []);

  // ONSUBMIT STORED DATA  =============================************===============*****==================

  const onSubmitHandler = async (e) => {
    setError(true);
    e.preventDefault();
    const isDuplicate = getData.some(
      (user) =>
        user.firstName === studentData.firstName &&
        user.email === studentData.email &&
        user.address === studentData.address
      // Add more fields as needed
    );
    if (studentData.firstName && studentData.email) {
      setLoading(true);
      if (editMode && editUserId) {
        if (isDuplicate) {
          setError(false);
          setStudentData(initialState);
          setImagePreview("");
        } else {
          // Update existing user
          const userRef = ref(realTimeDB, `users/${editUserId}`);
          await set(userRef, studentData);
          setError(false);
          setEditMode(false);
          setEditUserId(null);
          setLoading(false);
          setStudentData(initialState);
          setImagePreview("");
        }
      } else {
        await set(ref(realTimeDB, `users/` + uuidv4()), studentData);
        setLoading(false);
        setStudentData(initialState);
        setImagePreview("");
        setError(false);
      }
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
      console.log(data, "dta");
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
    console.log(id, "id");
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

  // EDIT OR UPDATE VALUE==============**************************==================**********============

  const editUser = (id) => {
    const userToEdit = getData.find((user) => user.id === id);
    if (userToEdit) {
      setStudentData(userToEdit);
      setImagePreview(userToEdit.imgUrl || null);
      setEditMode(true);
      setEditUserId(id);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center max-w-[700px] mx-auto">
      <form
        action=""
        onSubmit={(e) => onSubmitHandler(e)}
        className="pb-10 w-full"
      >
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
        {error && studentData.firstName == "" && (
          <p className="text-red-600 ms-1 mb-2">First name is required</p>
        )}
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
          type="email"
          name=""
          id=""
          placeholder="Email"
          value={studentData.email}
        />
        {error && studentData.email == "" && (
          <p className="text-red-600 ms-1 mb-2">Email is required</p>
        )}
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
          className={`border-[1px] flex justify-between items-center border-purple-700  text-purple-700 font-bold cursor-pointer  m-1 px-4 py-2 ${
            imagePreview ? "max-w-[250px]" : "max-w-[200px]"
          }`}
        >
          {imgLoading ? "uploading........" : "upload profile image"}

          <input
            onChange={handleImageChange}
            className="border-[1px] border-purple-700  m-1 p-4"
            type="file"
            name=""
            hidden
            id="image"
            placeholder="Address"
          />
          {imagePreview && (
            <img
              className="min-w-[50px] min-h-[50px] max-w-[50px] max-h-[50px] rounded-full object-cover"
              src={imagePreview}
              alt="profile img"
            />
          )}
        </label>
        <div className="text-center">
          <button
            disabled={imgLoading}
            className="bg-purple-700 text-white py-2 px-10 hover:bg-purple-500 transition-all duration-200 ease-in-out rounded-lg mt-4 text-lg"
          >
            {editMode ? "Update" : "Submit"}
          </button>
        </div>
      </form>

      {imgLoading && loading ? (
        <p className="text-2xl text-blue-600">....loading</p>
      ) : (
        <table>
          <tbody>
            {getData.length > 0 &&
              getData.map((obj, i) => (
                <tr key={i}>
                  <td className="border-[1px] border-blue-700 px-5">
                    {obj.imgUrl ? (
                      <img
                        className="min-w-[50px] min-h-[50px] max-w-[50px] max-h-[50px] rounded-full object-cover"
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
                  <td className="border-[1px] border-blue-700 px-5">
                    <button
                      onClick={() => editUser(obj.id)}
                      className="text-white bg-[#46f82e] w-[150px] px-4 py-1 my-1 rounded-lg"
                    >
                      EDIT
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserDetails;
