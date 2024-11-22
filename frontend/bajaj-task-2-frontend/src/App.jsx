import React, { useState } from 'react';
import axios from './axios';  // Axios instance you created
import Select from 'react-select';

const App = () => {
  const [inputJSON, setInputJSON] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Dropdown options for displaying response data
  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase', label: 'Highest Lowercase Alphabet' },
  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate JSON
      const parsedInput = JSON.parse(inputJSON);

      // Send input JSON to the backend API
      const res = await axios.post('', parsedInput);
      setResponse(res.data);

      // Display dropdown with options
      setDropdownOptions(options);
    } catch (err) {
      setError('Invalid JSON input or API error.');
    }
  };

  // Render response data based on selected dropdown options
  const renderResponse = () => {
    if (!response) return null;

    const selectedData = selectedOptions.map((option) => response[option.value]);
    return (
      <div>
        <h3>Response Data:</h3>
        <pre>{JSON.stringify(selectedData, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>JSON Processor</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="6"
          style={{ width: '100%', marginBottom: '10px' }}
          placeholder='Enter JSON (e.g., { "data": ["A", "C", "z"] })'
          value={inputJSON}
          onChange={(e) => setInputJSON(e.target.value)}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Submit
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {dropdownOptions.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Select Data to Display:</h3>
          <Select
            isMulti
            options={dropdownOptions}
            onChange={(selected) => setSelectedOptions(selected)}
          />
        </div>
      )}

      {renderResponse()}
    </div>
  );
};

export default App;
