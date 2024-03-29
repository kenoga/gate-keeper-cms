import * as util from "./util";

export type TimeRange = "DAY" | "EVENING" | "NIGHT" | "OTHER";

// export type DateReservedInfo = { [Property in TimeRange]: number }
export type DateReservedInfo = Map<TimeRange, number>;

export type CalendarResponse = {
  playground_id: number;
  reserved: { [date: string]: DateReservedInfo };
};

export type Plan = {
  id: number;
  name: string;
  monthly_limit: number;
  simul_limit: number;
};

export type UserInfo = {
  id: number;
  email: string;
  name: string;
  plan: Plan;
};

export type AdminDateReservedInfo = { [Property in TimeRange]: UserInfo };

export type AdminCalendarResponse = {
  playground_id: number;
  reserved: { [date: string]: AdminDateReservedInfo };
};

export type DateCalendarResponse = {
  playground_id: number;
  date: Date;
  reserved: DateReservedInfo;
};

type ReserveRequest = {
  playground_id: number;
  date: string;
  time_range: TimeRange;
};

export type SuccessResponse = {
  message: string;
};

type Playground = {
  id: number;
  name: string;
  description: string;
};

type GatewaySession = {
  gateway_id: number;
  user_id: number;
  reservation_id: number;
  start_at: Date;
  end_at: Date;
  token: string;
};

export type GatewayType = "ENTRANCE" | "DOOR";

export type Reservation = {
  id: number;
  user_id: number;
  playground: Playground;
  date: Date;
  start_at?: string;
  end_at?: string;
  time_range: TimeRange;
  gateway_sessions: Map<GatewayType, GatewaySession>;
};

type MyReservationResponse = {
  reservations: Reservation[];
};

type DoorStatus = "LOCKED" | "UNLOCKED";

type GatewayAction = "lock" | "unlock";

type GatewayStatusResponse = {
  gateway_id: number;
  status: DoorStatus;
};

type CreateUserResponse = {
  password: string;
};

export type UserProfileResponse = {
  name: string;
  email: string;
  plan: Plan;
};

export type UserListResponse = {
  user_list: Array<UserInfo>;
};

export function GetMonthCalendar(setCalendar: (res: CalendarResponse) => void) {
  let today = new Date();
  util
    .fetchGet("/api/calendar/1", {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch Reserved.");
      }
      return response.json();
    })
    .then((response: CalendarResponse) => {
      setCalendar(response);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function GetAdminMonthCalendar(
  setCalendar: (res: AdminCalendarResponse) => void
) {
  let today = new Date();
  return util
    .fetchGet("/api/admin/calendar/1", {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
    })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Permisson Denied.");
        }
        throw new Error("Failed to fetch Reserved.");
      }
      return response.json();
    })
    .then((response: AdminCalendarResponse) => {
      setCalendar(response);
      console.log(response);
    });
}

export function GetDateCaledar(
  date: Date,
  setCalendar: (res: DateReservedInfo) => void
) {
  util
    .fetchGet(`/api/calendar/1/${util.dateString(date)}`, {})
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch date calendar");
      }
      return response.json();
    })
    .then((response: DateCalendarResponse) => {
      console.log(response.reserved);
      setCalendar(util.toMap(response.reserved) as DateReservedInfo);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function PostReserve(
  dateString: string,
  timeRange: TimeRange
): Promise<SuccessResponse | null> {
  return util
    .fetchPost(`/api/reserve`, {
      playground_id: 1,
      date: dateString,
      time_range: timeRange,
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to reserve");
      }
      return response.json();
    })
    .then((response: SuccessResponse) => {
      console.log(response);
      return response;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

export function GetReservations(
  setReservations: (reservations: Reservation[]) => void
) {
  return util
    .fetchGet(`/api/user/reservations`, {})
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch my reservations.");
      }
      return response.json();
    })
    .then((response: MyReservationResponse) => {
      console.log(response);
      setReservations(response.reservations);
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

export function GetActiveReservation(
  setReservation: (reservation: Reservation) => void
) {
  return util
    .fetchGet(`/api/user/reservations/active`, {})
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch active reservation.");
      }
      return response.json();
    })
    .then((response: Reservation) => {
      console.log("reservation response");
      console.log(response);
      response.gateway_sessions = util.toMap(response.gateway_sessions) as Map<
        GatewayType,
        GatewaySession
      >;
      setReservation(response);
    });
}

export function ToggleGateway(
  key: string,
  action: GatewayAction,
  setOpened: (status: boolean) => void
) {
  return util
    .fetchPut(`/api/gateway/${action}`, {
      gateway_session_key: key,
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch toggle gateway.");
      }
      return response.json();
    })
    .then((response: GatewayStatusResponse) => {
      const status = response.status == "LOCKED" ? false : true;
      console.log(response);
      setOpened(status);
    })
    .then((error) => {
      console.error(error);
    });
}

export type UserReservationCountResponse = {
  all_count: number;
  simul_count: number;
  all_limit: number;
  simul_limit: number;
};

export function GetUserReservationCount(
  setReservationCount: (response: UserReservationCountResponse) => void
) {
  return util
    .fetchGet(`/api/user/reservations/count`, {})
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to get user reservation count.");
      }
      return response.json();
    })
    .then((response: UserReservationCountResponse) => {
      console.log(response);
      setReservationCount(response);
    })
    .then((error) => {
      console.error(error);
    });
}

export function GetUserProfile(
  setUserProfile: (response: UserProfileResponse) => void
) {
  return util
    .fetchGet(`/api/user/profile`, {})
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to get user profile.");
      }
      return response.json();
    })
    .then((response: UserProfileResponse) => {
      setUserProfile(response);
    })
    .then((error) => {
      console.error(error);
    });
}

export function PutEmailAndPassword(email: string, password: string) {
  return util
    .fetchPut(`/api/user/profile`, { email: email, password: password })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to put user profile.");
      }
      return response.json();
    })
    .then((response: SuccessResponse) => {
      console.log(response);
    })
    .then((error) => {
      console.error(error);
    });
}

export function GetUsers(setUsers: (response: Array<UserInfo>) => void) {
  return util
    .fetchGet(`/api/admin/user`, {})
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to get users.");
      }
      return response.json();
    })
    .then((response: UserListResponse) => {
      console.log(response);
      setUsers(response.user_list);
    })
    .then((error) => {
      console.error(error);
    });
}

export function GetPlans(setPlans: (response: Array<Plan>) => void) {
  return util
    .fetchGet(`/api/admin/plan`, {})
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to get plan.");
      }
      return response.json();
    })
    .then((response: Array<Plan>) => {
      console.log(response);
      setPlans(response);
    })
    .then((error) => {
      console.error(error);
    });
}

export function UpdatePlan(userId: number, planId: number) {
  return util
    .fetchPut("/api/admin/user/plan", { user_id: userId, plan_id: planId })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update user plan.");
      }
      return response.json();
    })
    .then((response: SuccessResponse) => {
      window.alert(`User ID: ${userId}のプランを更新しました。`);
      console.log(response);
    })
    .then((error) => {
      console.error(error);
    });
}

export function CreateUser(name: string, email: string, planId: number) {
  return util
    .fetchPost("/api/admin/user", { name: name, email: email, plan_id: planId })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to create user.");
      }
      return response.json();
    })
    .then((response: CreateUserResponse) => {
      window.alert(
        `${name} (${email})のアカウントを作成しました。初期パスワードは '${response.password}' です。ログイン後、パスワードを変更するように伝えてください。`
      );
    })
    .then((error) => {
      console.error(error);
    });
}

export function AdminPostReserve(
  dateString: string,
  timeRange: TimeRange,
  userId: number
): Promise<SuccessResponse | null> {
  return util
    .fetchPost(`/api/admin/reserve`, {
      playground_id: 1,
      date: dateString,
      time_range: timeRange,
      user_id: userId,
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to reserve");
      }
      return response.json();
    })
    .then((response: SuccessResponse) => {
      console.log(response);
      return response;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}
