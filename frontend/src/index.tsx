import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import RoomCalendar from "./RoomCalendar/RoomCalendar";
import AdminRoomCalendar from "./AdminRoomCalendar/AdminRoomCalendar";
import RoomDetail from "./RoomDetail/RoomDetail";
import Key from "./Key/Key";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Link, Route, Router } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import Navigation from "./Nav/Nav";

// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import Switch from "react-bootstrap/esm/Switch";
import Login from "./Login";
import Auth from "./Auth";
import MyReservation from "./MyReservation/MyReservation";
import MyPage from "./MyPage/MyPage";

ReactDOM.render(
  <React.StrictMode>
    <Container>
      <BrowserRouter>
        <Navigation></Navigation>
        <Auth>
          <Switch>
            <Route exact path="/" component={RoomCalendar} />
            <Route exact path="/my/reservation" component={MyReservation} />
            <Route exact path="/my/page" component={MyPage} />
            <Route exact path="/my/key" component={Key} />
            <Route path="/detail/:dateString" component={RoomDetail} />
            <Route path="/admin" component={AdminRoomCalendar} />
          </Switch>
        </Auth>
        <Route path="/login" component={Login} />
      </BrowserRouter>
    </Container>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
