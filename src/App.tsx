import React, { FunctionComponent, useState } from "react";

// Components
import Dropzone from "./common/components/Dropzone";
import FileSettings from "./common/components/FileSettings";

// Actions
import { fetchHeaders, processFile, EXT_PROCESSORS } from "./processor";
// import { processExcelData } from "./processor-DONTTOUCH";

// Other
import { colors } from "./assets/styles";
// import * as XLSX from "xlsx";

const App: FunctionComponent = () => {
  const fileTypes = "." + Object.keys(EXT_PROCESSORS).join(" .");

  const [currentFile, setCurrentFile] = useState<any>();
  const [isActive, setButtonStatus] = useState(false);
  const [headers, setHeaders] = useState([]);

  const setFiles = (files: FileList) => {
    if (files.length) {
      setCurrentFile(files[0]);
      setButtonStatus(true);
      fetchHeaders(files[0]).then((rc) => {
        if (rc.statusCode) {
          // error handling
          console.log(rc.errorMessage);
          return;
        }
        setHeaders(rc.data);
      });
    }
  };

  const deleteFile = () => {
    setCurrentFile(null);
    setButtonStatus(false);
  };

  const uploadFile = () => {
    processFile(currentFile, headers, 1, [2, 3], ".").then((rc) => {
      if (rc.statusCode) {
        // show error log
        console.log(rc.errorMessage);
        return;
      }
      let data = rc.data;
      console.log("data", data);
    });
    deleteFile();
  };

  return (
    <>
      <div style={styles.headerContainer}>
        <div
          onClick={() => alert("sydney loves stefan")}
          style={{ display: "flex", cursor: "pointer" }}
        >
          <span style={styles.betaTag}>Emdomy</span>
        </div>
      </div>
      <div style={styles.contentContainer}>
        <span style={styles.title}>Translation Processor</span>

        <span style={styles.description}>
          Upload spreadsheets containing your translations here to be converted
          to JSON in your desired i18n structure.
        </span>

        {!currentFile && (
          <Dropzone
            setFiles={setFiles}
            acceptedFileTypes={fileTypes}
            allowMultipleFiles={false}
          />
        )}

        {currentFile && (
          <FileSettings
            currentFile={currentFile}
            deleteFile={deleteFile}
            uploadFile={uploadFile}
          />
        )}
      </div>
    </>
  );
};

const styles: { [name: string]: React.CSSProperties } = {
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "30px",
    alignSelf: "center",
    maxWidth: "1400px",
    background: colors.main.primary,
  },
  contentContainer: {
    // flex: 1,
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    maxWidth: " 75%",
    padding: "2rem",
  },
  title: {
    fontSize: "21px",
    lineHeight: "22px",
  },
  description: {
    lineHeight: "23px",
    marginTop: "15px",
  },

  buttonContainer: {
    display: "flex",
    width: "50%",
    justifyContent: "space-between",
  },
  uploadButton: { width: "50%", margin: "2rem auto" },
  link: {
    color: colors.main.secondary,
    fontWeight: "bold",
    marginLeft: "15px",
  },
};

export default App;
