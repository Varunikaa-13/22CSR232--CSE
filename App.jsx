import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const windowSize = 10;

function App() {
  const [numberType, setNumberType] = useState('e'); 
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [windowCurrState, setWindowCurrState] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [avg, setAvg] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNumbers = async (type) => {
    try {
      const response = await axios.get(`http://localhost:9876/numbers/${type}`, {
        timeout: 800,
      });
      return response.data.numbers || [];
    } catch (error) {
      console.error('Error fetching numbers:', error.message);
      return [];
    }
  };

  const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return (sum / numbers.length).toFixed(2);
  };

  const handleRequest = async () => {
    setLoading(true);
    setError('');
    try {
      const newNumbers = await fetchNumbers(numberType);

      if (newNumbers.length === 0) {
        setError('No numbers received or API timed out.');
        setLoading(false);
        return;
      }

      const windowPrev = [...windowCurrState];
      let updatedWindow = [...windowCurrState];

      newNumbers.forEach((num) => {
        if (!updatedWindow.includes(num)) {
          updatedWindow.push(num);
        }
      });

      while (updatedWindow.length > windowSize) {
        updatedWindow.shift();
      }

      setWindowPrevState(windowPrev);
      setWindowCurrState(updatedWindow);
      setNumbers(newNumbers);
      setAvg(calculateAverage(updatedWindow));
    } catch (err) {
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Average Calculator</h1>

      <div>
        <label htmlFor="numberType">Select Number Type: </label>
        <select
          id="numberType"
          value={numberType}
          onChange={(e) => setNumberType(e.target.value)}
        >
          <option value="p">Prime</option>
          <option value="f">Fibonacci</option>
          <option value="e">Even</option>
          <option value="r">Random</option>
        </select>
      </div>

      <button onClick={handleRequest} disabled={loading}>
        {loading ? 'Loading...' : 'Get Numbers'}
      </button>

      {error && <div className="error">{error}</div>}

      {windowCurrState.length > 0 && (
        <div className="result">
          <h3>Response</h3>
          <p><strong>Window Previous State:</strong> {JSON.stringify(windowPrevState)}</p>
          <p><strong>Window Current State:</strong> {JSON.stringify(windowCurrState)}</p>
          <p><strong>Numbers Received:</strong> {JSON.stringify(numbers)}</p>
          <p><strong>Average:</strong> {avg}</p>
        </div>
      )}
    </div>
  );
}

export default App;
