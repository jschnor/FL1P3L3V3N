// @param _class (object) the type of class you want to create a pool of
Class(function ObjectPool(_class){

	var _self = this,
		_pool = ObjectPool.prototype,
		_objpool = [],
		_metrics = {};

	_clearMetrics();

	// allocate a new object from the pool
	_pool.allocate = function(){
		var _obj;

		if (_objpool.length == 0){
			// nothing free, so allocate a new object
			_obj = new _class();

			// keep track of how many are allocated
			_metrics.totalalloc++;
		}else{
			// grab available from top of the pool
			_obj = _objpool.pop();

			// keep track of how many are free
			_metrics.totalfree--;
		}

		return _obj;
	};

	// return an object to the pool
	// @param _obj (object) the object you want to put back
	// NOTE: you need to reinitialize the object's value in your code before dropping it back in here
	// otherwise it may still contain values from its previous use
	_pool.release = function(_obj){
		_objpool.push(_obj);
		_metrics.totalfree++;
	};

	// allow garbage collection of pool
	_pool.empty = function(){
		_objpool = [];

		// track objects currently in use that are not in pool
		var _inUse = _metrics.totalalloc - _metrics.totalfree;
		_clearMetrics(_inUse);
	};

	// get the contents of the pool
	_pool.get = function(){
		return _objpool;
	};

	// get the metrics
	_pool.getMetrics = function(){
		return _metrics;
	};

	// clear internal metrics
	// @param _allocated (integer) allows to manually set the number allocated (see _pool.empty above)
	function _clearMetrics(_allocated){
		_metrics.totalalloc = _allocated || 0;
		_metrics.totalfree = 0;
	};
});