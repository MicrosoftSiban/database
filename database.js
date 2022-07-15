var mysql = require("./node_modules/mysql")

var configuration = {
	host: 'us-cdbr-east-04.cleardb.com',
	user: 'b8f3dd1d8d9c29',
	password: '0611b499',
	database: 'heroku_23ebff43a942f06',
	multipleStatements: true
}
var connection

function open() {
	connection = mysql.createConnection(configuration)
	connection.connect(function(error) {
		if (error) {
			return console.error('error: ' + error.message)
		}

		console.log('Connected to the MySQL server')
	})
}

var query = {
	'LOGIN': 'SELECT * FROM HISTORY WHERE PHONE = ?',
	'SCHEDULE': 'UPDATE HISTORY SET APPOINTMENT = (SELECT AVAILABLE FROM APPOINTMENTS) WHERE PHONE = ?',
	'REGISTER': 'INSERT INTO HISTORY (PHONE, ONE, TWO, THREE, FOUR, FIVE) VALUES (?, "none", "none", "none", "none", "none")',
	'ORDERS': 'SELECT * FROM ORDERS WHERE PHONE = ?',
	'OFFER': '',
	'MENU': '',
	'PICKUP': '',
	'ORDER': 'INSERT INTO ORDERS (PHONE, ITEM, LOCATION, TIME) VALUES (?)',
	'placeholder': {
		'LOGIN': 'phone',
		'SCHEDULE': 'phone',
		'REGISTER': 'phone',
		'ORDERS': 'phone',
		'OFFER': '',
		'MENU': '',
		'PICKUP': '',
		'ORDER': 'order'
	},
	'after': {
		'LOGIN': function() {},
		'SCHEDULE': function() {
			connection.query('SELECT AVAILABLE FROM APPOINTMENTS', function(errors, results, fields) {
				console.log('ERRORS: ', errors)
				console.log('Parse last date available')
				data = JSON.stringify(results)
				console.log(data)
				data = JSON.parse(data)[0]

				var available = (new String(data['AVAILABLE']))
				available = available.split(' ')
				var day = available[0]
				var time = available[1]

				console.log('Find next time avaliable')
				var times = ['10:00AM', '1:00PM', '3:00PM', '5:00PM'] 
				var index = times.indexOf(time)
				var today = new Date()
				var tomorrow = today.setDate(today.getDate() + 1)

				if(index == 3) {
					index = 0
					tomorrow = (today.getMonth() + 1) + '/' + (today.getDate()) + '/' + (today.getFullYear())
					available = tomorrow + ' ' + times[index]
				} else {
					index = index + 1
					available = day + ' ' + times[index]
				}

				connection.query('UPDATE APPOINTMENTS SET AVAILABLE = ?', available, function(errors, results, fields) {
				})
			})
		},
		'REGISTER': function() {},
		'ORDERS': function() {},
		'OFFER': function() {},
		'MENU': function() {},
		'PICKUP': function() {},
		'ORDER': function() {}
	}
}

function call(task, records) {
	console.log(query[task])
	console.log(records[query['placeholder'][task]])
	
	// IMPROVE: Change into an array
	// IMPROVE: Move to query['placeholder']
	if(task == 'ORDER') {
		var columns = records
		records[query['placeholder'][task]] =  [[columns.phone, columns.item, columns.location, columns.time]]
		console.log(records[query['placeholder'][task]])
	}
	
	connection.query(query[task], records[query['placeholder'][task]], function(errors, results, fields) {
		module.exports.results = results

		query.after[task]()
	})
}

function stop() {
	connection.end()
}

module.exports = { call, connection, open, stop }