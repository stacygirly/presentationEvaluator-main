import { useState } from "react";
import "./PptUploader.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import "./global.css";

const PptUploader = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => { 
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 200);

      try {
        setUploading(true);
        const response = await fetch("https://b475-129-173-66-71.ngrok-free.app/upload", {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json', // Change this to 'application/json' or any content type that matches
          },
          mode: 'cors',  // Explicitly enable CORS
        });

        const result = await response.json();
        console.log("Success:", result);

        // Clear the interval and set progress to 100 when done
        clearInterval(interval);
        setProgress(100);

        // Redirect after a short delay to show 100% completion
        setTimeout(() => {
          window.location.href = '/PresentationRecorder';
        }, 1000); 

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setUploading(false);
      }
    } else {
      console.log("No file selected");
    }
  };

  return (
    <div className="MainBody background">
      <Header />
      <main>
        <form onSubmit={handleSubmit}>
          <h1 className="Heading mb-4">Upload Presentation File</h1>
          <input type="file" className="form-control" id="customFile" onChange={handleFileChange} />
          <br/>
          <button type="submit" className="btn btn-dark fw-bolder">
            Upload
          </button>
        </form>
        <br/>
        {uploading && (
          <div className="progress">
            <div
              id="theBar"
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PptUploader;