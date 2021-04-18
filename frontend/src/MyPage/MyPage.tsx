import React, { useEffect, useState } from "react";
import "./MyPage.css";
import "react-calendar/dist/Calendar.css";
import { RouteComponentProps, useParams } from "react-router-dom";
import { Button, Card, Container, Form, Image, Row } from "react-bootstrap";
import { GetReservations, Reservation } from "../api";
import { Col } from "react-bootstrap";
import * as util from "../util";
import * as api from "../api";

type ChangeEmailAndPasswordRequest = {
  email: string;
  password: string;
  password2: string;
};

const handleSubmit = (
  e: React.MouseEvent,
  params: ChangeEmailAndPasswordRequest
) => {
  if (params.password.length >= 1 && params.password.length <= 6) {
    window.alert("パスワード変更する場合は7文字以上で設定してください。");
    return;
  }
  if (params.password !== params.password2) {
    window.alert("パスワードとパスワード (再入力)が一致しません。");
    return;
  }
  api.PutEmailAndPassword(params.email, params.password).then(() => {
    window.alert("Email、またはパスワードの変更に成功しました。");
  });
};

function MyPage(props: RouteComponentProps) {
  let [reservations, setReservations] = useState<Reservation[]>([]);
  let [name, setName] = useState<string>("");
  let [planName, setPlanName] = useState<string>("");
  let [email, setEmail] = useState<string>("");
  let [password, setPassword] = useState<string>("********");
  let [password2, setPassword2] = useState<string>("********");

  useEffect(() => {
    // TODO: call api
    GetReservations(setReservations);
    api.GetUserProfile((response: api.UserProfileResponse) => {
      setName(response.name);
      setPlanName(response.plan_name);
      setEmail(response.email);
    });
  }, []);

  return (
    <Container className="myReservation p-3">
      <h2 className="text-center">マイページ</h2>

      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>お名前</Form.Label>
          <Form.Text>{name}</Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>プラン</Form.Label>
          <Form.Text>{planName}</Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>メールアドレス</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>パスワード</Form.Label>
          <Form.Control
            type="password"
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>パスワード (再入力)</Form.Label>
          <Form.Control
            type="password"
            placeholder="********"
            onChange={(e) => setPassword2(e.target.value)}
          />
        </Form.Group>
      </Form>

      <Row className="justify-content-center mt-5">
        <Col xs="4" md="2" className="text-center">
          <Button
            variant="primary"
            onClick={(e) =>
              handleSubmit(e, {
                email: email,
                password: password,
                password2: password2,
              })
            }
          >
            保存する
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default MyPage;
