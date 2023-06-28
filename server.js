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


