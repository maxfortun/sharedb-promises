'use strict';

const Debug			= require('debug');
const debugPrefix	= 'sharedb-promises:test:doc:';
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

		this.debug = new Debug(debugPrefix + this.currentTest.title);

		const doc = this.doc = this.connection.get('dogs', 'fido');
	});

	it('create', async function () {
		const { doc } = this;
		await ShareDBPromises.doc(doc).create({name: 'fido'});
		expect(doc.data.name).to.eql('fido');
	});

	it('submitOp', async function () {
		const { doc } = this;
		const doc2 = this.connection.get('dogs', 'fido');

		await ShareDBPromises.doc(doc).create({name: 'fido'});
		await ShareDBPromises.doc(doc).submitOp([{p: ['color'], oi: 'gray'}]);

		expect(doc2.data.color).to.eql('gray');
	});

	it('fetch', async function () {
		const { doc } = this;

		await ShareDBPromises.doc(doc).create({name: 'fido'});

		const doc2 = this.connection.get('dogs', 'fido');

		await ShareDBPromises.doc(doc).submitOp([{p: ['color'], oi: 'gray'}]);

		await ShareDBPromises.doc(doc).fetch();

		expect(doc2.data).to.eql({ name: 'fido', color: 'gray' });
	});

});
