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
import {
  CalendarResponse,
  TimeRange,
  GetMonthCalendar,
  UserReservationCountResponse,
  GetUserReservationCount,
} from "../api";
import { FaBed, FaQuestion } from "react-icons/fa";
import { WiDaySunny, WiSunset, WiMoonWaxingCrescent4 } from "react-icons/wi";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { JsxExpression } from "typescript";
import { Col, Row } from "react-bootstrap";

interface User {
  sessionToken: string;
}

function RoomCalendar() {
  let [user, setUser] = useState({ sessionToken: "test" });
  let [calendar, setReserved] = useState({ playground_id: 0, reserved: {} });
  let [
    userReservationCount,
    setUserReservationCount,
  ] = useState<UserReservationCountResponse>({
    all_count: 0,
    simul_count: 0,
    all_limit: 0,
    simul_limit: 0,
  });

  useEffect(() => {
    GetMonthCalendar(setReserved);
    GetUserReservationCount(setUserReservationCount);
  }, []);
  let history = useHistory();
  return (
    <div>
      <Row>
        <Col xs="12" className="text-center">
          今月の合計予約数: {userReservationCount.all_count} /{" "}
          {userReservationCount.all_limit}
        </Col>
        <Col xs="12" className="text-center">
          今月の同時予約数: {userReservationCount.simul_count} /{" "}
          {userReservationCount.simul_limit}
        </Col>
      </Row>
      <Calendar
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
        view="month"
      />
    </div>
  );
}

function onClickDay(date: Date, history: H.History) {
  console.log(util.dateString(date));
  history.push(`/detail/${util.dateString(date)}`);
}

function tileContent(
  props: CalendarTileProperties,
  reserved: CalendarResponse
): JSX.Element {
  return (
    <div>
      {getStatusIcon("DAY", isReserved(props.date, "DAY", reserved))}
      {getStatusIcon("EVENING", isReserved(props.date, "EVENING", reserved))}
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

function tileDisabled(
  props: CalendarTileProperties & { activeStartDate: Date }
): boolean {
  if (props.date.getDate() <= new Date().getDate()) {
    return true;
  }
  return false;
}

export default RoomCalendar;
