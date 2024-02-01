const feathers = require('@feathersjs/feathers');
const auth = require('@feathersjs/authentication-client');

const socketio = require('@feathersjs/socketio-client');
const io = require('socket.io-client');

const socketUrl = process.env.NODE_ENV === 'development' ? process.env.SSO_SERVER_URL : '';

export const socket = io(socketUrl);

export const feathersClient = feathers();

feathersClient
	.configure(auth({ storage: window.localStorage }))
	.configure(socketio(socket, {
		timeout: 20000
	}));
