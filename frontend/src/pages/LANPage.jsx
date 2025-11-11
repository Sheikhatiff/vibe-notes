import React, { useState, useEffect } from "react";
import { Form } from "react-router-dom";
import TextAreaField from "../features/notes/ui/TextAreaField";
import LinkButton from "../ui/LinkButton";
import FileInput from "../features/LAN/FileInput";
import { useLan } from "../hooks/useLan";
import store from "../store";
import { createOrUpdateLanThunk } from "../features/LAN/lanThunks";
import Loader from "../ui/Loader";
import { showError, showSuccess } from "../utils/toast";

function LANPage() {
  const lanData = useLan();
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  // Sync state with lanData when it changes
  useEffect(() => {
    if (lanData.text !== undefined) {
      setDescription(lanData.text);
    }
  }, [lanData.text]);

  useEffect(() => {
    if (lanData.files && Array.isArray(lanData.files)) {
      setFiles(lanData.files);
    }
  }, [lanData.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const MAX_SIZE = 10 * 1024 * 1024;
    const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);

    if (totalSize > MAX_SIZE) {
      const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      showError(
        `Total file size (${sizeMB}MB) exceeds the 10MB limit. Please remove some files.`
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", description);

      const existingFiles = files.filter((file) => !(file instanceof File));
      const newFiles = files.filter((file) => file instanceof File);

      existingFiles.forEach((file) => {
        formData.append("keepFiles[]", file.name);
      });

      newFiles.forEach((file) => {
        formData.append("files", file);
      });

      await store.dispatch(createOrUpdateLanThunk(formData)).unwrap();
      showSuccess("Note / Files on LAN Updated!");
    } catch (error) {
      console.error("Save error:", error);
      showError(error || "error in updating");
    }
  };

  if (lanData.loading) {
    return <Loader />;
  }

  return (
    <div className="md:m-2">
      <Form onSubmit={handleSubmit}>
        <div className="flex flex-col min-h-dvh">
          <div className="bg-emerald-100 rounded-xl">
            <FileInput files={files} setFiles={setFiles} />
          </div>
          <div className="flex-1 m-2 p-2">
            <h1 className="text-xl text-emerald-900 sm:text-2xl italic font-medium sm:pl-15">
              "On the same WiFi? Share note & files effortlessly between all
              your devices... 😉"
            </h1>
            <TextAreaField
              divCss="sm:text-2xl"
              name="note"
              label="note"
              value={description}
              setValue={setDescription}
              rows={20}
              css="md:text-xl"
            />
            <LinkButton css="md:px-20 md:ml-30 sm:px-14 sm:ml-24 mt-2 px-10">
              Save
            </LinkButton>
          </div>
        </div>
      </Form>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }) {
  const formData = await request.formData();
  const note = formData.get("note");
  const files = formData.getAll("files");

  const lanData = {
    files,
    text: note,
  };

  try {
    await store.dispatch(createOrUpdateLanThunk(lanData)).unwrap();
    showSuccess("Note / Files on LAN Updated!");
    return null;
  } catch (error) {
    showError(error || "error in updating");
    return { error: error || "Save Failed" };
  }
}

export default LANPage;
