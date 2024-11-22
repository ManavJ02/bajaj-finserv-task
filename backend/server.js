const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const mime = require("mime-types");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Multer middleware (not used for Base64 but remains for potential file upload)
const upload = multer({ storage: multer.memoryStorage() });

// Utility Functions
const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const extractAlphabets = (array) =>
  array.filter((item) => /^[a-zA-Z]$/.test(item));
const extractNumbers = (array) =>
  array.map(Number).filter((item) => !isNaN(item) && Number.isInteger(item));
const findHighestLowercase = (array) => {
  const lowercaseAlphabets = array.filter((char) => /^[a-z]$/.test(char));
  return lowercaseAlphabets.length > 0 ? lowercaseAlphabets.sort().pop() : null;
};

const decodeBase64File = (base64String) => {
  try {
    const buffer = Buffer.from(base64String, "base64");
    const mimeType = mime.getType(buffer);
    return {
      valid: true,
      sizeKB: (buffer.length / 1024).toFixed(2), // Size in KB
      mimeType: mimeType || "unknown", // MIME type extraction can be added if necessary
    };
  } catch {
    return { valid: false, sizeKB: null, mimeType: null };
  }
};

// POST endpoint
app.post("/bfhl", upload.single("file"), (req, res) => {
  try {
    const { data, file_b64 } = req.body;

    // Validate and process `data` array
    const alphabets = extractAlphabets(data);
    const numbers = extractNumbers(data);
    const highestLowercase = findHighestLowercase(alphabets);
    const containsPrime = numbers.some(isPrime);

    // Handle Base64-encoded file
    const fileDetails = file_b64
      ? decodeBase64File(file_b64)
      : { valid: false };

    // Response
    res.status(200).json({
      is_success: true,
      user_id: "Manav_Joshi_19052002",
      email: "manavmanishjoshi@gmail.com",
      roll_number: "0101CS211075",
      numbers,
      alphabets,
      highest_lowercase: highestLowercase,
      prime_found: containsPrime,
      file_valid: fileDetails.valid,
      file_mime_type: fileDetails.mimeType,
      file_size_kb: fileDetails.sizeKB,
    });
  } catch (error) {
    res.status(400).json({ is_success: false, message: error.message });
  }
});

app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
