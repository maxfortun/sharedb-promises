'use strict';

const Debug			= require('debug');
const debug			= new Debug('sharedb-promises:test:doc');
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

describe('doc', function() {

	beforeEach(async function() {
		this.backend = new Backend();
		this.connection = this.backend.connect();
		this.connection.debug = sharedbDebug.enabled;

		const doc = this.doc = this.connection.get('dogs', 'fido');
	});

	it('create', async function () {
		const { doc } = this;
		await ShareDBPromises.doc(doc).create({name: 'fido'});
		expect(doc.data.name).to.eql('fido');
	});

	it('fetch', async function () {
		const { doc } = this;
		debug("doc", doc);

		const doc2 = this.connection.get('dogs', 'fido');
		debug("doc2", doc2);

		await ShareDBPromises.doc(doc).create({name: 'fido'});

		debug("doc2", doc2);
		expect(doc2.data.name).to.eql('fido');
	});

});
