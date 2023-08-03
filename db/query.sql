SELECT employees_with_mangers.id AS employee_id,
employees_with_mangers.first_name,
employees_with_mangers.last_name,
employees_with_mangers.manager_name,
employee_info.title,
employee_info.salary,
employee_info.department_name,
FROM employee_info
JOIN employees_with_mangers on employee_info.role_id = employees_with_mangers.role_id;
