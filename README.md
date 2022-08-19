# Database

General database for Drifty templates.

		server.js						HTTP REST server
		database.js						MySQL server
		programbase.js					MongoDB server
		conf/<base-service>.conf		Base configuration
		query/<application>.sql			Database queries
		create/<application>.sql		Create database
		interface/<engine>-interface.js Language Interface
		tmp/<file>						Uploaded files

## Running

		iojs-3.3.1/node server.js

## Specific Files
### Heroku

- Procfile
- release-task.sh

## Logic

- Server/Database/Application --> File/Text/Email
- (Question), (Answer)

## Query Structure

		NoSQL: <taskname> <variable> <filetype> <redirect>
		SQL:   <taskname> <sqlquery> <filetype> <redirect>

## Question
### Server (server.js)

		Send URL/FILE to server

		inuse
		location
		
		upload()
		direct()
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
### File (file.php)

		Send URL/FILE to client

### Text (text.sh)
### Email (email.sh)

## Organize (myphpadmin)
### MySQL
### MongoDB
### HTTP