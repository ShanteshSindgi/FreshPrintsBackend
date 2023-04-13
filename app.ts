import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
require("dotenv").config();

import { router } from './routes/apparel.route'
const app: Application = express();
console.log("s", process.env.PORT)
const port = process.env.PORT || 3000;



// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes


// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);

});

app.use('/apparel', router);
app.get('/', (req: Request, res: Response) => {
    res.send('Server running!');
});