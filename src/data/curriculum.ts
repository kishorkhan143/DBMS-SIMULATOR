import { Part, QuizQuestion } from '../types/sql';
import { PART_3, PART_4, PART_3_4_QUIZ, PART_3_4_PRESETS } from './curriculumParts3And4';

export const CURRICULUM_PARTS: Part[] = [
  {
    id: 'part-1',
    number: 1,
    title: 'Part 1: Database & Table Fundamentals (DDL Basics)',
    subtitle: 'Data Definition Language: Databases, Tables, Altering & Column Morphing',
    description: 'Master the foundation of MySQL schema design: creating & dropping databases, read-only protection, table initialization, column additions, re-ordering with FIRST / AFTER, and row inserts.',
    badge: 'Core Curriculum',
    topics: [
      {
        id: 'topic-1-1',
        title: 'Create Database',
        category: 'Database Management',
        summary: 'Inspect system catalogs with SHOW DATABASES, create isolated database containers, and switch active contexts.',
        commandCount: 4,
        definitions: [
          {
            title: 'SHOW DATABASES Statement',
            syntax: 'SHOW DATABASES;',
            purpose: 'Lists all databases currently managed by the MySQL database server that the current user has privileges to see.',
            keyPoints: [
              'System databases like information_schema, performance_schema, mysql, and sys exist by default.',
              'Helps verify database existence before creating or dropping.'
            ],
            example: 'SHOW DATABASES;'
          },
          {
            title: 'CREATE DATABASE Statement',
            syntax: 'CREATE DATABASE database_name;',
            purpose: 'Creates a new physical directory and storage container in MySQL to hold tables, views, procedures, and schemas.',
            keyPoints: [
              'Database names are case-sensitive on Linux/Unix systems, case-insensitive on Windows.',
              'Optional modifier: CREATE DATABASE IF NOT EXISTS db_name avoids throwing an error if it already exists.'
            ],
            example: 'CREATE DATABASE pandiyan_store;'
          },
          {
            title: 'USE Statement',
            syntax: 'USE database_name;',
            purpose: 'Sets the default/current working database for subsequent SQL commands.',
            keyPoints: [
              'Without USE, you would need to qualify table names as database_name.table_name.',
              'Switching databases does not require logging out or reconnecting.'
            ],
            example: 'USE pandiyan_store;'
          }
        ],
        steps: [
          {
            id: 'step-1-1-1',
            title: 'List Existing Databases',
            sql: 'show databases;',
            commandType: 'DQL',
            description: 'Inspect which databases are currently registered on the server.',
            explanation: [
              'MySQL queries its internal metadata dictionary.',
              'Returns default schemas: information_schema, mysql, performance_schema, sys, plus any existing user databases like "july".'
            ],
            animationType: 'show_databases',
            highlightDetails: { databaseName: 'all' },
            beforeState: {
              databaseName: 'none',
              isReadOnly: false,
              availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'july']
            },
            afterState: {
              databaseName: 'none',
              isReadOnly: false,
              availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'july']
            },
            keyTakeaways: [
              'Always inspect available databases before creating to avoid naming collisions.'
            ]
          },
          {
            id: 'step-1-1-2',
            title: 'Create pandiyan_store Database',
            sql: 'create database pandiyan_store;',
            commandType: 'DDL',
            description: 'Allocate a new database container named pandiyan_store.',
            explanation: [
              'The server creates a new namespace entry in the data dictionary.',
              'Allocates disk space and initializes collation (default: utf8mb4).'
            ],
            animationType: 'create_db',
            highlightDetails: { databaseName: 'pandiyan_store' },
            beforeState: {
              databaseName: 'none',
              isReadOnly: false,
              availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'july']
            },
            afterState: {
              databaseName: 'none',
              isReadOnly: false,
              availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'july', 'pandiyan_store']
            },
            keyTakeaways: [
              'The new database is now ready to store tables, but is not yet the active working database.'
            ]
          },
          {
            id: 'step-1-1-3',
            title: 'Verify Database Creation',
            sql: 'show databases;',
            commandType: 'DQL',
            description: 'Confirm that pandiyan_store now appears in the catalog list.',
            explanation: [
              'The catalog now shows "pandiyan_store" alongside existing databases.'
            ],
            animationType: 'show_databases',
            highlightDetails: { databaseName: 'pandiyan_store' },
            beforeState: {
              databaseName: 'none',
              isReadOnly: false,
              availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'july', 'pandiyan_store']
            },
            afterState: {
              databaseName: 'none',
              isReadOnly: false,
              availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'july', 'pandiyan_store']
            },
            keyTakeaways: [
              'pandiyan_store is verified in the system catalog.'
            ]
          },
          {
            id: 'step-1-1-4',
            title: 'Select Active Database',
            sql: 'use pandiyan_store;',
            commandType: 'ADMIN',
            description: 'Switch active context to pandiyan_store so all future tables are created here.',
            explanation: [
              'Sets the active session pointer to pandiyan_store.',
              'Subsequent CREATE TABLE commands will place tables into this database.'
            ],
            animationType: 'create_db',
            highlightDetails: { databaseName: 'pandiyan_store' },
            beforeState: {
              databaseName: 'none',
              isReadOnly: false,
              availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'july', 'pandiyan_store']
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'july', 'pandiyan_store']
            },
            keyTakeaways: [
              'Always ensure you are in the correct database with USE before creating or altering tables.'
            ]
          }
        ]
      },
      {
        id: 'topic-1-2',
        title: 'Drop Database',
        category: 'Database Management',
        summary: 'Permanently remove obsolete or temporary databases from the storage engine.',
        commandCount: 2,
        definitions: [
          {
            title: 'DROP DATABASE Statement',
            syntax: 'DROP DATABASE [IF EXISTS] database_name;',
            purpose: 'Drops all tables contained in the database and permanently removes the database directory.',
            keyPoints: [
              'HIGHLY DESTRUCTIVE: Irreversible without backups.',
              'Requires DROP privilege on the database.',
              'Using IF EXISTS prevents the error "Can\'t drop database; database doesn\'t exist".'
            ],
            example: 'DROP DATABASE july;'
          }
        ],
        steps: [
          {
            id: 'step-1-2-1',
            title: 'Drop Obsolete Database (july)',
            sql: 'drop database july;',
            commandType: 'DDL',
            description: 'Permanently delete the obsolete "july" database from the system.',
            explanation: [
              'Removes all tables and schema definitions inside "july".',
              'The entry is wiped from the RDBMS catalog.'
            ],
            animationType: 'drop_db',
            highlightDetails: { databaseName: 'july' },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'july', 'pandiyan_store']
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'pandiyan_store']
            },
            keyTakeaways: [
              'Dropping a database removes all tables and data inside it permanently.'
            ]
          },
          {
            id: 'step-1-2-2',
            title: 'Drop pandiyan_store (Later in workflow)',
            sql: 'drop database pandiyan_store;',
            commandType: 'DDL',
            description: 'Test dropping the main database when unprotected.',
            explanation: [
              'Shows how unprotected databases can be dropped if READ ONLY is not active.',
              'In production, READ ONLY protection guards against accidental drop.'
            ],
            animationType: 'drop_db',
            highlightDetails: { databaseName: 'pandiyan_store' },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'pandiyan_store']
            },
            afterState: {
              databaseName: 'none',
              isReadOnly: false,
              availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys']
            },
            keyTakeaways: [
              'Never execute DROP DATABASE in production without verified backups.'
            ]
          }
        ]
      },
      {
        id: 'topic-1-3',
        title: 'Alter Database',
        category: 'Database Administration',
        summary: 'Lock and protect schemas by toggling READ ONLY mode (MySQL 8.0+ feature).',
        commandCount: 2,
        definitions: [
          {
            title: 'ALTER DATABASE READ ONLY',
            syntax: 'ALTER DATABASE database_name READ ONLY = {1 | 0 | DEFAULT};',
            purpose: 'Controls whether modifications to the database and objects within it are permitted.',
            keyPoints: [
              'READ ONLY = 1 prevents CREATE, ALTER, DROP tables, and INSERT/UPDATE/DELETE queries.',
              'Attempts to drop or modify an altered read-only database yield MySQL ERROR 3989: Schema is in read only mode.',
              'READ ONLY = 0 restores full write/DDL privileges.'
            ],
            example: 'ALTER DATABASE read only = 1;'
          }
        ],
        steps: [
          {
            id: 'step-1-3-1',
            title: 'Enable Read-Only Protection',
            sql: 'alter database read only =1;',
            commandType: 'ADMIN',
            description: 'Put pandiyan_store into read-only mode to prevent write/drop operations.',
            explanation: [
              'Locks the schema metadata.',
              'Any subsequent DROP DATABASE or DDL modifications will be rejected with an error.'
            ],
            animationType: 'alter_db_readonly',
            highlightDetails: { isReadOnly: true, databaseName: 'pandiyan_store' },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'employee',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: true,
              tableName: 'employee',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' }
              ]
            },
            keyTakeaways: [
              'Read-only mode protects vital production databases from accidental DDL or deletions.'
            ]
          },
          {
            id: 'step-1-3-2',
            title: 'Disable Read-Only Protection',
            sql: 'alter database read only =0;',
            commandType: 'ADMIN',
            description: 'Restore write and modification capability to pandiyan_store.',
            explanation: [
              'Removes the schema lock.',
              'Allows table alterations, renaming, and data inserts to resume.'
            ],
            animationType: 'alter_db_readonly',
            highlightDetails: { isReadOnly: false, databaseName: 'pandiyan_store' },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: true,
              tableName: 'employee',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'employee',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' }
              ]
            },
            keyTakeaways: [
              'Set READ ONLY = 0 when scheduled schema migrations or updates need to be applied.'
            ]
          }
        ]
      },
      {
        id: 'topic-1-4',
        title: 'Create Table & Data Types',
        category: 'Schema Definition',
        summary: 'Construct the employee table and master essential MySQL data types: INT, VARCHAR, DECIMAL(p,s), and DATE.',
        commandCount: 2,
        definitions: [
          {
            title: 'CREATE TABLE Syntax',
            syntax: 'CREATE TABLE table_name (\n  column1 datatype,\n  column2 datatype,\n  ...\n);',
            purpose: 'Establishes a new two-dimensional relation consisting of ordered named columns with strict types.',
            keyPoints: [
              'Columns define the schema structure and integrity rules.',
              'Tables store individual records as rows.'
            ],
            example: 'CREATE TABLE employee (\n  id INT,\n  name VARCHAR(50),\n  salary DECIMAL(5,2),\n  join_date DATE\n);'
          },
          {
            title: 'Data Types Breakdown',
            syntax: 'INT | VARCHAR(M) | DECIMAL(P, S) | DATE',
            purpose: 'Guarantees storage efficiency and type safety for each column.',
            keyPoints: [
              'INT: 4-byte integer from -2,147,483,648 to 2,147,483,647.',
              'VARCHAR(50): Variable-length text up to 50 characters. Only uses storage for characters actually stored + 1 byte length prefix.',
              'DECIMAL(5,2): Exact fixed-point numeric. P=5 (5 total digits) and S=2 (2 digits after decimal point). Max value: 999.99! Crucial for financial/currency values.',
              'DATE: Stores calendar dates in standard "YYYY-MM-DD" format ranging from 1000-01-01 to 9999-12-31.'
            ],
            example: 'salary DECIMAL(5,2) -> Allows 450.00, but rejects 1000.00 because 1000.00 has 6 total digits!'
          }
        ],
        steps: [
          {
            id: 'step-1-4-1',
            title: 'Create Employee Table',
            sql: 'create table employee(\nid int,\nname varchar(50),\nsalary decimal(5,2),\njoin_date date\n);',
            commandType: 'DDL',
            description: 'Create employee table with 4 typed columns: id, name, salary, and join_date.',
            explanation: [
              'The storage engine registers a new table structure "employee" inside "pandiyan_store".',
              'id is set to INT (numeric IDs).',
              'name is allocated up to 50 characters (VARCHAR).',
              'salary is precision-constrained to DECIMAL(5,2) (e.g. 450.00).',
              'join_date expects YYYY-MM-DD calendar values.'
            ],
            animationType: 'create_table',
            highlightDetails: { columnName: 'all' },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: undefined,
              columns: []
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'employee',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' }
              ],
              rows: []
            },
            keyTakeaways: [
              'DECIMAL(5,2) means 5 total digits maximum, with 2 decimal places (e.g. max 999.99).'
            ]
          },
          {
            id: 'step-1-4-2',
            title: 'Query Empty Table',
            sql: 'select * from employee;',
            commandType: 'DQL',
            description: 'Verify the newly created table structure and check for initial rows.',
            explanation: [
              'The SELECT query scans the employee table.',
              'Returns the 4 defined column headers with Empty set (0 rows).'
            ],
            animationType: 'select_query',
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'employee',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' }
              ],
              rows: []
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'employee',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' }
              ],
              rows: []
            },
            keyTakeaways: [
              'A newly created table is ready to accept records; SELECT * displays all columns defined.'
            ]
          }
        ]
      },
      {
        id: 'topic-1-5',
        title: 'Rename Tables',
        category: 'Schema Definition',
        summary: 'Change table identifiers efficiently without altering data or column layout.',
        commandCount: 2,
        definitions: [
          {
            title: 'RENAME TABLE Statement',
            syntax: 'RENAME TABLE old_table_name TO new_table_name;',
            purpose: 'Renames an existing table atomically in the database catalog.',
            keyPoints: [
              'Fast metadata operation — physical table records do NOT need to be copied or rebuilt.',
              'You can rename across databases: RENAME TABLE db1.t1 TO db2.t1;',
              'All existing columns, indexes, and records remain completely intact.'
            ],
            example: 'RENAME TABLE employee TO emp;'
          }
        ],
        steps: [
          {
            id: 'step-1-5-1',
            title: 'Rename employee to emp',
            sql: 'rename table employee to emp;',
            commandType: 'DDL',
            description: 'Change table name from "employee" to the shorthand "emp".',
            explanation: [
              'Updates the table dictionary pointer in pandiyan_store.',
              'The underlying storage file is renamed instantly.',
              'All 4 columns (id, name, salary, join_date) and any records remain intact.'
            ],
            animationType: 'rename_table',
            highlightDetails: { databaseName: 'pandiyan_store' },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'employee',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' }
              ],
              rows: []
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' }
              ],
              rows: []
            },
            keyTakeaways: [
              'RENAME TABLE preserves all table schemas and data while updating the table reference.'
            ]
          },
          {
            id: 'step-1-5-2',
            title: 'Inspect Table under New Name',
            sql: 'select * from emp;',
            commandType: 'DQL',
            description: 'Confirm the table is now queryable under "emp".',
            explanation: [
              'Selecting from "employee" now causes a Table doesn\'t exist error.',
              'Selecting from "emp" successfully queries the renamed table.'
            ],
            animationType: 'select_query',
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' }
              ],
              rows: []
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' }
              ],
              rows: []
            },
            keyTakeaways: [
              'After renaming, update all queries and applications to reference the new table name.'
            ]
          }
        ]
      },
      {
        id: 'topic-1-6',
        title: 'Alter Table',
        category: 'Schema Evolution',
        summary: 'Add columns, modify column sizes, rename columns, rearrange with FIRST / AFTER, and drop columns.',
        commandCount: 7,
        definitions: [
          {
            title: 'ALTER TABLE ADD COLUMN',
            syntax: 'ALTER TABLE table_name ADD column_name datatype [FIRST | AFTER existing_column];',
            purpose: 'Appends or inserts a new column into an existing table structure.',
            keyPoints: [
              'By default, new columns are appended at the very end of the table.',
              'Can specify FIRST or AFTER to dictate exact column order.'
            ],
            example: 'ALTER TABLE emp ADD phn_no VARCHAR(10);'
          },
          {
            title: 'ALTER TABLE MODIFY COLUMN',
            syntax: 'ALTER TABLE table_name MODIFY COLUMN column_name new_datatype [FIRST | AFTER existing_column];',
            purpose: 'Changes the data type, length, or position of an existing column.',
            keyPoints: [
              'Enlarging VARCHAR length (e.g. from 50 to 100) is safe.',
              'Using FIRST relocates the column to column position index 0.',
              'Using AFTER existing_column moves the column right behind that specific column.'
            ],
            example: 'ALTER TABLE emp MODIFY COLUMN email VARCHAR(100) FIRST;'
          },
          {
            title: 'ALTER TABLE RENAME COLUMN',
            syntax: 'ALTER TABLE table_name RENAME COLUMN old_name TO new_name;',
            purpose: 'Changes the identifier of a column while keeping its type and data intact.',
            keyPoints: [
              'Introduced in MySQL 8.0 (previously required CHANGE COLUMN with full type re-declaration).',
              'Preserves existing data and column position.'
            ],
            example: 'ALTER TABLE emp RENAME COLUMN phn_no TO ph_no;'
          },
          {
            title: 'ALTER TABLE DROP COLUMN',
            syntax: 'ALTER TABLE table_name DROP COLUMN column_name;',
            purpose: 'Permanently deletes a column and all values stored within that column.',
            keyPoints: [
              'Irreversible operation: drops the column definition and clears storage.',
              'Any applications relying on that column will fail until updated.'
            ],
            example: 'ALTER TABLE emp DROP COLUMN email;'
          }
        ],
        steps: [
          {
            id: 'step-1-6-1',
            title: 'Add phn_no Column',
            sql: 'alter table emp\nadd phn_no varchar(10);',
            commandType: 'DDL',
            description: 'Append a new phone number column phn_no of type varchar(10).',
            explanation: [
              'Appends "phn_no" as the 5th column at the end of the table.',
              'Existing rows automatically receive NULL for this column until populated.'
            ],
            animationType: 'add_column',
            highlightDetails: { columnName: 'phn_no', newType: 'varchar(10)' },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'phn_no', type: 'varchar(10)' }
              ]
            },
            keyTakeaways: [
              'By default, ADD COLUMN adds the new column to the end of the table layout.'
            ]
          },
          {
            id: 'step-1-6-2',
            title: 'Add email Column',
            sql: 'alter table emp\nadd email varchar(50);',
            commandType: 'DDL',
            description: 'Append an email address column email of type varchar(50).',
            explanation: [
              'Appends "email" as the 6th column.',
              'Allows storing email strings up to 50 characters.'
            ],
            animationType: 'add_column',
            highlightDetails: { columnName: 'email', newType: 'varchar(50)' },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'phn_no', type: 'varchar(10)' }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'phn_no', type: 'varchar(10)' },
                { name: 'email', type: 'varchar(50)' }
              ]
            },
            keyTakeaways: [
              'Multiple columns can be added progressively as business requirements evolve.'
            ]
          },
          {
            id: 'step-1-6-3',
            title: 'Modify email Data Type to varchar(100)',
            sql: 'alter table emp\nmodify column email varchar(100);',
            commandType: 'DDL',
            description: 'Expand the email column length limit from 50 to 100 characters.',
            explanation: [
              'Modifies the schema definition for "email" to varchar(100).',
              'Position remains unchanged at the end of the table.',
              'Accommodates longer email addresses without truncation.'
            ],
            animationType: 'modify_column_type',
            highlightDetails: { columnName: 'email', oldType: 'varchar(50)', newType: 'varchar(100)' },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'phn_no', type: 'varchar(10)' },
                { name: 'email', type: 'varchar(50)' }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'phn_no', type: 'varchar(10)' },
                { name: 'email', type: 'varchar(100)' }
              ]
            },
            keyTakeaways: [
              'MODIFY COLUMN allows updating data types and sizes without changing column names.'
            ]
          },
          {
            id: 'step-1-6-4',
            title: 'Rename Column phn_no to ph_no',
            sql: 'alter table emp\nrename column phn_no to ph_no;',
            commandType: 'DDL',
            description: 'Rename column header identifier from "phn_no" to "ph_no".',
            explanation: [
              'MySQL 8.0+ native RENAME COLUMN modifies the column identifier directly.',
              'The data type varchar(10) and column position remain unchanged.'
            ],
            animationType: 'rename_column',
            highlightDetails: { oldColumnName: 'phn_no', newColumnName: 'ph_no', columnName: 'ph_no' },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'phn_no', type: 'varchar(10)' },
                { name: 'email', type: 'varchar(100)' }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' },
                { name: 'email', type: 'varchar(100)' }
              ]
            },
            keyTakeaways: [
              'RENAME COLUMN cleans up naming conventions without requiring data reloads.'
            ]
          },
          {
            id: 'step-1-6-5',
            title: 'Move email Column to FIRST Position',
            sql: 'alter table emp\nmodify column email varchar(100)\nfirst;',
            commandType: 'DDL',
            description: 'Relocate the email column to become the very first column in the table.',
            explanation: [
              'The FIRST keyword instructs the MySQL storage engine to re-order the table metadata.',
              '"email" shifts from the last position to index 0 (before "id").',
              'All other columns shift right.'
            ],
            animationType: 'reorder_column_first',
            highlightDetails: { columnName: 'email', movedFromIndex: 5, movedToIndex: 0 },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' },
                { name: 'email', type: 'varchar(100)' }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'email', type: 'varchar(100)' },
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ]
            },
            keyTakeaways: [
              'The FIRST keyword moves any column to position #1 in the table schema.'
            ]
          },
          {
            id: 'step-1-6-6',
            title: 'Move email Column AFTER join_date',
            sql: 'alter table emp\nmodify column email varchar(100)\nafter join_date;',
            commandType: 'DDL',
            description: 'Reposition the email column immediately after the join_date column.',
            explanation: [
              'The AFTER join_date clause instructs the engine to re-sequence the column list.',
              '"email" is placed directly following "join_date".',
              'The resulting order is: id, name, salary, join_date, email, ph_no.'
            ],
            animationType: 'reorder_column_after',
            highlightDetails: { columnName: 'email', movedFromIndex: 0, movedToIndex: 4 },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'email', type: 'varchar(100)' },
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'email', type: 'varchar(100)' },
                { name: 'ph_no', type: 'varchar(10)' }
              ]
            },
            keyTakeaways: [
              'AFTER existing_column lets you precisely insert or move columns between other columns.'
            ]
          },
          {
            id: 'step-1-6-7',
            title: 'Drop email Column',
            sql: 'alter table emp\ndrop column email;',
            commandType: 'DDL',
            description: 'Permanently remove the email column from the table structure.',
            explanation: [
              'Deletes the "email" column descriptor from the emp schema.',
              'Any data stored in the email column for all rows is discarded.',
              'The remaining 5 columns shift into place.'
            ],
            animationType: 'drop_column',
            highlightDetails: { columnName: 'email' },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'email', type: 'varchar(100)' },
                { name: 'ph_no', type: 'varchar(10)' }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ]
            },
            keyTakeaways: [
              'DROP COLUMN permanently removes the column and all of its associated data values.'
            ]
          }
        ]
      },
      {
        id: 'topic-1-7',
        title: 'Insert Rows',
        category: 'Data Manipulation',
        summary: 'Populate records into the modified table schema and verify the loaded rows with SELECT.',
        commandCount: 2,
        definitions: [
          {
            title: 'INSERT INTO Statement',
            syntax: 'INSERT INTO table_name (col1, col2, ...)\nVALUES (val1, val2, ...);',
            purpose: 'Appends one or more new records to the table.',
            keyPoints: [
              'String and date values must be enclosed in single quotes (\'text\').',
              'Numeric values (INT, DECIMAL) are passed without quotes.',
              'Values must match the designated column data types and order.'
            ],
            example: 'INSERT INTO emp (id, name, salary, join_date, ph_no)\nVALUES (101, \'Pandiyan\', 450.00, \'2023-01-15\', \'9876543210\');'
          },
          {
            title: 'SELECT Query',
            syntax: 'SELECT * FROM table_name;',
            purpose: 'Retrieves all rows and columns currently stored in the table.',
            keyPoints: [
              '* is the wildcard for "all columns".',
              'Returns an active tabular result set.'
            ],
            example: 'SELECT * FROM emp;'
          }
        ],
        steps: [
          {
            id: 'step-1-7-1',
            title: 'Insert Pandiyan Employee Record',
            sql: "insert into emp (id, name, salary, join_date, ph_no)\nvalues (101, 'Pandiyan', 450.00, '2023-01-15', '9876543210');",
            commandType: 'DML',
            description: 'Insert an employee record for "Pandiyan" with id 101, salary 450.00, and phone number.',
            explanation: [
              'The storage engine verifies data types: id=101 (int), name="Pandiyan" (varchar), salary=450.00 (decimal 5,2), join_date="2023-01-15" (date), ph_no="9876543210" (varchar 10).',
              'Appends a new physical row to the emp table.'
            ],
            animationType: 'insert_row',
            highlightDetails: { columnName: 'row_101' },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: []
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 101, name: 'Pandiyan', salary: '450.00', join_date: '2023-01-15', ph_no: '9876543210' }
              ]
            },
            keyTakeaways: [
              'INSERT INTO populates table rows adhering strictly to column constraints and types.'
            ]
          },
          {
            id: 'step-1-7-2',
            title: 'Verify Table Content',
            sql: 'select * from emp;',
            commandType: 'DQL',
            description: 'Fetch and view the newly inserted row in the emp table.',
            explanation: [
              'Executes a full table scan returning 1 row with 5 columns.',
              'Confirms all data values were stored accurately.'
            ],
            animationType: 'select_query',
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 101, name: 'Pandiyan', salary: '450.00', join_date: '2023-01-15', ph_no: '9876543210' }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 101, name: 'Pandiyan', salary: '450.00', join_date: '2023-01-15', ph_no: '9876543210' }
              ]
            },
            keyTakeaways: [
              'SELECT * FROM emp renders all saved records in formatted tabular structure.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'part-2',
    number: 2,
    title: 'Part 2: Insert Rows - Select Query & Where',
    subtitle: 'Data Ingestion, Projection, Aliases & Conditional Filtering (WHERE & NULL)',
    description: 'Master row insertion techniques (single, multi-row, partial column with NULL) alongside targeted SELECT queries, column aliases with AS, and WHERE condition filters.',
    badge: 'Core Operations',
    topics: [
      {
        id: 'topic-2-1',
        title: 'Insert Rows',
        category: 'Data Manipulation',
        summary: 'Ingest individual records, batch multi-row inserts with comma notation, and perform partial column insertions with default NULL population.',
        commandCount: 6,
        definitions: [
          {
            title: 'Single-Row INSERT Statement',
            syntax: 'INSERT INTO table_name\nVALUES (val1, val2, val3, ...);',
            purpose: 'Appends a single new record into a table where the provided values map directly to columns in the exact order defined in the table schema.',
            keyPoints: [
              'Values count must strictly match the table column count.',
              'String and date values must be enclosed in quotes (e.g. "kishor", "2001-1-1").',
              'Numeric values like 400.0 or 1 do not need quotation marks.'
            ],
            example: 'INSERT INTO emp VALUES (1, "kishor", 400.0, "2001-1-1", "7094507823");'
          },
          {
            title: 'Multi-Row Batched INSERT',
            syntax: 'INSERT INTO table_name\nVALUES\n  (row1_val1, row1_val2, ...),\n  (row2_val1, row2_val2, ...);',
            purpose: 'Inserts multiple rows in a single atomic database query using comma-separated value tuples.',
            keyPoints: [
              'Substantially faster than executing multiple separate INSERT statements because it saves round-trip network latency and single-transaction disk flushing.',
              'All tuples must follow the same schema layout and value order.'
            ],
            example: 'INSERT INTO emp VALUES (2,"rakesh",400.0,"2001-1-1","7094507824"), (2,"manish",400.0,"2001-1-1","7094507825");'
          },
          {
            title: 'Partial Column INSERT (with NULL defaults)',
            syntax: 'INSERT INTO table_name (col1, col2)\nVALUES (val1, val2);',
            purpose: 'Allows inserting data into specific target columns only, without having to specify values for every column.',
            keyPoints: [
              'Any column omitted from the column list automatically receives its DEFAULT value, or NULL if nullable.',
              'Useful when certain information (like phone number or joining date) is not yet available.'
            ],
            example: 'INSERT INTO emp(id, name) VALUES (1, "kishor");'
          }
        ],
        steps: [
          {
            id: 'step-2-1-1',
            title: 'Select pandiyan_store Database',
            sql: 'use pandiyan_store;',
            commandType: 'ADMIN',
            description: 'Set pandiyan_store as the active database context for subsequent employee queries.',
            explanation: [
              'Instructs the MySQL session to direct all future table statements to pandiyan_store.',
              'Allows referring to emp directly without qualifying as pandiyan_store.emp.'
            ],
            animationType: 'show_databases',
            highlightDetails: { databaseName: 'pandiyan_store' },
            beforeState: {
              databaseName: 'none',
              isReadOnly: false,
              availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'july', 'pandiyan_store']
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'july', 'pandiyan_store']
            },
            keyTakeaways: ['USE sets the active schema namespace for the current database connection.']
          },
          {
            id: 'step-2-1-2',
            title: 'Inspect Empty emp Table',
            sql: 'select * from emp;',
            commandType: 'DQL',
            description: 'Query the table to verify columns exist and inspect the empty table state.',
            explanation: [
              'MySQL scans the storage engine for registered records in table "emp".',
              'Returns "Empty set (0 records)" while showing the 5 defined columns: id, name, salary, join_date, ph_no.'
            ],
            animationType: 'select_query',
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: []
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: []
            },
            keyTakeaways: ['SELECT * on an empty table confirms the schema layout before inserting data.']
          },
          {
            id: 'step-2-1-3',
            title: 'Insert Single Row (Kishor)',
            sql: 'insert into emp\nvalues(1,"kishor",400.0,"2001-1-1","7094507823");',
            commandType: 'DML',
            description: 'Insert the first employee row containing values for all 5 columns.',
            explanation: [
              'Maps values in exact positional order: id=1, name="kishor", salary=400.0, join_date="2001-1-1", ph_no="7094507823".',
              'Converts 400.0 to DECIMAL(5,2) storage format (400.00).'
            ],
            animationType: 'insert_row',
            highlightDetails: { highlightedRowIndices: [0] },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: []
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' }
              ]
            },
            keyTakeaways: ['Single-row INSERT requires supplying values for every column when no column list is given.']
          },
          {
            id: 'step-2-1-4',
            title: 'Insert Multiple Rows in Single Statement (Rakesh & Manish)',
            sql: 'insert into emp\nvalues(2,"rakesh",400.0,"2001-1-1","7094507824"),\n(2,"manish",400.0,"2001-1-1","7094507825");',
            commandType: 'DML',
            description: 'Batch insert two employee records simultaneously using comma-separated value tuples.',
            explanation: [
              'Executes a batched insert containing two tuples separated by a comma.',
              'Both rows are committed to table storage in a single atomic write: Records: 2.',
              'Notice both records have id = 2, demonstrating tables without PRIMARY KEY allow duplicate IDs.'
            ],
            animationType: 'insert_multi',
            highlightDetails: { highlightedRowIndices: [1, 2] },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
                { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
                { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' }
              ]
            },
            keyTakeaways: ['Multi-row inserts use comma-separated parentheses tuples for optimal bulk performance.']
          },
          {
            id: 'step-2-1-5',
            title: 'Insert Partial Columns (id, name)',
            sql: 'insert into emp(id ,name)\nvalues(1,"kishor");',
            commandType: 'DML',
            description: 'Insert a new record specifying only id and name columns.',
            explanation: [
              'Explicitly declares target columns (id, name) in parentheses before VALUES.',
              'Unspecified columns (salary, join_date, ph_no) automatically receive NULL default values.',
              'Adds a 4th record to the table.'
            ],
            animationType: 'insert_partial',
            highlightDetails: { highlightedRowIndices: [3] },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
                { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
                { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
                { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
                { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
                { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
              ]
            },
            keyTakeaways: ['Columns omitted from the column list default to NULL unless defined with NOT NULL or DEFAULT.']
          },
          {
            id: 'step-2-1-6',
            title: 'Verify All Ingested Records',
            sql: 'select * from emp;',
            commandType: 'DQL',
            description: 'Inspect all 4 records stored in the emp table, observing complete and partial fields.',
            explanation: [
              'Queries all 4 rows in the table.',
              'Observe that row 4 has NULL values in salary, join_date, and ph_no, as expected.'
            ],
            animationType: 'select_query',
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
                { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
                { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
                { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
                { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
                { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
                { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
              ]
            },
            keyTakeaways: ['The table now holds 4 active employee records with both complete and nullable columns.']
          }
        ]
      },
      {
        id: 'topic-2-2',
        title: 'Select Query & Where',
        category: 'Data Query & Filtering',
        summary: 'Target specific columns, define aliases with AS, reorder projections, and filter records with WHERE conditions including numeric, string, and IS NULL checks.',
        commandCount: 9,
        definitions: [
          {
            title: 'Column Projection (Specific Columns)',
            syntax: 'SELECT col1, col2 FROM table_name;',
            purpose: 'Restricts the returned grid to only the specified columns, filtering out unwanted schema fields.',
            keyPoints: [
              'Reduces network data transfer compared to SELECT *.',
              'Columns appear in the output in the order specified in the query, regardless of table schema order.'
            ],
            example: 'SELECT id, name FROM emp;'
          },
          {
            title: 'Column Aliasing with AS',
            syntax: 'SELECT col_name AS alias_name FROM table_name;',
            purpose: 'Temporarily renames an output column header in the query result for readability or reporting.',
            keyPoints: [
              'The underlying table schema remains completely untouched.',
              'The AS keyword is optional in MySQL, but recommended for clarity.'
            ],
            example: 'SELECT name AS emp_name, id FROM emp;'
          },
          {
            title: 'WHERE Filtering Clause',
            syntax: 'SELECT ... FROM table_name WHERE condition;',
            purpose: 'Evaluates each row against a boolean predicate, returning only rows where condition evaluates to TRUE.',
            keyPoints: [
              'Supports comparison operators: =, !=, <, >, <=, >=.',
              'Strings must be quoted in the WHERE clause: WHERE name = "kishor".'
            ],
            example: 'SELECT * FROM emp WHERE id = 2;'
          },
          {
            title: 'IS NULL and IS NOT NULL Operators',
            syntax: 'SELECT ... FROM table_name WHERE col IS [NOT] NULL;',
            purpose: 'Checks whether a column value is missing/unknown (NULL) or populated (NOT NULL).',
            keyPoints: [
              'You CANNOT use "= NULL" because NULL represents an unknown value in SQL, so NULL = NULL evaluates to UNKNOWN (not true).',
              'Always use IS NULL and IS NOT NULL to test for absent data.'
            ],
            example: 'SELECT * FROM emp WHERE join_date IS NULL;'
          }
        ],
        steps: [
          {
            id: 'step-2-2-1',
            title: 'Project Specific Columns (id, name)',
            sql: 'select id ,name from emp;',
            commandType: 'DQL',
            description: 'Retrieve only id and name columns from all employees, omitting salary, join_date, and ph_no.',
            explanation: [
              'MySQL reads the table rows but projects only the id and name fields in the result set.',
              'Returns all 4 employee records with 2 columns.'
            ],
            animationType: 'select_query',
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
                { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
                { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
                { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp (Projected: id, name)',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' }
              ],
              rows: [
                { id: 1, name: 'kishor' },
                { id: 2, name: 'rakesh' },
                { id: 2, name: 'manish' },
                { id: 1, name: 'kishor' }
              ]
            },
            keyTakeaways: ['Column projection limits network payload and clarifies query output.']
          },
          {
            id: 'step-2-2-2',
            title: 'Column Alias and Order Swap (emp_name, id)',
            sql: 'select name as emp_name ,id from emp;',
            commandType: 'DQL',
            description: 'Rename column "name" to "emp_name" in the output and place it first, before id.',
            explanation: [
              'Uses "name as emp_name" to rename the display column header.',
              'Reorders output columns so emp_name is Column 1 and id is Column 2.'
            ],
            animationType: 'select_alias',
            highlightDetails: { columnName: 'emp_name' },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' }
              ],
              rows: [
                { id: 1, name: 'kishor' },
                { id: 2, name: 'rakesh' },
                { id: 2, name: 'manish' },
                { id: 1, name: 'kishor' }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp (Aliased & Reordered)',
              columns: [
                { name: 'emp_name', type: 'varchar(50)' },
                { name: 'id', type: 'int' }
              ],
              rows: [
                { emp_name: 'kishor', id: 1 },
                { emp_name: 'rakesh', id: 2 },
                { emp_name: 'manish', id: 2 },
                { emp_name: 'kishor', id: 1 }
              ]
            },
            keyTakeaways: ['Aliases with AS rename the display header without altering the physical schema.']
          },
          {
            id: 'step-2-2-3',
            title: 'Project Salary and Name',
            sql: 'select salary ,name from emp;',
            commandType: 'DQL',
            description: 'Select salary first, followed by name, across all 4 employees.',
            explanation: [
              'Extracts the compensation column first, followed by employee name.',
              'Row 4 displays NULL for salary since it was not populated during partial insert.'
            ],
            animationType: 'select_query',
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
                { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
                { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
                { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp (salary, name)',
              columns: [
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'name', type: 'varchar(50)' }
              ],
              rows: [
                { salary: '400.00', name: 'kishor' },
                { salary: '400.00', name: 'rakesh' },
                { salary: '400.00', name: 'manish' },
                { salary: null, name: 'kishor' }
              ]
            },
            keyTakeaways: ['SELECT allows ordering columns in whatever sequence is best for application needs.']
          },
          {
            id: 'step-2-2-4',
            title: 'Full Table Retrieval (SELECT *)',
            sql: 'select * from emp;',
            commandType: 'DQL',
            description: 'Inspect all columns and all rows in the table.',
            explanation: [
              'Renders the complete table: all 5 columns and all 4 rows.',
              'Serves as the baseline dataset for the subsequent WHERE clause filtering steps.'
            ],
            animationType: 'select_query',
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
                { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
                { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
                { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
                { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
                { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
                { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
              ]
            },
            keyTakeaways: ['SELECT * returns all columns in their original schema order.']
          },
          {
            id: 'step-2-2-5',
            title: 'Filter by ID Equals 2',
            sql: 'select * from emp where id =2;',
            commandType: 'DQL',
            description: 'Filter table records using numeric equality where id equals 2.',
            explanation: [
              'Evaluates the boolean condition id = 2 for every row in the table.',
              'Matches row 2 (rakesh) and row 3 (manish).',
              'Filters out rows 1 and 4 where id = 1.'
            ],
            animationType: 'select_where',
            highlightDetails: { highlightedRowIndices: [1, 2], filterCondition: 'id = 2' },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
                { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
                { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
                { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp (WHERE id = 2)',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
                { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' }
              ]
            },
            keyTakeaways: ['WHERE id = 2 returns all records matching the numeric equality predicate.']
          },
          {
            id: 'step-2-2-6',
            title: 'Filter by Name Equals "kishor"',
            sql: 'select * from emp where name="kishor";',
            commandType: 'DQL',
            description: 'Filter records using string equality matching the name "kishor".',
            explanation: [
              'Tests name = "kishor" against each record.',
              'Matches both kishor records: Row 1 (complete record) and Row 4 (partial record with NULLs).',
              'String literals in WHERE conditions must be enclosed in quotes.'
            ],
            animationType: 'select_where',
            highlightDetails: { highlightedRowIndices: [0, 3], filterCondition: 'name = "kishor"' },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
                { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
                { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
                { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp (WHERE name="kishor")',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
                { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
              ]
            },
            keyTakeaways: ['Enclose string comparisons in quotes; both single and double quotes are supported in MySQL.']
          },
          {
            id: 'step-2-2-7',
            title: 'Project Name and Salary with WHERE Filter',
            sql: 'select name,salary from emp where name="kishor";',
            commandType: 'DQL',
            description: 'Combine projection of name and salary columns with a WHERE condition filtering on name="kishor".',
            explanation: [
              'Executes filtering first: identifies the two rows where name="kishor".',
              'Applies projection second: outputs only the name and salary columns.',
              'Row 1 returns ("kishor", 400.00) and Row 4 returns ("kishor", NULL).'
            ],
            animationType: 'select_where',
            highlightDetails: { highlightedRowIndices: [0, 1] },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
                { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
                { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
                { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp (name, salary WHERE name="kishor")',
              columns: [
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' }
              ],
              rows: [
                { name: 'kishor', salary: '400.00' },
                { name: 'kishor', salary: null }
              ]
            },
            keyTakeaways: ['Combining column projection with WHERE conditions produces precise, compact reports.']
          },
          {
            id: 'step-2-2-8',
            title: 'Filter Rows with Missing Data (IS NULL)',
            sql: 'select * from emp where join_date is null;',
            commandType: 'DQL',
            description: 'Find all employee records where join_date is unassigned or NULL.',
            explanation: [
              'Tests join_date IS NULL.',
              'Matches row 4 (the partial insert where only id and name were supplied).',
              'Demonstrates why IS NULL is required instead of "= NULL" in standard SQL.'
            ],
            animationType: 'select_where',
            highlightDetails: { highlightedRowIndices: [0] },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
                { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
                { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
                { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp (WHERE join_date IS NULL)',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
              ]
            },
            keyTakeaways: ['Always use IS NULL to test for absent data; "= NULL" returns unknown/false.']
          },
          {
            id: 'step-2-2-9',
            title: 'Filter Populated Records (IS NOT NULL)',
            sql: 'select * from emp where join_date is not null;',
            commandType: 'DQL',
            description: 'Find all employee records that have a valid, assigned join_date.',
            explanation: [
              'Tests join_date IS NOT NULL.',
              'Matches rows 1, 2, and 3 where valid date strings were provided during insertion.',
              'Filters out row 4 which has a NULL join_date.'
            ],
            animationType: 'select_where',
            highlightDetails: { highlightedRowIndices: [0, 1, 2] },
            beforeState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
                { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
                { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
                { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
              ]
            },
            afterState: {
              databaseName: 'pandiyan_store',
              isReadOnly: false,
              tableName: 'emp (WHERE join_date IS NOT NULL)',
              columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar(50)' },
                { name: 'salary', type: 'decimal(5,2)' },
                { name: 'join_date', type: 'date' },
                { name: 'ph_no', type: 'varchar(10)' }
              ],
              rows: [
                { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
                { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
                { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' }
              ]
            },
            keyTakeaways: ['IS NOT NULL filters out incomplete or missing entries, returning only populated records.']
          }
        ]
      }
    ]
  },
  PART_3,
  PART_4
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    topicId: 'topic-1-1',
    question: 'What is the correct SQL command to list all databases available on the current MySQL server?',
    options: [
      'SELECT * FROM databases;',
      'SHOW DATABASES;',
      'LIST ALL DATABASES;',
      'DISPLAY SCHEMAS;'
    ],
    correctIndex: 1,
    explanation: 'SHOW DATABASES; is the standard MySQL query to inspect all database schemas currently accessible on the server.'
  },
  {
    id: 'q2',
    topicId: 'topic-1-4',
    question: 'In the column definition `salary DECIMAL(5,2)`, what does the number 5 represent?',
    codeSnippet: 'salary DECIMAL(5,2)',
    options: [
      'The number of digits to the right of the decimal point',
      'The total number of significant digits (precision) stored',
      'The maximum salary value in thousands',
      'The byte size allocated in storage'
    ],
    correctIndex: 1,
    explanation: 'DECIMAL(M, D): M is precision (total digits), and D is scale (digits after decimal point). Thus DECIMAL(5,2) supports up to 5 total digits with 2 decimals (e.g. 999.99).'
  },
  {
    id: 'q3',
    topicId: 'topic-1-6',
    question: 'Which keyword in ALTER TABLE ... MODIFY COLUMN moves a column to the very first position of the table schema?',
    codeSnippet: 'alter table emp modify column email varchar(100) _______;',
    options: [
      'TOP',
      'BEGINNING',
      'FIRST',
      'HEAD'
    ],
    correctIndex: 2,
    explanation: 'The FIRST keyword instructs MySQL to reorder the column to index position 0 (the first column in the table).'
  },
  {
    id: 'q4',
    topicId: 'topic-1-6',
    question: 'Which clause moves a column immediately behind an existing column during an ALTER TABLE operation?',
    codeSnippet: 'alter table emp modify column email varchar(100) AFTER join_date;',
    options: [
      'BEHIND existing_column',
      'AFTER existing_column',
      'NEXT TO existing_column',
      'FOLLOWING existing_column'
    ],
    correctIndex: 1,
    explanation: 'The AFTER column_name clause positions the modified column directly following the specified existing column.'
  },
  {
    id: 'q5',
    topicId: 'topic-1-3',
    question: 'What happens when you run `ALTER DATABASE pandiyan_store READ ONLY = 1;`?',
    options: [
      'The database is encrypted and hidden from normal users',
      'The database becomes protected against write, update, and drop operations',
      'All tables are permanently converted into read-only CSV files',
      'Users can only run INSERT queries but no SELECT queries'
    ],
    correctIndex: 1,
    explanation: 'Setting READ ONLY = 1 prevents DDL modifications (CREATE, ALTER, DROP) and DML writes (INSERT, UPDATE, DELETE), protecting data from accidental loss.'
  },
  {
    id: 'q6',
    topicId: 'topic-1-5',
    question: 'What is the syntax in MySQL to change a table named "employee" to "emp"?',
    options: [
      'ALTER TABLE employee SET NAME = emp;',
      'RENAME TABLE employee TO emp;',
      'MOVE TABLE employee AS emp;',
      'UPDATE TABLE NAME employee emp;'
    ],
    correctIndex: 1,
    explanation: 'RENAME TABLE old_name TO new_name; atomically renames the table reference in the database dictionary.'
  },
  {
    id: 'q7',
    topicId: 'topic-1-6',
    question: 'How do you rename a column from `phn_no` to `ph_no` in modern MySQL 8.0+?',
    options: [
      'ALTER TABLE emp CHANGE NAME phn_no ph_no;',
      'ALTER TABLE emp RENAME COLUMN phn_no TO ph_no;',
      'UPDATE emp SET COLUMN phn_no = ph_no;',
      'MODIFY TABLE emp phn_no AS ph_no;'
    ],
    correctIndex: 1,
    explanation: 'In MySQL 8.0+, ALTER TABLE table_name RENAME COLUMN old_name TO new_name; allows renaming columns without needing to restate the data type.'
  },
  {
    id: 'q8',
    topicId: 'topic-2-1',
    question: 'What occurs when you run `INSERT INTO emp(id, name) VALUES (1, "kishor");` when other columns exist in the table?',
    options: [
      'The query causes a syntax error because all columns must be provided.',
      'The omitted columns are automatically populated with NULL (or their specified DEFAULT value).',
      'The omitted columns are populated with empty strings or 0.',
      'The table columns that were omitted get automatically dropped from the schema.'
    ],
    correctIndex: 1,
    explanation: 'When an explicit column list is specified, any omitted column that is nullable will receive NULL, or its configured DEFAULT value.'
  },
  {
    id: 'q9',
    topicId: 'topic-2-1',
    question: 'What is the primary advantage of batching multiple row inserts like `VALUES (1, "a"), (2, "b");` over running multiple single-row `INSERT` statements?',
    options: [
      'It allows inserting records across different databases in one statement.',
      'It significantly boosts throughput by reducing network round-trips and committing in a single transaction.',
      'It automatically prevents duplicate primary keys without index constraints.',
      'It encrypts rows on disk automatically.'
    ],
    correctIndex: 1,
    explanation: 'Batch inserting records in a single statement reduces connection round-trips, transaction overhead, and disk sync operations.'
  },
  {
    id: 'q10',
    topicId: 'topic-2-2',
    question: 'Why should you write `WHERE join_date IS NULL` instead of `WHERE join_date = NULL` in SQL?',
    options: [
      'Because "= NULL" triggers a fatal syntax error in MySQL.',
      'In SQL three-valued logic, NULL represents an unknown value, so comparing anything with "= NULL" evaluates to UNKNOWN (treated as false).',
      'Because "= NULL" only matches non-empty strings.',
      'Because "= NULL" only works on integer columns.'
    ],
    correctIndex: 1,
    explanation: 'In ANSI SQL, NULL means "unknown", and any direct comparison with "=" results in UNKNOWN. IS NULL and IS NOT NULL are the only valid operators to test for absent data.'
  },
  {
    id: 'q11',
    topicId: 'topic-2-2',
    question: 'What does `SELECT name AS emp_name, id FROM emp;` do to the underlying `emp` table schema?',
    options: [
      'It permanently renames the column `name` to `emp_name` inside the MySQL dictionary.',
      'It creates a new view called `emp_name`.',
      'It only changes the display column header in the query result set; the table schema remains unchanged.',
      'It swaps the physical column storage order in InnoDB.'
    ],
    correctIndex: 2,
    explanation: 'Column aliases with AS only affect the header displayed in the output grid of that particular query; the underlying table schema is not modified.'
  },
  ...PART_3_4_QUIZ
];

export const PRESET_PRACTICE_QUERIES = [
  // --- PART 1 QUERIES ---
  { label: 'P1: Show Databases', query: 'show databases;' },
  { label: 'P1: Create DB pandiyan_store', query: 'create database pandiyan_store;' },
  { label: 'P1: Use pandiyan_store', query: 'use pandiyan_store;' },
  { label: 'P1: Drop DB july', query: 'drop database july;' },
  { label: 'P1: Create Table employee', query: 'create table employee(\nid int,\nname varchar(50),\nsalary decimal(5,2),\njoin_date date\n);' },
  { label: 'P1: Select from employee', query: 'select * from employee;' },
  { label: 'P1: Alter DB Read Only = 1', query: 'alter database read only =1;' },
  { label: 'P1: Alter DB Read Only = 0', query: 'alter database read only =0;' },
  { label: 'P1: Rename employee to emp', query: 'rename table employee to emp;' },
  { label: 'P1: Add phn_no column', query: 'alter table emp add phn_no varchar(10);' },
  { label: 'P1: Add email column', query: 'alter table emp add email varchar(50);' },
  { label: 'P1: Modify email to varchar(100)', query: 'alter table emp modify column email varchar(100);' },
  { label: 'P1: Rename column phn_no to ph_no', query: 'alter table emp rename column phn_no to ph_no;' },
  { label: 'P1: Move email FIRST', query: 'alter table emp modify column email varchar(100) first;' },
  { label: 'P1: Move email AFTER join_date', query: 'alter table emp modify column email varchar(100) after join_date;' },
  { label: 'P1: Drop column email', query: 'alter table emp drop column email;' },

  // --- PART 2 QUERIES (Insert Rows - Select Query & Where) ---
  { label: 'P2: Use pandiyan_store', query: 'use pandiyan_store;' },
  { label: 'P2: Select * from emp (Empty Check)', query: 'select * from emp;' },
  { label: 'P2: Insert Row 1 (kishor)', query: 'insert into emp\nvalues(1,"kishor",400.0,"2001-1-1","7094507823");' },
  { label: 'P2: Insert Multiple Rows (rakesh, manish)', query: 'insert into emp\nvalues(2,"rakesh",400.0,"2001-1-1","7094507824"),\n(2,"manish",400.0,"2001-1-1","7094507825");' },
  { label: 'P2: Insert Partial Columns (id, name)', query: 'insert into emp(id ,name)\nvalues(1,"kishor");' },
  { label: 'P2: Select * from emp (All 4 Rows)', query: 'select * from emp;' },
  { label: 'P2: Select id, name (Projection)', query: 'select id ,name from emp;' },
  { label: 'P2: Select name as emp_name, id (Alias)', query: 'select name as emp_name ,id from emp;' },
  { label: 'P2: Select salary, name', query: 'select salary ,name from emp;' },
  { label: 'P2: Select * where id = 2', query: 'select * from emp where id =2;' },
  { label: 'P2: Select * where name="kishor"', query: 'select * from emp where name="kishor";' },
  { label: 'P2: Select name,salary where name="kishor"', query: 'select name,salary from emp where name="kishor";' },
  { label: 'P2: Select where join_date is null', query: 'select * from emp where  join_date is null;' },
  { label: 'P2: Select where join_date is not null', query: 'select * from emp where  join_date is not null;' },

  ...PART_3_4_PRESETS
];
