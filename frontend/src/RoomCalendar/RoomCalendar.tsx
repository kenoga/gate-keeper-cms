import React, { useState } from 'react';
import './RoomCalendar.css';
import Calendar, { CalendarTileProperties, DateCallback, MonthView } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import * as H from 'history'
import { RouteComponentProps, useHistory } from 'react-router-dom';

interface User {
  sessionToken: string
}

function RoomCalendar() {
  let [user, setUser] = useState({ sessionToken: "test"})
  let history = useHistory()
  return (
      <Calendar
        // onChange={onChange}
        // value={value}
        tileContent={tileContent}
        onClickDay={(date: Date) => onClickDay(date, history)}
        activeStartDate={new Date()}
        showNeighboringMonth={false}
        tileDisabled={tileDisabled}
        prevLabel=""
        prev2Label=""
        nextLabel=""
        next2Label=""
      />
  )
} 

function onClickDay(date: Date, history: H.History) {
  console.log(formatDate(date))
  history.push(`/detail/${formatDate(date)}`)
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

function formatDate(date: Date): string {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

function tileDisabled(props: CalendarTileProperties & { activeStartDate: Date }): boolean {
  if (props.date.getDate() < new Date().getDate()) { return true }
  return false
}

export default RoomCalendar;
