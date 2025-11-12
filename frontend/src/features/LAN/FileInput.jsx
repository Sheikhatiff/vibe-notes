import React, { useCallback, useMemo } from "react";
import {
  Download,
  DownloadCloud,
  UploadCloud,
  X,
  FileIcon,
} from "lucide-react";
import JSZip from "jszip";
import { BACKEND_URL } from "../../pages/DashboardPage";

function FileInput({ files, setFiles, inputCss = "", boxCss = "" }) {
  const handleFileChange = useCallback(
    (e) => {
      const newFiles = Array.from(e.target.files);
      if (newFiles.length > 0) {
        setFiles((prev) => [...prev, ...newFiles]);
      }
    },
    [setFiles]
  );

  const handleRemoveFile = useCallback(
    (indexToRemove) => {
      setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    },
    [setFiles]
  );

  const handleDownloadFile = useCallback(async (file) => {
    try {
      let blob;
      let filename = file.name;

      if (file instanceof File) {
        blob = file;
      } else if (file.path || file.url) {
        let fileUrl = file.path || file.url;

        if (!fileUrl.startsWith("http://") && !fileUrl.startsWith("https://")) {
          fileUrl = `${BACKEND_URL}/${fileUrl.replace(/^\//, "")}`;
        }

        const response = await fetch(fileUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/octet-stream",
          },
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const contentType =
          response.headers.get("content-type") || "application/octet-stream";
        const arrayBuffer = await response.arrayBuffer();
        blob = new Blob([arrayBuffer], { type: contentType });
      } else {
        throw new Error("Invalid file object");
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 150);
    } catch (error) {
      console.error("Download failed:", error);
      alert(`Failed to download file: ${error.message}`);
    }
  }, []);

  const handleDownloadAll = useCallback(async () => {
    if (files.length === 0) {
      alert("No files to download");
      return;
    }

    try {
      const zip = new JSZip();

      for (const file of files) {
        if (file instanceof File) {
          zip.file(file.name, file);
        } else if (file.path || file.url) {
          // Fetch file from server
          let fileUrl = file.path || file.url;

          // Fix: If the URL doesn't start with http, prepend backend URL
          if (
            !fileUrl.startsWith("http://") &&
            !fileUrl.startsWith("https://")
          ) {
            fileUrl = `${BACKEND_URL}/${fileUrl.replace(/^\//, "")}`;
          }

          const response = await fetch(fileUrl);

          if (!response.ok) {
            console.error(`Failed to fetch ${file.name}`);
            continue;
          }

          const blob = await response.blob();
          zip.file(file.name, blob);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `files_${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Download all failed:", error);
      alert(`Failed to download files: ${error.message}`);
    }
  }, [files]);

  const handleRemoveAll = useCallback(() => {
    if (
      files.length > 0 &&
      window.confirm(`Remove all ${files.length} files?`)
    ) {
      setFiles([]);
    }
  }, [files.length, setFiles]);

  const fileCount = useMemo(() => files.length, [files.length]);
  const totalSize = useMemo(() => {
    return files.reduce((acc, file) => acc + (file.size || 0), 0);
  }, [files]);

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* File Display Area */}
      <div className={boxCss}>
        <div className="border-2 p-3 flex flex-wrap gap-3 rounded-lg border-emerald-600 bg-emerald-50 min-h-[120px] items-start">
          {fileCount > 0 ? (
            files.map((file, index) => (
              <FileItem
                key={`${file.name}-${index}`}
                file={file}
                index={index}
                handleRemove={handleRemoveFile}
                handleDownload={handleDownloadFile}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-8 text-center">
              <FileIcon className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">No files uploaded yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Click "Upload Files" to add files
              </p>
            </div>
          )}
        </div>

        {/* File Stats */}
        {fileCount > 0 && (
          <div className="mt-2 text-xs text-gray-600 flex gap-4">
            <span className="font-medium">
              {fileCount} {fileCount === 1 ? "file" : "files"}
            </span>
            <span>Total: {formatSize(totalSize)}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <label
          htmlFor="files"
          className={`${inputCss} flex items-center justify-center gap-2 text-xs sm:text-sm uppercase font-medium bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 transition-colors duration-200 cursor-pointer text-white px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md flex-1 sm:flex-none sm:min-w-40`}
        >
          <UploadCloud className="w-5 h-5" />
          <span>Upload Files</span>
          <input
            type="file"
            className="hidden"
            multiple
            name="files"
            id="files"
            onChange={handleFileChange}
          />
        </label>

        <button
          type="button"
          className="flex items-center justify-center gap-2 text-xs sm:text-sm uppercase font-medium bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-white px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md flex-1 sm:flex-none sm:min-w-40"
          onClick={handleDownloadAll}
          disabled={fileCount === 0}
        >
          <DownloadCloud className="w-5 h-5" />
          <span>Download All</span>
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 text-xs sm:text-sm uppercase font-medium bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-white px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md flex-1 sm:flex-none sm:min-w-40"
          onClick={handleRemoveAll}
          disabled={fileCount === 0}
        >
          <X className="w-5 h-5" />
          <span>Remove All</span>
        </button>
      </div>
    </div>
  );
}

function FileItem({ file, handleRemove, index, handleDownload }) {
  const formatSize = (bytes) => {
    if (!bytes) return "";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileExtension = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    return ext;
  };

  const getFileColor = (filename) => {
    const ext = getFileExtension(filename);
    const colorMap = {
      pdf: "bg-red-100 border-red-300 text-red-700",
      doc: "bg-blue-100 border-blue-300 text-blue-700",
      docx: "bg-blue-100 border-blue-300 text-blue-700",
      txt: "bg-gray-100 border-gray-300 text-gray-700",
      jpg: "bg-purple-100 border-purple-300 text-purple-700",
      jpeg: "bg-purple-100 border-purple-300 text-purple-700",
      png: "bg-purple-100 border-purple-300 text-purple-700",
      gif: "bg-purple-100 border-purple-300 text-purple-700",
      zip: "bg-yellow-100 border-yellow-300 text-yellow-700",
      rar: "bg-yellow-100 border-yellow-300 text-yellow-700",
    };
    return (
      colorMap[ext] || "bg-emerald-100 border-emerald-300 text-emerald-700"
    );
  };

  return (
    <div
      className={`border-2 flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:shadow-md ${getFileColor(
        file.name
      )}`}
    >
      <Download
        className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform"
        onClick={() => handleDownload(file)}
        title="Download file"
      />
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className="text-sm font-medium truncate max-w-[200px]"
          title={file.name}
        >
          {file.name}
        </span>
        {file.size && (
          <span className="text-xs opacity-70">{formatSize(file.size)}</span>
        )}
      </div>
      <X
        className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform ml-auto"
        onClick={() => handleRemove(index)}
        title="Remove file"
      />
    </div>
  );
}

export default FileInput;
