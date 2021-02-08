import React, { useEffect, useState } from "react";
import "./RoomDetail.css";
import "react-calendar/dist/Calendar.css";
import { RouteComponentProps, useParams } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import {
  TimeRange,
  GetDateCaledar,
  DateReservedInfo,
  PostReserve,
  SuccessResponse,
} from "../api";

type DetailParam = {
  dateString: string;
};

type TimeSlotId = TimeRange;
type TimeSlotInfo = {
  name: string;
};
type TimeSlotInfos = Map<TimeSlotId, TimeSlotInfo>;

const TIME_SLOTS: TimeSlotInfos = new Map([
  ["DAY", { name: "12:00 - 17:00" }],
  ["EVENING", { name: "18:00 - 23:00" }],
  ["NIGHT", { name: "24:00 - 10:00" }],
]);

function pickEmpty(reservedInfo: DateReservedInfo): TimeSlotId | null {
  for (let key of Array.from(TIME_SLOTS.keys())) {
    if (reservedInfo.get(key as TimeSlotId) == undefined)
      return key as TimeSlotId;
  }
  return null;
}

function RoomDetail(props: RouteComponentProps<DetailParam>) {
  let [selectedTimeSlot, setTimeSlot] = useState<TimeSlotId>("DAY");
  let [dateString, setDateString] = useState<string>(
    props.match.params.dateString
  );
  let [timeSlotInfos, setTimeSlotInfos] = useState<TimeSlotInfos>(TIME_SLOTS);
  let [reservedInfo, setReservedInfo] = useState<DateReservedInfo>(new Map());

  useEffect(() => {
    GetDateCaledar(new Date(dateString), setReservedInfo);
  }, [dateString]);

  useEffect(() => {
    let emptySlot = pickEmpty(reservedInfo);
    if (emptySlot) {
      setTimeSlot(emptySlot);
    }
  }, [reservedInfo]);

  return (
    <div className="roomDetail">
      <p>ABCマンション中目黒の詳細</p>
      <h3>{dateString}</h3>

      <div
        onChange={(e) => handleChange(e, setTimeSlot)}
        className="radioButtons text-center"
      >
        {Array.from(timeSlotInfos.keys()).map((timeSlotId) => {
          return returnRadioButton(
            timeSlotId,
            timeSlotInfos,
            reservedInfo,
            selectedTimeSlot
          );
        })}
      </div>
      <div className="text-center">
        <Button
          variant="primary"
          onClick={(e) => handleSubmit(props, selectedTimeSlot, dateString)}
          size="lg"
        >
          予約する
        </Button>
      </div>
    </div>
  );
}

function handleSubmit(
  props: RouteComponentProps,
  selectedTimeSlot: TimeSlotId,
  dateString: string
) {
  console.log("submit!");
  console.log(selectedTimeSlot);
  console.log(dateString);
  PostReserve(dateString, selectedTimeSlot).then(
    (response: SuccessResponse | null) => {
      if (response == null) {
        window.alert("予約が失敗しました。");
      } else {
        window.alert("予約が完了しました。");
        props.history.push("/my/reservation");
      }
    }
  );
}

function handleChange(
  e: any,
  setTimeSlot: (timeSlot: TimeSlotId) => void
): void {
  setTimeSlot(e.target.value);
}

function returnRadioButton(
  timeSlotId: TimeSlotId,
  timeSlotInfos: TimeSlotInfos,
  reservedInfo: DateReservedInfo,
  selectedTimeSlot: TimeSlotId
): JSX.Element {
  return (
    <Form.Check
      type="radio"
      name={timeSlotInfos.get(timeSlotId)?.name}
      className="radioButton custom-control custom-radio"
      id={timeSlotId}
    >
      <Form.Check.Input
        type="radio"
        checked={selectedTimeSlot == timeSlotId}
        value={timeSlotId}
        disabled={reservedInfo.get(timeSlotId) != undefined}
        // className="custom-control-input"
      ></Form.Check.Input>
      <Form.Check.Label
      // className="custom-control-label"
      >
        {timeSlotInfos.get(timeSlotId)?.name}
      </Form.Check.Label>
    </Form.Check>
  );
}

// function isAble(reservedInfo: DateReservedInfo, timeSlotId: TimeSlotId) {
//   if (reservedInfo.get(timeSlotId) == undefined)) return false
// }

export default RoomDetail;
