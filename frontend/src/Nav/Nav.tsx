import { Form, Nav, Navbar } from "react-bootstrap";
import React from "react";
import "./Nav.css";
import { Link, useHistory } from "react-router-dom";
import * as H from "history";
import User from "../User";

function Navigation() {
  return (
    <Navbar expand="lg">
      <Navbar.Brand href="/">
        <img src="/venture_growth_icon.png" width="60px"></img>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">ホーム</Nav.Link>
          <Nav.Link href="/my/reservation">予約一覧</Nav.Link>
          <Nav.Link href="/my/page">マイページ</Nav.Link>
          {User.isLoggedIn() && (
            <Nav.Link onClick={User.logout}>ログアウト</Nav.Link>
          )}
          {User.isAdmin() && <Nav.Link href="/admin">管理画面</Nav.Link>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
