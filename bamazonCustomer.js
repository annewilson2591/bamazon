var mysql = require("mysql");
var inquirer = require("inquirer");
//require console.table

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

//on run, file will display all items available for sale with each column information

function start() {
    ///display all items
    inquirer.prompt({
        name: "bamazonPurchase",
        type: "list",
        message: "Would you like to make a purchase today?",
        choices: ["YES", "NO"]
        ////how to first display the items, then trigger the prompt 
    })

    //if user selects to make a purchase, run purchase options function, if not, end connection
    .then(function(answer) {
        if (answer.bamazonPurchase === "YES") {
            newPurchase();
        }
        else{
            connection.end();
        }
    })
}


function newPurchase() {
    //query db for all available items
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
    
    inquirer.prompt([
      {
        name: "item",
        type: "list",
        choices: function() {
            var choiceArray = [];
            //for loop of available items from sql - how to specify id and name?
            for (var i = 0; i < results.length; i++){
                choiceArray.push(results[i].product_name);
            }
            return choiceArray;
        },
        message: "Which item you would like to purchase?"
      },
      {
          name: "amount",
          type: "input",
          message: "How many units would you like to purchase?",
          validate: function(value) {
              if (isNaN(value) === false) {
                  return true;
              }
              return false;
          }
      }
    ])
    .then(function(answer) {
        //var chosenItem;
        console.log(answer.amount);
        console.log(results[0].item_id);

        for (var i = 0; i < results.length; i++) {
            if (results[i].product_name === answer.item) {
                if (results[i].stock_quantity >= parseInt (answer.amount)) {
                    console.log("Placing Order Now!");
                    connection.query(
                        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_name = ?",
                        [answer.amount, answer.item]
                    )
                }
            }
        }
       
        // if (chosenItem.stock_quantity < parseInt(answer.choices)) 
        // console.log("Placing Order Now!")
        // {
        //     connection.query(
        //         "UPDATE products SET ? WHERE ?",
        //         [
        //             {
        //                 //update sql quantity   
        //             }
        //         ],
        //         function(error) {
        //             if (error) throw err;
        //             console.log("Product stock updated successfully");
        //             start();
        //         }
        //     )
        //     //check if enough quantity
        //     //fill the order - update sql, display total cost of purchase
        // };
        // else {
        //     console.log("Insufficient quantity! Try again..");
        //     start();
        // }
    });
});
}




