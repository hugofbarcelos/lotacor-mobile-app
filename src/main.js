import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')


// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
app.use(cors());
app.use(express.json());
app.post('/api/testQuery', async (req, res) => {
  const response = await fetch('https://www.lotacor.pt/api/testQuery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(req.body).toString()
  });
  const data = await response.text();
  res.send(data);
});
app.listen(3001);