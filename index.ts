import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = +(process.env.PORT ?? 3000);
const host = process.env.HOST ?? 'localhost';

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, host, () => {
  console.log(`[server]: Server is running at http://${host}:${port}`);
});