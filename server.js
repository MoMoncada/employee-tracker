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
    password: 'KokoRough1$' 
});



//---- Initial prompts for the user ----//
const promptMenu = () => {

    console.log(`

   ====================================================================================================
    
    _____                   _                             _____                  _               
   |  ___|                 | |                           |_   _|                | |              
   | |__  _ __ ___   _ __  | |  ___   _   _   ___   ___    | | _ __  __ _   ___ | | __ ___  _ __ 
   |  __|| '_ \` _ \\ | '_ \\ | | / _ \\ | | | | / _ \\ / _ \\   | || '__|/ _\` | / __|| |/ // _ \\| '__|
   | |___| | | | | || |_) || || (_) || |_| ||  __/| (_) |  | || |  | (_| || (__ |   <|  __/| |   
   \\____/|_| |_| |_|| .__/ |_| \\___/  \\__,_| \\___| \\___/   \\_/|_|   \\__,_| \\___||_|\\_\\\\___||_|   
                    | |                __/ |                                                     
                    |_|               |___/                                                 
   
   ====================================================================================================
    
    `);
   

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
                selectionDepartment();
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
            
            case 'Add an employee':
                selectionAddEmployee();
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

const selectionDepartment = () => {
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
};


const selectionEmployee = () => {
    connection.query(
        'SELECT * FROM employee;',
        (err, results) => {
            console.table(results);
            promptMenu();
        }
    )
};



//---- Prompts to add/ update information in SQL----//
const selectionAddDepartment = () => {
    inquirer.prompt(
        [{
            type: 'input',
            name: 'name',
            message: 'What is the name of the department you would like to add?',
            validate: newDepartment => {
                if (newDepartment) {
                    return true;
                } else {
                    return false;
                }
            }

        }]
    )
    .then(name => {
        connection.query('INSERT INTO department SET ?', {department_name: name.name}, (err, result) => {
            if (err) throw err;
            selectionDepartment();
        });
    });
};


const selectionAddRole = () => {

    return connection.promise().query(
        "SELECT department.id, department.department_name FROM department;"
    )
        .then(([departments]) => {
            let departmentChoices = departments.map(({
                id,
                name
            }) => ({
                name: name,
                value: id
            }));

            inquirer.prompt(
                [{
                    type: 'input',
                    name: 'title',
                    message: 'Enter the name of your title (Required)',
                    validate: titleName => {
                        if (titleName) {
                            return true;
                        } else {
                            console.log('Please enter your title name!');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department are you from?',
                    choices: departmentChoices
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter your salary (Required)',
                    validate: salary => {
                        if (salary) {
                            return true;
                        } else {
                            console.log('Please enter your salary!');
                            return false;
                        }
                    }
                }
                ]
            )
                .then(({ title, department, salary }) => {
                    const query = connection.query(
                        'INSERT INTO role SET ?',
                        {
                            title: title,
                            department_id: department,
                            salary: salary
                        },
                        function (err, res) {
                            if (err) throw err;
                        }
                    )
                })
                
                .then(() => selectionRole())

        })
}




const selectionAddEmployee = (roles) => {
  connection.promise().query(
    'SELECT R.id, R.title FROM role R;'
  )
    .then(([employees]) => {
      let titleChoices = employees.map(({ id, title }) => ({
        name: title,
        value: id
      }));

      connection.promise().query(
        'SELECT E.id, CONCAT(E.first_name," ",E.last_name) AS manager FROM employee E;'
      )
        .then(([managers]) => {
          let managerChoices = managers.map(({ id, manager }) => ({
            value: id,
            name: manager
          }));

          inquirer.prompt([
            {
              type: 'input',
              name: 'firstName',
              message: 'What is the employee\'s first name (Required)',
              validate: firstName => {
                if (firstName) {
                  return true;
                } else {
                  console.log('Please enter the employee\'s first name!');
                  return false;
                }
              }
            },
            {
              type: 'input',
              name: 'lastName',
              message: 'What is the employee\'s last name (Required)',
              validate: lastName => {
                if (lastName) {
                  return true;
                } else {
                  console.log('Please enter the employee\'s last name!');
                  return false;
                }
              }
            },
            {
              type: 'list',
              name: 'role',
              message: 'What is the employee\'s role?',
              choices: titleChoices
            },
            {
              type: 'list',
              name: 'manager',
              message: 'Who is the employee\'s manager?',
              choices: managerChoices
            }
          ])
            .then(({ firstName, lastName, role, manager }) => {
              const query = connection.query(
                'INSERT INTO employee SET ?',
                {
                  first_name: firstName,
                  last_name: lastName,
                  role_id: role,
                  manager_id: manager
                },
                function (err, res) {
                  if (err) throw err;
                  console.log({ role, manager });
                }
              );
            })
            .then(() => selectionEmployee());
        });
    });
};

selectionUpdateEmployeeRole = () => {
    return connection.promise().query(
      "SELECT id, title FROM role;"
    )
      .then(([rows]) => {
        const roleChoices = rows.map(({ id, title }) => ({ value: id, name: title }));
        return inquirer.prompt([
          {
            type: 'list',
            name: 'roleId',
            message: 'Which role do you want to update?',
            choices: roleChoices
          },
          {
            type: 'input',
            name: 'title',
            message: 'Enter the updated title of the role (Required)',
            validate: (title) => {
              if (title) {
                return true;
              } else {
                return 'Please enter the updated title of the role';
              }
            }
          },
          {
            type: 'number',
            name: 'salary',
            message: 'Enter the updated salary of the role (Required)',
            validate: (salary) => {
              if (salary) {
                return true;
              } else {
                return 'Please enter the updated salary of the role';
              }
            }
          }
        ]);
      })
      .then(({ roleId, title, salary }) => {
        const query = 'UPDATE role SET title = ?, salary = ? WHERE id = ?';
        return connection.promise().query(query, [title, salary, roleId]);
      })
      .then(() => {
        console.log('Role updated successfully!');
        return promptMenu();
      })
      .catch((err) => console.log(err));
  };
  




    
  


promptMenu();



