// города запрашиваем полным списком до начала игры
// так мы сможем продолжить игру в случае потери связи

let cityData;

function getJSON(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = () => {
    const status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
}

getJSON(
  'https://gist.githubusercontent.com/dziaineka/edac9ff93e3b3ddf64cad3ec25fdceff/raw/24ff99f23f9ccc917b08dc7f78a098ee7425b1a7/cities.json',
  (err, data) => {
    if (err !== null) {
      alert('При загрузке списка городов что-то пошло не так: ' + err);
    } else {
      cityData = data;

      cityData.forEach((item, i, arr) => {
        arr[i] = item.toLowerCase();
      });
    }
  }
);