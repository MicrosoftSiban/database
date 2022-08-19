# Interfaces

## Queries (MySQL example)

database						SHOW DATABASES
 (query)						USE DATABASE
  tables						SHOW TABLES
   rows							SELECT * FROM TABLE
    columns						SELECT COLUMN FROM TABLE
     change data field			UPDATE TABLE SET FIELD = VALUE WHERE UNIQUE_FIELD = VALUE
 (parameters)					from *.conf
  host:URL						us-cdbr-east-04.cleardb.com
  user							b8f3dd1d8d9c29
  password						0611b499
  multiplestatements			true

SQL								from *.sql
 (task)+create/					create(file)

## UI

POST
<select>http,mongodb,mysql</select>
<div id="paramaters">values</div>
<form>database,tables,row,column,value</form>
<input type="button" onclick="request()"></input>
<div id="results">(Value)</div>

GET
setTimeout()
xmldocument
results(div)=xmldocument