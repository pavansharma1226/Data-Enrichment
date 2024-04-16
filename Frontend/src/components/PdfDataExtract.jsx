import axios from 'axios';
import { useState } from 'react';

const PdfTextExtract = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('pdf', file);

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/text/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setText(response.data.text);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <form style={{ maxWidth: '80%', margin: 'auto', marginTop: '2%',textAlign: 'center', fontFamily: 'Arial, sans-serif', border: '2px solid #007bff', borderRadius: '10px', padding: '20px' }}>
      <h1 style={{ color: '#007bff', marginBottom: '2%', fontSize: '28px' }}>PDF Text Extractor</h1>
      <div style={{ marginBottom: '2%' }}>
        <label htmlFor="pdfFile" style={{ marginRight: '10px', color: '#333', fontSize: '18px' }}>Select a PDF file:</label>
        <input type="file" id="pdfFile" accept=".pdf" onChange={handleFileChange} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '250px' }} />
      </div>
      <button type="button" onClick={handleSubmit} disabled={loading} style={{ backgroundColor: '#007bff', color: '#fff', padding: '12px 24px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>{loading ? 'Extracting...' : 'Upload and Extract'}</button>
      <div style={{ marginTop: '2%' }}>
        <h2 style={{ color: '#333', marginBottom: '20px', fontSize: '24px' }}>Extracted Text:</h2>
        <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #ccc', minHeight: '150px', fontSize: '16px', lineHeight: '1.6' }}><pre>{loading ? 'Loading...' : text}</pre></div>
      </div>
    </form>
  );
}

export default PdfTextExtract;
