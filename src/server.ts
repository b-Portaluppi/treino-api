import 'dotenv/config';

import express from 'express';
import { route } from './route';

const app = express();

app.use(express.json());
app.use(route);

const PORT = process.env.PORT || 3333;

console.log(`${process.env.PORT}`);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});