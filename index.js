'use strict';

const Doc			= require('./doc');
const Connection	= require('./connection');

module.exports = {
	Doc,
	doc: doc => new Doc(doc),
	Connection,
	connection: connection => new Connection(connection)
};


