import { Part, QuizQuestion } from '../types/sql';

export const PART_1: Part = {
  id: 'part-1',
  number: 1,
  title: 'Part 1: DDL Operations',
  subtitle: 'Databases • Table Creation • Column Alterations & Position Morphing',
  description: 'Master Data Definition Language (DDL) in MySQL: create and drop databases, protect schemas with READ ONLY modes, construct and rename tables, and morph schemas using ADD, MODIFY, and column reordering with FIRST and AFTER.',
  badge: 'Part 1 • DDL Basics',
  topics: [
    {
      id: 'topic-1-1',
      title: 'Topic 1.1: Database Operations & Management',
      subtitle: 'CREATE / DROP DATABASE • Schema Inspection • READ ONLY Protection',
      conceptBadge: 'DDL Database',
      description: 'Explore MySQL database management fundamentals: inspect system catalogs, create new databases, toggle READ ONLY protection to safeguard critical schemas, and safely drop databases.',
      commands: [
        'show databases;',
        'create database pandiyan_store;',
        'alter database pandiyan_store read only = 1;',
        'drop database pandiyan_store;',
        'alter database pandiyan_store read only = 0;',
        'use pandiyan_store;'
      ],
      steps: [
        {
          id: 'step-1-1-1',
          stepNumber: 1,
          sql: 'show databases;',
          actionLabel: 'Inspect Existing Databases',
          explanation: 'Queries the MySQL data dictionary to display all available database catalogs, including system catalogs like information_schema and performance_schema.',
          animationType: 'show_databases',
          statusMessage: '4 rows in set (0.001 sec)',
          afterState: {
            databaseName: 'None',
            availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys'],
            statusNote: 'System catalogs loaded'
          },
          keyTakeaways: ['SHOW DATABASES lists all schemas accessible by the user.', 'System schemas store MySQL metadata.']
        },
        {
          id: 'step-1-1-2',
          stepNumber: 2,
          sql: 'create database pandiyan_store;',
          actionLabel: 'Create New Database Catalog',
          explanation: 'Initializes a new storage namespace directory on disk for our store application named pandiyan_store.',
          animationType: 'create_db',
          statusMessage: 'Query OK, 1 row affected (0.002 sec)',
          highlightDetails: { databaseName: 'pandiyan_store' },
          afterState: {
            databaseName: 'pandiyan_store',
            availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'pandiyan_store'],
            statusNote: 'Database pandiyan_store created successfully.'
          },
          keyTakeaways: ['CREATE DATABASE allocates a distinct storage space.', 'Database names must be unique within an instance.']
        },
        {
          id: 'step-1-1-3',
          stepNumber: 3,
          sql: 'alter database pandiyan_store read only = 1;',
          actionLabel: 'Enable READ ONLY Protection',
          explanation: 'Activates MySQL read-only safeguard on pandiyan_store. Prevents accidental DROP DATABASE, table creations, or write operations.',
          animationType: 'alter_db_readonly',
          statusMessage: 'Query OK, 0 rows affected (0.001 sec)',
          highlightDetails: { databaseName: 'pandiyan_store', isReadOnly: true },
          afterState: {
            databaseName: 'pandiyan_store',
            isReadOnly: true,
            availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'pandiyan_store'],
            statusNote: 'Database pandiyan_store locked in READ ONLY mode.'
          },
          keyTakeaways: ['READ ONLY = 1 protects schemas against accidental destruction.', 'Requires administrative privilege in production.']
        },
        {
          id: 'step-1-1-4',
          stepNumber: 4,
          sql: 'drop database pandiyan_store;',
          actionLabel: 'Attempt DROP on Protected Database',
          explanation: 'MySQL intercepts the DROP DATABASE command and throws Error 3989 because pandiyan_store is in read-only mode, protecting our data.',
          animationType: 'drop_db',
          statusMessage: 'ERROR 3989 (HY000): Schema pandiyan_store is in read only mode.',
          highlightDetails: { databaseName: 'pandiyan_store', isReadOnly: true },
          afterState: {
            databaseName: 'pandiyan_store',
            isReadOnly: true,
            availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'pandiyan_store'],
            statusNote: 'Deletion safely blocked by MySQL Read-Only protection.'
          },
          keyTakeaways: ['Dropping a read-only database triggers Error 3989.', 'Protection prevents catastrophic accidental deletions.']
        },
        {
          id: 'step-1-1-5',
          stepNumber: 5,
          sql: 'alter database pandiyan_store read only = 0;',
          actionLabel: 'Disable READ ONLY Protection',
          explanation: 'Unlocks pandiyan_store back to read-write mode, allowing normal DDL and DML operations to resume.',
          animationType: 'alter_db_readonly',
          statusMessage: 'Query OK, 0 rows affected (0.001 sec)',
          highlightDetails: { databaseName: 'pandiyan_store', isReadOnly: false },
          afterState: {
            databaseName: 'pandiyan_store',
            isReadOnly: false,
            availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'pandiyan_store'],
            statusNote: 'Database pandiyan_store unlocked for writing.'
          },
          keyTakeaways: ['READ ONLY = 0 restores full read-write access.', 'Enables schema evolution and modifications.']
        },
        {
          id: 'step-1-1-6',
          stepNumber: 6,
          sql: 'use pandiyan_store;',
          actionLabel: 'Select Active Database Context',
          explanation: 'Sets pandiyan_store as the active default database context for the current SQL session.',
          animationType: 'show_databases',
          statusMessage: 'Database changed to pandiyan_store.',
          afterState: {
            databaseName: 'pandiyan_store',
            isReadOnly: false,
            availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'pandiyan_store'],
            statusNote: 'Active database context switched to pandiyan_store.'
          },
          keyTakeaways: ['USE sets the target database for subsequent queries.', 'Subsequent CREATE TABLE queries will target pandiyan_store.']
        }
      ]
    },
    {
      id: 'topic-1-2',
      title: 'Topic 1.2: Table Architecture & Structure',
      subtitle: 'CREATE TABLE • Column Types • Empty State • RENAME TABLE',
      conceptBadge: 'DDL Tables',
      description: 'Learn how to define structural schemas using CREATE TABLE, examine column types and empty state representations, and rename tables without data loss.',
      commands: [
        'use pandiyan_store;',
        'create table emp(id int, name varchar(50), salary decimal(5,2));',
        'select * from emp;',
        'rename table emp to employee;',
        'rename table employee to emp;'
      ],
      steps: [
        {
          id: 'step-1-2-1',
          stepNumber: 1,
          sql: 'create table emp(\n  id int,\n  name varchar(50),\n  salary decimal(5,2)\n);',
          actionLabel: 'Instantiate emp Table Schema',
          explanation: 'Defines the structural blueprint for table emp with 3 typed attributes: id (integer), name (varchar string up to 50 chars), and salary (exact decimal with 5 digits and 2 decimals).',
          animationType: 'create_table',
          statusMessage: 'Query OK, 0 rows affected (0.003 sec)',
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' }
            ],
            rows: [],
            statusNote: 'Table emp initialized with 3 columns.'
          },
          keyTakeaways: ['CREATE TABLE defines column identifiers and data types.', 'DECIMAL(5,2) supports numbers up to 999.99.']
        },
        {
          id: 'step-1-2-2',
          stepNumber: 2,
          sql: 'select * from emp;',
          actionLabel: 'Verify Empty Table State',
          explanation: 'Runs a SELECT projection against emp to inspect its storage. Since no records have been inserted yet, the result set is empty.',
          animationType: 'select_query',
          statusMessage: 'Empty set (0.001 sec)',
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' }
            ],
            rows: [],
            statusNote: 'Empty table verified (0 rows).'
          },
          keyTakeaways: ['A newly created table is empty until populated with INSERT.', 'Column headers exist in metadata immediately.']
        },
        {
          id: 'step-1-2-3',
          stepNumber: 3,
          sql: 'rename table emp to employee;',
          actionLabel: 'Rename Table Schema',
          explanation: 'Renames the physical table identifier from emp to employee without reloading or altering stored rows.',
          animationType: 'rename_table',
          statusMessage: 'Query OK, 0 rows affected (0.001 sec)',
          afterState: {
            tableName: 'employee',
            name: 'employee',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' }
            ],
            rows: [],
            statusNote: 'Table renamed from emp to employee.'
          },
          keyTakeaways: ['RENAME TABLE modifies catalog references instantly.', 'Underlying data remains intact during rename.']
        },
        {
          id: 'step-1-2-4',
          stepNumber: 4,
          sql: 'rename table employee to emp;',
          actionLabel: 'Revert Table Name to emp',
          explanation: 'Restores the original table name emp to align with our upcoming curriculum modules and examples.',
          animationType: 'rename_table',
          statusMessage: 'Query OK, 0 rows affected (0.001 sec)',
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' }
            ],
            rows: [],
            statusNote: 'Table renamed back to emp.'
          },
          keyTakeaways: ['Tables can be renamed seamlessly in MySQL DDL.']
        }
      ]
    },
    {
      id: 'topic-1-3',
      title: 'Topic 1.3: Table Morphing & Schema Alterations',
      subtitle: 'ADD / MODIFY / DROP Column • FIRST & AFTER Position Reordering',
      conceptBadge: 'DDL Alterations',
      description: 'Evolve table schemas dynamically using ALTER TABLE: add new columns, widen precision types with MODIFY, control column physical sequence with FIRST and AFTER, and prune unused attributes.',
      commands: [
        'alter table emp add join_date date;',
        'alter table emp modify column salary decimal(10,2);',
        'alter table emp add ph_no varchar(15) after name;',
        'alter table emp modify ph_no varchar(15) first;',
        'alter table emp modify ph_no varchar(15) after salary;',
        'alter table emp drop column ph_no;'
      ],
      steps: [
        {
          id: 'step-1-3-1',
          stepNumber: 1,
          sql: 'alter table emp add join_date date;',
          actionLabel: 'Append Column join_date',
          explanation: 'Appends a new DATE column named join_date to table emp. By default, new columns are appended to the far right of the column sequence.',
          animationType: 'add_column',
          statusMessage: 'Query OK, 0 rows affected (0.002 sec)',
          highlightDetails: { columnName: 'join_date' },
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' }
            ],
            rows: [],
            statusNote: 'Column join_date added at end.'
          },
          keyTakeaways: ['ALTER TABLE ADD COLUMN appends to the table by default.', 'DATE types store dates formatted as YYYY-MM-DD.']
        },
        {
          id: 'step-1-3-2',
          stepNumber: 2,
          sql: 'alter table emp modify column salary decimal(10,2);',
          actionLabel: 'Widen Column Precision',
          explanation: 'Expands the numeric capacity of column salary from DECIMAL(5,2) (max 999.99) to DECIMAL(10,2) (max 99,999,999.99) without dropping the column.',
          animationType: 'modify_column_type',
          statusMessage: 'Query OK, 0 rows affected (0.002 sec)',
          highlightDetails: { columnName: 'salary', oldType: 'decimal(5,2)', newType: 'decimal(10,2)' },
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
            statusNote: 'Column salary widened to decimal(10,2).'
          },
          keyTakeaways: ['MODIFY changes data types or constraints in-place.', 'Widening precision avoids data truncation errors.']
        },
        {
          id: 'step-1-3-3',
          stepNumber: 3,
          sql: 'alter table emp add ph_no varchar(15) after name;',
          actionLabel: 'Insert Column With AFTER Keyword',
          explanation: 'Inserts ph_no directly between name and salary using the AFTER positional specifier.',
          animationType: 'reorder_column_after',
          statusMessage: 'Query OK, 0 rows affected (0.002 sec)',
          highlightDetails: { columnName: 'ph_no' },
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'ph_no', type: 'varchar(15)' },
              { name: 'salary', type: 'decimal(10,2)' },
              { name: 'join_date', type: 'date' }
            ],
            rows: [],
            statusNote: 'Column ph_no positioned AFTER name.'
          },
          keyTakeaways: ['AFTER specifies exact placement after a target column.', 'Allows logical grouping of related columns.']
        },
        {
          id: 'step-1-3-4',
          stepNumber: 4,
          sql: 'alter table emp modify ph_no varchar(15) first;',
          actionLabel: 'Move Column to FIRST Position',
          explanation: 'Repositions column ph_no to become the very first column (index 0) of table emp using FIRST.',
          animationType: 'reorder_column_first',
          statusMessage: 'Query OK, 0 rows affected (0.002 sec)',
          highlightDetails: { columnName: 'ph_no' },
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'ph_no', type: 'varchar(15)' },
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(10,2)' },
              { name: 'join_date', type: 'date' }
            ],
            rows: [],
            statusNote: 'Column ph_no moved to FIRST position.'
          },
          keyTakeaways: ['FIRST repositions an existing column to the front.', 'Requires repeating the column data type definition.']
        },
        {
          id: 'step-1-3-5',
          stepNumber: 5,
          sql: 'alter table emp modify ph_no varchar(15) after salary;',
          actionLabel: 'Reposition Column AFTER salary',
          explanation: 'Moves ph_no from the front of the table to immediately after salary using MODIFY with AFTER.',
          animationType: 'reorder_column_after',
          statusMessage: 'Query OK, 0 rows affected (0.002 sec)',
          highlightDetails: { columnName: 'ph_no' },
          afterState: {
            tableName: 'emp',
            name: 'emp',
            databaseName: 'pandiyan_store',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(10,2)' },
              { name: 'ph_no', type: 'varchar(15)' },
              { name: 'join_date', type: 'date' }
            ],
            rows: [],
            statusNote: 'Column ph_no repositioned AFTER salary.'
          },
          keyTakeaways: ['MODIFY with AFTER reorders existing columns.', 'Does not destroy or alter existing row data.']
        },
        {
          id: 'step-1-3-6',
          stepNumber: 6,
          sql: 'alter table emp drop column ph_no;',
          actionLabel: 'Drop Column ph_no',
          explanation: 'Permanently deletes column ph_no from the table schema. The remaining columns retain their sequence.',
          animationType: 'drop_column',
          statusMessage: 'Query OK, 0 rows affected (0.002 sec)',
          highlightDetails: { columnName: 'ph_no' },
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
            statusNote: 'Column ph_no dropped from schema.'
          },
          keyTakeaways: ['DROP COLUMN removes an attribute and any data stored in it.', 'Cannot be rolled back in standard DDL.']
        }
      ]
    }
  ]
};

export const PART_1_QUIZ: QuizQuestion[] = [
  {
    id: 'p1-q1',
    topicId: 'topic-1-1',
    question: 'What happens when you run "DROP DATABASE store;" on a database configured with "READ ONLY = 1"?',
    options: [
      'The database is dropped immediately without warning',
      'MySQL throws Error 3989: Schema is in read only mode',
      'Only the tables inside the database are deleted',
      'The database is moved to the recycle bin'
    ],
    correctIndex: 1,
    explanation: 'When a database has READ ONLY = 1 enabled, MySQL blocks all DDL and DML operations that modify or delete the schema, returning ERROR 3989.'
  },
  {
    id: 'p1-q2',
    topicId: 'topic-1-2',
    question: 'Which SQL statement renames the table "emp" to "employee"?',
    options: [
      'ALTER TABLE emp UPDATE NAME employee;',
      'MODIFY TABLE emp TO employee;',
      'RENAME TABLE emp TO employee;',
      'CHANGE TABLE emp AS employee;'
    ],
    correctIndex: 2,
    explanation: 'The standard MySQL syntax is "RENAME TABLE old_name TO new_name;".'
  },
  {
    id: 'p1-q3',
    topicId: 'topic-1-3',
    question: 'How do you insert a new column "ph_no" immediately following the "name" column?',
    options: [
      'ALTER TABLE emp ADD ph_no varchar(15) AFTER name;',
      'ALTER TABLE emp ADD ph_no varchar(15) BEHIND name;',
      'ALTER TABLE emp INSERT ph_no varchar(15) NEXT TO name;',
      'ALTER TABLE emp ADD ph_no varchar(15) FIRST name;'
    ],
    correctIndex: 0,
    explanation: 'The AFTER clause in MySQL specifies the target column after which the new column should be positioned.'
  },
  {
    id: 'p1-q4',
    topicId: 'topic-1-3',
    question: 'Which clause moves an existing column to the very first position in the table?',
    options: [
      'ALTER TABLE emp MODIFY col_name type AT START;',
      'ALTER TABLE emp MODIFY col_name type FIRST;',
      'ALTER TABLE emp REORDER col_name TO 0;',
      'ALTER TABLE emp MOVE col_name TO FRONT;'
    ],
    correctIndex: 1,
    explanation: 'The FIRST keyword in ALTER TABLE MODIFY places the designated column at the beginning (index 0) of the table.'
  }
];

export const PART_1_PRESETS = [
  { label: 'P1: Show Databases', query: 'show databases;' },
  { label: 'P1: Create database pandiyan_store', query: 'create database pandiyan_store;' },
  { label: 'P1: Alter db read only = 1', query: 'alter database pandiyan_store read only = 1;' },
  { label: 'P1: Drop db pandiyan_store (Fails)', query: 'drop database pandiyan_store;' },
  { label: 'P1: Alter db read only = 0', query: 'alter database pandiyan_store read only = 0;' },
  { label: 'P1: Use pandiyan_store', query: 'use pandiyan_store;' },
  { label: 'P1: Create table emp', query: 'create table emp(\n  id int,\n  name varchar(50),\n  salary decimal(5,2)\n);' },
  { label: 'P1: Select from emp (Check empty)', query: 'select * from emp;' },
  { label: 'P1: Rename table to employee', query: 'rename table emp to employee;' },
  { label: 'P1: Rename back to emp', query: 'rename table employee to emp;' },
  { label: 'P1: Add join_date date', query: 'alter table emp add join_date date;' },
  { label: 'P1: Modify salary decimal(10,2)', query: 'alter table emp modify column salary decimal(10,2);' },
  { label: 'P1: Add ph_no after name', query: 'alter table emp add ph_no varchar(15) after name;' },
  { label: 'P1: Move ph_no to first', query: 'alter table emp modify ph_no varchar(15) first;' },
  { label: 'P1: Move ph_no after salary', query: 'alter table emp modify ph_no varchar(15) after salary;' },
  { label: 'P1: Drop column ph_no', query: 'alter table emp drop column ph_no;' }
];
