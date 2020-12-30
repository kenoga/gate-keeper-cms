import userEvent from '@testing-library/user-event';
import React, { FC, ReactNode } from 'react';
import { Button } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import User from './User';

type Props = {
}


const handleSubmit = (e: React.MouseEvent, props: RouteComponentProps) => {
    console.log("submit!");
    User.login('test', 'test');
    props.history.push("/")
    window.location.reload(); // ページを再レンダリングしてるのでよくない。
}


const Login: React.FC<RouteComponentProps> = (props) => 
    <div className="text-center">
        <Button size="lg" onClick={(e) => {handleSubmit(e, props)}}>Login</Button>
    </div>


export default Login;