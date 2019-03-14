var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "Valentine1!",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
  });

function start() {
    inquirer.prompt([
        {
          name: "menu_options",
          type: "list",
          choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
          message: "As a manager, what would you like to do?"
        }
        .then(function(answer) {
            switch(answer) {
                case "View Products for Sale":
                return;
                
                case "View Low Inventory":
                return;

                case "Add to Inventory":
                return;

                case "Add New Product":
                return;
            }
        })
    ]);
}


  //switch case
    //if view products for sale, list all item ids, names, prices and quanities
    //if view low inventory, list all items with count<5
    //if add to inventory, prompt manager with option to add more of any item
    //if add new product, allow manager to add new item