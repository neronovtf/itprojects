import axios from 'axios'
window.axios = axios

let link = "https://api.jsonbin.io/b/5ea1c32b1299b9374234ddfe"
let key = "$2b$10$fZ/zvd/joZiXwuQYIn3GWehK0l54QzXNlzCK7gwH/XUHzFyfVjFYu"

/** Получаю данные со стороны */
export const getNotes = () => new Promise((resolve, reject) => {
  axios.get(link,
    {
      headers : 
      {
        "Content-type": "application/json",
        "secret-key": key
      }
    })
    .then(value => {
      return resolve(value.data['notes']);
    })
    .catch(() => {
      return reject({
        error: 'Server error'
      });
    })
});

/** Отправить данные на сервер */
export const setNotes = (jsonNotes) => new Promise((resolve, reject) => {
  axios.put(link, JSON.stringify(jsonNotes),
    {
      headers : 
      {
        "Content-type": "application/json",
        "versioning": "false",
        "secret-key": key
      }
    })
    .then(() => {
      return resolve({
        done: 'Server upgrade'
      });
    })
    .catch(() => {
      return reject({
        error: 'Server error'
      });
    })
});