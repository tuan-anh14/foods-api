/** @format */
const express = require('express');
const cors = require('cors');
const authRouter = require('./src/routes/authRouter');
const errorMiddleHandle = require('./src/middleware/errorMiddleware');
const connectDB = require('./src/config/connectDb');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.use(errorMiddleHandle);

app.use('/auth', authRouter);


connectDB();


app.listen(PORT, (err) => {
	if (err) {
		console.log(err);
		return;
	}

	console.log(`Server starting at http://localhost:${PORT}`);
});
