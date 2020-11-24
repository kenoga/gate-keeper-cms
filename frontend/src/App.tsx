import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Calendar, { CalendarTileProperties, DateCallback, MonthView } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function App() {
  // const [value, onChange] = useState(new Date());
  return (
    <div className="App">
      <div>
        <Calendar
          // onChange={onChange}
          // value={value}
          tileContent={tileContent}
          onClickDay={onClickDay}
          activeStartDate={new Date()}
          showNeighboringMonth={false}
          tileDisabled={tileDisabled}
          prevLabel=""
          prev2Label=""
          nextLabel=""
          next2Label=""
        />
      </div>
    </div>
  );
}

function onClickDay(date: Date) {
  console.log(date)
}

function tileContent(props: CalendarTileProperties): JSX.Element {
  return (
    <div>
      <p>12-17</p>
      <p>18-23</p>
      <p>24-10</p>
    </div>
  )
}

function tileDisabled(props: CalendarTileProperties & { activeStartDate: Date }): boolean {
  if (props.date.getDate() < new Date().getDate()) { return true }
  return false
}

export default App;
