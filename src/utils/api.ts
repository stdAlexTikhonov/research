export const post = async (url: string, data: any) => {
  const response = await fetch(process.env.REACT_APP_SURVEY_BACK + url, {
    credentials: "same-origin", // параметр определяющий передвать ли разные сессионные данные вместе с запросом
    method: "POST", // метод POST
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // типа запрашиаемого документа
  });
  return response.json();
};

export const generateUID = () => {
  return (
    "_" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getFullList = (code: string, obj: any) => {
  obj[code].forEach((item: any, i: number) => {
    if (obj[item]) obj[code] = obj[code].concat(obj[item]);
  });

  return obj[code].slice();
};

export const get = async (url: string) => {
  const response = await fetch(process.env.REACT_APP_SURVEY_BACK + url, {
    credentials: "same-origin", // параметр определяющий передвать ли разные сессионные данные вместе с запросом
    method: "GET", // метод POST
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};
