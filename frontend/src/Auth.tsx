import React, { FC, ReactNode } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import User from './User';


type Props = {
  children: React.ReactNode
}

const Auth: React.FC<Props> = (props: Props) => {
  if (User.isLoggedIn()) {
    return <div>{props.children}</div>;
  }
  return <Redirect to={'/login'} />;
}


export default Auth;