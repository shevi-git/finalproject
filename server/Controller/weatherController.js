require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/weather', async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!city) return res.status(400).send('חסר שם עיר');

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: apiKey,
          units: 'metric',
          lang: 'he'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('שגיאה בשליפת מזג האוויר');
  }
});

module.exports = router;
