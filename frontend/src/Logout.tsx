import userEvent from "@testing-library/user-event";
import React, { FC, ReactNode } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";
import User from "./User";

type Props = {};

const handleSubmit = (e: React.MouseEvent, props: RouteComponentProps) => {
  console.log("submit!");
  User.logout();
  props.history.push("/login");
};

const Logout: React.FC<RouteComponentProps> = (props) => (
  <Row className="mt-5">
    <Col className="text-center">
      <Button
        size="lg"
        variant="primary"
        onClick={(e) => {
          handleSubmit(e, props);
        }}
      >
        Logout
      </Button>
    </Col>
  </Row>
);

export default Logout;
