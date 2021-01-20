import React, { ChangeEvent, useEffect, useState } from "react";
import "./RoomDetail.css";
import Calendar, {
  CalendarTileProperties,
  DateCallback,
  MonthView,
} from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as H from "history";
import { RouteComponentProps, useParams } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

type DetailParam = {
  dateString: string;
};

type TimeSlotId = number;
type TimeSlotInfo = {
  name: string;
  status: boolean;
};
type TimeSlotInfos = Map<TimeSlotId, TimeSlotInfo>;



function pickEmpty(roomStatus: TimeSlotInfos): TimeSlotId | null {
  for (let key of Array.from(roomStatus.keys())) {
    if (roomStatus.get(key)?.status) return key;
  }
  return null;
}

const testRoomStatus: TimeSlotInfos = new Map([
  [1, { name: "12 - 17PM", status: false }],
  [2, { name: "18 - 23PM", status: true }],
  [3, { name: "24 - 05AM", status: true }],
]);

function RoomDetail(props: RouteComponentProps<DetailParam>) {
  let [selectedTimeSlot, setTimeSlot] = useState<TimeSlotId>(1);
  let [dateString, setDateString] = useState(props.match.params.dateString);
  let [roomStatus, setRoomStatus] = useState(new Map());

  useEffect(() => {
    setRoomStatus(testRoomStatus);
  }, [dateString]);

  return (
    <div className="roomDetail">
      <p>ABCマンション中目黒の詳細</p>
      <h3>{dateString}</h3>

      <div onChange={ (e) => handleChange(e, setTimeSlot) } className="radioButtons">
        {Array.from(roomStatus.keys()).map((timeSlotId) => {
          return returnRadioButton(timeSlotId, roomStatus, selectedTimeSlot);
        })}
      </div>
      <div className="text-center">
        <Button variant="primary" onClick={ (e) => handleSubmit(selectedTimeSlot, dateString) } size="lg">
          予約する
        </Button>
      </div>
    </div>
  );
}

function handleSubmit(selectedTimeSlot: TimeSlotId, dateString: string) {
  console.log("submit!");
  console.log(selectedTimeSlot);
  console.log(dateString);
  fetch("https://www.google.com/").then((response) => {
    console.log(response);
  });
}

function handleChange(
  e: any,
  setTimeSlot: (timeSlot: TimeSlotId) => void
): void {
  console.log(e.target.value);
  setTimeSlot(parseInt(e.target.value));
}

function returnRadioButton(
  timeSlotId: number,
  roomStatus: TimeSlotInfos,
  selectedTimeSlot: TimeSlotId
): JSX.Element {
  return (
    <Form.Check
      type="radio"
      label={roomStatus.get(timeSlotId)?.name}
      name={roomStatus.get(timeSlotId)?.name}
      value={timeSlotId}
      checked={selectedTimeSlot == timeSlotId}
      disabled={!roomStatus.get(timeSlotId)?.status}
      className="radioButton"
    />
  );
}


export default RoomDetail;
