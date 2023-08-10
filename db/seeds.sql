INSERT INTO department(name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", "100000", 1),
    ("Sales Person", "80000", 1),
    ("Lead Engineer", "150000", 2),
    ("Software Engineer", "120000", 2),
    ("Account Manager", "160000", 3),
    ("Accountant", "125000", 3),
    ("Legal Team Lead", "250000", 4),
    ("Lawyer", "190000", 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, null),
    ("Mike", "Chan", 1, "John Doe"),
    ("Ashley", "Rodriguez", 2, null),
    ("Kevin", "Tupik", 2, "Ashley Rodriguez"),
    ("Kunal", "Singh", 3, null),
    ("Malia", "Brown", 3, "Kunal Singh"),
    ("Sarah", "Lourd", 4, null),
    ("Tom", "Allen", 4, "Sarah Lourd");

CREATE VIEW employee_info AS
(SELECT role.id
AS role_id, role.title, role.salary,
department.name AS department_name
FROM role 
JOIN department 
on role.department_id = department.id);

CREATE VIEW employees_with_managers 
AS
(SELECT emp.id, emp.first_name, emp.last_name, emp.role_id,
CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
FROM employee AS manager RIGHT OUTER JOIN employee AS emp ON manager.id = emp.manager_id);
