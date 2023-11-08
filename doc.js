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
			try {
				doc.create(data, (err) => {
					if (err) {
						this.debug("create !", doc.collection, doc.id, err, err.stack);
						return reject(err);
					}
					this.debug("create <", doc.collection, doc.id, doc.data);
					return resolve(doc);
				});
			} catch(err) {
				this.debug("create !", doc.collection, doc.id, err, err.stack);
				return reject(err);
			}
		});
	}

	async del() {
		const { doc } = this;
		const [ options ] = arguments;
	
		return new Promise((resolve, reject) => {
			this.debug("del >", doc.collection, doc.id);
			try {
				doc.del(options, (err) => {
					if (err) {
						this.debug("del !", doc.collection, doc.id, err, err.stack);
						return reject(err);
					}
					this.debug("del <", doc.collection, doc.id, doc.data);
					return resolve(doc);
				});
			} catch(err) {
				this.debug("del !", doc.collection, doc.id, err, err.stack);
				return reject(err);
			}
		});
	}

	async fetch() {
		const { doc } = this;
	
		return new Promise((resolve, reject) => {
			this.debug("fetch >", doc.collection, doc.id);
			try {
				doc.fetch((err) => {
					if (err) {
						this.debug("fetch !", doc.collection, doc.id, err, err.stack);
						return reject(err);
					}
					this.debug("fetch <", doc.collection, doc.id, doc.data);
					return resolve(doc);
				});
			} catch(err) {
				this.debug("fetch !", doc.collection, doc.id, err, err.stack);
				return reject(err);
			}
		});
	}

	async submitOp() {
		const { doc } = this;
		const [ op, options ] = arguments;
	
		return new Promise((resolve, reject) => {
			this.debug("submitOp >", doc.collection, doc.id, op, options);
			try {
				doc.submitOp(op, options, (err) => {
					if (err) {
						this.debug("submitOp !", doc.collection, doc.id, op, options, err, err.stack);
						return reject(err);
					}
					this.debug("submitOp <", doc.collection, doc.id, op, options);
					return resolve(doc);
				});
			} catch(err) {
				this.debug("submitOp !", doc.collection, doc.id, op, options, err, err.stack);
				return reject(err);
			}
		});
	}


	async subscribe() {
		const { doc } = this;
	
		return new Promise((resolve, reject) => {
			this.debug("subscribe >", doc.collection, doc.id);
			try {
				doc.subscribe((err) => {
					if (err) {
						this.debug("subscribe !", doc.collection, doc.id, err, err.stack);
						return reject(err);
					}
					this.debug("subscribe <", doc.collection, doc.id);
					return resolve(doc);
				});
			} catch(err) {
				this.debug("subscribe !", doc.collection, doc.id, err, err.stack);
				return reject(err);
			}
		});
	}

	async unsubscribe() {
		const { doc } = this;
	
		return new Promise((resolve, reject) => {
			this.debug("unsubscribe >", doc.collection, doc.id);
			try {
				doc.subscribe((err) => {
					if (err) {
						this.debug("unsubscribe !", doc.collection, doc.id, err, err.stack);
						return reject(err);
					}
					this.debug("unsubscribe <", doc.collection, doc.id);
					return resolve(doc);
				});
			} catch(err) {
				this.debug("unsubscribe !", doc.collection, doc.id, err, err.stack);
				return reject(err);
			}
		});
	}

	async fetchOrCreate() {
		const { doc } = this;
		const [ data ] = arguments;
	
		await this.fetch();
		if (doc.type !== null) {
			return doc;
		}
	
		return this.create(data);
	}
	
	async fetchOrCreateAndSubscribe() {
		const [ data ] = arguments;
	
		await this.fetchOrCreate(data);
		return this.subscribe();
	}

	getPath(data) {
		let path = [];
	
		while(data && typeof data === "object") {
			let keys = Object.keys(data);
	
			if(keys.length == 0) {
				break;
			}
	
			if(keys.length != 1) {
				if(path.length > 0) {
					path.pop();
				}
	
				return path;
			}
	
			let key = keys[0];
			path.push(key);
			data = data[key];
		}
	
		return path;
	}

	createDataOp() {
		const { doc } = this;
		const [ data ] = arguments;
	
		let path = this.getPath(data);
		// this.debug("creating data", doc, path, data);
		let insertPath = [];
	
		let parentData = null;
		let docData = doc.data;
	
		let _data = data; // modifiable
		for(let i = 0; i < path.length && docData != undefined; i++) {
			let key = path[i];
			insertPath.push(key);
			_data = _data[key];
			parentData = docData;
			docData = docData[key];
		}
	
		if(null != docData) {
			// this.debug("createDataOp already exists", path, doc);
			return {path};
		}
	
		let action = "oi";
		if(Array.isArray(parentData)) {
			action = "li";
		} else if (typeof parentData === "string") {
			action = "si";
		}
	
		let op = { p: insertPath };
		op[action] = _data;
	
		// this.debug("createDataOp", op, doc);
		return {path, op};
	}

	async createData() {
		const [ data ] = arguments;

		let opInfo = this.createDataOp(data);
		if(!opInfo.op) {
			return opInfo.path;
		}

		return this.submitOp([opInfo.op])
			.then(() => opInfo.path);
	}
	
}

module.exports = Doc;


