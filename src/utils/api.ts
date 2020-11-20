export const post = async (url: string, data: any) => {
  const response = await fetch(window.location.origin + url, {
    credentials: "same-origin", // параметр определяющий передвать ли разные сессионные данные вместе с запросом
    method: "POST", // метод POST
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // типа запрашиаемого документа
  });
  return response.json();
};
