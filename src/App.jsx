import "./app.css";
import image from "./assets/a5.png";
import txt from "./assets/txt.jpg";
import pdf from "./assets/pdf.jpg";
import doc from "./assets/doc.jpg";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import { useState } from "react";
import { Encrypt1, DEcrypt1 } from "./aes";
import { saveAs } from "file-saver";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [dataEncrypt, setDataEncrypt] = useState([]);
  const [dataDecrypt, setDataDecrypt] = useState([]);
  const [displayDataEncrypt, setDisplayDataEncrypt] = useState(false);
  const [encryptionTime, setEncryptionTime] = useState("");
  const [decryptionTime, setDecryptionTime] = useState("");
  const displayedData = displayDataEncrypt ? dataEncrypt : dataDecrypt;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
      setIsFileUploaded(true);

      // Reset the displayed data
      setDataEncrypt("");
      setDataDecrypt("");
      setDisplayDataEncrypt(false);

      setEncryptionTime("");
      setDecryptionTime("");
    };

    reader.readAsText(file);
  };

  const handleChangeTextField = (event) => {
    if (!isFileUploaded) {
      setFileContent(event.target.value);
    }
  };
  const getFileExtension = (fileName) => {
    return fileName.split(".").pop().toLowerCase();
  };
  const getImageForFileExtension = (extension) => {
    switch (extension) {
      case "txt":
        return txt; // Replace with the image source for TXT files
      case "pdf":
        return pdf; // Replace with the image source for PDF files
      case "docx":
        return doc;
      default:
        return image; // Replace with the image source for other file types
    }
  };

  const currencies = [
    {
      value: "128bit",
      label: "128 bit",
    },
    {
      value: "192bit",
      label: "192 bit",
    },
    {
      value: "256bit",
      label: "256 bit",
    },
  ];

  const handleEncrypt = () => {
    const startTime = performance.now();
    const lines = fileContent.split("\n");
    const encodedLines = [];

    lines.forEach((line) => {
      const encodedLine = Encrypt1(line);
      encodedLines.push(encodedLine);
    });

    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    console.log(elapsedTime);

    setEncryptionTime(elapsedTime);
    setDataEncrypt(encodedLines);
    setDisplayDataEncrypt(true);
  };

  const handleDecrypt = () => {
    const startTime = performance.now();
    // Tách dữ liệu thành từng dòng
    const lines = fileContent.split("\n");

    // Mảng chứa dữ liệu đã giải mã
    const decodedLines = [];

    // Giải mã từng dòng và thêm vào mảng
    lines.forEach((line) => {
      const decodedLine = DEcrypt1(line);
      decodedLines.push(decodedLine);
    });
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    console.log(elapsedTime);

    setDecryptionTime(elapsedTime);
    setDataDecrypt(decodedLines);
    setDisplayDataEncrypt(false);
  };

  const handleDownloadClick = () => {
    const blob = new Blob([dataEncrypt], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "encrypted_data.txt");
  };
  // async function performEncryption() {
  //   console.time("thời gian mã hóa");
  //   await handleEncrypt();
  //   console.timeEnd("thời gian mã hóa");
  // }
  // async function performDecryption() {
  //   console.time("thời gian giải mã");
  //   await handleDecrypt();
  //   console.timeEnd("thời gian giải mã");
  // }
  // useEffect(() => {}, [decryptionTime]);
  return (
    <div className="container">
      <div className="upload">
        {/* <h1> Upload file</h1> */}
        <div className="wrapper_upload">
          {selectedFile ? (
            <>
              <img
                src={getImageForFileExtension(
                  getFileExtension(selectedFile.name)
                )}
                alt={selectedFile.name}
                className="img"
              />
              <h3>{selectedFile.name}</h3>
            </>
          ) : (
            <div className="wrapper">
              <img src={image} alt="txt" className="img" />
              <h3>Thả và kéo file vào đây</h3>
            </div>
          )}

          <div className="button">
            <input
              type="file"
              id="file-upload"
              style={{ display: "none" }}
              onChange={(event) => handleFileUpload(event)}
            />
            <button
              className="btn-upload"
              onClick={() => document.getElementById("file-upload").click()}
            >
              Upload file
            </button>
            <button
              size="large"
              className={`btn-encrypt ${fileContent === "" ? "disabled" : ""}`}
              onClick={handleEncrypt}
              disabled={fileContent === ""}
            >
              Mã hóa
            </button>
            <button
              size="large"
              className={`btn-descypt ${fileContent === "" ? "disabled" : ""}`}
              onClick={handleDecrypt}
              disabled={fileContent === ""}
              // onClick={performDecryption}
            >
              Giải mã
            </button>
            <button
              size="large"
              className={`btn-download ${fileContent === "" ? "disabled" : ""}`}
              onClick={handleDownloadClick}
              disabled={fileContent === ""}
            >
              Download
            </button>
          </div>

          {encryptionTime && <h3>Thời gian mã hóa: {encryptionTime} ms</h3>}
          {decryptionTime && <h3>Thời gian giải mã: {decryptionTime} ms</h3>}
        </div>
        <div className="wrapper_key">
          <h3>Nhập key</h3>

          <TextField
            id="outlined-select-currency"
            select
            label="Key"
            defaultValue="128bit"
            sx={{
              width: "20%",
            }}
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="outlined-basic"
            label="Nhập mã key"
            variant="outlined"
            sx={{
              width: "70%",
              marginLeft: "2%",
            }}
          />

          <h3>Đầu vào</h3>

          <TextField
            id="outlined-multiline-static"
            label="Dữ liệu đầu vào"
            multiline
            rows={5}
            defaultValue=""
            value={fileContent}
            onChange={handleChangeTextField}
            // disabled={isFileUploaded}
            sx={{ width: "92%" }}
          />

          <h3>Đầu ra</h3>

          <TextField
            id="outlined-multiline-static"
            label="Dữ liệu đầu ra"
            multiline
            rows={8}
            disabled
            defaultValue=""
            value={displayedData}
            sx={{ width: "92%" }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
