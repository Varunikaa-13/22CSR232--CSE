const express = require("express");
const axios = require("axios");
const app = express();
const port = 9876;
const windowSize = 10;
let numbersWindow = [];

const apiUrls = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibo",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand",
};


const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return (sum / numbers.length).toFixed(2); 
};


const fetchNumbers = async (type) => {
  try {
    const response = await axios.get(apiUrls[type], {
      headers: {
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MDI4MzIyLCJpYXQiOjE3NDcwMjgwMjIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjljNWNjMGI3LTRiYWYtNDY1MS05MmVhLWY0OGFiMjBiZTU2NSIsInN1YiI6InZhcnVuaWthYWsuMjJjc2VAa29uZ3UuZWR1In0sImVtYWlsIjoidmFydW5pa2Fhay4yMmNzZUBrb25ndS5lZHUiLCJuYW1lIjoidmFydW5pa2FhIiwicm9sbE5vIjoiMjJjc3IyMzIiLCJhY2Nlc3NDb2RlIjoiam1wWmFGIiwiY2xpZW50SUQiOiI5YzVjYzBiNy00YmFmLTQ2NTEtOTJlYS1mNDhhYjIwYmU1NjUiLCJjbGllbnRTZWNyZXQiOiJRc1poc0piQ1NtbU5icFJEIn0.Q5jdAV01Pr6Zql-X5TCQHViMvFXI-83GHVBLlejWB3g`, // Replace with your actual token
      },
      timeout: 500, 
    });
    return response.data.numbers || [];
  } catch (error) {
    console.error(`Failed to fetch ${type} numbers:`, error.message);
    return [];
  }
};


const updateWindow = (newNumbers) => {
  if (newNumbers.length === 0) return;
  
  newNumbers.forEach((num) => {
    if (!numbersWindow.includes(num)) {
      numbersWindow.push(num);
    }
  });

  while (numbersWindow.length > windowSize) {
    numbersWindow.shift();
  }
};


app.get("/numbers/:type", async (req, res) => {
  const type = req.params.type;

  
  if (!apiUrls[type]) {
    return res.status(400).json({ error: "Invalid number type" });
  }

  
  const newNumbers = await fetchNumbers(type);

  
  
  const windowPrevState = [...numbersWindow];

 
  updateWindow(newNumbers);

  
  const avg = calculateAverage(numbersWindow);

 
  const response = {
    windowPrevState,
    windowCurrState: numbersWindow,
    numbers: newNumbers,
    avg: parseFloat(avg), 
  };

  
  res.json(response);
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
