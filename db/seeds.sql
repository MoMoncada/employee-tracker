-- This is a seeds.sql file to pre-populate the database --

-- Data to populate the department table --
INSERT INTO department (department_name)
VALUES  ("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal");


-- Data to populate the  role table --
INSERT INTO role (title, salary, department_id)
VALUES ('Chief Sales Officer', 100000, 1),
       ('Sales Executive', 80000, 1),
       ('Lead Software Engineer', 150000, 2),
       ('Software Developer', 120000, 2),
       ('Senior Account Manager', 160000, 3),
       ('Financial Analyst', 125000, 3),
       ('Chief Legal Officer', 250000, 4),
       ('Corporate Attorney', 190000, 4);



-- Data to populate employee table --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Han', 'Solo', 1, NULL),
       ('Chew', 'Bacca', 2, 1),
       ('ObiWan', 'Kenobi', 3, NULL),
       ('Anakin', 'Skywalker', 4, 3),
       ('Leia', 'Organa', 5, NULL),
       ('Luke', 'Skywalker', 6, 5),
       ('Padme', 'Amidala', 7, NULL),
       ('Ahsoka', 'Tano', 8, 7);