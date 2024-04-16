const express = require("express");
const cors = require("cors");
const app = express();
const multer = require("multer");
const pdf = require("pdf-parse");
const fs = require('fs');
const port = 3000;
const { GoogleGenerativeAI, prompt, ImageEmbedder } = require('@google/generative-ai');
const dotenv = require("dotenv");
dotenv.config();


const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
// console.log(gemini_api_key);


const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096
};
 
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  geminiConfig,
});

let finaldata = "";
 
const generate = async (data) => {
  try {
    const prompt = `Enrich the data without loss and adding some relevant data and formatting: ${data}`;
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    // console.log(response.text());
    finaldata = response.text();
    // console.log("Final Data : " + finaldata);
  } catch (error) {
    console.log("response error", error);
    return(error)
  }
};


//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Multer configuration
// const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
    //     cb(null, 'uploads/') // Save uploaded files to the 'uploads' directory
    //   },
    //   filename: function (req, file, cb) {
      //     cb(null, Date.now() + '-' + file.originalname) // Use unique filenames
      //   }
      // });
      
      const upload = multer({ storage: multer.memoryStorage() });
      
      // const upload = multer({ storage: storage });
      
      app.post('/api/text/upload', upload.single('pdf'), async (req, res) => {
        try {
          // console.log(req);  
          const pdfBuffer = req.file.buffer;
          const dataBuffer = new Uint8Array(pdfBuffer);
          const pdfData = new Buffer.from(dataBuffer);
          // const pdfBuffer = fs.readFileSync(req.file.path);
          // // Parse PDF buffer to extract text
          // const pdfText = await extractTextFromPDF(pdfBuffer);
          const pdfText = await extractTextFromPDF(pdfData);
          // console.log("hello"+ pdfText);
          await generate(pdfText);
          // console.log(finaldata);
          res.json({ text: finaldata });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'An error occurred during text extraction.' });
  }
});

const extractTextFromPDF = (pdfBuffer) => {
  return new Promise((resolve, reject) => {
    pdf(Buffer.from(pdfBuffer)).then(function(data) {
      resolve(data.text);
    }).catch(function(error) {
      reject(error);
    });
  });
};

app.listen(port, () => {
  console.log(`Live at port ${port}`);
});