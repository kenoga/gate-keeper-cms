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
import DisableRadioButtons, {
  IdAndValue,
} from "../Components/DisableRadioButtons";

type DetailParam = {
  dateString: string;
};

type TimeSlotId = TimeRange;
type TimeSlotInfo = {
  name: string;
};

const TIME_SLOTS: IdAndValue<TimeSlotId>[] = [
  { id: "DAY", value: "12:00 - 17:00 (使用枠数1)" },
  { id: "EVENING", value: "18:00 - 23:00 (使用枠数1)" },
  { id: "NIGHT", value: "24:00 - 10:00 (使用枠数2)" },
];

function pickEmpty(reservedInfo: DateReservedInfo): TimeSlotId | null {
  for (let idAndValue of TIME_SLOTS) {
    if (reservedInfo.get(idAndValue.id) == undefined) return idAndValue.id;
  }
  return null;
}

function RoomDetail(props: RouteComponentProps<DetailParam>) {
  let [selectedTimeSlot, setTimeSlot] = useState<TimeSlotId>("DAY");
  let [dateString, setDateString] = useState<string>(
    props.match.params.dateString
  );
  let [reservedInfo, setReservedInfo] = useState<DateReservedInfo>(new Map());

  useEffect(() => {
    GetDateCaledar(new Date(dateString), setReservedInfo);
  }, [dateString]);

  useEffect(() => {
    console.log("reservedInfo", reservedInfo);
    console.log(reservedInfo.get("NIGHT"));
    let emptySlot = pickEmpty(reservedInfo);
    if (emptySlot) {
      setTimeSlot(emptySlot);
    }
  }, [reservedInfo]);

  return (
    <div className="roomDetail">
      <p>ABCマンション中目黒の詳細</p>
      <h3>{dateString}</h3>

      <DisableRadioButtons
        values={TIME_SLOTS}
        isDisable={(id: TimeSlotId) => {
          return reservedInfo.get(id) != null;
        }}
        selectedId={selectedTimeSlot}
        setSelectedId={setTimeSlot}
      ></DisableRadioButtons>

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

export default RoomDetail;
