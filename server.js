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

const viewDepartments = () => {
    db.query(`SELECT * FROM department`, function (err, results) {
        console.log(`\n`);
        console.table(results);
        promptUser();
    })
}

const viewRoles = () => {
    db.query(`SELECT * FROM roles`, function (err, results) {
        console.log(`\n`);
        console.table(results);
        promptUser();
    })
}

const viewEmployees = () => {
    db.query(`
    SELECT 
        employees_with_managers.id AS employee_id,
        employees_with_managers.first_name,
        employees_with_managers.last_name,
        employee_info.title,
        employee_info.salary,
        employee_info.department_name,
        employees_with_managers.manager_name
    FROM
        employee_info
    JOIN
        employees_with_managers
    ON 
        employee_info.role_id = employees_with_managers.role_id;
    `, function (err, results) {
        console.log(`\n`);
        console.table(results);
        promptUser();
    })
}

const addDepartment = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the new department being added?"
            
        }
    ])
    .then((data) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, data.name, (err, results) => {
            console.log(`\nNew department has been added to the database.`);
            viewDepartments();
        })
    })
}
const addRole = () => {
    let departmentArray = [];
    db.query(`SELECT * FROM department`, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            departmentArray.push(results[i].name);
        }
        return inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What would you like to title the new role?",
            },
            {
                type: "input",
                name: "salary",
                message: "What is salary of this new role?",
            },
            {
                type: "list",
                name: "department",
                message: "What department is the new role assigned to?",
                choices: departmentArray,
            }
        ])
        .then((data) => {
            // Get's department id
            db.query(`SELECT id FROM department WHERE department.name = ?`, data.department, (err, results) => {
                let department_id = results[0].id;
            db.query(`INSERT INTO roles(title, salary, department_id) VALUES (?,?,?)`, [data.title, data.salary, department_id], (err, results) => {
                console.log("\nNew role added. See below:");
                viewRoles();
            })
            });
        })
    })
}

const addEmployee = () => {
    // Creating empty arrays to be filled
    const rolesArray = [];
    const employeesArray = [];
    // Fills rolesArray with all roles
    db.query(`SELECT * FROM roles`, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            let employeeName = `${results[i].first_name} ${results[i].last_name}`
            employeesArray.push(employeeName);
        }
        return inquirer.prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?",
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?",
            },
            {
                type: "list",
                name: "role",
                message: "what is the employee's role?",
                choices: rolesArray
            },
            {
                type: "list",
                name: "has_manager",
                message: "Does the employee have a manger?",
                choices: ["YES", "NO"]
            }
        ]).then((data) => {
            let roleName = data.role;
            let first_name = data.first_name;
            let last_name = data.last_name;
            let role_id = "";
            let manager = "";
            //fills empty string of role_id
            db.query(`SELECT is FROM role WHERE role.title = ?`, data.role, (err,results) => {
                role_id = results[0].id
            });
            if (data.has_manager === "YES") {
                return inquirer.prompt([
                    {
                        type: "list",
                        name: "manager",
                        message: "Please select the employee's manager from the list",
                        choices: employeesArray
                    }
                ]).then((data) => {
                    db.query(`SELECT id FROM role WHERE role.title = ?`, roleName, (err, results) => {
                        role_id = results[0].id;
                    })
                    db.query(`SELECT id FROM employee WHERE employee.first_name = ? AND employee.last_name = ?`, data.manager.split(" "), (err, results) => {
                        manager = results[0].id;
                        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)`, [first_name, last_name, role_id, manager])
                    })
                })
            }
        })
    })
}