/** @format */
const express = require('express');
const cors = require('cors');
const authRouter = require('./src/routes/authRouter');
const errorMiddleHandle = require('./src/middleware/errorMiddleware');
const connectDB = require('./src/config/connectDb');
const path = require('path');
const restaurantRouter = require('./src/routes/restaurantRouter');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.use(errorMiddleHandle);

app.use('/auth', authRouter);
app.use('/restaurant', restaurantRouter);

app.use('/images', express.static(path.join(__dirname, '/src/public/images')));

connectDB();


app.listen(PORT, (err) => {
	if (err) {
		console.log(err);
		return;
	}

	console.log(`Server starting at http://localhost:${PORT}`);
});
