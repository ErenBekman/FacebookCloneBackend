const express = require('express');
const fileupload = require('express-fileupload');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const errorMiddleware = require('./middleware/error');
const cloudinary = require('cloudinary').v2;
dotenv.config();

// ?MongoDB
mongoose.connect(
	`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => {
		console.log('Connected to MongoDB');
	}
);

// ?Middleware
const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(fileupload({ useTempFiles: true }));
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);

// ?Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

// ?Router
const userRouter = require('./router/users');
const authRouter = require('./router/auth');
const postRouter = require('./router/post');

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

app.listen(process.env.APP_PORT || 3006, () => {
	console.log('server have started');
});
