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

export const commonTransform = (data: any) => {
  const test = data.Questionary.reduce(
    (a: any, b: any, i: number, arr: any) => {
      const code = b.code;
      const acc = a[`${b.parent_code}`];

      return {
        ...a,
        [`${b.parent_code}`]: acc
          ? acc.includes(code)
            ? acc
            : acc.concat([code])
          : [code],
      };
    },
    {}
  );

  const test_keys = Object.keys(test).reverse();

  const itog = test_keys.reduce(
    (a: any, key: string) => ({
      ...a,
      [`${key}`]: getFullList(key, test),
    }),
    {}
  );

  //filtering group questions
  for (let key in itog) {
    const arr = itog[key].map((item: string) => item.split("_")[0]);
    arr.sort((a: any, b: any) => +a.slice(1) - +b.slice(1));
    const filtered = arr.filter(
      (item: string, index: number) => arr.indexOf(item) === index
    );
    itog[key] = filtered;
  }

  return itog;
};
