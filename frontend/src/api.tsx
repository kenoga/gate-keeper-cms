import * as util from "./util";


export type TimeRange = "DAY" | "EVENING" | "NIGHT" | "OTHER"

// export type DateReservedInfo = { [Property in TimeRange]: number }
export type DateReservedInfo = Map<TimeRange, number>

export type CalendarResponse = {
  playground_id: number
  reserved: { [date: string]: DateReservedInfo }
}

export type DateCalendarResponse = {
  playground_id: number
  date: Date
  reserved: DateReservedInfo
}



export function GetMonthCalendar(setCalendar: (res: CalendarResponse) => void) {
  let today = new Date()
  util.fetchGet('/api/calendar/1', { year: today.getFullYear(), month: today.getMonth()+1 })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch Reserved.')
    }
    return response.json()
  }).then((response: CalendarResponse) => {
    setCalendar(response);
    console.log(response);
  }).catch(error => {
    console.error(error);
  })
}


export function GetDateCaledar(date: Date, setCalendar: (res: DateReservedInfo) => void) {
  util.fetchGet(`/api/calendar/1/${util.dateString(date)}`, {})
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch date calendar')
    }
    return response.json()
  }).then((response: DateCalendarResponse) => {
    console.log(response.reserved);
    setCalendar(util.toMap(response.reserved) as DateReservedInfo);
    console.log(response);
  }).catch(error => {
    console.error(error);
  })
}


