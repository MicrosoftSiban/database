var web = require('http')
var url = require('url')
var database = require('./database.js')
var email = require('emailjs')

var server = {
	using: 'Codeanywhere',
	URL: {
		Codeanywhere: 'https://drifty-abakasam720639.codeanyapp.com/',
		Heroku: 'https://drifty-coachshake.herokuapp.com/'
	},
	redirect: {
		LOGIN: 'council.html',
		SCHEDULE: 'council.html',
		REGISTER: 'council.html',
		ORDERS: 'schedule.html',
		OFFER: 'offer.html',
		MENU: 'menu.html',
		PICKUP: 'delivery.html',
		ORDER: 'schedule.html'
	}
}

server.web = web.createServer(function (request, response) {	
	console.log('Request started from coachshake')
	server.URL.parameters = url.parse(request.url, true).query
	server.task = server.URL.parameters.task
	console.log(server.URL.parameters)
	
	database.open()
	database.call(server.task, server.URL.parameters)
	
	setTimeout(function () {
		console.log('Executed query and acquired database results ', database.results)

		server.redirect.location = server.URL[server.using] + server.redirect[server.task]		
		server.URL.query = '?task=' + server.task + '&phone=' + server.URL.parameters.phone  + '&data=' + JSON.stringify(database.results)
		
		// IMPROVE: module.exports server.URL.parameters from server.js
		if(server.task == 'PICKUP') {
			server.URL.query = '?task=' + server.task + '&phone=' + server.URL.parameters.phone + '&type=' + server.URL.parameters.type + '&choice=' + server.URL.parameters.choice
		}
		
		if(server.task == 'ORDER') {
			console.log('Send email')

			var mail = email.server.connect({
				user:     "abakasam@zohomail.com", 
				password: "WS;SsPz.", 
				host:     "smtp.zoho.com", 
				ssl:      true
			})
			
			console.log('New Order! Phone: ' + server.URL.parameters.phone + ' Item: ' + server.URL.parameters.item + ' Location: ' + server.URL.parameters.location + ' Time: ' + server.URL.parameters.time)
		}

		response.writeHead(302, { location: server.redirect.location + server.URL.query })
		console.log('Loaded webpage', server.redirect.location, server.URL.query)

		response.end()
		database.stop()
	}, 2000)
})

server.web.listen(process.env.PORT || 3001, function () {
	console.log('Server is running')
})