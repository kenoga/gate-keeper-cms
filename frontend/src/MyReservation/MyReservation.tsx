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
} from "../api";
import { Col } from "react-bootstrap";

function MyReservation(props: RouteComponentProps) {
  return (
    <div className="myReservation">
      <h1>予約一覧</h1>
      <div className="reservationContents">
        <Row className="justify-content-center">
          <Col xs="11">
            <Row>
              <Col xs="3" md="2" lg="1">
                2022/2/22
              </Col>
              <Col xs="6">12:00 ~ 18:00</Col>
            </Row>

            <Row>
              <Col>目黒邸宅</Col>
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
              <Col xs="8">
                <Button variant="primary" block>
                  鍵ページにアクセス
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        {/* loop this */}
        
        <Row className="justify-content-center">
          <Col xs="11">
            <Row>
              <Col xs="3" md="2" lg="1">
                2022/2/22
              </Col>
              <Col xs="6">12:00 ~ 18:00</Col>
            </Row>

            <Row>
              <Col>目黒邸宅</Col>
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
              <Col xs="8">
                <Button variant="primary" block>
                  鍵ページにアクセス
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

      </div>
    </div>
  );
}

export default MyReservation;
