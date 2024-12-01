import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const ExcelUpload = () => {
  const [files, setFiles] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadedFilesVisible, setIsUploadedFilesVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedFileNames =
      JSON.parse(localStorage.getItem("uploadedFileNames")) || [];
    const storedData = JSON.parse(localStorage.getItem("fileData")) || [];
    setFiles(storedFileNames); // Load stored file names
    setFileData(storedData); // Load corresponding file data
  }, []);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    const allowedFiles = selectedFiles.filter((file) =>
      [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
        "text/csv", // .csv
      ].includes(file.type)
    );

    const rejectedFiles = selectedFiles.filter(
      (file) => !allowedFiles.includes(file)
    );
    if (rejectedFiles.length > 0) {
      alert("Only Excel (.xlsx, .xls) and CSV (.csv) files are allowed.");
    }

    const allowedFileNames = allowedFiles.map((file) => file.name);
    const updatedFileNames = [...files, ...allowedFileNames];

    setFiles(updatedFileNames);
    localStorage.setItem("uploadedFileNames", JSON.stringify(updatedFileNames));

    allowedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetNames = workbook.SheetNames;
        const sheet = workbook.Sheets[sheetNames[0]]; // Read first sheet
        const sheetData = XLSX.utils.sheet_to_json(sheet);
        const newFileData = { fileName: file.name, data: sheetData };

        const updatedFileData = [...fileData, newFileData];
        setFileData(updatedFileData);
        localStorage.setItem("fileData", JSON.stringify(updatedFileData));
      };
      reader.readAsBinaryString(file);
    });
  };

  const removeFileData = (fileName) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this file?"
    );
    if (confirmRemove) {
      const updatedFileData = fileData.filter(
        (file) => file.fileName !== fileName
      );
      setFileData(updatedFileData);
      localStorage.setItem("fileData", JSON.stringify(updatedFileData));

      const updatedFileNames = files.filter((name) => name !== fileName);
      setFiles(updatedFileNames);
      localStorage.setItem(
        "uploadedFileNames",
        JSON.stringify(updatedFileNames)
      );
    }
  };

  const resetFiles = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all files?"
    );
    if (confirmReset) {
      setFiles([]);
      setFileData([]);
      localStorage.removeItem("uploadedFileNames");
      localStorage.removeItem("fileData");
      localStorage.removeItem("shops");
    }
  };

  const filteredData = fileData.map((file) => ({
    ...file,
    data: file.data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    ),
  }));

  return (
    <div>
      <div>
        {files.length === 0 ? (
          
          <div className="wrapper flex justify-center items-center min-h-screen">
            
            <div className="flex flex-col justify-center items-center">
            <h3 className="font-semibold ">Upload Excel File</h3>
              <label htmlFor="file-input" className="cursor-pointer">
                <img
                  className="w-52 rounded-lg shadow-md"
                  src="bdb6abe62ffe8ac78bff9ae3fb552b5e-removebg-preview.png"
                  alt="Upload"
                />
              </label>
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept=".xls,.xlsx,.csv"
                onChange={handleFileChange}
                multiple
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center p-4">
              <button
                onClick={resetFiles}
                className="text-red-700 border font-bold px-4 py-2 rounded-full hover:bg-red-100 transition duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                Reset
              </button>

              <h1 className="text-xl sm:text-3xl font-semibold text-gray-800 text-center flex-grow">
                ORDEREASE
              </h1>

              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-white bg-green-800 rounded-md hover:bg-green-900 focus:outline-none"
                >
                  <span className="block w-6 h-1 bg-white mb-1"></span>
                  <span className="block w-6 h-1 bg-white mb-1"></span>
                  <span className="block w-6 h-1 bg-white"></span>
                </button>

                {isMenuOpen && (
                  <div className="absolute  right-0  w-48 border rounded-lg shadow-lg  bg-green-900 text-center py-4 pb-5  ">
                    <button
                      onClick={() => navigate("/addorder")}
                      className="w-full text-center px-4 py-3  hover:bg-green-800 text-white rounded font-semibold"
                    >
                      Add Order
                    </button>
                    <button
                      onClick={() => navigate("/vieworder")}
                      className="w-full text-center px-4 py-3 mb-2 hover:bg-green-800 text-white rounded font-semibold"
                    >
                      View Order
                    </button>
                    <label
                      htmlFor="file-input"
                      className="w-full text-center px-4 py-3  hover:bg-green-800 text-white cursor-pointer rounded font-semibold"
                    >
                      Add More Files
                      <input
                        id="file-input"
                        type="file"
                        className="hidden"
                        accept=".xls,.xlsx,.csv"
                        onChange={handleFileChange}
                        multiple
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap justify-center mt-6 mb-4 gap-4">
              <input
                type="text"
                placeholder="Search Data..."
                className="border mx-3 rounded-lg px-4 py-2 sm:py-3 w-full sm:w-72 md:w-96 lg:w-1/2 xl:w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm sm:text-base "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                id="uploaded-files-btn"
                className="border bg-white text-black font-semibold px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-gray-300 transition duration-300 text-xs sm:text-sm"
                onClick={() => setIsUploadedFilesVisible(!isUploadedFilesVisible)}
              >
                Uploaded Files
              </button>
            </div>

            {isUploadedFilesVisible && (
              <div
                id="uploaded-files-div"
                className="m-5 p-4 bg-white shadow-lg rounded-lg border border-gray-200"
              >
                <h4 className=" text-gray-800 mb-4">
                  Uploaded Files:
                </h4>
                <ul className="space-y-2 ">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="text-sm flex text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm hover:bg-green-50 hover:shadow-md transition duration-300 ease-in-out"
                    >
                      <span className="font-medium text-gray-800">{file}</span>
                      <div>
                        <button
                          className="ml-4 text-red-600 hover:text-red-800 
             hidden sm:block" // This will hide the "Remove" text on small screens and show the "X" text
                          onClick={() => removeFileData(file)}
                        >
                          Remove
                        </button>

                        <button
                          className="ml-4 text-red-600 hover:text-red-800 
             sm:hidden" // This will only show the "X" on small screens
                          onClick={() => removeFileData(file)}
                        >
                          X
                        </button>
                      </div>

                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              {filteredData.map((file, fileIndex) => (
                <div
                  key={fileIndex}
                  className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm m-5"
                >
                  <h3 className="font-semibold mb-4">
                    {file.fileName}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse bg-white shadow-lg rounded-lg border border-gray-200">
                      
                      <tbody className="text-xs sm:text-sm text-gray-600">
                        {file.data.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className={`border-b ${rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }`}
                          >
                            {Object.values(row).map((value, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-4 py-2 border-b"
                              >
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExcelUpload;
