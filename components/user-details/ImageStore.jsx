import React, { useEffect, useState } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../db/firebase";

const ImageStore = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const imagesListRef = ref(storage, "images/");

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };
  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);
  return (
    <>
      <label
        htmlFor="image"
        className={`border-[1px] flex justify-between items-center border-purple-700  text-purple-700 font-bold cursor-pointer  m-1 px-4 py-2 `}
      >
        upload profile image
        <input
          onChange={(e) => setImageUpload(e.target.files[0])}
          className="border-[1px] border-purple-700  m-1 p-4"
          type="file"
          name=""
          hidden
          id="image"
          placeholder="Address"
        />
        {imageUrls.map((url) => {
          return <img src={url} />;
        })}
      </label>
      <button onClick={uploadFile}> Upload Image</button>
    </>
  );
};

export default ImageStore;
