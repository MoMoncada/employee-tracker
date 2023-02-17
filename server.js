//---- Importing modules ----//
const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
const consoleTable = require('console.table');

//---- Connecting to the database ----//
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employee_db',
    password: 'KokoRough1$' //TODO: remove password 
});



//---- Initial prompts for the user ----//
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
    //-- Functions to be executed according to the user's choice --//
    .then(selectedChoice => {
        switch (selectedChoice.menu) {
            case 'View all departments':
                selectionDepartments();
                break;
            
            case 'View all roles':
                selectionRole();
                break;
            
            case 'View all employees':
                selectionEmployee();
                break;

            case 'Add a department':
                selectionAddDepartment();
                break;

            case 'Add a role':
                selectionAddRole();
                break;
            
            case 'Update an employee role':
                selectionUpdateEmployeeRole();
                break;

            default:
                process.exit();
        }
    });

};

//---- Queries to select data from the database tables ----//

const selectionDepartments = () => {
    connection.query(
        'SELECT * FROM department;',
        (err, results) => {
            console.table(results);
            promptMenu();
        }
    );

};


const selectionRole = () => {
    connection.query(
        'SELECT * FROM role;',
        (err, results) => {
            console.table(results);
            promptMenu();
        }
    )
}


const selectionEmployee = () => {
    connection.query(
        'SELECT * FROM employee;',
        (err, results) => {
            console.table(results);
            promptMenu();
        }
    )
}





promptMenu();



