import { Part, QuizQuestion } from '../types/sql';

export const PART_2: Part = {
  id: 'part-2',
  number: 2,
  title: 'Part 2: Data Manipulation & Querying',
  subtitle: 'Single & Multi-Row INSERT • Projections • Aliases & WHERE Predicates',
  description: 'Master Data Manipulation Language (DML) and Data Query Language (DQL): populate tables using single and multi-row INSERT, handle partial columns and implicit NULL values, project specific attributes with AS aliases, and filter datasets using WHERE predicates and IS NULL checks.',
  badge: 'Part 2 • DML & Queries',
  topics: [
    {
      id: 'topic-2-1',
      title: 'Topic 2.1: Data Ingestion Variations',
      subtitle: 'Single & Multi-Row INSERT • Partial Columns • Implicit NULLs',
      conceptBadge: 'DML Ingestion',
      description: 'Explore the various patterns for populating MySQL tables: standard single-row INSERT, high-throughput multi-row batch INSERT, and partial column insertions that automatically assign NULL to omitted attributes.',
      commands: [
        'use pandiyan_store;',
        'insert into emp values(1, "kishor", 400.00, "2001-01-01");',
        'select * from emp;',
        'insert into emp values(2, "rakesh", 400.00, "2001-01-01"), (3, "manish", 400.00, "2001-01-01");',
        'select * from emp;',
        'insert into emp(id, name) values(4, "begam");',
        'select * from emp;'
      ],
      steps: [
        {
          id: 'step-2-1-1',
          stepNumber: 1,
          sql: 'use pandiyan_store;',
          actionLabel: 'Select Active Database',
          explanation: 'Switches the session focus to pandiyan_store where table emp is located.',
          animationType: 'show_databases',
          statusMessage: 'Database changed to pandiyan_store.',
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(10,2)' },
              { name: 'join_date', type: 'date' }
            ],
            rows: [],
            statusNote: 'Connected to pandiyan_store.emp.'
          },
          keyTakeaways: ['USE ensures queries target the correct schema.']
        },
        {
          id: 'step-2-1-2',
          stepNumber: 2,
          sql: 'insert into emp values(1, "kishor", 400.00, "2001-01-01");',
          actionLabel: 'Single-Row INSERT',
          explanation: 'Inserts a single employee record into emp. Since column names were not specified, values must match the exact column count and order of the schema.',
          animationType: 'insert_row',
          statusMessage: 'Query OK, 1 row affected (0.002 sec)',
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(10,2)' },
              { name: 'join_date', type: 'date' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01' }
            ],
            statusNote: '1 row inserted into emp.'
          },
          keyTakeaways: ['Positional INSERT values must match the table schema column count.', 'Date literals must follow "YYYY-MM-DD".']
        },
        {
          id: 'step-2-1-3',
          stepNumber: 3,
          sql: 'select * from emp;',
          actionLabel: 'Inspect First Inserted Record',
          explanation: 'Queries table emp to confirm that the row for kishor was successfully committed.',
          animationType: 'select_query',
          statusMessage: '1 row in set (0.001 sec)',
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(10,2)' },
              { name: 'join_date', type: 'date' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01' }
            ],
            statusNote: 'Single row active.'
          },
          keyTakeaways: ['SELECT * returns all columns for all active rows.']
        },
        {
          id: 'step-2-1-4',
          stepNumber: 4,
          sql: 'insert into emp values\n  (2, "rakesh", 400.00, "2001-01-01"),\n  (3, "manish", 400.00, "2001-01-01");',
          actionLabel: 'Multi-Row Batch INSERT',
          explanation: 'Inserts multiple tuples in a single statement separated by commas. Batch inserts are much faster than running individual INSERT statements.',
          animationType: 'insert_multi',
          statusMessage: 'Query OK, 2 rows affected (0.002 sec)\nRecords: 2  Duplicates: 0  Warnings: 0',
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(10,2)' },
              { name: 'join_date', type: 'date' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01' },
              { id: 3, name: 'manish', salary: '400.00', join_date: '2001-01-01' }
            ],
            statusNote: '2 additional rows inserted via batching.'
          },
          keyTakeaways: ['Batch inserting reduces round-trip network and disk I/O latency.', 'Comma-separated value lists allow arbitrary batch sizes.']
        },
        {
          id: 'step-2-1-5',
          stepNumber: 5,
          sql: 'select * from emp;',
          actionLabel: 'Inspect 3 Active Rows',
          explanation: 'Verifies the cumulative 3 records currently stored inside table emp.',
          animationType: 'select_query',
          statusMessage: '3 rows in set (0.001 sec)',
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(10,2)' },
              { name: 'join_date', type: 'date' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01' },
              { id: 3, name: 'manish', salary: '400.00', join_date: '2001-01-01' }
            ],
            statusNote: '3 rows displayed.'
          },
          keyTakeaways: ['Rows are stored in tabular format with identical column layouts.']
        },
        {
          id: 'step-2-1-6',
          stepNumber: 6,
          sql: 'insert into emp(id, name) values(4, "begam");',
          actionLabel: 'Partial Column INSERT with NULLs',
          explanation: 'Inserts values for only id and name. The unmentioned columns (salary and join_date) automatically receive NULL as their default value.',
          animationType: 'insert_partial',
          statusMessage: 'Query OK, 1 row affected (0.002 sec)',
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(10,2)' },
              { name: 'join_date', type: 'date' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01' },
              { id: 3, name: 'manish', salary: '400.00', join_date: '2001-01-01' },
              { id: 4, name: 'begam', salary: null, join_date: null }
            ],
            statusNote: 'Partial insert completed: salary and join_date set to NULL.'
          },
          keyTakeaways: ['Specifying target columns allows omitting non-mandatory fields.', 'Omitted columns default to NULL or their schema DEFAULT.']
        },
        {
          id: 'step-2-1-7',
          stepNumber: 7,
          sql: 'select * from emp;',
          actionLabel: 'Verify NULL Population',
          explanation: 'Reviews all 4 rows in table emp, observing the NULL placeholders in row 4 for begam.',
          animationType: 'select_query',
          statusMessage: '4 rows in set (0.001 sec)',
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(10,2)' },
              { name: 'join_date', type: 'date' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01' },
              { id: 3, name: 'manish', salary: '400.00', join_date: '2001-01-01' },
              { id: 4, name: 'begam', salary: null, join_date: null }
            ],
            statusNote: 'All 4 employee rows retrieved.'
          },
          keyTakeaways: ['NULL represents unknown or missing data in relational SQL.']
        }
      ]
    },
    {
      id: 'topic-2-2',
      title: 'Topic 2.2: Data Projections & Conditional Filtering',
      subtitle: 'SELECT Projections • Column Aliases with AS • WHERE Predicates & NULL Checks',
      conceptBadge: 'DQL Queries',
      description: 'Master data querying fundamentals in MySQL: select specific column projections to minimize memory overhead, rename output attributes using AS aliases, and filter rows using WHERE comparisons, AND conditions, and IS NULL / IS NOT NULL tests.',
      commands: [
        'select * from emp;',
        'select name, salary from emp;',
        'select name as employee_name, salary as monthly_pay from emp;',
        'select * from emp where salary = 400.00;',
        'select * from emp where id > 1;',
        'select * from emp where salary is null;',
        'select * from emp where salary is not null;',
        'select name from emp where salary is not null and id <= 2;'
      ],
      steps: [
        {
          id: 'step-2-2-1',
          stepNumber: 1,
          sql: 'select * from emp;',
          actionLabel: 'Full Table Projection (*)',
          explanation: 'Executes a full table scan returning every column and every row stored in table emp.',
          animationType: 'select_query',
          statusMessage: '4 rows in set (0.001 sec)',
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(10,2)' },
              { name: 'join_date', type: 'date' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01' },
              { id: 3, name: 'manish', salary: '400.00', join_date: '2001-01-01' },
              { id: 4, name: 'begam', salary: null, join_date: null }
            ],
            statusNote: 'All 4 rows and all 4 columns projected.'
          },
          keyTakeaways: ['The wildcard * retrieves every column defined in the table.']
        },
        {
          id: 'step-2-2-2',
          stepNumber: 2,
          sql: 'select name, salary from emp;',
          actionLabel: 'Specific Column Projection',
          explanation: 'Restricts the returned projection to only name and salary, excluding id and join_date.',
          animationType: 'select_query',
          statusMessage: '4 rows in set (0.001 sec)',
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(10,2)' }
            ],
            rows: [
              { name: 'kishor', salary: '400.00' },
              { name: 'rakesh', salary: '400.00' },
              { name: 'manish', salary: '400.00' },
              { name: 'begam', salary: null }
            ],
            statusNote: 'Projected only name and salary columns.'
          },
          keyTakeaways: ['Projecting specific columns saves memory and bandwidth in large tables.']
        },
        {
          id: 'step-2-2-3',
          stepNumber: 3,
          sql: 'select name as employee_name, salary as monthly_pay from emp;',
          actionLabel: 'Assign Column Aliases with AS',
          explanation: 'Uses the AS keyword to rename the result set column headers to employee_name and monthly_pay without changing the underlying physical schema.',
          animationType: 'select_alias',
          statusMessage: '4 rows in set (0.001 sec)',
          highlightDetails: {
            aliasMapping: { name: 'employee_name', salary: 'monthly_pay' }
          },
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'employee_name', type: 'varchar(50)' },
              { name: 'monthly_pay', type: 'decimal(10,2)' }
            ],
            rows: [
              { employee_name: 'kishor', monthly_pay: '400.00' },
              { employee_name: 'rakesh', monthly_pay: '400.00' },
              { employee_name: 'manish', monthly_pay: '400.00' },
              { employee_name: 'begam', monthly_pay: null }
            ],
            statusNote: 'Output headers renamed with AS aliases.'
          },
          keyTakeaways: ['AS provides readable headers for reports and user interfaces.', 'Aliases do not modify underlying table column names.']
        },
        {
          id: 'step-2-2-4',
          stepNumber: 4,
          sql: 'select * from emp where salary = 400.00;',
          actionLabel: 'Exact Match WHERE Filter',
          explanation: 'Filters the rows to only return records where the salary column equals 400.00, matching kishor, rakesh, and manish.',
          animationType: 'select_where',
          statusMessage: '3 rows in set (0.001 sec)',
          highlightDetails: { filterCondition: 'salary = 400.00', highlightedRowIndices: [0, 1, 2] },
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(10,2)' },
              { name: 'join_date', type: 'date' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01' },
              { id: 3, name: 'manish', salary: '400.00', join_date: '2001-01-01' }
            ],
            statusNote: 'Filtered 3 rows where salary = 400.00.'
          },
          keyTakeaways: ['WHERE evaluates each row and keeps only those that evaluate to TRUE.', 'NULL values evaluate to UNKNOWN and are excluded by = comparisons.']
        },
        {
          id: 'step-2-2-5',
          stepNumber: 5,
          sql: 'select * from emp where id > 1;',
          actionLabel: 'Relational Comparison (id > 1)',
          explanation: 'Filters rows with an id strictly greater than 1, returning rakesh (2), manish (3), and begam (4).',
          animationType: 'select_where',
          statusMessage: '3 rows in set (0.001 sec)',
          highlightDetails: { filterCondition: 'id > 1', highlightedRowIndices: [1, 2, 3] },
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(10,2)' },
              { name: 'join_date', type: 'date' }
            ],
            rows: [
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01' },
              { id: 3, name: 'manish', salary: '400.00', join_date: '2001-01-01' },
              { id: 4, name: 'begam', salary: null, join_date: null }
            ],
            statusNote: 'Filtered 3 rows where id > 1.'
          },
          keyTakeaways: ['Relational operators (<, <=, >, >=, !=) work on numeric and date types.']
        },
        {
          id: 'step-2-2-6',
          stepNumber: 6,
          sql: 'select * from emp where salary is null;',
          actionLabel: 'Inspect Missing Values with IS NULL',
          explanation: 'Tests for the absence of a value using IS NULL. Note that "= NULL" would never match because NULL is not equal to anything, not even itself.',
          animationType: 'select_where',
          statusMessage: '1 row in set (0.001 sec)',
          highlightDetails: { filterCondition: 'salary IS NULL', highlightedRowIndices: [3] },
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(10,2)' },
              { name: 'join_date', type: 'date' }
            ],
            rows: [
              { id: 4, name: 'begam', salary: null, join_date: null }
            ],
            statusNote: '1 row retrieved where salary is NULL.'
          },
          keyTakeaways: ['Always use IS NULL to test for NULL values; never use = NULL.', 'Begam is the only employee currently with a NULL salary.']
        },
        {
          id: 'step-2-2-7',
          stepNumber: 7,
          sql: 'select * from emp where salary is not null;',
          actionLabel: 'Filter Known Values with IS NOT NULL',
          explanation: 'Retrieves all employees who have a defined numeric salary, excluding any records where salary is NULL.',
          animationType: 'select_where',
          statusMessage: '3 rows in set (0.001 sec)',
          highlightDetails: { filterCondition: 'salary IS NOT NULL', highlightedRowIndices: [0, 1, 2] },
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(10,2)' },
              { name: 'join_date', type: 'date' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01' },
              { id: 3, name: 'manish', salary: '400.00', join_date: '2001-01-01' }
            ],
            statusNote: '3 rows retrieved where salary is NOT NULL.'
          },
          keyTakeaways: ['IS NOT NULL filters out incomplete or missing records.']
        },
        {
          id: 'step-2-2-8',
          stepNumber: 8,
          sql: 'select name from emp where salary is not null and id <= 2;',
          actionLabel: 'Compound Condition with AND',
          explanation: 'Combines multiple predicates with AND: must have a non-null salary AND have an id <= 2. Only kishor and rakesh satisfy both criteria.',
          animationType: 'select_where',
          statusMessage: '2 rows in set (0.001 sec)',
          highlightDetails: { filterCondition: 'salary IS NOT NULL AND id <= 2', highlightedRowIndices: [0, 1] },
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'name', type: 'varchar(50)' }
            ],
            rows: [
              { name: 'kishor' },
              { name: 'rakesh' }
            ],
            statusNote: '2 rows satisfy compound AND predicate.'
          },
          keyTakeaways: ['AND requires both conditions to be TRUE.', 'Projections can be restricted to specific columns like name.']
        }
      ]
    }
  ]
};

export const PART_2_QUIZ: QuizQuestion[] = [
  {
    id: 'p2-q1',
    topicId: 'topic-2-1',
    question: 'How do you insert multiple rows into a MySQL table within a single SQL statement?',
    options: [
      'Separate each tuple with a semicolon: INSERT INTO t VALUES(...); VALUES(...);',
      'Separate each tuple with a comma: INSERT INTO t VALUES (1, "a"), (2, "b");',
      'Use the BATCH keyword: INSERT BATCH INTO t VALUES(...);',
      'MySQL does not allow inserting multiple rows in one query'
    ],
    correctIndex: 1,
    explanation: 'MySQL supports multi-row inserts by separating comma-delimited parenthesized value tuples in a single INSERT INTO statement.'
  },
  {
    id: 'p2-q2',
    topicId: 'topic-2-1',
    question: 'What happens to unlisted columns when executing a partial INSERT such as "INSERT INTO emp(id, name) VALUES(1, "begam");"?',
    options: [
      'The query fails with Error 1136 Column Count Mismatch',
      'The unmentioned columns receive an empty string ""',
      'The unmentioned columns receive NULL (or their schema DEFAULT value)',
      'The table columns are dropped automatically'
    ],
    correctIndex: 2,
    explanation: 'When columns are omitted in an explicit column list, MySQL assigns their specified DEFAULT value or NULL if nullable.'
  },
  {
    id: 'p2-q3',
    topicId: 'topic-2-2',
    question: 'Why does "WHERE salary = NULL" fail to match rows where salary is missing?',
    options: [
      'Syntax error: MySQL keywords cannot follow the = sign',
      'In SQL three-valued logic, comparison with NULL yields UNKNOWN, not TRUE',
      'You must always write "salary == NULL"',
      'NULL can only be compared to numbers'
    ],
    correctIndex: 1,
    explanation: 'In SQL, NULL signifies unknown. Any comparison with = NULL evaluates to UNKNOWN (not TRUE), so you must use "IS NULL" or "IS NOT NULL".'
  },
  {
    id: 'p2-q4',
    topicId: 'topic-2-2',
    question: 'What does the "AS" keyword do in "SELECT salary AS monthly_pay FROM emp;"?',
    options: [
      'Permanently renames the salary column on the physical disk schema',
      'Provides a temporary alias label for the result set output column',
      'Converts the salary data type into string',
      'Filters the rows based on monthly pay'
    ],
    correctIndex: 1,
    explanation: 'The AS keyword designates a column alias for the result set projection without affecting the underlying database table definition.'
  }
];

export const PART_2_PRESETS = [
  { label: 'P2: Use pandiyan_store', query: 'use pandiyan_store;' },
  { label: 'P2: Insert kishor (Single row)', query: 'insert into emp values(1, "kishor", 400.00, "2001-01-01");' },
  { label: 'P2: Select * from emp', query: 'select * from emp;' },
  { label: 'P2: Insert rakesh & manish (Batch)', query: 'insert into emp values\n  (2, "rakesh", 400.00, "2001-01-01"),\n  (3, "manish", 400.00, "2001-01-01");' },
  { label: 'P2: Select * from emp (3 rows)', query: 'select * from emp;' },
  { label: 'P2: Insert partial (begam, NULL salary)', query: 'insert into emp(id, name) values(4, "begam");' },
  { label: 'P2: Select * from emp (Inspect NULL)', query: 'select * from emp;' },
  { label: 'P2: Select specific columns (name, salary)', query: 'select name, salary from emp;' },
  { label: 'P2: Select with AS aliases', query: 'select name as employee_name, salary as monthly_pay from emp;' },
  { label: 'P2: Select where salary = 400.00', query: 'select * from emp where salary = 400.00;' },
  { label: 'P2: Select where id > 1', query: 'select * from emp where id > 1;' },
  { label: 'P2: Select where salary is null', query: 'select * from emp where salary is null;' },
  { label: 'P2: Select where salary is not null', query: 'select * from emp where salary is not null;' },
  { label: 'P2: Select where salary not null AND id <= 2', query: 'select name from emp where salary is not null and id <= 2;' }
];
