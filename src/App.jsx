import "./app.css";
import image from "./assets/a5.png";
import txt from "./assets/txt.jpg";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import { useState } from "react";
import { Encrypt1, DEcrypt1, key128, key192, key256 } from "./aes";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import UploadFile from "@mui/icons-material/UploadFile";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [dataEncrypt, setDataEncrypt] = useState([]);
  const [dataDecrypt, setDataDecrypt] = useState([]);
  const [displayDataEncrypt, setDisplayDataEncrypt] = useState(false);
  const [encryptionTime, setEncryptionTime] = useState("");
  const [decryptionTime, setDecryptionTime] = useState("");
  const [active, setActive] = useState(false);
  const [key, setKey] = useState("");
  const [typeKey, setTypeKey] = useState("128bit");

  let displayedData = displayDataEncrypt ? dataEncrypt : dataDecrypt;

  const handleRead = (e, file) => {
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
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    handleRead(event, file);
  };

  const handleDrapOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    handleRead(e, e.dataTransfer.files[0]);
  };
  const handleChangeTextField = (event) => {
    if (!isFileUploaded) {
      setFileContent(event.target.value);
      displayedData = "";
    }
  };
  const getFileExtension = (fileName) => {
    return fileName.split(".").pop().toLowerCase();
  };
  const getImageForFileExtension = (extension) => {
    switch (extension) {
      case "txt":
        return txt; // Replace with the image source for TXT files
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

  let functionType;
  switch (typeKey) {
    case "128bit":
      functionType = key128;
      break;
    case "192bit":
      functionType = key192;
      break;
    case "256bit":
      functionType = key256;
      break;
    default:
      break;
  }
  const checkKey = (key) => {
    if (key === "") {
      toast.error("Không được để key trống");
      return true;
    } else return false;
  };

  const handleEncrypt = () => {
    if (checkKey(key)) return;

    try {
      const startTime = performance.now();
      const encodedLine = Encrypt1(fileContent, key, functionType);
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;
      setEncryptionTime(elapsedTime);
      setDataEncrypt(encodedLine);
      setDisplayDataEncrypt(true);
      setActive(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDecrypt = () => {
    if (checkKey(key)) return;

    try {
      const startTime = performance.now();
      const decodedLine = DEcrypt1(fileContent, key, functionType);
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;
      setDecryptionTime(elapsedTime);
      setDataDecrypt(decodedLine);
      setDisplayDataEncrypt(false);
      setActive(true);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDownloadClick = () => {
    let data;
    data = displayDataEncrypt ? dataEncrypt : dataDecrypt;

    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    saveAs(
      blob,
      displayDataEncrypt ? "encrypted_data.txt" : "decrypted_data.txt"
    );
  };

  return (
    <div className="container">
      <div className="upload">
        <div className="wrapper_upload">
          {selectedFile ? (
            <div onDragOver={handleDrapOver} onDrop={handleDrop}>
              <img
                src={getImageForFileExtension(
                  getFileExtension(selectedFile.name)
                )}
                alt={selectedFile.name}
                className="img"
              />

              <h3>{selectedFile.name}</h3>
            </div>
          ) : (
            <div
              className="wrapper"
              onDragOver={handleDrapOver}
              onDrop={handleDrop}
            >
              <img src={txt} alt="txt" className="img" />
              <h3>Kéo và thả file vào đây</h3>
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
              <UploadFile />
              <span className="title">Tải lên</span>
            </button>
            <button
              size="large"
              className={`btn-encrypt ${fileContent === "" ? "disabled" : ""}`}
              onClick={handleEncrypt}
              disabled={fileContent === ""}
            >
              <LockIcon />
              <span className="title"> Mã hóa</span>
            </button>
            <button
              size="large"
              className={`btn-decrypt ${fileContent === "" ? "disabled" : ""}`}
              onClick={handleDecrypt}
              disabled={fileContent === ""}
            >
              <LockOpenIcon />
              <span className="title"> Giải mã</span>
            </button>
            <button
              size="large"
              className={`btn-download ${!active ? "disabled" : ""}`}
              onClick={handleDownloadClick}
              disabled={!active}
            >
              <FileDownloadIcon />
              <span className="title"> Download</span>
            </button>
          </div>

          {displayDataEncrypt
            ? encryptionTime && <h3>Thời gian mã hóa: {encryptionTime} ms</h3>
            : decryptionTime && <h3>Thời gian giải mã: {decryptionTime} ms</h3>}
        </div>
        <div className="wrapper_key">
          <h3>Nhập key</h3>

          <TextField
            id="outlined-select-currency"
            select
            label="Key"
            defaultValue="128bit"
            value={typeKey}
            onChange={(e) => {
              setTypeKey(e.target.value);
            }}
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
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
            }}
          />

          <h3>Đầu vào</h3>

          <TextField
            id="outlined-multiline-static"
            label="Dữ liệu đầu vào"
            multiline
            rows={5}
            value={fileContent}
            onChange={handleChangeTextField}
            sx={{ width: "92%" }}
          />

          <h3>Đầu ra</h3>

          <TextField
            id="outlined-multiline-static"
            label="Dữ liệu đầu ra"
            multiline
            rows={8}
            disabled
            value={displayedData}
            sx={{ width: "92%" }}
          />

          <ToastContainer autoClose={3000} />
        </div>
      </div>
    </div>
  );
}

export default App;
