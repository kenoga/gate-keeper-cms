import React, { ChangeEvent, useState } from "react";
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
  name: string,
  status: boolean
};
type TimeSlotInfos = Map<TimeSlotId, TimeSlotInfo>

type State = {
  selectedTimeSlot: TimeSlotId | null,
  dateString: string,
  roomStatus: TimeSlotInfos 
}

function pickEmpty(roomStatus: TimeSlotInfos): TimeSlotId | null {
  for (let key of Array.from(roomStatus.keys())) {
    if (roomStatus.get(key)?.status) return key
  }
  return null
}

const testRoomStatus: TimeSlotInfos = new Map([
  [1, { name: "12 - 17PM", status: false}],
  [2, { name: "18 - 23PM", status: true}],
  [3, { name: "24 - 05AM", status: true}],
])

class RoomDetail extends React.Component<RouteComponentProps<DetailParam>, State> {
  constructor(props: RouteComponentProps<DetailParam>) {
    super(props);
    this.state = { selectedTimeSlot: null, dateString: props.match.params.dateString, roomStatus: new Map() };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.setState({ roomStatus: testRoomStatus })
  }

  handleSubmit() {
    console.log("submit!");
    console.log(this.state.selectedTimeSlot)
    console.log(this.state.dateString)
    fetch("https://www.google.com/").then((response) => { console.log(response)});
  }

  handleChange(e: ChangeEvent<HTMLInputElement>): void {
    console.log(e.target.value)
    this.setState({selectedTimeSlot: parseInt(e.target.value)})
  }

  returnRadioButton(timeSlotId: number): JSX.Element {
    return (
    <Form.Check
      type="radio"
      label={this.state.roomStatus.get(timeSlotId)?.name}
      name={this.state.roomStatus.get(timeSlotId)?.name}
      value={timeSlotId}
      checked={this.state.selectedTimeSlot == timeSlotId}
      disabled={!this.state.roomStatus.get(timeSlotId)?.status}
      className="radioButton"
     />
    )
  }

  render(): JSX.Element {
    return (
      <div className="roomDetail">
        <p>ABCマンション中目黒の詳細</p>
        <h3>{this.state.dateString}</h3>
        
        <div onChange={this.handleChange} className="radioButtons">
          {Array.from(
            this.state.roomStatus.keys()
            ).map((timeSlotId) => { return this.returnRadioButton(timeSlotId) })
          }
        </div>
        <div className="text-center">
          <Button variant="primary" onClick={this.handleSubmit} size="lg">
            予約する
          </Button>
        </div>

      </div>
    );
  }
}

export default RoomDetail;
