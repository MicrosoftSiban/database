# Database

General database for Drifty templates

		server.js
		database.js
		programbase.js
		query/<application>.sql
		create/<application>.sql

## Running

		iojs-3.3.1/node server.js

## Specific Files
### Heroku

- Procfile
- release-task.sh

## Logic

- Server/Database/Application --> File/Text/Email
- (Question), (Answer)

## Question
### Server (server.js)

		Send URL/FILE to server

		inuse
		location
		redirect

		slug()
		database()
		task(taskname)
		filed({ type: js/xml/json - js/html/data })
		listen(port)

### Database 
#### Applications (.sql)

-card-match
-coachshake
	
#### MongoDB: Programming (programbase.js)

		configuration
		connection
		variable

		open
		store()
		reuse()
		stop()

#### MySQL: Data (database.js)

		configuration
		connection
		query (coachshake - examples)

		open()
		call(task, records)
		stop()

## Answer
### File (.php)

		Send URL/FILE to client

### Text
### Email