//---- Importing modules ----//
const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
// const consoleTable = require('console.table');

//---- Connecting to the database ----//
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employee_db',
    password: 'KokoRough1$' //TODO: remove password 
});


const promptMenu = () => {
    return inquirer.prompt([
        {
            type:'list',
            name:'menu',
            message: 'What would you like to do?',
            choices: [
                'View all departments', 
                'View all roles', 
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ])
};



promptMenu();



