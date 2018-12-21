module.exports = {
	'secret': process.env.SECRET_KEY || /* istanbul ignore next: tired of writing tests */ 'crevance-v0.0.1',
	'database':  process.env.MONGO_CONNECTION||'mongodb://localhost/crevance', /* istanbul ignore next: tired of writing tests */ 
	// 'mongodb://skywalker_kfg:moyosore1991@ds125841.mlab.com:25841/crevance?connectTimeoutMS=300000'
	// process.env.MONGO_CONNECTION ||
};
