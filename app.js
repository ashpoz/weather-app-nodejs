require('dotenv').config();

const fs = require('fs');
const http = require('http');
const url = require('url');
const superagent = require('superagent');

const apiKey = process.env.API_KEY;
const city = 'Austin';
const apiURL = `api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

const writeFilePro = (file, data) => {
  // executor callback fn where we do async work
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (err) reject('I could not write that file')
      resolve('success'); // doesn't need to return meaningful val
    })
  });
}

const getCurrentWeather = async () => {
  try {
    const data = await superagent.get(apiURL);
    console.log(data.body);
    // write json file
    await writeFilePro('data.json', JSON.stringify(data.body));
  } catch(err) {
    console.log(err);
    throw err;
  }
  return 'READY';
}

const server = http.createServer((req, res) => {
  const pathName = req.url;
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/api') {
    getCurrentWeather();
    res.writeHead(200, {
      // can send headers here
      'Content-type': 'application/json',
    });
    const json = fs.readFileSync(`${__dirname}/data.json`, 'utf-8')
    res.end(json);
  } else {
    res.writeHead(404, {
      // can send headers here
      'Content-type': 'text/html',
    });
    res.end('<h1>page not found</h1>')
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to req on port 8000');
  // when server is started, it doesn't automatically stop b/c its listening to requests
});