const express = require("express");
const inquirer = require("inquirer");
const consoleTable = require("console.table")

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_db'

    },
    console.log(`Successfully connected to the employee_db!`)
);

// Inquirer prompt function
const promptUser = () => {
    return inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [ "VIEW all Departments", "VIEW all Roles", " VIEW all Employees", "ADD a Department", "ADD a Role", "ADD an Employee", "UPDATE an Employee Role"]

        }
    ])
    .then((data) => {
        // Use the switch statement to select one of many code blocks to be executed. The switch expression is evaluated once; that value os compared with the values of each case.
        // If there is a match, the associated block of code is executed. If there is no match, the default code is executed.

        switch (data.choice) {
            case "VIEW all Departments":
                viewDepartments();
                break;

            case "VIEW all Roles":
                viewRoles();
                break;
            
            case "VIEW all Employees":
                viewEmployees();
                break;

            case "ADD a Department":
                addDepartment();
                break;
            
            case "ADD a Role":
                addRole();
                break;

            case "ADD an Employee":
                addEmployee();
                break;

            case "UPDATE an Employee Role":
                updateEmployeeRole();
                break;
            
            default:
                console.log("Invalid choice! Exiting the program. Please restart and try again.");
                process.exit(1); 
      
        }
    })
};

// Run the prompt
promptUser();


