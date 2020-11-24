import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function App() {
  // const [value, onChange] = useState(new Date());
  return (
    <div className="App">
      <div>
        
      </div>
      <Calendar
        // onChange={onChange}
        // value={value}
      />
    </div>
  );
}

export default App;
