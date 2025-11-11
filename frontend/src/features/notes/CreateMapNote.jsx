import React, { useState } from "react";
import {
  Form,
  //  redirect
} from "react-router-dom";
import HeartIcon from "../../../assets/icons/HeartIcon";
import LinkButton from "../../ui/LinkButton";
import Recorder from "../../ui/Recorder";
import { ArrowBigRight, Mic, Mic2, PlusCircleIcon, X } from "lucide-react";
import TextField from "./ui/TextField";
import TextAreaField from "./ui/TextAreaField";
function MapNote({ type, newPos, curPos, location, setLocation }) {
  const [title, setTitle] = useState("New Note");
  const [description, setDescription] = useState("");
  const [fav, setFav] = useState(false);
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);

  function toggleFav() {
    setFav((prev) => !prev);
  }
  function handleReset() {
    setTitle("New Note");
    setDescription("");
    setFav(false);
  }
  function handleTagAdd() {
    if (tags.includes(tag?.toLowerCase())) return;

    setTags([...tags, tag?.toLowerCase()]);
    setTag("");
  }

  function handleTagDelete(tag) {
    setTags(tags.filter((t) => t !== tag));
  }

  return (
    <>
      <div className=" uppercase tracking-wide  ">
        <h1 className="font-bold text-2xl">{type || "simple"} Note</h1>
        <h5 className="text-stone-500 mt-4">
          write a new {type || "simple"} note
        </h5>
      </div>
      <Form method="POST">
        <div className="my-4 ">
          <HeartIcon
            color={`${fav ? "#059669" : "transparent"}`}
            size={35}
            handleClick={toggleFav}
            strokeColor="#059669"
            className="ml-1"
          />
          <input type="hidden" name="fav" value={fav ? "true" : "false"} />
          <input type="hidden" name="type" value="geo" />
        </div>
        <TextField
          label="title"
          name="title"
          value={title}
          setValue={setTitle}
          required={true}
        />

        <TextField
          label="location"
          name="location-name"
          value={location}
          setValue={setLocation}
        />

        <TextAreaField
          name="description"
          value={description || ""}
          label="description"
          required={true}
          setValue={setDescription}
          placeholder="write your memories of about this place..."
          rows={5}
        />

        <Recorder Icon={<Mic />} setContent={setDescription} />
        <div
          className="mb-5 mt-2 flex gap-2   
                flex-row items-center"
        >
          <label className="sm:basis-20 uppercase tracking-wide font-medium">
            Tags
          </label>
          <input
            className="w-full rounded-md border border-stone-400
                      px-4 py-2 text-sm transition-all duration-300 
                      placeholder:text-stone-400 focus:outline-none focus:ring
                      focus:ring-emerald-400 md:px-6 md:py-3 sm:ml-6"
            type="text"
            name="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <button
            type="button"
            className="hover:text-emerald-900 text-stone-700"
            onClick={handleTagAdd}
          >
            <PlusCircleIcon />
          </button>
        </div>
        <div className="flex flex-wrap gap-4 items-center sm:pl-20">
          {tags.map((t) => (
            <div className="flex space-x-2" key={t}>
              <div className="text-sm font-semibold italic text-emerald-600">
                #{t}
              </div>
              <button
                className="text-sm text-red-900"
                type="button"
                onClick={() => handleTagDelete(t)}
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
        <input type="hidden" name="tags" value={tags} />
        <input
          type="hidden"
          name="coordinates"
          value={`${(newPos || curPos)?.lat},${(newPos || curPos)?.lng}`}
        />

        <div className="mb-2 flex flex-col-reverse sm:flex-row mt-12 gap-4 sm:gap-6 justify-center">
          <LinkButton css="w-full sm:w-80">Save</LinkButton>
          <button
            type="reset"
            className="hover:text-emerald-700 hover:font-bold uppercase transition-colors duration-300 border-y border-emerald-600 p-2 px-4 w-30 items-end rounded-mdtracking-widest font-semibold"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </Form>
    </>
  );
}

export default MapNote;
