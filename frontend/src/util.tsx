export function fetchGet(url: string, params: any): Promise<Response> {
  const qs = new URLSearchParams(params);
  return fetch(`${url}?${qs}`, {
    method: "GET",
    mode: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function fetchPost(url: string, params: any): Promise<Response> {
  return fetch(`${url}`, {
    method: "POST",
    mode: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
}

export function fetchPut(url: string, params: any): Promise<Response> {
  return fetch(`${url}`, {
    method: "PUT",
    mode: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
}

export function dateString(date: Date) {
  var y = date.getFullYear();
  var m = ("00" + (date.getMonth() + 1)).slice(-2);
  var d = ("00" + date.getDate()).slice(-2);
  return y + "-" + m + "-" + d;
}

export function timeStrFromStrForDisp(datestr?: string) {
  if (!datestr) {
    return "";
  }
  const date = new Date(datestr);
  return `${date.getHours()}:${date.getMinutes()}`;
}

export function toMap(object: Object) {
  return new Map(Object.entries(object));
}
