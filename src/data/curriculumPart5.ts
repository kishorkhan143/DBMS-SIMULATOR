import { Part, QuizQuestion } from '../types/sql';

export const PART_5: Part = {
  id: 'part-5',
  number: 5,
  title: 'Part 5: Primary Keys & AUTO_INCREMENT',
  subtitle: 'Primary Key Rules • Constraint Violations • AUTO_INCREMENT Mechanics & Seed Offsets',
  description: 'Master relational identity and surrogate key generation: enforce entity integrity with PRIMARY KEY, observe engine-level rejection of duplicates, NULLs, and mismatched tuples, automate row indexing with AUTO_INCREMENT, and configure sequence seed offsets with ALTER TABLE.',
  badge: 'Part 5 • Primary Keys & Auto Increment',
  topics: [
    {
      id: 'topic-5-1',
      title: 'Topic 5.1: PRIMARY KEY & Constraint Violations',
      subtitle: 'Entity integrity, duplicate key rejection, and NULL prevention',
      conceptBadge: 'PRIMARY KEY & ERRORS',
      description: 'Understand the fundamental rules of a PRIMARY KEY. See how MySQL automatically rejects duplicate keys (Error 1062), blocks NULL insertions (Error 1048), detects mismatched column-value counts (Error 1136), and handles table drops.',
      commands: [
        'use pandiyan_store;',
        'create table transactions(\nid int primary key,\namount decimal(10,2)\n);',
        'insert into transactions\nvalues (1,200);',
        'insert into transactions\nvalues (1,300);',
        'insert into transactions\nvalues (null,600);',
        'insert into transactions\nvalues(200);',
        'drop table transactions;',
        'select * from transactions;'
      ],
      definitions: [
        {
          title: 'PRIMARY KEY Constraint',
          syntax: 'column_name data_type PRIMARY KEY',
          purpose: 'Uniquely identifies each record in a database table. A table can have only ONE primary key.',
          keyPoints: [
            'Inherently enforces NOT NULL: Primary key columns can never contain NULL values.',
            'Inherently enforces UNIQUE: Every row must have a distinct, non-duplicate primary key value.',
            'Forms the default clustered index in InnoDB storage engine for high-speed row lookups.'
          ],
          example: 'create table transactions(id int primary key, amount decimal(10,2));'
        },
        {
          title: 'Error 1062: Duplicate Entry',
          syntax: 'ERROR 1062 (23000): Duplicate entry \'val\' for key \'table.PRIMARY\'',
          purpose: 'Thrown when an INSERT or UPDATE attempts to store a key value that already exists in a PRIMARY or UNIQUE index.',
          keyPoints: [
            'Guarantees that entity uniqueness cannot be corrupted by concurrent or erroneous queries.',
            'The entire INSERT statement fails atomically if any row violates uniqueness.'
          ],
          example: 'insert into transactions values (1,300); -- Fails if id=1 already exists'
        },
        {
          title: 'Error 1048: Column Cannot Be NULL',
          syntax: 'ERROR 1048 (23000): Column \'col\' cannot be null',
          purpose: 'Thrown when attempting to write a NULL literal or omitted non-default value into a NOT NULL / PRIMARY KEY column.',
          keyPoints: [
            'A primary key must always point to a concrete, identifiable entity.'
          ],
          example: 'insert into transactions values (null,600); -- Rejected by engine'
        },
        {
          title: 'Error 1136: Column Count Mismatch',
          syntax: 'ERROR 1136 (21S01): Column count doesn\'t match value count at row 1',
          purpose: 'Occurs when an INSERT without a column list supplies fewer or more values than columns defined in the table.',
          keyPoints: [
            'If you omit column names in INSERT INTO table, you MUST supply values for ALL columns in exact schema order.'
          ],
          example: 'insert into transactions values(200); -- Table has 2 columns, only 1 value supplied'
        }
      ],
      steps: [
        {
          id: 'step-5-1-1',
          stepNumber: 1,
          sql: 'use pandiyan_store;',
          actionLabel: 'Select Active Database',
          commandType: 'DDL',
          description: 'Switch session context to pandiyan_store database container.',
          explanation: [
            'Selects pandiyan_store as default working schema.',
            'Ensures all subsequent DDL and DML operations execute within this namespace.'
          ],
          animationType: 'show_databases',
          statusMessage: 'Database changed to pandiyan_store.',
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: 'transactions',
            columns: [],
            rows: [],
            statusNote: 'Active context: pandiyan_store'
          }
        },
        {
          id: 'step-5-1-2',
          stepNumber: 2,
          sql: 'create table transactions(\nid int primary key,\namount decimal(10,2)\n);',
          actionLabel: 'Create Table with PRIMARY KEY',
          commandType: 'DDL',
          description: 'Initialize transactions table with an integer PRIMARY KEY and decimal amount.',
          explanation: [
            'Column "id" is designated as the PRIMARY KEY.',
            'MySQL automatically creates a unique index on "id" and disallows NULLs.'
          ],
          animationType: 'create_table',
          statusMessage: 'Query OK, 0 rows affected (0.002 sec)',
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: 'transactions',
            columns: [
              { name: 'id', type: 'int', isPrimary: true, nullable: false, isUnique: true },
              { name: 'amount', type: 'decimal(10,2)', nullable: true }
            ],
            rows: [],
            statusNote: 'Table transactions created with PRIMARY KEY (id)'
          }
        },
        {
          id: 'step-5-1-3',
          stepNumber: 3,
          sql: 'insert into transactions\nvalues (1,200);',
          actionLabel: 'Insert Valid Baseline Record',
          commandType: 'DML',
          description: 'Insert the first transaction with id=1 and amount=200.00.',
          explanation: [
            'Value 1 is successfully accepted as the primary key.',
            'Amount is stored as decimal 200.00.'
          ],
          animationType: 'insert_row',
          statusMessage: 'Query OK, 1 row affected (0.001 sec)',
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: 'transactions',
            columns: [
              { name: 'id', type: 'int', isPrimary: true, nullable: false, isUnique: true },
              { name: 'amount', type: 'decimal(10,2)', nullable: true }
            ],
            rows: [
              { id: 1, amount: '200.00' }
            ],
            statusNote: 'Row inserted: id=1, amount=200.00'
          }
        },
        {
          id: 'step-5-1-4',
          stepNumber: 4,
          sql: 'insert into transactions\nvalues (1,300);',
          actionLabel: 'Demonstrate Duplicate PK Rejection',
          commandType: 'DML',
          description: 'Attempt to insert another row with duplicate id=1 and amount=300.',
          explanation: [
            'CRITICAL CONSTRAINT ENFORCEMENT:',
            'Primary keys forbid duplicate values. Key "1" already exists in table transactions.',
            'Engine halts with: ERROR 1062 (23000): Duplicate entry \'1\' for key \'transactions.PRIMARY\'.'
          ],
          animationType: 'primary_key_error',
          statusMessage: "ERROR 1062 (23000): Duplicate entry '1' for key 'transactions.PRIMARY'",
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: 'transactions',
            columns: [
              { name: 'id', type: 'int', isPrimary: true, nullable: false, isUnique: true },
              { name: 'amount', type: 'decimal(10,2)', nullable: true }
            ],
            rows: [
              { id: 1, amount: '200.00' }
            ],
            statusNote: 'Transaction aborted: Duplicate key entry rejected!'
          }
        },
        {
          id: 'step-5-1-5',
          stepNumber: 5,
          sql: 'insert into transactions\nvalues (null,600);',
          actionLabel: 'Demonstrate NULL PK Rejection',
          commandType: 'DML',
          description: 'Attempt to insert a row with NULL primary key value.',
          explanation: [
            'CRITICAL NOT-NULL ENFORCEMENT:',
            'A primary key can NEVER be NULL because every entity must be concretely addressable.',
            'Engine halts with: ERROR 1048 (23000): Column \'id\' cannot be null.'
          ],
          animationType: 'primary_key_error',
          statusMessage: "ERROR 1048 (23000): Column 'id' cannot be null",
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: 'transactions',
            columns: [
              { name: 'id', type: 'int', isPrimary: true, nullable: false, isUnique: true },
              { name: 'amount', type: 'decimal(10,2)', nullable: true }
            ],
            rows: [
              { id: 1, amount: '200.00' }
            ],
            statusNote: 'Transaction aborted: Column "id" cannot be null!'
          }
        },
        {
          id: 'step-5-1-6',
          stepNumber: 6,
          sql: 'insert into transactions\nvalues(200);',
          actionLabel: 'Demonstrate Column Count Mismatch',
          commandType: 'DML',
          description: 'Attempt to insert only 1 value into a table with 2 columns without specifying target columns.',
          explanation: [
            'SYNTAX RULE: When no column list is declared in INSERT INTO, values must be supplied for ALL columns.',
            'Table has 2 columns (id, amount), but only 1 value (200) was supplied.',
            'Engine halts with: ERROR 1136 (21S01): Column count doesn\'t match value count at row 1.'
          ],
          animationType: 'primary_key_error',
          statusMessage: "ERROR 1136 (21S01): Column count doesn't match value count at row 1",
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: 'transactions',
            columns: [
              { name: 'id', type: 'int', isPrimary: true, nullable: false, isUnique: true },
              { name: 'amount', type: 'decimal(10,2)', nullable: true }
            ],
            rows: [
              { id: 1, amount: '200.00' }
            ],
            statusNote: 'Transaction aborted: Column count mismatch!'
          }
        },
        {
          id: 'step-5-1-7',
          stepNumber: 7,
          sql: 'drop table transactions;',
          actionLabel: 'Drop Transactions Table',
          commandType: 'DDL',
          description: 'Permanently remove the transactions table and its schema.',
          explanation: [
            'Removes table definition, indexes, and all stored rows from storage catalog.',
            'Demonstrates clean schema tear-down before creating new configurations.'
          ],
          animationType: 'drop_table',
          statusMessage: 'Query OK, 0 rows affected (0.002 sec)',
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: undefined,
            columns: [],
            rows: [],
            statusNote: 'Table transactions successfully dropped'
          }
        },
        {
          id: 'step-5-1-8',
          stepNumber: 8,
          sql: 'select * from transactions;',
          actionLabel: 'Verify Non-Existent Table Query Error',
          commandType: 'DQL',
          description: 'Attempt to query the dropped table to verify that it no longer exists.',
          explanation: [
            'Querying a non-existent table returns MySQL Error 1146.',
            'Confirms that table transactions was completely unmapped.'
          ],
          animationType: 'select_query',
          statusMessage: "ERROR 1146 (42S02): Table 'pandiyan_store.transactions' doesn't exist",
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: undefined,
            columns: [],
            rows: [],
            statusNote: 'Verified: Table transactions does not exist'
          }
        }
      ]
    },
    {
      id: 'topic-5-2',
      title: 'Topic 5.2: AUTO_INCREMENT Surrogate Keys & Column Constraints',
      subtitle: 'Automatic ID generation and adding primary key constraints',
      conceptBadge: 'AUTO_INCREMENT & ALTER',
      description: 'Learn how to designate an AUTO_INCREMENT column so MySQL automatically generates unique serial identifiers when new rows are inserted. Discover what happens when attempting to add a second primary key constraint.',
      commands: [
        'create table transactions(\nt_id int primary key auto_increment,\namt decimal(10,2)\n);',
        'alter table transactions\nadd constraint primary key(t_id);',
        'insert into transactions(amt)\nvalues(900);',
        'select * from transactions;'
      ],
      definitions: [
        {
          title: 'AUTO_INCREMENT Attribute',
          syntax: 'col_name data_type PRIMARY KEY AUTO_INCREMENT',
          purpose: 'Generates a unique integer identity for new rows automatically whenever the column is omitted or passed as NULL.',
          keyPoints: [
            'Only one AUTO_INCREMENT column is allowed per table, and it MUST be indexed (typically the PRIMARY KEY).',
            'By default, starts counting from 1 and increments by 1 for each new row.',
            'Relieves client applications from manually calculating MAX(id) + 1, avoiding race conditions.'
          ],
          example: 'create table transactions(t_id int primary key auto_increment, amt decimal(10,2));'
        },
        {
          title: 'Error 1068: Multiple Primary Key Defined',
          syntax: 'ERROR 1068 (42000): Multiple primary key defined',
          purpose: 'Thrown when an ALTER TABLE attempts to add a primary key constraint to a table that already has one defined.',
          keyPoints: [
            'A table can only have ONE PRIMARY KEY in relational databases.',
            'To replace a primary key, you must execute ALTER TABLE table DROP PRIMARY KEY first.'
          ],
          example: 'alter table transactions add constraint primary key(t_id);'
        }
      ],
      steps: [
        {
          id: 'step-5-2-1',
          stepNumber: 1,
          sql: 'create table transactions(\nt_id int primary key auto_increment,\namt decimal(10,2)\n);',
          actionLabel: 'Create Table with AUTO_INCREMENT PK',
          commandType: 'DDL',
          description: 'Create transactions table where t_id is both PRIMARY KEY and AUTO_INCREMENT.',
          explanation: [
            't_id will automatically increment starting from 1.',
            'amt is defined as decimal(10,2) for monetary precision.'
          ],
          animationType: 'create_table',
          statusMessage: 'Query OK, 0 rows affected (0.002 sec)',
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, nullable: false, isUnique: true, autoIncrement: true },
              { name: 'amt', type: 'decimal(10,2)', nullable: true }
            ],
            rows: [],
            statusNote: 'Table transactions created with t_id AUTO_INCREMENT'
          }
        },
        {
          id: 'step-5-2-2',
          stepNumber: 2,
          sql: 'alter table transactions\nadd constraint primary key(t_id);',
          actionLabel: 'Attempt Adding Duplicate Primary Key',
          commandType: 'DDL',
          description: 'Try adding a primary key constraint when t_id is already defined as the primary key.',
          explanation: [
            'In MySQL, a table can possess only ONE primary key.',
            'Because t_id was already declared primary key during CREATE TABLE, MySQL rejects duplicate primary key definitions with: ERROR 1068 (42000): Multiple primary key defined.'
          ],
          animationType: 'primary_key_error',
          statusMessage: 'ERROR 1068 (42000): Multiple primary key defined',
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, nullable: false, isUnique: true, autoIncrement: true },
              { name: 'amt', type: 'decimal(10,2)', nullable: true }
            ],
            rows: [],
            statusNote: 'Constraint rejected: Multiple primary key defined'
          }
        },
        {
          id: 'step-5-2-3',
          stepNumber: 3,
          sql: 'insert into transactions(amt)\nvalues(900);',
          actionLabel: 'Insert Row with Omitted AUTO_INCREMENT ID',
          commandType: 'DML',
          description: 'Insert a transaction specifying only the amt column (900).',
          explanation: [
            'Notice that t_id is omitted from the column list.',
            'MySQL evaluates the AUTO_INCREMENT counter and automatically assigns t_id = 1!',
            'Amount is stored as 900.00.'
          ],
          animationType: 'auto_increment_insert',
          statusMessage: 'Query OK, 1 row affected (0.001 sec)',
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, nullable: false, isUnique: true, autoIncrement: true },
              { name: 'amt', type: 'decimal(10,2)', nullable: true }
            ],
            rows: [
              { t_id: 1, amt: '900.00' }
            ],
            statusNote: 'Row inserted! t_id automatically assigned 1'
          }
        },
        {
          id: 'step-5-2-4',
          stepNumber: 4,
          sql: 'select * from transactions;',
          actionLabel: 'Inspect Auto-Generated Record',
          commandType: 'DQL',
          description: 'Verify the newly inserted record with auto-generated primary key.',
          explanation: [
            'Shows the table contents: t_id = 1, amt = 900.00.',
            'Proves that AUTO_INCREMENT automatically handles unique primary key generation.'
          ],
          animationType: 'select_query',
          statusMessage: '1 row in set (0.001 sec)',
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, nullable: false, isUnique: true, autoIncrement: true },
              { name: 'amt', type: 'decimal(10,2)', nullable: true }
            ],
            rows: [
              { t_id: 1, amt: '900.00' }
            ],
            statusNote: '1 row returned: t_id=1, amt=900.00'
          }
        }
      ]
    },
    {
      id: 'topic-5-3',
      title: 'Topic 5.3: Modify Column to AUTO_INCREMENT & Set Seed (200)',
      subtitle: 'Altering existing columns and configuring sequence starting points',
      conceptBadge: 'MODIFY & SEED OFFSET',
      description: 'Discover how to add AUTO_INCREMENT to an existing column using ALTER TABLE MODIFY, and configure a custom starting seed value using ALTER TABLE table AUTO_INCREMENT = 200.',
      commands: [
        'drop table transactions;',
        'create table transactions\n(\nt_id int primary key ,\namt decimal(10,2)\n);',
        'alter table transactions\nmodify t_id int auto_increment ;',
        'alter table transactions\nauto_increment = 200;',
        'insert into transactions(amt)\nvalues(900);',
        'select * from transactions;'
      ],
      definitions: [
        {
          title: 'ALTER TABLE ... MODIFY col AUTO_INCREMENT',
          syntax: 'ALTER TABLE table_name MODIFY col_name data_type AUTO_INCREMENT;',
          purpose: 'Enables auto-incrementing on an existing column that was initially created without it.',
          keyPoints: [
            'The column must already be indexed or defined as PRIMARY KEY.',
            'Existing rows maintain their current ID values; subsequent inserts generate the next numbers.'
          ],
          example: 'alter table transactions modify t_id int auto_increment;'
        },
        {
          title: 'ALTER TABLE ... AUTO_INCREMENT = seed',
          syntax: 'ALTER TABLE table_name AUTO_INCREMENT = new_start_value;',
          purpose: 'Sets the next integer value to be assigned by the auto-increment generator.',
          keyPoints: [
            'Useful for starting order IDs or invoice numbers at professional offsets like 1000, 5000, or 200.',
            'In MySQL InnoDB, the new seed value must be greater than or equal to the current maximum key value in the table.'
          ],
          example: 'alter table transactions auto_increment = 200;'
        }
      ],
      steps: [
        {
          id: 'step-5-3-1',
          stepNumber: 1,
          sql: 'drop table transactions;',
          actionLabel: 'Drop Existing Transactions Table',
          commandType: 'DDL',
          description: 'Tear down previous table to demonstrate configuring AUTO_INCREMENT via ALTER TABLE.',
          explanation: [
            'Drops the previous transactions schema.',
            'Prepares a clean slate for creating a table without AUTO_INCREMENT initially.'
          ],
          animationType: 'drop_table',
          statusMessage: 'Query OK, 0 rows affected (0.001 sec)',
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: undefined,
            columns: [],
            rows: [],
            statusNote: 'Table transactions dropped'
          }
        },
        {
          id: 'step-5-3-2',
          stepNumber: 2,
          sql: 'create table transactions\n(\nt_id int primary key ,\namt decimal(10,2)\n);',
          actionLabel: 'Create Table Without AUTO_INCREMENT',
          commandType: 'DDL',
          description: 'Initialize transactions with t_id as PRIMARY KEY, but initially without AUTO_INCREMENT.',
          explanation: [
            'Notice that t_id is created as standard int primary key.',
            'Next, we will modify it using ALTER TABLE.'
          ],
          animationType: 'create_table',
          statusMessage: 'Query OK, 0 rows affected (0.002 sec)',
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, nullable: false, isUnique: true },
              { name: 'amt', type: 'decimal(10,2)', nullable: true }
            ],
            rows: [],
            statusNote: 'Table created without AUTO_INCREMENT attribute'
          }
        },
        {
          id: 'step-5-3-3',
          stepNumber: 3,
          sql: 'alter table transactions\nmodify t_id int auto_increment ;',
          actionLabel: 'Modify Column to AUTO_INCREMENT',
          commandType: 'DDL',
          description: 'Use ALTER TABLE MODIFY to add the AUTO_INCREMENT attribute to column t_id.',
          explanation: [
            'Re-defines t_id in-place to include AUTO_INCREMENT behavior.',
            'MySQL registers t_id with the sequence generator.'
          ],
          animationType: 'modify_column_type',
          statusMessage: 'Query OK, 0 rows affected (0.003 sec)\nRecords: 0  Duplicates: 0  Warnings: 0',
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, nullable: false, isUnique: true, autoIncrement: true },
              { name: 'amt', type: 'decimal(10,2)', nullable: true }
            ],
            rows: [],
            statusNote: 'Column t_id modified to AUTO_INCREMENT'
          }
        },
        {
          id: 'step-5-3-4',
          stepNumber: 4,
          sql: 'alter table transactions\nauto_increment = 200;',
          actionLabel: 'Set AUTO_INCREMENT Seed to 200',
          commandType: 'DDL',
          description: 'Configure the sequence generator so the next assigned ID starts at 200.',
          explanation: [
            'Alters table metadata setting next AUTO_INCREMENT value to 200.',
            'Any subsequent insert without a specified ID will receive 200, then 201, 202, and so on.'
          ],
          animationType: 'alter_auto_increment',
          statusMessage: 'Query OK, 0 rows affected (0.002 sec)\nRecords: 0  Duplicates: 0  Warnings: 0',
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, nullable: false, isUnique: true, autoIncrement: true },
              { name: 'amt', type: 'decimal(10,2)', nullable: true }
            ],
            rows: [],
            statusNote: 'Table AUTO_INCREMENT counter updated to 200'
          }
        },
        {
          id: 'step-5-3-5',
          stepNumber: 5,
          sql: 'insert into transactions(amt)\nvalues(900);',
          actionLabel: 'Insert Row to Verify Seed 200',
          commandType: 'DML',
          description: 'Insert a transaction with amt=900 to observe the 200 seed in action.',
          explanation: [
            'Because AUTO_INCREMENT was set to 200, MySQL assigns t_id = 200 instead of 1!',
            'Amt is recorded as 900.00.'
          ],
          animationType: 'auto_increment_insert',
          statusMessage: 'Query OK, 1 row affected (0.001 sec)',
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, nullable: false, isUnique: true, autoIncrement: true },
              { name: 'amt', type: 'decimal(10,2)', nullable: true }
            ],
            rows: [
              { t_id: 200, amt: '900.00' }
            ],
            statusNote: 'Row inserted! t_id received seed value 200'
          }
        },
        {
          id: 'step-5-3-6',
          stepNumber: 6,
          sql: 'select * from transactions;',
          actionLabel: 'Verify Resulting Table Record',
          commandType: 'DQL',
          description: 'Query table transactions to confirm the row with id=200 exists.',
          explanation: [
            'Displays record: t_id = 200, amt = 900.00.',
            'Confirms that starting offset 200 was successfully executed and stored.'
          ],
          animationType: 'select_query',
          statusMessage: '1 row in set (0.001 sec)',
          afterState: {
            databaseName: 'pandiyan_store',
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, nullable: false, isUnique: true, autoIncrement: true },
              { name: 'amt', type: 'decimal(10,2)', nullable: true }
            ],
            rows: [
              { t_id: 200, amt: '900.00' }
            ],
            statusNote: '1 row returned: t_id=200, amt=900.00'
          }
        }
      ]
    }
  ]
};

export const PART_5_QUIZ: QuizQuestion[] = [
  {
    id: 'p5-q1',
    topicId: 'topic-5-1',
    question: 'What two fundamental constraints are automatically enforced by a PRIMARY KEY in MySQL?',
    options: [
      'NOT NULL and UNIQUE',
      'DEFAULT and AUTO_INCREMENT',
      'CHECK and FOREIGN KEY',
      'READ ONLY and INDEX'
    ],
    correctIndex: 0,
    explanation: 'A PRIMARY KEY strictly enforces both NOT NULL (no missing keys) and UNIQUE (no duplicate keys) for every record in the table.'
  },
  {
    id: 'p5-q2',
    topicId: 'topic-5-1',
    question: 'What MySQL error occurs when you attempt to insert a duplicate value into a PRIMARY KEY column?',
    options: [
      'ERROR 1062 (23000): Duplicate entry for key',
      'ERROR 1048 (23000): Column cannot be null',
      'ERROR 1050 (42S01): Table already exists',
      'ERROR 1146 (42S02): Table doesn\'t exist'
    ],
    correctIndex: 0,
    explanation: 'MySQL throws ERROR 1062 (Duplicate entry) when an INSERT or UPDATE violates a unique or primary key constraint.'
  },
  {
    id: 'p5-q3',
    topicId: 'topic-5-2',
    question: 'If a table has an AUTO_INCREMENT primary key and you run: INSERT INTO transactions(amt) VALUES(900); without specifying the ID, what happens?',
    options: [
      'MySQL throws an error saying the primary key cannot be null',
      'MySQL automatically generates the next sequential integer for the primary key',
      'MySQL inserts NULL for the primary key',
      'The insert is converted into an UPDATE query'
    ],
    correctIndex: 1,
    explanation: 'MySQL evaluates the table\'s AUTO_INCREMENT generator and automatically assigns the next sequential integer (e.g. 1, 2, 3...).'
  },
  {
    id: 'p5-q4',
    topicId: 'topic-5-3',
    question: 'Which SQL command configures the next generated AUTO_INCREMENT value to start at 200?',
    options: [
      'ALTER TABLE transactions AUTO_INCREMENT = 200;',
      'UPDATE transactions SET AUTO_INCREMENT = 200;',
      'SET AUTO_INCREMENT = 200 ON transactions;',
      'MODIFY TABLE transactions AUTO_INCREMENT 200;'
    ],
    correctIndex: 0,
    explanation: 'ALTER TABLE table_name AUTO_INCREMENT = 200; updates the table\'s internal auto-increment counter to begin at 200.'
  },
  {
    id: 'p5-q5',
    topicId: 'topic-5-2',
    question: 'Why does "ALTER TABLE transactions ADD CONSTRAINT PRIMARY KEY(t_id);" fail with ERROR 1068 if t_id was already defined as PRIMARY KEY in CREATE TABLE?',
    options: [
      'Because SQL allows multiple primary keys only if they are varchar',
      'Because a relational table can have only ONE primary key defined',
      'Because t_id has already reached the maximum integer limit',
      'Because transactions must be rolled back first'
    ],
    correctIndex: 1,
    explanation: 'A table can only have one primary key constraint. Adding a second primary key violates relational rules and triggers ERROR 1068 (Multiple primary key defined).'
  }
];

export const PART_5_PRESETS = [
  { label: 'P5: Use pandiyan_store', query: 'use pandiyan_store;' },
  { label: 'P5: Create table transactions (PK)', query: 'create table transactions(\nid int primary key,\namount decimal(10,2)\n);' },
  { label: 'P5: Insert Row 1 (1, 200)', query: 'insert into transactions\nvalues (1,200);' },
  { label: 'P5: Insert Duplicate PK (1, 300) [Error 1062]', query: 'insert into transactions\nvalues (1,300);' },
  { label: 'P5: Insert NULL PK [Error 1048]', query: 'insert into transactions\nvalues (null,600);' },
  { label: 'P5: Insert 1 Value [Error 1136]', query: 'insert into transactions\nvalues(200);' },
  { label: 'P5: Drop table transactions', query: 'drop table transactions;' },
  { label: 'P5: Select missing table [Error 1146]', query: 'select * from transactions;' },
  { label: 'P5: Create table with AUTO_INCREMENT', query: 'create table transactions(\nt_id int primary key auto_increment,\namt decimal(10,2)\n);' },
  { label: 'P5: Add PK constraint [Error 1068]', query: 'alter table transactions\nadd constraint primary key(t_id);' },
  { label: 'P5: Insert into transactions(amt) (Auto ID)', query: 'insert into transactions(amt)\nvalues(900);' },
  { label: 'P5: Select * from transactions', query: 'select * from transactions;' },
  { label: 'P5: Create table without AUTO_INC', query: 'create table transactions\n(\nt_id int primary key ,\namt decimal(10,2)\n);' },
  { label: 'P5: Modify t_id to AUTO_INCREMENT', query: 'alter table transactions\nmodify t_id int auto_increment ;' },
  { label: 'P5: Set AUTO_INCREMENT = 200', query: 'alter table transactions\nauto_increment = 200;' }
];
