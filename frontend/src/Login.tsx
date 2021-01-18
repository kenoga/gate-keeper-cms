import React, { FC, ReactNode, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";
import User from "./User";

type Props = {};

type LoginRequest = {
  email: string,
  password: string
}

const handleSubmit = (e: React.MouseEvent, props: RouteComponentProps, params: LoginRequest) => {
  console.log("submit!");
  fetch('/api/login', {
    method: 'POST',
    mode: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)

  }).then(response => {
    if (!response.ok)  {
      if (response.status === 401) {
      throw new Error('Wrong email and password.')
      }
      throw new Error('Failed to request.')
    }
    return response.json()
  }).then(json => {
    User.login("test", "test");
    props.history.push("/");
    window.location.reload();
  }).catch(error => {
    console.error(error);
  })
};


const Login: React.FC<RouteComponentProps> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  return <div className="text-center">
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>メールアドレス</Form.Label>
        <Form.Control type="email" placeholder="Enter email" onChange={ (e) => setEmail(e.target.value) } />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>パスワード</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={ (e) => setPassword(e.target.value) }/>
      </Form.Group>
    </Form>

    <Button
      size="lg"
      onClick={(e) => {
        handleSubmit(e, props, { email: email, password: password });
      }}
    >
      ログイン
    </Button>
  </div>
};

export default Login;
