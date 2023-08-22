'use strict';

const Doc	= require('./doc');

module.exports = {
	Doc,
	doc: doc => new Doc(doc)
};


