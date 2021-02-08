import React, { useEffect, useState } from "react";
import "./MyReservation.css";
import "react-calendar/dist/Calendar.css";
import { RouteComponentProps, useParams } from "react-router-dom";
import { Button, Card, Form, Image, Row } from "react-bootstrap";
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
      <h2 className="text-center">予約一覧</h2>
      <div className="reservationContents pt-3">
        {reservations.map((reservation) => {
          return reservationContent(reservation, props);
        })}
      </div>
    </div>
  );
}

function isEble(reservation: Reservation): boolean {
  let now = new Date();
  if (reservation.start_at == null || reservation.end_at == null) {
    return false;
  }
  return (
    new Date(reservation.start_at) <= now && now <= new Date(reservation.end_at)
  );
}

function reservationContent(
  reservation: Reservation,
  props: RouteComponentProps
) {
  return (
    <Row className="justify-content-center mb-3">
      <Col xs="11" lg="8">
        <Card>
          <Card.Img
            variant="top"
            src="https://cdn.autoc-one.jp/images/article/201910/21141552266_d5a8_o.jpg"
          />
          <Card.Body>
            <Card.Title>
              {util.dateStringForDisp(reservation.start_at!!)}
              {"  "}
              {util.timeStrFromStrForDisp(reservation.start_at)} ~{" "}
              {util.timeStrFromStrForDisp(reservation.end_at)}
            </Card.Title>
            <Card.Text>{reservation.playground.name}</Card.Text>
            {!isEble(reservation) && (
              <Card.Text>
                <small className="text-muted">
                  予約時間内になると鍵ページにアクセスできます
                </small>
              </Card.Text>
            )}

            {isEble(reservation) && (
              <Button
                variant="primary"
                block
                onClick={() => props.history.push("/my/key")}
              >
                鍵ページへ
              </Button>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default MyReservation;
