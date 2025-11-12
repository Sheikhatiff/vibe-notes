import React, { useEffect, useState } from "react";
import NoteCard from "../ui/NoteCard";
import { useNavigate } from "react-router-dom";
import { useNotes } from "../hooks/useNotes";
import { useDispatch } from "react-redux";
import { deleteNoteThunk } from "../features/notes/notesThunks";
import { Loader } from "lucide-react";
import { showError, showSuccess } from "../utils/toast";

function AllNotes() {
  const { notes, loading, error } = useNotes();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const notesPerPage = 6;

  const filteredNotes = notes?.filter((note) => {
    const matchesSearch =
      note?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note?.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesType =
      typeFilter === "all" ||
      note?.type === typeFilter ||
      (typeFilter === "fav" && note?.favorite);
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);
  const startIndex = (currentPage - 1) * notesPerPage;
  const endIndex = startIndex + notesPerPage;
  const currentNotes = filteredNotes.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function handleRemove(id) {
    try {
      dispatch(deleteNoteThunk(id));
      showSuccess("Note Deleted Successfully!");
    } catch (err) {
      showError(err || "Error in deleting");
    }
  }

  function handleView(to) {
    console.log(to);
    navigate(to);
  }
  function handleEdit(to) {
    console.log(to);
    navigate(to);
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="relative">
      {" "}
      {loading && <Loader />}
      <div className=" min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 md:gap-3 mb-6 pr-4">
            <input
              type="text"
              placeholder="Search by title & tags"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder:text-stone-700"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">All Types</option>
              <option value="fav">Favourites</option>
              <option value="smart">Smart</option>
              <option value="quick">Quick</option>
              <option value="geo">Geo</option>
            </select>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {currentNotes.map((note, i) => (
              <NoteCard
                note={note}
                key={i}
                handleRemove={handleRemove}
                handleView={handleView}
                handleEdit={handleEdit}
              />
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No notes found matching your criteria.
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      currentPage === page
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {filteredNotes.length > 0 && (
            <div className="text-center text-gray-600 text-sm mt-4">
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredNotes.length)} of{" "}
              {filteredNotes.length} notes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllNotes;
