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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
      setIsFileUploaded(true);
    };

    reader.readAsText(file);
  };

  const handleChangeTextField = (event) => {
    if (!isFileUploaded) {
      setFileContent(event.target.value);
    }
  };
  const getFileExtension = (fileName) => {
    console.log(fileName.split(".").pop().toLowerCase());
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
    const lines = fileContent.split("\n");
    // console.log(lines);

    // Mảng chứa dữ liệu đã mã hóa
    const encodedLines = [];

    // Mã hóa từng dòng và thêm vào mảng
    lines.forEach((line) => {
      const encodedLine = Encrypt1(line);
      encodedLines.push(encodedLine);
    });
    console.log(encodedLines);
    setDataEncrypt(encodedLines);
  };

  const handleDecrypt = () => {
    // Tách dữ liệu thành từng dòng
    const lines = fileContent.split("\n");

    // Mảng chứa dữ liệu đã giải mã
    const decodedLines = [];

    // Giải mã từng dòng và thêm vào mảng
    lines.forEach((line) => {
      const decodedLine = DEcrypt1(line);
      decodedLines.push(decodedLine);
    });
    console.log(decodedLines);

    setDataDecrypt(decodedLines);
  };

  const handleDownloadClick = () => {
    const blob = new Blob([dataEncrypt], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "encrypted_data.txt");
  };
  async function performEncryption() {
    console.time("thời gian mã hóa");
    await handleEncrypt();
    console.timeEnd("thời gian mã hóa");
  }
  async function performDecryption() {
    console.time("thời gian giải mã");
    await handleDecrypt();
    console.timeEnd("thời gian giải mã");
  }

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
              className="btn-encrypt"
              // onClick={handleEncrypt}
              onClick={performEncryption}
            >
              Mã hóa
            </button>
            <button
              size="large"
              className="btn-descypt"
              onClick={performDecryption}
            >
              Giải mã
            </button>
            <button
              size="large"
              className="btn-download"
              onClick={handleDownloadClick}
            >
              Download
            </button>
          </div>

          {/* <h3>Thời gian giải mã: </h3> */}
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
            value={dataDecrypt || dataEncrypt}
            sx={{ width: "92%" }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
