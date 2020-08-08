function escapeRegExp(string) {
	string=string.toLowerCase();
	return string.replace(/^\s+|\s+$/gm,'');
}

module.exports = {
	asyncErrorHandler: (fn) =>
		(req, res, next) => {
			Promise.resolve(fn(req, res, next))
						 .catch(next);
		},

	isLoggedIn: (req, res, next) => {
		if(req.isAuthenticated()) return next();
		res.redirect('/login');
	},
	async searchAndFilterPosts(req, res, next) {
		const queryKeys = Object.keys(req.query);
		if(queryKeys.length) {
			const dbQueries = [];
			let { search, age} = req.query;
			if (search) {
				let search=escapeRegExp(req.query.search);
  				var regex = new RegExp(["^", search, "$"].join(""), "i");
				dbQueries.push({ username: search });
			}
			if (age) {
				if (age.min) dbQueries.push({ age: { $gte: age.min } });
				if (age.max) dbQueries.push({ age: { $lte: age.max } });
			}

			res.locals.dbQuery = dbQueries.length ? { $and: dbQueries } : {};
		}
		res.locals.query = req.query;
		next();
	}
}