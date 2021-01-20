import * as util from "./util";


export type TimeRange = "DAY" | "EVENING" | "NIGHT" | "OTHER"

export type ReservedResponse = {
  playground_id: number
  reserved: { [date: string]: { [time: string]: number } }
}

export function GetReserved(setReserved: (res: ReservedResponse) => void) {
  let today = new Date()
  util.fetchGet('/api/calendar/1', { year: today.getFullYear(), month: today.getMonth()+1 })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch Reserved.')
    }
    return response.json()
  }).then((response: ReservedResponse) => {
    setReserved(response);
    console.log(response);
  }).catch(error => {
    console.error(error);
  })
}

export default GetReserved