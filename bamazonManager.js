var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "Valentine1!",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId);
    start();
  });

function start() {
    
    inquirer.prompt([
        {
          name: "menu_options",
          type: "list",
          choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
          message: "As a manager, what would you like to do?"
        }])
        .then(function(user) {
          
              if (user.menu_options === "View Products for Sale") {
                productList();
              } else if (user.menu_options === "View Low Inventory") {
                lowInventory();
              } else if (user.menu_options === "Add to Inventory") {
                addInventory();
              } else {
                addProduct();
              }
        });
}

function productList() {
    
  var table = new Table({
    head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
    colWidths: [10, 30, 30, 30, 30]
  });

  listInventory();

  function listInventory() {
    
    connection.query("SELECT * FROM products", function(err, results) {
      for (var i = 0; i < results.length; i++) {

        var itemID = results[i].item_id,
            productName = results[i].product_name,
            departmentName = results[i].department_name,
            price = results[i].price,
            stockQuantity = results[i].stock_quantity;
        
        table.push(
          [itemID, productName, departmentName, price, stockQuantity]
        );
      }
      console.log(table.toString());
      console.log("---------------------------------");
      
        start();

    });
  }
}

function lowInventory() {

    var table = new Table({
        head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
        colWidths: [10, 30, 30, 30, 30]
  });

    listLowInventory();

    function listLowInventory() {
      
      connection.query("SELECT * FROM products", function(err, results) {
        for (var i = 0; i < results.length; i++) {

          if (results[i].stock_quantity <= 10) {
            var itemID = results[i].item_id,
                productName = results[i].product_name,
                departmentName = results[i].department_name,
                price = results[i].price,
                stockQuantity = results[i].stock_quantity;
            
            table.push(
              [itemID, productName, departmentName, price, stockQuantity]
            );
          }
        }
          console.log("---------------------------------");
          console.log("The following products have a stock quantity of less than 10:")
          console.log(table.toString());
          console.log("---------------------------------");
          start();
      });
    }
}

function addInventory() {

    inquirer.prompt([
      {
        name: "addID",
        type: "input",
        message: "Please enter the ID number of the item you would like to add to inventory",
      },
      {
        name: "addNumber",
        type: "input",
        message: "How many units of this item would you like to add to the inventory?",
      }
    ])
    .then(function(managerAdd) {
        
        connection.query("UPDATE products SET ? WHERE ?", [
        {
            stock_quantity: managerAdd.addNumber
        }, {
            item_ID: managerAdd.addID
        }], function(err, results) {

        console.log("---------------------------------");
        console.log("Adding " + managerAdd.addNumber + " units");
        console.log("---------------------------------");

        });

        start();
    });
}

function addProduct() {

    inquirer.prompt([{

        name: "inputName",
        type: "input",
        message: "Please enter the item name of the new product",
      },
      {
        name: "inputDepartment",
        type: "input",
        message: "Please enter which department the new product belongs",
      },
      {
        name: "inputPrice",
        type: "input",
        message: "Please enter the price of the new product (0.00)",
      },
      {
        name: "inputStock",
        type: "input",
        message: "Please enter the stock quantity of the new product",
      }

    ])
    .then(function(managerNew) {
      
        connection.query("INSERT INTO products SET ?", {

          product_name: managerNew.inputName,
          departmentName: managerNew.inputDepartment,
          price: managerNew.inputPrice,
          stock_quantity: managerNew.inputStock
        }, function(err, results) {});

        console.log("---------------------------------");
        console.log("Manager added the following product to the inventory:")
        console.log("New Product: " + managerNew.inputName);
        console.log("Department: " + managerNew.inputDepartment);
        console.log("Unit Price: " + managerNew.inputPrice);
        console.log("Stock Quantity: " + managerNew.inputStock)
        console.log("---------------------------------");
        
        start();
    });
}