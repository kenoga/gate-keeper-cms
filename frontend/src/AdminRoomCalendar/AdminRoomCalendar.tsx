import React, { useEffect, useState } from "react";
import "./AdminRoomCalendar.css";
import Calendar, {
  CalendarTileProperties,
  DateCallback,
  MonthView,
} from "react-calendar";
import * as H from "history";
import { RouteComponentProps, useHistory } from "react-router-dom";
import * as util from "../util";
import {
  CalendarResponse,
  TimeRange,
  GetAdminMonthCalendar,
  UserReservationCountResponse,
  GetUserReservationCount,
  AdminCalendarResponse,
} from "../api";
import { FaBed, FaQuestion } from "react-icons/fa";
import { WiDaySunny, WiSunset, WiMoonWaxingCrescent4 } from "react-icons/wi";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { JsxExpression } from "typescript";
import { Col, Row } from "react-bootstrap";
import UserList from "../UserList/UserList";

interface User {
  sessionToken: string;
}

function AdminRoomCalendar() {
  let [user, setUser] = useState({ sessionToken: "test" });
  let [calendar, setReserved] = useState({ playground_id: 0, reserved: {} });

  let history = useHistory();
  useEffect(() => {
    GetAdminMonthCalendar(setReserved).catch((error) =>
      util.showErrorAndRedirect(error, history, "/")
    );
  }, []);
  return (
    <div>
      <h2 className="text-center">管理画面</h2>
      <Calendar
        tileContent={(props: CalendarTileProperties) =>
          tileContent(props, calendar)
        }
        onClickDay={(date: Date) => onClickDay(date, history)}
        showNeighboringMonth={false}
        tileDisabled={tileDisabled}
        view="month"
      />
      <UserList></UserList>
    </div>
  );
}

function onClickDay(date: Date, history: H.History) {
  history.push(`/admin/detail/${util.dateString(date)}`);
}

function tileContent(
  props: CalendarTileProperties,
  reserved: AdminCalendarResponse
): JSX.Element {
  return (
    <div>
      {isReserved(props.date, "DAY", reserved) &&
        iconWithName(props.date, "DAY", reserved)}
      {isReserved(props.date, "EVENING", reserved) &&
        iconWithName(props.date, "EVENING", reserved)}
      {isReserved(props.date, "NIGHT", reserved) &&
        iconWithName(props.date, "NIGHT", reserved)}
    </div>
  );
}

const iconMap = {
  DAY: <WiDaySunny></WiDaySunny>,
  EVENING: <WiMoonWaxingCrescent4></WiMoonWaxingCrescent4>,
  NIGHT: <FaBed></FaBed>,
  OTHER: <FaQuestion></FaQuestion>,
};

function isReserved(
  date: Date,
  timeRange: TimeRange,
  reserved: AdminCalendarResponse
): boolean {
  return (
    util.dateString(date) in reserved.reserved &&
    timeRange in reserved.reserved[util.dateString(date)]
  );
}

function iconWithName(
  date: Date,
  timeRange: TimeRange,
  reserved: AdminCalendarResponse
): JSX.Element {
  return (
    <p>
      {iconMap[timeRange]}
      <br></br>
      <p className="calendar-user-name">
        {reserved.reserved[util.dateString(date)][timeRange].name}
      </p>
    </p>
  );
}

function tileDisabled(
  props: CalendarTileProperties & { activeStartDate: Date }
): boolean {
  const today_start = new Date();
  today_start.setHours(0, 0, 0, 0);
  if (props.date < today_start) {
    return true;
  }
  return false;
}

export default AdminRoomCalendar;
