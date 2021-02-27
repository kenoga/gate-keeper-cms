import { RouteComponentProps } from "react-router-dom";

import React, { useEffect, useState } from "react";
import "./Key.css";
import { Card, Col, Row, ToggleButton } from "react-bootstrap";
import { Button, FormControlLabel, Switch } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { GetActiveReservation, Reservation, ToggleGateway } from "../api";

function Key(props: RouteComponentProps) {
  let [doorOpened, setDoorOpened] = useState<boolean>(false);
  let [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    GetActiveReservation(setReservation).catch((error) => {
      console.error(error);
      window.alert("現在有効な予約がありません。");
      props.history.push("/my/reservation");
    });
  }, []);

  return (
    <div className="myKey">
      {reservation && (
        <div>
          <h2 className="text-center">目黒マンション</h2>
          <Row className="justify-content-center my-3">
            <Col xs="11">
              <Card>
                <Card.Body>
                  <Card.Title>エントランス</Card.Title>
                  <Button variant="contained" color="primary" fullWidth>
                    解錠
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="justify-content-center my-3">
            <Col xs="11">
              <Card>
                <Card.Body>
                  <Card.Title>玄関</Card.Title>
                  <FormControlLabel
                    control={
                      <Switch
                        size="medium"
                        checked={doorOpened}
                        onChange={(e) =>
                          toggleDoor(reservation!!, doorOpened, setDoorOpened)
                        }
                      ></Switch>
                    }
                    label={doorOpened.toString()}
                  ></FormControlLabel>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

function toggleDoor(
  reservation: Reservation,
  opened: boolean,
  setDoorOpened: (doorOpened: boolean) => void
) {
  const token: string | undefined = reservation.gateway_sessions.get("DOOR")
    ?.token;
  if (token == null) {
    console.error("There is no door key.");
    return;
  } else {
    ToggleGateway(token, opened ? "lock" : "unlock", setDoorOpened);
  }
}

export default Key;
