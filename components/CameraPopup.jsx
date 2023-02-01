import React, { useRef, useState } from "react";

import BlackCameraIcon from "../svg/components/BlackCameraIcon";
import { Camera } from "react-camera-pro";
import CameraIcon from "../svg/components/CameraIcon";
import Image from "next/image";
import UploadIcon from "@mui/icons-material/Upload";
import { fromString } from "uint8arrays/from-string";
import { getSession } from "next-auth/react";
import storeFileToIPFS from "../helpers/storeFileToIPFS";

const errorMessages = {
  noCameraAccessible:
    "No camera device accessible. Please connect your camera or try a different browser.",
  permissionDenied:
    "Permission denied. Please refresh and give camera permission.",
  switchCamera:
    "It is not possible to switch camera to different one because there is only one video device accessible.",
  canvas: "Canvas is not supported.",
};

function CameraPopup({ setIsOpened, chosenSquares }) {
  const camera = useRef(null);
  const [price, setPrice] = useState(0);
  const [imageURL, setImageURL] = useState(null);
  const [imageAvatarURL, setImageAvatarURL] = useState(null);
  const [isTakingCameraImg, setIsTakingCameraImg] = useState(false);
  const [isSendingData, setIsSendingData] = useState(false);

  const capture = () => {
    if (!camera.current) return;

    setImageURL(camera.current.takePhoto());
  };

  const handlePopupCloseClick = () => {
    setIsOpened(false);
  };

  const storeDataToMongoDb = async (
    ipfsCameraLink,
    ipfsAvatarLink,
    ipfs3RandomWordsLink
  ) => {
    setIsSendingData(true);
    const session = await getSession();

    const data = {
      walletAddress: session.user.address,
      chosenSquares,
      ipfs3RandomWordsLink,
      imageURL,
      ipfsCameraLink,
      imageAvatarURL: imageAvatarURL.name,
      ipfsAvatarLink,
      price,
    };

    await fetch("/api/postData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  const handleSubmitDialogClick = async () => {
    //STORE TO IPFS
    const ipfs3RandomWordsLink = await storeFileToIPFS(chosenSquares.join(" "));

    const data = fromString(imageURL.slice(23), "base64");
    const ipfsCameraLink = await storeFileToIPFS(data);

    const ipfsAvatarLink = await storeFileToIPFS(imageAvatarURL);

    //STORE TO MONGODB
    await storeDataToMongoDb(
      ipfsCameraLink,
      ipfsAvatarLink,
      ipfs3RandomWordsLink
    );

    setIsSendingData(false);
    setImageURL(null);
    setImageAvatarURL(null);
    setPrice(0);
    handlePopupCloseClick();
  };

  const handleUploadAvatar = (e) => {
    setImageAvatarURL(e.target.files[0]);
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-40"
        onClick={handlePopupCloseClick}
      ></div>
      <div className="flex items-center min-h-screen px-4 py-8">
        <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
          <a
            href="#"
            className="relative block overflow-hidden rounded-lg border border-gray-100 p-8"
          >
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600" />
            <div className="justify-between sm:flex">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Please take a picture & set the Rate to confirm.
                </h3>
              </div>
            </div>
            <div className="mt-4 sm:pr-8">
              {isTakingCameraImg ? (
                <div>
                  <div>
                    <Camera
                      ref={camera}
                      errorMessages={errorMessages}
                      aspectRatio={16 / 9}
                    />
                  </div>
                  <div>
                    <button
                      aria-label="take a photo"
                      onClick={() => {
                        capture(), setIsTakingCameraImg(false);
                      }}
                    >
                      <BlackCameraIcon />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex py-2 px-3">
                    <h1 className="pl-2 pr-10 py-2">Rate:</h1>
                    <label
                      htmlFor="UserEmail"
                      className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                    >
                      <input
                        value={price <= 0 ? "" : price}
                        onChange={(e) => {
                          if (!isNaN(+e.target.value)) {
                            setPrice(+e.target.value);
                          }
                        }}
                        type="number"
                        placeholder="Rate"
                        className="peer h-8 w-[7rem] border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      />
                      <span className="absolute left-3 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
                        Price
                      </span>
                    </label>
                  </div>
                  <div className="flex py-2 px-2">
                    <h1 className="pl-2 pr-10 py-2">Photo:</h1>
                    {imageURL != null ? (
                      <div className="ml-3 flex-shrink-0">
                        <Image
                          src={imageURL}
                          alt="claimed land picture"
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-lg object-cover shadow-sm"
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsTakingCameraImg(true)}
                        className="group relative inline-flex items-center overflow-hidden rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
                      >
                        <span className="absolute right-0 translate-x-full transition-transform group-hover:-translate-x-4">
                          <CameraIcon />
                        </span>
                        <span className="text-sm font-medium transition-all group-hover:mr-4">
                          Take Photo
                        </span>
                      </button>
                    )}
                  </div>
                  <div className="flex py-2 px-2">
                    <h1 className="pl-2 pr-10 py-2">Avatar:</h1>
                    {imageAvatarURL ? (
                      <div className="ml-3 flex-shrink-0">
                        <Image
                          src={URL.createObjectURL(imageAvatarURL)}
                          alt="claimed land picture"
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-lg object-cover shadow-sm"
                        />
                      </div>
                    ) : (
                      <>
                        <label
                          htmlFor="upload-photo"
                          style={{ cursor: "pointer" }}
                          className=" group relative inline-flex items-center overflow-hidden rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
                        >
                          <span className="absolute right-0 translate-x-full transition-transform group-hover:-translate-x-4">
                            <UploadIcon />
                          </span>
                          <span className="text-sm font-medium transition-all group-hover:mr-4">
                            Upload Avatar
                          </span>
                        </label>
                        <input
                          type="file"
                          required
                          id="upload-photo"
                          onChange={handleUploadAvatar}
                        />
                      </>
                    )}
                  </div>

                  <button onClick={handleSubmitDialogClick}>TEST</button>

                  <div className="flex py-3 px-3">
                    <button
                      disabled={
                        !imageURL || !price || isSendingData || !imageAvatarURL
                      }
                      onClick={handleSubmitDialogClick}
                      className="inline-block rounded bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
                    >
                      <span className="block rounded-sm bg-white px-8 py-3 text-sm font-medium hover:bg-transparent">
                        Submit
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default CameraPopup;
