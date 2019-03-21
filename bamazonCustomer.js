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
    start();
  });

function start() {

    inquirer.prompt([{
        name: "confirm",
        type: "confirm",
        message: "WELCOME TO BAMAZON! Would you like to view our inventory?",
        default: true
    }])
    .then(function(user) {
        if (user.confirm === true) {
            inventory();
        } else {
            console.log("Come back another time!");
            connection.end();
        }
    });
}

function inventory() {
    var table = new Table({
        head: ['ID', 'Item', 'Department', 'Price', 'In Stock'],
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
            promptOrder();
        });
    }
}
    
function promptOrder() {
    
    inquirer.prompt([
        {
          name: "confirm",
          type: "confirm",
          message: "Would you like to make a purchase today?",
          default: true
        }])
    .then(function(user) {
        if (user.confirm === true) {
            newPurchase();
        } else {
            console.log("Come back another time!"); 
        }
    });
}


function newPurchase() {

    inquirer.prompt([
      {
        name: "itemID",
        type: "input",
        message: "What is the ID of the item you would like to purchase?",
      },
      {
        name: "amount",
        type: "input",
        message: "How many units would you like to purchase?",
      }
    ])
    .then(function(userPurchase) {

        connection.query("SELECT * FROM products WHERE item_id = ?", userPurchase.itemID, function(err, results) {
            
        for (var i = 0; i < results.length; i++) {
           
            if (userPurchase.amount > results[i].stock_quantity) {
                
                console.log("Insufficient quantity! Try again..");
                start();
            
            } else {
                
                console.log("---------------------------------");
                console.log("Placing order for: " + userPurchase.amount + " units of " + results[i].product_name);
                console.log("Your total is: $" + (results[i].price * userPurchase.amount));
                console.log("---------------------------------");

                var newStock = (results[i].stock_quantity - userPurchase.amount);
                var purchaseID = (userPurchase.itemID);
                console.log("New stock quantity of " + results[i].product_name + " is: " + newStock);
                console.log("---------------------------------");
                secondPurchase(newStock, purchaseID);
            }
        }
        });
    });
}


function secondPurchase(newStock, purchaseID) {

    inquirer.prompt([
        {
          name: "second",
          type: "confirm",
          message: "Would you like to make another purchase today?",
          default: true
        }])    
        .then(function(answer) {
            if (answer.second === true) {

            connection.query("UPDATE products SET ? WHERE ?", [
                {
                  stock_quantity: newStock
                },
                {
                  item_id: purchaseID
                }], function(err, results) {});
                newPurchase();
        } else {
            console.log("---------------------------------");
            console.log("Come back another time!");
            console.log("---------------------------------");
            connection.end();
        }
    });
}
      





