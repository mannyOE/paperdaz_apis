module.exports = {
	'secret': process.env.SECRET_KEY || /* istanbul ignore next: tired of writing tests */ 'paperdaz-v0.0.1',
	'database':  process.env.MONGO_CONNECTION||'mongodb://admin:powerfully-made22@ds157614.mlab.com:57614/paperdaz', /* istanbul ignore next: tired of writing tests */ 
	// 'mongodb://skywalker_kfg:moyosore1991@ds125841.mlab.com:25841/crevance?connectTimeoutMS=300000'
	// process.env.MONGO_CONNECTION ||
};
