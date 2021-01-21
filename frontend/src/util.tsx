

export function fetchGet(url: string, params: any): Promise<Response> {
  const qs = new URLSearchParams(params);
  return fetch(`${url}?${qs}`, {
    method: 'GET',
    mode: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}


export function dateString(date: Date) {
  var y = date.getFullYear();
  var m = ('00' + (date.getMonth()+1)).slice(-2);
  var d = ('00' + date.getDate()).slice(-2);
  return (y + '-' + m + '-' + d);
}



export function toMap(object: Object) {
  return new Map(Object.entries(object));
}