
Drop Table Emp;
Drop table Salgrade;
Drop table Dept;

CREATE TABLE DEPT (
 DEPTNO  NUMBER(2),
 DNAME   VARCHAR2(14),
 LOC     VARCHAR2(13),
 CONSTRAINT DEPT_PRIMARY_KEY PRIMARY KEY (DEPTNO)
);

INSERT INTO DEPT VALUES (10,'ACCOUNTING','New York');
INSERT INTO DEPT VALUES (20,'RESEARCH','Dallas');
INSERT INTO DEPT VALUES (30,'SALES','Chicago');
INSERT INTO DEPT VALUES (40,'OPERATIONS','Boston');

CREATE TABLE EMP (
 EMPNO      NUMBER(4),
 ENAME      VARCHAR2(10),
 JOB        VARCHAR2(9),
 MGR        NUMBER(4),
 HIREDATE   DATE,
 SAL        NUMBER(7,2),
 COMM       NUMBER(7,2),
 DEPTNO     NUMBER(2),
  CONSTRAINT EMP_EMPNO_PK PRIMARY KEY (EMPNO),
  CONSTRAINT EMP_DEPTNO_FK FOREIGN KEY (DEPTNO) REFERENCES DEPT (DEPTNO)
);

INSERT INTO EMP VALUES (7839,'King','PRESIDENT',NULL,'1981-11-17',5000,NULL,NULL);
INSERT INTO EMP VALUES (7698,'Blake','MANAGER',7839,'1981-05-01',2850,NULL,30);
INSERT INTO EMP VALUES (7782,'Clark','MANAGER',7839,'1981-06-09',2450,NULL,10);
INSERT INTO EMP VALUES (7566,'Jones','MANAGER',7839,'1981-04-02',2975,NULL,20);
INSERT INTO EMP VALUES (7654,'Martin','SALESMAN',7698,'1981-09-28',1200,1250,30);
INSERT INTO EMP VALUES (7499,'Allen','SALESMAN',7698,'1981-02-20',1600,300,30);
INSERT INTO EMP VALUES (7844,'Turner','SALESMAN',7698,'1981-09-08',1500,0,30);
INSERT INTO EMP VALUES (7900,'James','CLERK',7698,'1981-12-03',950,NULL,30);
INSERT INTO EMP VALUES (7521,'Ward','SALESMAN',7698,'1981-02-22',1250,500,30);
INSERT INTO EMP VALUES (7902,'Ford','ANALYST',7566,'1981-12-03',3000,NULL,20);
INSERT INTO EMP VALUES (7369,'Smith','CLERK',7902,'1980-12-17',800,NULL,20);
INSERT INTO EMP VALUES (7788,'Scott','ANALYST',7566,'1982-12-09',3000,NULL,20);
INSERT INTO EMP VALUES (7876,'Adams','CLERK',7788,'1983-01-12',1100,NULL,20);
INSERT INTO EMP VALUES (7934,'Miller','CLERK',7782,'1982-01-23',1300,NULL,10);


CREATE TABLE SALGRADE (
 GRADE  NUMBER,
 LOSAL  NUMBER,
 HISAL  NUMBER
 );

INSERT INTO SALGRADE VALUES (1,700,1200);
INSERT INTO SALGRADE VALUES (2,1201,1400);
INSERT INTO SALGRADE VALUES (3,1401,2000);
INSERT INTO SALGRADE VALUES (4,2001,3000);
INSERT INTO SALGRADE VALUES (5,3001,9999);

CREATE TABLE testsql_question (
	section text,
	num text,
	question text,
	answer text,
	include text,
	primary key (section, num)
);


insert into testsql_question (section, num, question, answer, include)
values (
	"B", " 1a",
	"Display all the contents of the DEPT table.",
	"Select * from DEPT",
	NULL
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", " 1b",
	"Display all the contents of the EMP table.",
	"Select * from EMP",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", " 1c",
	"Display all the contents of the SALGRADE table.",
	"Select * from SALGRADE",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", " 2",
	"Display the name and commission of all the employees.",
	"SELECT ename, comm
FROM EMP;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", " 3",
	"Display the job title of all the employees.",
	"SELECT job
FROM EMP;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", " 4",
	"Display all the different job titles which currently exist in the company.",
	"SELECT DISTINCT job
FROM EMP;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", " 5",
	'Display the name and commission of all the employees together with another column that shows their commission increased by 10%. Call the increased commission "new_comm"',
	"SELECT ename, comm, comm*1.1 AS NEW_COMM
FROM EMP;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", " 6",
	"Display the employee number, name and current job of all those who workin Department 30.",
	"SELECT empno, ename, job
FROM emp
WHERE deptno=30;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", " 7",
	"Display the names of all the clerks, showing their employee number and that of their manager. Note: String matching is case sensitive; strings must be enclosed within single quote marks.",
	"SELECT ename, empno, mgr
FROM emp
WHERE job='CLERK';",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", " 8",
	"Display details of all employees whose commission is greater than salary.",
	"SELECT *
FROM emp
WHERE comm>sal;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", " 9",
	"Display name, a twentieth of salary as 'Twentieth' and commission of all employees whose commission is greater than a twentieth of their salary.",
	"SELECT ename, sal/20 AS Twentieth, comm
FROM emp
WHERE comm>sal/20;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", "10",
	"Display the name of all clerks and analysts.",
	"SELECT ename
FROM emp
WHERE job = 'CLERK' OR job='ANALYST';",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", "11",
	"Display details of all clerks, analysts and salesmen.",
	"SELECT *
FROM emp
WHERE job = 'CLERK' OR job='ANALYST' OR job='SALESMAN'",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", "12",
	"Display details of employees who are neither managers nor the president; you must not use knowledge about other jobs that might exist, use != instead.",
	"SELECT *
FROM emp
WHERE job != 'MANAGER' AND job != 'PRESIDENT';",
	"AND"
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", "13",
	"Display employee name, job and department number for employees whose names begin with ‘M’.",
	"SELECT ename, job, deptno
FROM emp
WHERE ename LIKE 'M%';",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", "14",
	"Create alternative instructions to answer B11 (details of all clerks, analysts and salesmen). Use IN",
	"SELECT *
FROM emp
WHERE job IN ('CLERK', 'ANALYST', 'SALESMAN')",
	"IN"
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", "15",
	"Write another query to display details of employees who are not managers or the president; use the keyword NOT.",
	"SELECT *
FROM emp
WHERE NOT (job = 'MANAGER' OR job = 'PRESIDENT');",
	"NOT"
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", "16a",
	"Display the name of employees who are not clerks, analysts or salesmen; again you must not use knowledge about other jobs that might exist. Use several comparisons, and *AND* to achieve this.",
	"SELECT ename
FROM emp
WHERE job <> 'CLERK' AND job <> 'ANALYST' AND job <> 'SALESMAN';",
	"AND"
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", "16b",
	"Display the same details (of employees who are not clerks, analysts or salesmen), but this time using NOT.",
	"SELECT ename
FROM emp
WHERE job NOT IN ('CLERK', 'ANALYST', 'SALESMAN');
-- Note: that are yet more alternative ways to obtain this data!",
	"NOT"
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", "17a",
	"Display details of employees whose salaries are between £1,200 and £1,400; use the BETWEEN keyword.",
	"SELECT *
FROM emp
WHERE sal BETWEEN 1200 AND 1400;",
	"BETWEEN"
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", "17b",
	"Display details of employees whose salaries are between £1,200 and £1,400. Find a solution that -does not use- between.",
	"SELECT *
FROM emp
WHERE sal >= 1200 AND sal <= 1400;",
	"<="
);

-- Stage 1: Display details of salesmen and managers.",
insert into testsql_question (section, num, question, answer, include)
values (
	"B", "19-1",
	"Display details of salesmen and managers.",
	"SELECT *
FROM emp
WHERE (job = 'SALESMAN' OR job = 'MANAGER');

-- alternatively:
-- SELECT * FROM emp WHERE job IN ('SALESMAN', 'MANAGER');",
	null
);

-- Stage 2:  -- Run the instruction and check your results.",
insert into testsql_question (section, num, question, answer, include)
values (
	"B", "19-2",
	"Display details of salesmen and managers in dept 30. Hint: if you use OR, you will need brackets.",
	"SELECT *
FROM emp
WHERE job IN ('SALESMAN', 'MANAGER')
-- alternatively: WHERE (job = 'SALESMAN' OR job ='MANAGER')
AND deptno = 30;",
	null
);

-- Stage 3: Display details of those salesmen and managers in dept 30-- whose salary is greater than or equal to £1,500.
insert into testsql_question (section, num, question, answer, include)
values (
	"B", "19-3",
	"Display details of those salesmen and managers in dept 30 whose salary is greater than or equal to £1,500.  Check your results carefully.
(Note: for logical operators - AND takes precedence over OR).",
	"SELECT *
FROM emp
WHERE job IN ('SALESMAN', 'MANAGER')
AND deptno = 30
AND sal >= 1500;",
	null
);


insert into testsql_question (section, num, question, answer, include)
values (
	"B", "20",
	"Display the employee number, current job and salary of all those who work in Department 30,
with the output in ascending salary order.
As before,you may wish to write and test your instruction in a number of stages.",
	"SELECT empno, job, sal
FROM emp
WHERE deptno=30
ORDER BY sal ASC;",
	null
);


insert into testsql_question (section, num, question, answer, include)
values (
	"B", "21",
	"Display the employee name and current job of all those who work in Department 30, with the output in descending salary order",
	"SELECT ename, job
FROM emp
WHERE deptno=30
ORDER BY sal DESC;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", "22",
	"Display employee details for departments 10 and 30, in name order, within each department. Display the columns to put employee name and department first.",
	"SELECT ename, deptno, empno, job, mgr, hiredate, sal, comm
FROM emp
WHERE deptno IN (10, 30)
ORDER BY deptno, ename;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", "23",
	"Display the employee name, current job and salary of all those who work in Department 30, with the output in descending salary order within each job.",
	"SELECT ename, job, sal
FROM emp
WHERE deptno=30
ORDER BY job, sal DESC;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", "24",
	"Display details of employees recruited before 1st March 1981, in hiredate order. Note: in SQLite, dates follow the ISO format (YYYY-MM-DD)",
	"SELECT * FROM emp
WHERE hiredate < '1981-03-01'
ORDER BY HIREDATE;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", "25",
	"Display details of employees who were recruited during 1983.  Do NOT use wildcards, follow the 'YYYY-MM-DD' format.",
	"SELECT * FROM emp
WHERE hiredate BETWEEN '1983-01-01' AND '1983-12-31';",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"B", "26",
	"Display, in chronological order, the name, hire date and job details of employees who have been with the company for more than approximately 36 years. Do NOT pre-calculate the values you use: in SQLite, use the julianday() function which returns a number of days, and 'now' for the current date.",
	"SELECT ename, hiredate, job
FROM emp
WHERE (julianday('now')-julianday(HIREDATE))/365 > 36",
	"julianday,now"
);

insert into testsql_question (section, num, question, answer, include)
values (
	"C"," 1",
	"What are the lowest and highest basic salaries within the company?",
	"Select MIN(sal), MAX(sal)
FROM emp;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"C", " 2",
	"How many people have a salary greater than £2000?",
	"Select COUNT(empno) FROM emp
WHERE sal > 2000;",
	null
);


insert into testsql_question (section, num, question, answer, include)
values (
	"C", " 3",
	"How many people are there in department 10?",
	"Select COUNT(EMPNO) FROM emp
WHERE deptno=10;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"C", " 5",
	"List the names of employees with no commission recorded in their details.",
	"Select ename FROM emp
WHERE comm IS NULL;
-- Important: to find NULLs we use IS, not the = sign",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"C", " 6",
	'List the name, job and commission for all employees,
replacing the commission with a 0 for employees that have none. Use the SQLite "ifnull" function',
	"SELECT ename, job, ifnull(comm,0)
FROM emp;

-- any value may be substituted for the null - not just zero!!
-- 0 is the often useful for numeric columns.",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"C", " 7",
	"Change C6 to list the name, job and total income (salary + commission) for all employees.  Ensure the total income is shown for all employees, including those without commission.",
	"SELECT ename, job, sal+ifnull(comm,0)
FROM emp;

-- Note how we are combining two operations: the + and the ifnull function.",
	"ifnull"
);

insert into testsql_question (section, num, question, answer, include)
values (
	"C", " 8",
	"What are the highest and lowest incomes (including commission) for all
employees?",
	"Select MAX(sal+ifnull(comm,0)), MIN(sal+ifnull(comm,0))
FROM emp;",
	"ifnull"
);

insert into testsql_question (section, num, question, answer, include)
values (
	"C", " 9",
	"What is the total income (one value per person) of those employees who have been
allocated commission (ie a commission value is recorded)? Rename the column 'income'",
	"Select sal+comm
FROM emp
WHERE comm is not null;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"C", "11",
	"How many people are there in each department?",
	"Select deptno, count(empno)
FROM emp
GROUP BY deptno;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"C", "12",
	"How many people are there in each type of job within each department?",
	"Select deptno, job, count(empno)
FROM emp
GROUP BY deptno, job;",
	null
);


insert into testsql_question (section, num, question, answer, include)
values (
	"C", "13",
	"For each department, find the average salary and the total salary bill
excluding commission. ",
	"Select deptno, AVG(sal), SUM(sal)
FROM emp
GROUP BY deptno;",
	null
);


insert into testsql_question (section, num, question, answer, include)
values (
	"C", "14",
	"For each department, find the maximum commission earned, and the number
of people in that department.",
	"Select deptno, MAX(ifnull(comm,0)), COUNT(empno)
FROM emp
GROUP BY deptno;",
	"ifnull"
);

/*
insert into testsql_question (section, num, question, answer, include)
values (
	"C", "15",
	"",
	"SELECT AREA, COUNT(REFNO) Customers
FROM 	CUST
GROUP BY AREA
HAVING	COUNT(REFNO) > 1 ;",
	null
);
*/

insert into testsql_question (section, num, question, answer, include)
values (
	"C", "16",
	"Display the department number and number of employees in departments with
5 or more employees.",
	"Select deptno, COUNT(empno)
FROM emp
GROUP BY deptno
HAVING COUNT(*) >= 5;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"C", "17",
	"Display in descending value, the average salary for those jobs held by
two or more people.",
	"Select job, AVG(sal)
FROM emp
GROUP BY job
HAVING count(empno)>=2
ORDER BY AVG(sal) DESC;",
	"ORDER"
);

insert into testsql_question (section, num, question, answer, include)
values(
	"D", " 3",
	"Show the name of each employee and, by name, the department they belong to. You will need to join the two tables.",
	"select ename, dname
FROM emp
INNER JOIN dept
ON emp.deptno = dept.deptno;

-- Joins are always needed for multiple tables.",
	null
);

insert into testsql_question (section, num, question, answer, include)
values(
	"D", " 4",
	"Display each employee's name along with the city they work in.",
	"select ename, loc
FROM emp
INNER JOIN dept
ON emp.deptno = dept.deptno;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values(
	"D", " 7",
	"Find the name and salary of employees in DALLAS.",
	"select ename, sal
FROM emp
INNER JOIN dept
ON emp.deptno = dept.deptno
WHERE loc='DALLAS';",
	null
);


insert into testsql_question (section, num, question, answer, include)
values(
	"D", " 8",
	"Display all details of employees in ACCOUNTING. Don’t answer this by using 'WHERE Deptno = 10'. Use two tables to find the department by name.",
	"select emp.*
FROM emp
INNER JOIN dept
ON emp.deptno = dept.deptno
WHERE dname = 'ACCOUNTING';

-- This will give all fields from emp and those in dept that are extra",
	null
);

insert into testsql_question (section, num, question, answer, include)
values(
	"D", " 9",
	"Display the department name along with the lowest and highest salaries in
each department.",
	'select dname, MIN(sal), MAX(sal)
FROM emp
INNER JOIN dept
ON emp.deptno = dept.deptno
GROUP BY dname;',
	null
);

insert into testsql_question (section, num, question, answer, include)
values(
	"D", "10",
	'Find the highest and lowest incomes (including commission) in the
Sales department?  Rename the two columns "Max income" and "Min income" (You might like to refer back to exercise C10.)',
	'SELECT MAX(sal+ifnull(comm,0)) AS "Max income",
	MIN(sal+ifnull(comm,0)) AS "Min income"
FROM emp
INNER JOIN dept
ON emp.deptno = dept.deptno
AND dname=''SALES'';

-- The column aliases help when calculations are complex.',
	'JOIN'
);

insert into testsql_question (section, num, question, answer, include)
values(
	"D", "11",
	"Display the department name and number of employees in departments with 5
or more employees.  (Refer back to C14.)",
	"select dname, count(empno)
FROM emp
INNER JOIN dept
ON emp.deptno = dept.deptno
GROUP BY dname
HAVING count(empno) >= 5;",
	null
);


insert into testsql_question (section, num, question, answer, include)
values(
	"D", "12",
	'Find out the total income (renamed "Total Income") for all employees in each city.  This will
include commission.',
	'select loc, SUM(sal+ifnull(comm,0)) AS "Total Income"
FROM emp
INNER JOIN dept
ON emp.deptno = dept.deptno
GROUP BY loc;',
	null
);


insert into testsql_question (section, num, question, answer, include)
values(
	"D", "13",
	"Produce a list that will show the salary grade each
employee is on. Display the name, job, salary and grade
with the output in ascending order of salary, and with
those on the same salary ordered alphabetically.",
	"select ename, job, sal, grade
from emp
inner join salgrade
on sal between losal and hisal
order by sal, ename;",
	null
);


insert into testsql_question (section, num, question, answer, include)
values(
	"D", "14",
	"Display employee name, job, salary and department
name for those on grade 3.",
	"select ename, job, sal, dname
from emp
inner join salgrade
on sal between losal and hisal
inner join dept
on emp.deptno = dept.deptno
where grade = 3;",
	null
);

-------------------- Section G ------------------

insert into testsql_question (section, num, question, answer, include)
values (
	"G", " 1",
	"Show the name and salary of every employee
and the name of the department where they work.
Use aliases to replace table names with their initials.",
	"select ename, sal, dname
from emp e
inner join dept d
on e.deptno = d.deptno;",
	"emp e, dept d"
);

insert into testsql_question (section, num, question, answer, include)
values (
	"G", " 2a",
	'List the names of Employees (as "worker"), together with their manager''s name (as "boss"). Find the boss'' name, not just their number.',
	"select staff.ename worker, manager.ename boss
from emp staff
inner join emp manager
on staff.mgr = manager.empno;

-- the difficulty is knowing which is which - employee or manager",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"G", " 2b",
	"Show the name, employee number and manager's name of
those who are managed by either Blake or Jones.
Keep renaming employee and manager as worker and boss, for clarity.",
	"select staff.ename as worker, staff.empno, manager.ename as boss
from emp staff
inner join emp manager
on staff.mgr = manager.empno
Where (manager.ename = 'Jones' or manager.ename = 'Blake');

-- alternative solution

select staff.ename as worker, staff.empno, manager.ename as boss
from emp staff
inner join emp manager
on staff.mgr = manager.empno
where manager.ename IN ( 'Jones',  'Blake');",
	null
);


insert into testsql_question (section, num, question, answer, include)
values (
	"G", " 3",
	"Display the names of all the people in a management
position, their department number and the number of
staff for whom they have direct responsibility.
(This is not a case of asking for those with job
'MANAGER' - who manages Blake? We are looking for those employees
that manage one or more employees, ie where employees have them
as their manager (column MGR).",
	"select manager.ename, manager.deptno, count(staff.empno)
from emp staff
inner join emp manager
on staff.mgr = manager.empno
group by manager.ename, manager.deptno;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"G", " 4",
	"Show the result of G3 (names of all the people in a management position,
their department number and the number of staff for whom they have direct
responsibility), but only for those people who are directly responsible for
the management of more than two employees.",
	"select manager.ename, manager.deptno, count(staff.empno)
from emp staff
inner join emp manager
on staff.mgr = manager.empno
group by manager.ename, manager.empno
having count(staff.empno) > 2;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"G", " 5",
	"Display the employee name, location and department number of
those managers whose salary is greater than £1500. Ensure the results do not include duplicates.",
	"select distinct manager.ename, loc, dept.deptno
from emp staff
inner join emp manager
on staff.mgr = manager.empno
inner join dept
on manager.deptno = dept.deptno
where manager.sal > 1500;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"G", " 6",
	"For all employees list their name, salary and location.",
	"select ename, sal, loc
from emp
inner join dept
on emp.deptno = dept.deptno

-- But 'King' is missing, because he is not in any department.",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"G", " 7a",
	"One person, 'King', is missing from the last result, because he is not associated to any department.",
	"select ename, sal, loc
from emp left outer join dept
on emp.deptno = dept.deptno;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"G", " 8",
	"Display the employee name, location and department name of those whose
salary is greater than £1500.  Ensure all relevant employees are selected.",
	"select ename, loc, dname
from emp left outer join dept
on emp.deptno = dept.deptno
where sal > 1500;

-- note the 'left' outer join points to the emp table,
-- which has all the values that we are looking for
-- while dept may return NULLs.",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"G", " 9",
	"For all employees (i.e. to include the President) display their own name
and employee number and if they have one, their manager's name and number.",
	"select staff.ename, staff.empno, manager.empno, manager.ename
from emp staff
left outer join emp manager
on staff.mgr = manager.empno;

-- ...staff left outer join...
-- returns all employees, including the president
-- even though he has no manager.",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"G", "10",
	"List the names and department name of all employees that are not in the RESEARCH department, including the president.",
	"select ename, dname
from emp
left outer join dept
on emp.deptno = dept.deptno
where (dname is null or dname != 'RESEARCH');

-- The NULL dname can't be compared to anything
-- not even to find whether it is 'different'
-- which is why the surprising use of 'OR'",
	null
);


insert into testsql_question (section, num, question, answer, include)
values (
	"G", "11",
	"List the names of those departments that have no employees.",
	"select dname
from dept
left outer join emp
on dept.deptno = emp.deptno
where emp.deptno is null;

-- *** or with a right join! ***

select dname
from emp
right outer join dept
on dept.deptno = emp.deptno
where emp.deptno is null;

-- *** or (!!) by counting employees and keeping only departments with 0 employees ***

select dname
from dept
left outer join emp
on dept.deptno = emp.deptno
group by dname
having count(ename) = 0;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"G", "12",
	"List the departmental names and number of employees in departments with
fewer than 6 employees.",
	"select dname, count(empno)
from dept
left outer join emp
on dept.deptno = emp.deptno
group by dname
having count(emp.empno) < 6;

-- it is important to use a non-null column for the count parameters.",
	null
);

-------------------- Section H ------------------

insert into testsql_question (section, num, question, answer, include)
values (
	"H", " 5a",
	"What is the value of the highest basic salary?",
	"select max(sal)
from emp;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"H", " 5b",
	"Who has the highest basic salary?
(this cannot be answered straight off - using the previous query
that gives the highest salary, we can find who has that salary.)",
	"select ename
from emp
where sal = ( select max(sal)
              from emp
            );",
	"max"
);

insert into testsql_question (section, num, question, answer, include)
values (
	"H", " 6",
	"Which salesman earns the most, including commission?",
	"select ename
from emp
where job = 'SALESMAN'
and (sal + nvl(comm, 0)) = ( select max(sal + nvl(comm, 0)) max_pay
                             from emp
                             where job = 'SALESMAN'
                           );
                          
-- note the necessity to repeat 'SALESMAN'
-- and to match income to income (apples with apples, pears with pears;",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"H", " 6b",
	"Who in New York has the highest income?
Don’t work out how many people there are in department 10, department
codes may change next week!",
	"-- identify what is the highest income in New York
 select max(sal + ifnull(comm, 0))
 from emp
 inner join dept
 on emp.deptno = dept.deptno
 where loc = 'New York';

-- now embed as a subquery, remember to repeat the 'NEW YORK'

select ename
from emp
inner join dept
on emp.deptno = dept.deptno
where loc = 'New York'
and (sal + ifnull(comm, 0)) = (
   select max(sal + ifnull(comm, 0))
   from emp
	inner join dept
   on emp.deptno = dept.deptno
   where loc = 'New York'
);",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"H", " 7",
	"List the names of the people who work with Jones (you may use the fact
that his Employee number is 7566 as there may be more than one 'JONES' on
the list) in his department.",
	"select ename
from emp
where empno != 7566
and deptno = (
   select deptno
   from emp
   where empno = 7566
);",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"H", " 8",
	"List the names of anyone who started work on the same date as FORD.",
	"select ename
from emp
where ename != 'Ford`'
and hiredate = (
   select hiredate
   from emp
   where ename = 'Ford'
);",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"H", " 9",
	"Does anyone have a basic salary that is the same as that of FORD ?",
	"select ename
from emp
where ename != 'Ford'
and sal = (
   select sal
   from emp
   where ename = 'Ford'
);",
	null
);

insert into testsql_question (section, num, question, answer, include)
values (
	"H", "10 (i)",
	"What is the average salary of those employees on Grade 2?  Use a subquery
in your solution.",
	"select avg(sal)
from emp
where empno in (
   select empno
   from emp
	inner join salgrade
   on sal between losal and hisal
   where grade = 2
)",
   "IN"
);


insert into testsql_question (section, num, question, answer, include)
values (
	"H", "10 (ii)",
	"Write another query to find the average salary of those employees on Grade 2, but without using a subquery.",
	"select avg(sal)
from emp
inner join salgrade
on sal between losal and hisal
where grade = 2;",
   "JOIN"
);


insert into testsql_question (section, num, question, answer, include)
values (
	"H", "11",
	"Find the name and salary of the people who earn more than the average
salary of those on grade 2.",
	"select ename, sal
from emp
where sal > (
   select avg(sal)
   from emp
   inner join salgrade
   on sal between losal and hisal
   where grade = 2
);",
	null
);
