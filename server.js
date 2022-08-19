var server = {
	engine: require('https'),
	inuse: '',
	location: '',
	
	upload: '',
	direct: '',
	slug: '',
	database: '',
	task: function(taskname) {},
	filed: function(type = ['js', 'xml', 'json']) {},
	listen: function(port) {}
}