import React, { useEffect, useState } from "react";
import "./RoomCalendar.css";
import Calendar, {
  CalendarTileProperties,
  DateCallback,
  MonthView,
} from "react-calendar";
import * as H from "history";
import { RouteComponentProps, useHistory } from "react-router-dom";
import * as util from "../util";
import { CalendarResponse, TimeRange, GetMonthCalendar } from "../api";
import { FaBed, FaQuestion } from "react-icons/fa";
import { WiDaySunny, WiSunset, WiMoonWaxingCrescent4 } from "react-icons/wi";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { JsxExpression } from "typescript";

interface User {
  sessionToken: string;
}

function RoomCalendar() {
  let [user, setUser] = useState({ sessionToken: "test" });
  let [calendar, setReserved] = useState({ playground_id: 0, reserved: {} });
  useEffect(() => {
    GetMonthCalendar(setReserved);
  }, []);
  let history = useHistory();
  return (
    <Calendar
      // onChange={onChange}
      // value={value}
      tileContent={(props: CalendarTileProperties) =>
        tileContent(props, calendar)
      }
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

function tileContent(
  props: CalendarTileProperties,
  reserved: CalendarResponse
): JSX.Element {
  return (
    <div>
      {getStatusIcon("DAY", isReserved(props.date, "DAY", reserved))}
      {getStatusIcon("EVENING", isReserved(props.date, "NIGHT", reserved))}
      <br></br>
      {getStatusIcon("NIGHT", isReserved(props.date, "NIGHT", reserved))}
    </div>
  );
}

const iconMap = {
  DAY: <WiDaySunny></WiDaySunny>,
  EVENING: <WiMoonWaxingCrescent4></WiMoonWaxingCrescent4>,
  NIGHT: <FaBed></FaBed>,
  OTHER: <FaQuestion></FaQuestion>,
};

function getStatusIcon(timeRange: TimeRange, isReserved: boolean): JSX.Element {
  if (isReserved) {
    return <MdDoNotDisturbAlt></MdDoNotDisturbAlt>;
  }
  return iconMap[timeRange];
}

function isReserved(
  date: Date,
  timeRange: TimeRange,
  reserved: CalendarResponse
): boolean {
  return (
    util.dateString(date) in reserved.reserved &&
    timeRange in reserved.reserved[util.dateString(date)]
  );
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
