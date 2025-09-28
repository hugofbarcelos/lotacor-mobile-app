import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/testQuery', async (req, res) => {
  const params = new URLSearchParams(req.body).toString();
  const cookieHeader = req.headers.cookie || ''; // Get cookie from browser request

  const apiRes = await fetch('https://www.lotacor.pt/api/testQuery', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookieHeader, // Forward the cookie!
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: params,
  });
  const data = await apiRes.text();
  res.send(data);
});

app.listen(3001, () => console.log('Proxy running on port 3001'));