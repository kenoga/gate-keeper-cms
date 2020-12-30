
import { Button, Container, Form, FormControl, Nav, Navbar, NavDropdown } from "react-bootstrap";
import React from 'react';
import './Nav.css'
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">Gatekeeper</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">ホーム</Nav.Link>
          <Nav.Link href="/mypage">マイページ</Nav.Link>
          <Nav.Link href="/logout">ログアウト</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation
