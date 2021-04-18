import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { Button, Card, Container, Form, Image, Row } from "react-bootstrap";
import {
  UserInfo,
  GetUsers,
  Plan,
  GetPlans,
  UpdatePlan,
  CreateUser,
} from "../api";
import { Col } from "react-bootstrap";
import * as util from "../util";

const handlePlanChange = (userId: number, planId: number) => {
  UpdatePlan(userId, planId);
};

const handleUserCreate = (name: string, email: string, planId: number) => {
  CreateUser(name, email, planId);
};

function UserList() {
  let [users, setUsers] = useState<Array<UserInfo>>([]);
  let [plans, setPlans] = useState<Array<Plan>>([]);

  useEffect(() => {
    GetUsers(setUsers);
    GetPlans(setPlans);
  }, []);

  return (
    <Container className="p-3">
      <CreateUserView plans={plans}></CreateUserView>
      <h2 className="text-center">ユーザ一覧</h2>
      <div>{users.map((user) => User(user, plans))}</div>
    </Container>
  );
}

interface CreateUserViewProps {
  plans: Array<Plan>;
}
const CreateUserView: React.FC<CreateUserViewProps> = ({ plans }) => {
  let [name, setName] = useState<string>("");
  let [planId, setPlanId] = useState<number>(1);
  let [email, setEmail] = useState<string>("");

  return (
    <div>
      <h2 className="text-center">新規ユーザ作成</h2>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>お名前</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>メールアドレス</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PlanSelector
            plans={plans}
            initPlanId={1}
            setPlanId={setPlanId}
          ></PlanSelector>
        </Form.Group>

        <Row className="justify-content-center mt-5">
          <Col xs="4" md="2" className="text-center">
            <Button
              variant="primary"
              onClick={() => handleUserCreate(name, email, planId)}
            >
              ユーザを作成する
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

function User(user: UserInfo, plans: Array<Plan>) {
  var planId: number = user.plan.id;
  return (
    <div className="mt-3">
      <Card>
        <Card.Header>
          {user.name} ({user.id})
        </Card.Header>
        <Card.Body>
          <Card.Title>{user.email}</Card.Title>
          <Form>
            <PlanSelector
              plans={plans}
              initPlanId={user.plan.id}
              setPlanId={(newPlanId: number) => {
                planId = newPlanId;
              }}
            ></PlanSelector>
          </Form>

          <Button
            variant="primary"
            onClick={() => {
              handlePlanChange(user.id, planId);
            }}
          >
            プランを更新
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

interface PlanSelectorProps {
  plans: Array<Plan>;
  initPlanId: number;
  setPlanId: (planId: number) => void;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({
  plans,
  initPlanId,
  setPlanId,
}) => {
  var planId = initPlanId;
  return (
    <Form.Group controlId="exampleForm.ControlSelect1">
      <Form.Label>プラン</Form.Label>
      <Form.Control
        as="select"
        onChange={(e) => {
          planId = Number(e.target.value);
          setPlanId(planId);
        }}
      >
        {plans.map((plan: Plan) => {
          return (
            <option value={plan.id} selected={planId == plan.id}>
              {plan.name}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default UserList;
