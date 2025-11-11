import React, { useState } from "react";
import { Trash2, UserLock } from "lucide-react";
import { Form, redirect } from "react-router-dom";
import ModalWindow from "../ui/ModalWindow";
import { useSelector } from "react-redux";
import { formatDate } from "../utils/formatDate";
import store from "../store.js";
import { updateImageThunk, updateThunk } from "../features/auth/authThunks";
import { showError, showSuccess } from "../utils/toast.jsx";

function SettingPage() {
  const user = useSelector((st) => st.auth.user);
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling

    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("photo", selectedImage);

    try {
      await store
        .dispatch(updateImageThunk({ id: user._id, updates: formData }))
        .unwrap();
      showSuccess("Image updated successfully!");
      setSelectedImage(null);
      setPreviewUrl(null);
      redirect("/dashboard");
    } catch (error) {
      console.error("Failed to upload image:", error);
      showError("Failed to upload image");
    }
  };

  function handleConfirmDelete() {
    setIsOpen(false);
    alert("Account Deleted!");
  }

  return (
    <div className="relative min-h-screen bg-linear-to-br from-emerald-200 to-emerald-400 flex justify-center items-center p-6">
      <Form
        method="POST"
        className="bg-emerald-100 shadow-2xl rounded-2xl w-full max-w-3xl p-8 space-y-8"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6">
          <div className="shrink-0">
            <div className="flex flex-col items-center  gap-4">
              <div className="bg-emerald-100 border-4 border-emerald-300 rounded-full">
                <img
                  src={
                    previewUrl || `http://localhost:3000/userImg/${user.photo}`
                  }
                  alt="User Profile"
                  className="rounded-full h-40 w-40 object-cover"
                  onError={(e) => {
                    e.target.src = "http://localhost:3000/userImg/default.jpg";
                  }}
                />
              </div>

              <div className="flex gap-2">
                <label className="cursor-pointer bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {selectedImage && (
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Upload Image
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="w-full mt-6 sm:mt-0 space-y-4">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-stone-700 uppercase font-semibold mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-stone-700 font-semibold uppercase mb-1">
                Email
              </label>
              <p className="text-stone-600 bg-emerald-50 rounded-lg p-2">
                {user.email}
              </p>
            </div>
            <input type="hidden" name="id" value={user?._id} />
            <div className="flex flex-col sm:flex-row sm:justify-between text-stone-500 text-xs">
              <p>
                <span className="font-medium uppercase">Created At:</span>{" "}
                {formatDate(user.createdAt)}
              </p>
              {user?.updatedAt && user.updatedAt !== user.createdAt && (
                <p className="text-emerald-700">
                  <span className="font-medium uppercase ">Updated At:</span>{" "}
                  {formatDate(user.updatedAt)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-300">
          <h2 className="text-lg font-bold text-stone-800 uppercase mb-4">
            Change Password
          </h2>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label
                htmlFor="current-password"
                className="text-stone-700 font-semibold uppercase mb-1"
              >
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                name="current-password"
                className="border border-stone-300  rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="new-password"
                className="text-stone-700 font-semibold uppercase mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                name="new-password"
                className="border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="confirm-password"
                className="text-stone-700 font-semibold uppercase mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                className="border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="sm:flex">
            <button
              type="submit"
              className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg shadow transition-all uppercase duration-200"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="mt-6 w-full sm:ml-4 bg-red-500 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg shadow transition-all uppercase duration-200 flex justify-center items-center"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              <Trash2 />
            </button>
            {isOpen && (
              <ModalWindow
                setIsOpen={setIsOpen}
                onConfirm={handleConfirmDelete}
              />
            )}
          </div>
        </div>
      </Form>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  console.log("Form Data:\n", data);

  const userData = { name: formData.get("name") };
  if (formData.get("new-password")) {
    userData.password = formData.get("new-password");
    userData.passwordConfirm = formData.get("confirm-password");
    // userData.currentPassword = formData.get("current-password");
  }
  const id = formData.get("id");

  try {
    await store.dispatch(updateThunk({ id, updates: userData })).unwrap();

    showSuccess("Preferences saved!");
    return redirect("/dashboard");
  } catch (error) {
    showError(error || "Something went wrong on our end.");
    return { error: error || "Login Failed" };
  }
}

export default SettingPage;
