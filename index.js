require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3010;
const router = require('./routes/router');
const db = require('./models/index');
const http = require('http').createServer(app);
router.use(express.json());
app.use(cors(), router);
app.use(require('prerender-node').set('prerenderToken', 'pmAz691dTZfZ6GTrUiZZ'));
const path = require('path');
const { main } = require('./startup/startup');
const messageController = require('./controllers/message-controller');

//START SOCKET
io = require('socket.io')(http);
//Secret to making io emit events available in controllers is to set io as global variable
global._io = io;
const util = require('util');
io.on('connection', (socket) => {
	// User Joins a room
	socket.on('join_room', (roomId) => {
		socket.join(roomId);
		console.log('User JOINED ROOM ', roomId);
	});

	//Listen for chat messages from users
	socket.on('message', ({ roomId, senderId, sender, message, timestamp }) => {
		messageController.saveMessage(roomId, senderId, message, timestamp);
		io.to(roomId).emit('message', { roomId, senderId, sender, message, timestamp });
	});

	//When client disconnects, handle it
	socket.on('disconnect', () => {
		const clientDisconnectedMsg = 'User disconnected ' + util.inspect(socket.id);
		io.emit(clientDisconnectedMsg);
		console.log(clientDisconnectedMsg);
	});
});

//END SOCKET
(async () => {
	try {
		// await db.sequelize.sync({ force: true });
		await db.sequelize.sync();
		await main();
		// coffee old code to serve what is in public
		// app.use(express.static(path.join(__dirname + '/public')));
		if (process.env.IS_PROD == '1') {
			//Serve static content if production
			app.use(express.static(path.join(__dirname, '/ui/build')));
			app.get('/*', function (req, res) {
				res.sendFile(path.join(__dirname, '/ui/build/index.html'));
			});
		}
		http.listen(process.env.PORT || PORT);
		console.log(`🌈Conected to DB, Server listening on port ${PORT}🌈`); // eslint-disable-line no-console
	} catch (e) {
		console.error('☹️Error connecting to the db ☹️ ', e); // eslint-disable-line no-console
	}
})();
