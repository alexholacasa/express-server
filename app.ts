import express from 'express';
import axios from 'axios';

require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.post('/slack/command', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await query({ 'in-0': text });
    res.status(200).json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function query(data: any) {
  try {
    const response = await axios.post(
      'https://www.stack-inference.com/run_deployed_flow?flow_id=' +
        process.env.FLOW_ID +
        '&org=' +
        process.env.ORG_ID,
      data,
      {
        headers: {
          Authorization: 'Bearer ' + process.env.API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('API Request Failed');
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
