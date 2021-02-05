import React, { useEffect, useState } from "react";
import "./MyReservation.css";
import "react-calendar/dist/Calendar.css";
import { RouteComponentProps, useParams } from "react-router-dom";
import { Button, Form, Image, Row } from "react-bootstrap";
import {
  TimeRange,
  GetDateCaledar,
  DateReservedInfo,
  PostReserve,
  SuccessResponse,
  GetReservations,
  Reservation,
} from "../api";
import { Col } from "react-bootstrap";
import * as util from "../util";

function MyReservation(props: RouteComponentProps) {
  let [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    // TODO: call api
    GetReservations(8, setReservations);
  }, []);

  return (
    <div className="myReservation">
      <h1 className="text-center">予約一覧</h1>
      <div className="reservationContents">
        {reservations.map((reservation) => {
          return reservationContent(reservation, props);
        })}
      </div>
    </div>
  );
}

function reservationContent(
  reservation: Reservation,
  props: RouteComponentProps
) {
  return (
    <Row className="justify-content-center">
      <Col xs="11">
        <Row>
          <Col xs="4" md="3" lg="2">
            {reservation.date}
          </Col>
          <Col xs="6">
            {util.timeStrFromStrForDisp(reservation.start_at)} ~{" "}
            {util.timeStrFromStrForDisp(reservation.end_at)}
          </Col>
        </Row>

        <Row>
          <Col>{reservation.playground.name}</Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs="10">
            <Image
              width="100%"
              src="https://cdn.autoc-one.jp/images/article/201910/21141552266_d5a8_o.jpg"
            ></Image>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs="10">
            <Button
              variant="primary"
              block
              onClick={() => props.history.push("/my/key")}
            >
              鍵ページにアクセス
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default MyReservation;
