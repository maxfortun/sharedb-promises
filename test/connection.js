'use strict';

const Debug			= require('debug');
const debugPrefix	= 'sharedb-promises:test:connection:';
const sharedbDebug	= new Debug('sharedb-promises:sharedb');

const chai  = require('chai');
const { expect } = chai;
chai.config.truncateThreshold = 0;

const logger = {
	info: sharedbDebug,
	warn: sharedbDebug,
	error: sharedbDebug
};

const ShareDB	= require('sharedb');
ShareDB.logger.setMethods(logger);

const Backend	= ShareDB.Backend;

const ShareDBPromises = require('../index.js');

describe('connection', function() {

	beforeEach(async function() {
		this.backend = new Backend();
		this.connection = this.backend.connect();
		this.connection.debug = sharedbDebug.enabled;

		this.debug = new Debug(debugPrefix + this.currentTest.title);
	});

	it('fetchSnapshot', async function () {
		const { connection } = this;
		// await ShareDBPromises.connection(connection).fetchSnapshot();
		// expect(doc.data.name).to.eql('fido');
	});

});
