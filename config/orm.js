var connection = require("./connection.js");

// Helper function for SQL syntax.
// Let's say we want to pass 3 values into the mySQL query.
// In order to write the query, we need 3 question marks.
// The above helper function loops through and creates an array of question marks - ["?", "?", "?"] - and turns it into a string.
// ["?", "?", "?"].toString() => "?,?,?";

function printQuestionMarks(num) {
    var arr = [];
    
    
    for (var i = 0; i < num.length; i++) {
        arr.push("?");
    }
    return arr.toString();
};

// Helper function to convert object key/value pairs to SQL syntax
function objToSql(ob) {
    var arr = [];
    
    // loop through the keys and push the keys and values as a string into 'arr'
    for (var key in ob) {
        
        var value = ob[key];
        // check to skip hidden properties
        if (Object.hasOwnProperty.call(ob, key)) {
            //if string w spaces, add quotations (lana del ray => 'lana del ray')
            if (typeof value === "string" && value.indexOf(" ") >= 0) {
                value = "'" + value + "'";
            }
            // e.g. {name: 'Lana Del Grey'} => ["name='Lana Del Grey'"]
            // e.g. {sleepy: true} => ["sleepy=true"]
            arr.push(key + "=" + value);
        }
    }
    //translate the array of strings to a single comma-seperated string
    return arr.toString();
}


// Object for all MySQL statements

 var orm = {
     all: function(tableInput, cb) {
         var queryString = "SELECT * FROM " + tableInput + ";"
         connection.query(queryString, function(err, result) {
             if (err) {
                 throw err;
             } 
             cb(result);
         });
     },
     create: function(table, cols, vals, cb) {
         queryString = "INSERT INTO " + table;
         
         queryString += " (";
         queryString += cols.toString();
         queryString += ") ";
         queryString += "VALUES (";
         queryString += printQuestionMarks(vals.length);
         queryString += ") ";
         
         console.log(queryString);
        

         connection.query(queryString, function(err, results) {
             if (err) {
                 throw err;
             }
             cb(result);
         });
     },
     update: function(table, objColVals, condition, cb) {
         var queryString = "UPDATE " + table;

         queryString += "SET ";
         queryString += objToSql(objColVals);
         queryString += "WHERE ";
         queryString += condition;
         
         console.log(queryString);

         connection.query(queryString, function(err, result) {
             if (err) {
                 throw err;
             }
             cb(results);
         });
     }
 };

 module.exports = orm;
