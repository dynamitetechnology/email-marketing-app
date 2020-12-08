const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const redis = require('redis');
const port = 5000;
const app = express();
const dbConfig = require('./config/db');
var client = redis.createClient(6379, process.env.REDIS_IP);

app.use(cookieParser('your-secret-dontknow'));
const loginRouter = require('./app/routers/loginRouter');
const dashboardController = require('./app/routers/dashboardRouter');
const sendemailRoutes = require('./app/routers/sendemailRouter');
const createTemplateRoutser = require('./app/routers/createTemplateRouter');
const souceListRouter = require('./app/routers/sourceListRouter');
const createuserRouter = require('./app/routers/createuserRouter');
const emailgatwayRouter = require('./app/routers/emailgatwayRouter');
const uploadfileRouter = require('./app/routers/fileuploadRouter');
const scheduleRouter = require('./app/routers/scheduleEmailRouter');






app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));

app.use('/', loginRouter);
app.use('/', setUserData, loginRequired, dashboardController);
app.use('/', setUserData, loginRequired, sendemailRoutes);
app.use('/', setUserData, loginRequired, createTemplateRoutser);
app.use('/', setUserData, loginRequired, souceListRouter);
app.use('/', setUserData, loginRequired, createuserRouter);
app.use('/', setUserData, loginRequired, emailgatwayRouter);
app.use('/', setUserData, loginRequired, uploadfileRouter);
app.use('/',setUserData, loginRequired,scheduleRouter)
//Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
	console.log("Request URL==>> ", req.originalUrl)


	//if(req.originalUrl == '/assets/img/web3.png')
	if (req.originalUrl.includes("webemailhiddenmedia.png")) {
		console.log("I am an image")
		console.log('IPAddress------->', req.connection.socket)
		let ip = req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			(req.connection.socket ? req.connection.socket.remoteAddress : null);

		console.log('IP------->', ip)
		console.log('todo---------->', req.originalUrl)

		;
		(async () => {

			let db = req.app.locals.db;

			var currentdate = new Date();
			var datetime = currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " | " + currentdate.getHours() + ":" +
				currentdate.getMinutes() + ":" +
				currentdate.getSeconds();

			console.log('datetime', datetime)

			let vendorData = await new Promise(resolve => {
				const stmtCourseData = {
					text: "insert into email_statics(ip_address,image_path,viewdatetime) values($1, $2, $3)",
					values: [ip, req.originalUrl, datetime]
				}
				db.query(stmtCourseData, async function (err, result) {
					if (err) {
						throw err;
					} else {
						let response = await result.rows[0];
						return resolve(1)
					}
				})
			})

		})()
	}
	next();
});
(async function () {
	client.AUTH(process.env.REDIS_PASS, async function (err, result) {
		if (err) {
			console.log('redis connection errr => ', err);
		} else {
			console.log('redis connection reply => ', result);
		}
	})
	const pgClient = await dbConfig.pgPool.connect();
	app.locals.db = pgClient;
	app.locals.redisdb = client;
	app.listen(port, function () {
		console.log('server started at ', 5000);
	})
})();


function setUserData(req, res, next) {
	if (req.cookies.token) {
		let redisDb = req.app.locals.redisdb
		redisDb.hmget(req.cookies.token, 'username', 'role', 'email', async function (err, obj) {
			if (err) throw err;

			let response = await obj;
			if (response[0] != null) {
				res.locals.userIsLoggedIn = true;
				res.locals.username = response[0];
				res.locals.role = response[1];
				res.locals.email = response[2];

				next();

			} else {
				res.locals.userIsLoggedIn = false;
				next();
			}
		})
	} else {
		res.locals.userIsLoggedIn = false;
		next();
	}
}

function loginRequired(req, res, next) {
	if (req.cookies.token) {
		let redisDb = req.app.locals.redisdb
		redisDb.hmget(req.cookies.token, 'username', 'role', async function (err, obj) {
			if (err) throw err;
			let response = await obj;
			if (response[0] != null || response[0] != undefined) {

				next();

			} else {
				res.redirect("login")
			}
		})
	} else {
		res.redirect("login")
	}

}