
import axios from 'axios';
import { useState } from 'react';

const PdfTextExtract = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');

  const handleFileChange = (event) => {
    // console.log(file);
    // console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('pdf', file);
    console.log(formData);

    try {
      const response = await axios.post('http://localhost:3000/api/text/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response);
      setText(response.data.text);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>PDF Text Extractor</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Upload and Extract</button>
      <div>
        <h2>Extracted Text:</h2>
        <div className="text-container">{text}</div>
      </div>
    </div>
  );
}

export default PdfTextExtract;