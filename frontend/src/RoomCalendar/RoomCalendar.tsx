import React, { useEffect, useState } from "react";
import "./RoomCalendar.css";
import Calendar, {
  CalendarTileProperties,
  DateCallback,
  MonthView,
} from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as H from "history";
import { RouteComponentProps, useHistory } from "react-router-dom";
import * as util from "../util"
import GetReserved, { ReservedResponse, TimeRange } from "../api";

interface User {
  sessionToken: string;
}

function RoomCalendar() {
  let [user, setUser] = useState({ sessionToken: "test" });
  let [reserved, setReserved] = useState({ playground_id: 0, reserved: {} });
  useEffect(() => {
    GetReserved(setReserved);
  }, [reserved.playground_id]);
  let history = useHistory();
  return (
    <Calendar
      // onChange={onChange}
      // value={value}
      tileContent={ (props: CalendarTileProperties) => tileContent(props, reserved) }
      onClickDay={(date: Date) => onClickDay(date, history)}
      activeStartDate={new Date()}
      showNeighboringMonth={false}
      tileDisabled={tileDisabled}
      prevLabel=""
      prev2Label=""
      nextLabel=""
      next2Label=""
    />
  );
}

function onClickDay(date: Date, history: H.History) {
  console.log(formatDate(date));
  history.push(`/detail/${formatDate(date)}`);
}

function tileContent(props: CalendarTileProperties, reserved: ReservedResponse): JSX.Element {
  return (
    <div>
      {!isReserved(props.date, "DAY", reserved) && <p>12-17</p>}
      {!isReserved(props.date, "EVENING", reserved) && <p>18-23</p>}
      {!isReserved(props.date, "NIGHT", reserved) && <p>24-10</p>}
    </div>
  );
}


function isReserved(date: Date, timeRange: TimeRange, reserved: ReservedResponse): boolean {
  return (util.dateString(date) in reserved.reserved) && (timeRange in reserved.reserved[util.dateString(date)])
}

function formatDate(date: Date): string {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function tileDisabled(
  props: CalendarTileProperties & { activeStartDate: Date }
): boolean {
  if (props.date.getDate() < new Date().getDate()) {
    return true;
  }
  return false;
}

export default RoomCalendar;
