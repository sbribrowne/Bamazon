const inquirer = require("inquirer");
const mySql = require('mySql')

const connectObject = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'products'
}

const connection = mySql.createConnection(connectObject) //creates connection to database

//event that kicks off when connection is made... hook into event

connection.connect(function (error) {
  if (error) throw err;
  queryAll()
  inquire();
  //console.log('Connected as ID ${connection.threadID}');
});


function queryAll() {
  connection.query("SELECT * FROM product_info", function (error, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].itemName + " | " + res[i].itemPrice + " | " + res[i].itemDescription);
    }
    console.log("----------------------------------------");
  });
}

function inquire() {
  inquirer
    .prompt([
      // Here we create a basic text prompt.
      {
        type: "input",
        message: "What is the ID of the product you would like to buy?",
        name: "choice"
      },
      {
        type: "confirm",
        message: "Are you sure:",
        name: "confirm",
        default: true
      },
      {
        type: "input",
        message: "How many units of the item would you like to buy?",
        name: "units"
      },
      {
        type: "confirm",
        message: "Are you sure:",
        name: "confirm",
        default: true
      },

    ])
    .then(function (inquirerResponse) {
      // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.

      if (inquirerResponse.choice === "") {
        console.log("Fill in the information below to post an item");

        inquirer
          .prompt([
            // Here we create a basic text prompt.
            {
              type: "input",
              message: "What is the name of the item?",
              name: "itemName"
            },
            {
              type: "input",
              message: "What is the price of the item?",
              name: "itemPrice"
            },
            {
              type: "input",
              message: "What is the description of the item?",
              name: "itemDescription"
            },
          ])
          .then(function (inquirerResponse) {

            //console.log(inquirerResponse.itemName);

            (function createProduct() {
              let query = connection.query(
                "insert into product_info set ?",
                [
                  {
                    itemName: inquirerResponse.itemName,
                    itemPrice: inquirerResponse.itemPrice,
                    itemDescription: inquirerResponse.itemDescription
                  }
                ],
                function (error, response) {
                  if (error) throw error

                  console.log(response)
                }
              );
            })()

          });

      }
      else {
        //show list of availabe items
        console.log("Below are the available items:");
        console.log(inquirerResponse.action);
      }
    });

}