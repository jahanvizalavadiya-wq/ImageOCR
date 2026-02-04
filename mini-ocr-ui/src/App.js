import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // preview image
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Upload image to API
  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);

      const response = await fetch(
        "https://localhost:7159/api/ocr/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      setText(result.extractedText  || "No text found");
    } catch (error) {
      console.error(error);
      alert("OCR failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">

          <div className="card shadow">
            <div className="card-body">

              <h4 className="text-center mb-3">
                OCR Image Text Reader
              </h4>

              {/* File Upload */}
              <input
                type="file"
                className="form-control mb-3"
                accept="image/*"
                onChange={handleImageChange}
              />

              {/* Image Preview */}
              {preview && (
                <div className="text-center mb-3">
                  <img
                    src={preview}
                    alt="preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: "250px" }}
                  />
                </div>
              )}

              {/* Upload Button */}
              <button
                className="btn btn-primary w-100"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? "Reading text..." : "Upload & Read Text"}
              </button>

              {/* OCR Result */}
              {text && (
                <div className="mt-4">
                  <h6>Extracted Text:</h6>
                  <textarea
                    className="form-control"
                    rows="5"
                    value={text}
                    readOnly
                  />
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
