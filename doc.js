'use strict';

const Debug				= require('debug');

class Doc {
	constructor(doc) {
		this.doc = doc;
		this.debug = new Debug('sharedb-promises:doc:' + doc.collection + ':' + doc.id);
		return this;
	}
	
	async create() {
		const { doc } = this;
		const [ data ] = arguments;
	
		return new Promise((resolve, reject) => {
			this.debug("create >", doc.collection, doc.id);
			doc.create(data, (err) => {
				if (err) {
					this.debug("create !", doc.collection, doc.id, err, err.stack);
					return reject(err);
				}
				this.debug("create <", doc.collection, doc.id, doc.data);
				return resolve(doc);
			});
		});
	}

	async fetch() {
		const [ doc ] = arguments;
	
		return new Promise((resolve, reject) => {
			this.debug("fetch >", doc.collection, doc.id);
			doc.fetch((err) => {
				if (err) {
					this.debug("fetch !", doc.collection, doc.id, err, err.stack);
					return reject(err);
				}
				this.debug("fetch <", doc.collection, doc.id, doc.data);
				return resolve(doc);
			});
		});
	}
	
	async subscribe() {
		const [ doc ] = arguments;
	
		return new Promise((resolve, reject) => {
			this.debug("subscribe >", doc.collection, doc.id);
			doc.subscribe((err) => {
				if (err) {
					this.debug("subscribe !", doc.collection, doc.id, err, err.stack);
					return reject(err);
				}
				this.debug("subscribe <", doc.collection, doc.id);
				return resolve(doc);
			});
		});
	}
	
	async submitOp() {
		const [ doc, op, options ] = arguments;
	
		return new Promise((resolve, reject) => {
			this.debug("submitOp >", doc.collection, doc.id, op, options);
			doc.submitOp(op, options, (err) => {
				if (err) {
					this.debug("submitOp !", doc.collection, doc.id, op, options, err, err.stack);
					return reject(err);
				}
				this.debug("submitOp <", doc.collection, doc.id, op, options);
				return resolve(doc);
			});
		});
	}

}

module.exports = Doc;


