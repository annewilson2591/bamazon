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
            switch(answer.menu_options) {
                case "View Products for Sale":
                return productList();
                break;
                
                case "View Low Inventory":
                return lowInventory();

                case "Add to Inventory":
                return addInventory();

                case "Add New Product":
                return newProduct();
            }
        })
    ]);
}

function productList() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
    }
    )};

function lowInventory() {

};

function addInventory() {

};

function newProduct() {
    
}



  //switch case
    //if view products for sale, list all item ids, names, prices and quanities
    //if view low inventory, list all items with count<5
    //if add to inventory, prompt manager with option to add more of any item
    //if add new product, allow manager to add new item