const pg = require("pg");
const settings = require("./settings");

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

let userInput = process.argv[2];

const query = {
    text: 'SELECT * FROM famous_people WHERE first_name= $1::text OR last_name= $1::text;',
    values: [userInput]   
}

function lookupPerson (input) {
    client.query(query, (error,result) => {
        if (error) {
            return console.error("error running query", err);
        }
        console.log(`Found ${result.rows.length} person(s) yb the name ${userInput}:`);
        result.rows.forEach( (value, i) => { 
            console.log(`- ${i+1}: ${value.first_name} ${value.last_name}, born '${value.birthdate.toISOString().slice(0, 10)}'`) 
        });
        client.end();
    });
}


client.connect((err) => {
    if (err) {
      return console.error("Connection Error", err);
    }
    console.log("Searching ...");
    lookupPerson(userInput);
});