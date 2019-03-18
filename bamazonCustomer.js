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
    
    inquirer.prompt({
        name: "bamazonPurchase",
        type: "confirm",
        message: "Would you like to make a purchase today?",
        default: true
    })
    .then(function(user) {
        if (user.bamazonPurchase === true) {
            newPurchase();
        } else {
            console.log("Come back another time!"); 
        }
    });
}


function newPurchase() {

    inquirer.prompt([
      {
        name: "item",
        type: "list",
        // choices: function() {
        //     var choiceArray = [];
        //     //for loop of available items from sql - how to specify id and name?
        //     for (var i = 0; i < results.length; i++){
        //         choiceArray.push(results[i].product_name);
        //     }
        //     return choiceArray;
        // },
        message: "Which item you would like to purchase?"
      },
      {
          name: "amount",
          type: "input",
          message: "How many units would you like to purchase?",
        //   validate: function(value) {
        //       if (isNaN(value) === false) {
        //           return true;
        //       }
        //       return false;
        //   }
      }
    ])
    .then(function(answer) {

        connection.query("SELECT * FROM products WHERE item_id=?", answer.itemID, function(err, results) {
            
        for (var i = 0; i < results.length; i++) {
            if (results[i].product_name === answer.item) {
                if (answer.amount > results[i].stock_quantity) {
                    console.log("Insufficient quantity! Try again..");
                } else {
                    console.log("Placing order for " + answer.amount + answer.item + ". Your total is: " (results[i].price * answer.amount));

                    var newStock = (results[i].stock_quantity - answer.amount);
                    var purchaseID = (answer.item);
                    console.log(newStock);
                    secondPurchase(newStock, purchaseID);
                }
            }
        };
        })
    })
}

function secondPurchase(newStock, purchaseID) {

    inquirer.prompt([{
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
                start();
        } else {
            console.log("Come back another time!");
        }
    });
}
      





