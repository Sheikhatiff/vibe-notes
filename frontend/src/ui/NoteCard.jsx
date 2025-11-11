import React from "react";
import { Eye, NotebookPen, PenOff, X } from "lucide-react";
import Tag from "./Tag";
import HeartIcon from "../../assets/icons/HeartIcon";
import { formatDate } from "../utils/formatDate";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import { showConfirm } from "../utils/toast";

function NoteCard({ note, handleRemove, handleView, handleEdit }) {
  const loading = useSelector((st) => st.notes.loading);

  if (loading) return <Loader />;

  const handleDelete = () => {
    showConfirm(
      `Are you sure you want to delete this "${note.title}" note?`,
      () => {
        handleRemove(note._id);
      }
    );
  };

  return (
    <div
      className={`w-full sm:w-72 md:w-80 lg:w-72 xl:w-80 m-2 sm:m-4 border-2 ${
        note?.favorite ? "border-red-700" : "border-emerald-700"
      } rounded-md text-stone-800 flex flex-col px-2`}
    >
      <h2 className="flex justify-center items-center font-bold underline text-lg sm:text-xl uppercase px-2 py-2 wrap-break-word mb-2">
        {note.title}
      </h2>
      <div className="flex items-center justify-between">
        <span className="ml-2 italic uppercase text-xs font-bold bg-green-500 px-2 py-1 inline-block w-fit rounded">
          {note.type}
        </span>
        {note?.favorite && <HeartIcon size={30} />}
      </div>
      <p className="h-16 sm:h-16 p-2 text-sm sm:text-base overflow-hidden">
        {note.note.slice(0, 20)}
        ...
      </p>
      <div className="flex flex-wrap mt-2 mx-1 px-2 py-2 gap-2 border min-h-16 sm:min-h-12 border-emerald-300 rounded-xl">
        {note.tags.map((tag) => (
          <Tag tag={tag} key={tag} />
        ))}
      </div>
      <p className="mr-4 text-xs font-medium text-stone-600 flex justify-end items-center py-1">
        {formatDate(note.createdAt)}
      </p>
      <div className="flex items-center justify-between mx-3 mb-3 mt-1">
        <button
          className="hover:text-emerald-700 cursor-pointer p-1 transition-colors"
          type="button"
        >
          <Eye
            size={20}
            onClick={() => handleView(`/notes/${note.type}/${note.id}`)}
            color="#309e55"
            className="sm:w-6 sm:h-6"
          />
        </button>
        <button
          className="hover:text-emerald-700 cursor-pointer p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          onClick={() => handleEdit(`/notes/${note.type}/${note.id}/edit`)}
          disabled={note.type === "smart"}
        >
          {note.type === "smart" ? (
            <PenOff color="#309e55" size={20} className="sm:w-6 sm:h-6" />
          ) : (
            <NotebookPen color="#309e55" size={20} className="sm:w-6 sm:h-6" />
          )}
        </button>
        <button
          className="hover:text-red-700 cursor-pointer p-1 transition-colors"
          type="button"
          onClick={handleDelete}
        >
          <X color="#d71919" size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}

export default NoteCard;
