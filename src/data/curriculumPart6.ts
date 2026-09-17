import { Part, QuizQuestion } from '../types/sql';

export const PART_6: Part = {
  id: 'part-6',
  number: 6,
  title: 'Part 6: Foreign Keys & Referential Integrity',
  subtitle: 'Parent-Child Relationships • FOREIGN KEY Constraints • Drop & Add Named Constraints • Protected Deletions',
  description: 'Master relational data modeling: establish parent-child tables with FOREIGN KEY constraints, map child foreign keys to parent primary keys, customize constraint names with ALTER TABLE, and observe MySQL engine-level enforcement preventing accidental deletion of parent records (Error 1451).',
  badge: 'Part 6 • Foreign Keys',
  topics: [
    {
      id: 'topic-6-1',
      title: 'Topic 6.1: Parent Table Setup (customers)',
      subtitle: 'Creating the parent entity and establishing primary key records',
      conceptBadge: 'PARENT TABLE & SEEDING',
      description: 'Set up the primary table in pandiyan_store. The customers table serves as the authoritative parent entity with an auto-incrementing primary key (c_id).',
      commands: [
        'use pandiyan_store;',
        'create table customers\n(\nc_id int primary key auto_increment,\nc_name varchar(50),\nage int\n);',
        'insert into customers(c_name,age)\nvalues ( "kishor",18),("begam" ,19);'
      ],
      definitions: [
        {
          title: 'Parent (Referenced) Table',
          syntax: 'CREATE TABLE parent_table ( id INT PRIMARY KEY AUTO_INCREMENT, ... );',
          purpose: 'The table that holds the primary authoritative records that other tables link to via foreign keys.',
          keyPoints: [
            'The referenced column (e.g., c_id) must be indexed, usually as a PRIMARY KEY or UNIQUE constraint.',
            'Parent rows provide the valid set of values that child foreign key columns can legally reference.',
            'Surrogate primary keys (INT AUTO_INCREMENT) provide stable, immutable references.'
          ],
          example: 'create table customers(c_id int primary key auto_increment, c_name varchar(50), age int);'
        },
        {
          title: 'Multi-Row Parent Seeding',
          syntax: 'INSERT INTO table(col1, col2) VALUES (val1, val2), (val3, val4);',
          purpose: 'Seeds the parent table with initial entities in a single atomic transaction.',
          keyPoints: [
            'AUTO_INCREMENT automatically assigns c_id = 1 to "kishor" and c_id = 2 to "begam".',
            'Subsequent foreign keys in child tables will point back to these assigned IDs.'
          ],
          example: 'insert into customers(c_name,age) values ("kishor",18), ("begam",19);'
        }
      ],
      steps: [
        {
          id: 'step-6-1-1',
          stepNumber: 1,
          title: 'Select pandiyan_store Database Context',
          actionLabel: 'USE Context',
          sql: 'use pandiyan_store;',
          commandType: 'ADMIN',
          description: 'Ensure pandiyan_store is the active schema namespace.',
          explanation: [
            'MySQL switches working namespace to pandiyan_store.',
            'All subsequent table operations (customers, transactions) execute within this schema.'
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
            availableDatabases: ['information_schema', 'mysql', 'performance_schema', 'sys', 'july', 'pandiyan_store'],
            statusNote: 'Active Database: pandiyan_store'
          },
          keyTakeaways: [
            'Foreign keys can only reference tables within the same server instance, typically in the same schema.'
          ]
        },
        {
          id: 'step-6-1-2',
          stepNumber: 2,
          title: 'Create Parent Table: customers',
          actionLabel: 'Parent Table DDL',
          sql: 'create table customers\n(\nc_id int primary key auto_increment,\nc_name varchar(50),\nage int\n);',
          commandType: 'DDL',
          description: 'Create the customers table with primary key c_id, customer name, and age.',
          explanation: [
            'c_id is configured with PRIMARY KEY and AUTO_INCREMENT to act as the referenced target column.',
            'c_name allocates up to 50 characters, and age is stored as an INT.'
          ],
          animationType: 'create_table',
          highlightDetails: {
            columnName: 'c_id'
          },
          beforeState: {
            tableName: 'customers',
            columns: [],
            rows: []
          },
          afterState: {
            tableName: 'customers',
            columns: [
              { name: 'c_id', type: 'int', isPrimary: true, autoIncrement: true, nullable: false, isUnique: true },
              { name: 'c_name', type: 'varchar(50)', nullable: true },
              { name: 'age', type: 'int', nullable: true }
            ],
            rows: [],
            statusNote: 'Parent table "customers" allocated with PRIMARY KEY c_id (AUTO_INCREMENT).'
          },
          keyTakeaways: [
            'The referenced column in the parent table MUST be unique or a primary key before a foreign key can point to it.'
          ]
        },
        {
          id: 'step-6-1-3',
          stepNumber: 3,
          title: 'Seed Parent Customers',
          actionLabel: 'Multi-Row Insert',
          sql: 'insert into customers(c_name,age)\nvalues ( "kishor",18),("begam" ,19);',
          commandType: 'DML',
          description: 'Insert two customer records. c_id values are auto-generated as 1 and 2.',
          explanation: [
            'Row 1 ("kishor", 18) receives auto-incremented c_id = 1.',
            'Row 2 ("begam", 19) receives auto-incremented c_id = 2.'
          ],
          animationType: 'insert_multi',
          highlightDetails: {
            highlightedRowIndices: [0, 1]
          },
          beforeState: {
            tableName: 'customers',
            columns: [
              { name: 'c_id', type: 'int', isPrimary: true, autoIncrement: true, nullable: false, isUnique: true },
              { name: 'c_name', type: 'varchar(50)', nullable: true },
              { name: 'age', type: 'int', nullable: true }
            ],
            rows: []
          },
          afterState: {
            tableName: 'customers',
            columns: [
              { name: 'c_id', type: 'int', isPrimary: true, autoIncrement: true, nullable: false, isUnique: true },
              { name: 'c_name', type: 'varchar(50)', nullable: true },
              { name: 'age', type: 'int', nullable: true }
            ],
            rows: [
              { c_id: 1, c_name: 'kishor', age: 18 },
              { c_id: 2, c_name: 'begam', age: 19 }
            ],
            statusNote: '2 customer rows inserted. c_id values generated: 1 and 2.'
          },
          keyTakeaways: [
            'Parent rows establish valid foreign key target values (c_id = 1, 2).'
          ]
        }
      ]
    },
    {
      id: 'topic-6-2',
      title: 'Topic 6.2: Child Table Creation & Foreign Key Constraints',
      subtitle: 'Linking transactions to customers via FOREIGN KEY(customer_id) REFERENCES customers(c_id)',
      conceptBadge: 'FOREIGN KEY & CHILD ROWS',
      description: 'Create the child transactions table with a FOREIGN KEY linking customer_id to customers(c_id). Insert dependent child rows referencing parent customer 1.',
      commands: [
        'select * from transactions;',
        'create table transactions(\nt_id int primary key auto_increment,\namount decimal(6,2),\ncustomer_id int not null,\nforeign key(customer_id) references customers(c_id)\n);',
        'insert into transactions(amount,customer_id)\nvalues(45.67,1);',
        'insert into transactions(amount,customer_id)\nvalues(75.67,1);'
      ],
      definitions: [
        {
          title: 'FOREIGN KEY Constraint',
          syntax: 'FOREIGN KEY (child_col) REFERENCES parent_table(parent_col)',
          purpose: 'Enforces referential integrity by requiring every value in the child column to match an existing primary key value in the parent table.',
          keyPoints: [
            'Prevents orphan records: Cannot insert a transaction with a customer_id that does not exist in customers.',
            'If no explicit constraint name is provided, MySQL assigns a default name like table_ibfk_1.',
            'Maintains a 1-to-many relationship: One customer can have multiple transactions.'
          ],
          example: 'foreign key(customer_id) references customers(c_id)'
        },
        {
          title: 'Referential Integrity Rule',
          syntax: 'child.customer_id ∈ parent.c_id',
          purpose: 'Guarantees that relationships between tables remain consistent throughout all database operations.',
          keyPoints: [
            'Inserting an unknown customer_id (e.g. 99) raises Error 1452.',
            'Deleting a customer referenced by transactions raises Error 1451.'
          ],
          example: 'insert into transactions(amount,customer_id) values(45.67,1);'
        }
      ],
      steps: [
        {
          id: 'step-6-2-1',
          stepNumber: 4,
          title: 'Inspect Existing Transactions Table',
          actionLabel: 'Select Check',
          sql: 'select * from transactions;',
          commandType: 'DQL',
          description: 'Inspect the transactions table before configuring the new foreign-key relationship.',
          explanation: [
            'Queries the catalog to see current rows or schema.',
            'Prepares for the creation or recreation of the transactions table with the foreign key.'
          ],
          animationType: 'select_query',
          beforeState: {
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, autoIncrement: true },
              { name: 'amt', type: 'decimal(10,2)' }
            ],
            rows: []
          },
          afterState: {
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, autoIncrement: true },
              { name: 'amt', type: 'decimal(10,2)' }
            ],
            rows: [],
            statusNote: 'Empty set (0 rows). Table ready for foreign key schema setup.'
          },
          keyTakeaways: [
            'Inspecting schema state before altering or establishing foreign keys prevents schema mismatch errors.'
          ]
        },
        {
          id: 'step-6-2-2',
          stepNumber: 5,
          title: 'Create transactions Table with FOREIGN KEY',
          actionLabel: 'Create Table with FK',
          sql: 'create table transactions(\nt_id int primary key auto_increment,\namount decimal(6,2),\ncustomer_id int not null,\nforeign key(customer_id) references customers(c_id)\n);',
          commandType: 'DDL',
          description: 'Create child table transactions with t_id, amount decimal(6,2), and foreign key customer_id referencing customers(c_id).',
          explanation: [
            't_id serves as the surrogate primary key with AUTO_INCREMENT.',
            'customer_id is marked NOT NULL and bound via FOREIGN KEY to customers(c_id).',
            'MySQL automatically creates constraint "transactions_ibfk_1" for this relation.'
          ],
          animationType: 'foreign_key_create',
          highlightDetails: {
            columnName: 'customer_id',
            referencedTable: 'customers',
            referencedColumn: 'c_id',
            foreignKeyName: 'transactions_ibfk_1'
          },
          beforeState: {
            tableName: 'transactions',
            columns: [],
            rows: [],
            secondaryTable: {
              name: 'customers',
              columns: [
                { name: 'c_id', type: 'int', isPrimary: true, autoIncrement: true },
                { name: 'c_name', type: 'varchar(50)' },
                { name: 'age', type: 'int' }
              ],
              rows: [
                { c_id: 1, c_name: 'kishor', age: 18 },
                { c_id: 2, c_name: 'begam', age: 19 }
              ]
            }
          },
          afterState: {
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, autoIncrement: true, nullable: false, isUnique: true },
              { name: 'amount', type: 'decimal(6,2)', nullable: true },
              { name: 'customer_id', type: 'int', nullable: false, isForeignKey: true, referencesTable: 'customers', referencesColumn: 'c_id' }
            ],
            rows: [],
            foreignKeys: [
              { name: 'transactions_ibfk_1', column: 'customer_id', referencedTable: 'customers', referencedColumn: 'c_id' }
            ],
            secondaryTable: {
              name: 'customers',
              columns: [
                { name: 'c_id', type: 'int', isPrimary: true, autoIncrement: true },
                { name: 'c_name', type: 'varchar(50)' },
                { name: 'age', type: 'int' }
              ],
              rows: [
                { c_id: 1, c_name: 'kishor', age: 18 },
                { c_id: 2, c_name: 'begam', age: 19 }
              ]
            },
            statusNote: 'Table "transactions" created. Foreign key "transactions_ibfk_1" references customers(c_id).'
          },
          keyTakeaways: [
            'A foreign key links child records directly to parent entities with engine-level validation.'
          ]
        },
        {
          id: 'step-6-2-3',
          stepNumber: 6,
          title: 'Insert First Transaction for Customer 1',
          actionLabel: 'Valid FK Insert',
          sql: 'insert into transactions(amount,customer_id)\nvalues(45.67,1);',
          commandType: 'DML',
          description: 'Insert transaction of 45.67 for customer_id = 1 (kishor).',
          explanation: [
            'MySQL validates that customer_id = 1 exists in the parent customers table.',
            'Since c_id = 1 (kishor) exists, referential check passes.',
            't_id is automatically assigned 1.'
          ],
          animationType: 'foreign_key_insert',
          highlightDetails: {
            columnName: 'customer_id',
            referencedTable: 'customers',
            referencedColumn: 'c_id'
          },
          beforeState: {
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, autoIncrement: true },
              { name: 'amount', type: 'decimal(6,2)' },
              { name: 'customer_id', type: 'int', isForeignKey: true, referencesTable: 'customers', referencesColumn: 'c_id' }
            ],
            rows: []
          },
          afterState: {
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, autoIncrement: true },
              { name: 'amount', type: 'decimal(6,2)' },
              { name: 'customer_id', type: 'int', isForeignKey: true, referencesTable: 'customers', referencesColumn: 'c_id' }
            ],
            rows: [
              { t_id: 1, amount: '45.67', customer_id: 1 }
            ],
            statusNote: 'Query OK, 1 row affected. Referenced customer 1 verified in parent table.'
          },
          keyTakeaways: [
            'Every foreign key insertion triggers an internal index lookup in the parent table.'
          ]
        },
        {
          id: 'step-6-2-4',
          stepNumber: 7,
          title: 'Insert Second Transaction for Customer 1',
          actionLabel: 'One-to-Many FK',
          sql: 'insert into transactions(amount,customer_id)\nvalues(75.67,1);',
          commandType: 'DML',
          description: 'Insert transaction of 75.67 for customer_id = 1, demonstrating 1-to-many cardinality.',
          explanation: [
            'Customer 1 (kishor) now has two associated transaction records (t_id 1 and t_id 2).',
            'Demonstrates that parent primary keys can be referenced multiple times in a child table.'
          ],
          animationType: 'foreign_key_insert',
          highlightDetails: {
            columnName: 'customer_id',
            referencedTable: 'customers',
            referencedColumn: 'c_id'
          },
          beforeState: {
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, autoIncrement: true },
              { name: 'amount', type: 'decimal(6,2)' },
              { name: 'customer_id', type: 'int', isForeignKey: true, referencesTable: 'customers', referencesColumn: 'c_id' }
            ],
            rows: [
              { t_id: 1, amount: '45.67', customer_id: 1 }
            ]
          },
          afterState: {
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, autoIncrement: true },
              { name: 'amount', type: 'decimal(6,2)' },
              { name: 'customer_id', type: 'int', isForeignKey: true, referencesTable: 'customers', referencesColumn: 'c_id' }
            ],
            rows: [
              { t_id: 1, amount: '45.67', customer_id: 1 },
              { t_id: 2, amount: '75.67', customer_id: 1 }
            ],
            statusNote: 'Query OK, 1 row affected. Customer 1 now has 2 child transactions.'
          },
          keyTakeaways: [
            'A foreign key column does NOT have to be unique; multiple child rows can point to the same parent.'
          ]
        }
      ]
    },
    {
      id: 'topic-6-3',
      title: 'Topic 6.3: Dropping & Renaming Constraints & Protected Deletions',
      subtitle: 'ALTER TABLE DROP/ADD CONSTRAINT and Error 1451 parent deletion prevention',
      conceptBadge: 'NAMED CONSTRAINTS & ERROR 1451',
      description: 'Learn to drop auto-generated constraint names, add explicit named foreign keys with ALTER TABLE, and witness MySQL blocking the deletion of a parent record referenced by child transactions (Error 1451).',
      commands: [
        'alter table transactions\ndrop foreign key transactions_ibfk_1;',
        'alter table transactions\nadd constraint fk_c_id\nforeign key(customer_id) references customers(c_id);',
        'delete from customers\nwhere c_id =1;'
      ],
      definitions: [
        {
          title: 'DROP FOREIGN KEY Clause',
          syntax: 'ALTER TABLE table_name DROP FOREIGN KEY constraint_name;',
          purpose: 'Removes an existing foreign key constraint from a table without dropping the column itself.',
          keyPoints: [
            'Requires the exact constraint symbol name (e.g. transactions_ibfk_1).',
            'Once dropped, referential integrity checks on that column are temporarily or permanently lifted.',
            'Useful during bulk loading or when restructuring relationships.'
          ],
          example: 'alter table transactions drop foreign key transactions_ibfk_1;'
        },
        {
          title: 'ADD CONSTRAINT Named Foreign Key',
          syntax: 'ALTER TABLE child_table ADD CONSTRAINT constraint_name FOREIGN KEY (col) REFERENCES parent(col);',
          purpose: 'Adds an explicitly named foreign key constraint, establishing self-documenting, maintainable schemas.',
          keyPoints: [
            'Explicit names like fk_c_id make error messages and schema migrations unambiguous.',
            'Validates that all existing rows currently in the child table satisfy the reference.'
          ],
          example: 'alter table transactions add constraint fk_c_id foreign key(customer_id) references customers(c_id);'
        },
        {
          title: 'Error 1451: Cannot Delete or Update Parent Row',
          syntax: 'ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails',
          purpose: 'Thrown when attempting to DELETE a parent row (or UPDATE its primary key) while dependent child rows exist.',
          keyPoints: [
            'Crucial defense mechanism: Prevents child transactions from becoming orphans with invalid customer IDs.',
            'To delete customer 1, you must first either delete its child transactions, set ON DELETE CASCADE, or update child rows.'
          ],
          example: 'delete from customers where c_id = 1; -- BLOCKED by InnoDB engine'
        }
      ],
      steps: [
        {
          id: 'step-6-3-1',
          stepNumber: 8,
          title: 'Drop Auto-Generated Foreign Key',
          actionLabel: 'Drop FK Constraint',
          sql: 'alter table transactions\ndrop foreign key transactions_ibfk_1;',
          commandType: 'DDL',
          description: 'Remove default constraint transactions_ibfk_1 from transactions.',
          explanation: [
            'MySQL removes the internal constraint rule transactions_ibfk_1.',
            'customer_id remains in the table as an ordinary integer column.'
          ],
          animationType: 'foreign_key_drop',
          highlightDetails: {
            foreignKeyName: 'transactions_ibfk_1',
            columnName: 'customer_id'
          },
          beforeState: {
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, autoIncrement: true },
              { name: 'amount', type: 'decimal(6,2)' },
              { name: 'customer_id', type: 'int', isForeignKey: true, referencesTable: 'customers', referencesColumn: 'c_id' }
            ],
            rows: [
              { t_id: 1, amount: '45.67', customer_id: 1 },
              { t_id: 2, amount: '75.67', customer_id: 1 }
            ],
            foreignKeys: [
              { name: 'transactions_ibfk_1', column: 'customer_id', referencedTable: 'customers', referencedColumn: 'c_id' }
            ]
          },
          afterState: {
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, autoIncrement: true },
              { name: 'amount', type: 'decimal(6,2)' },
              { name: 'customer_id', type: 'int', isForeignKey: false }
            ],
            rows: [
              { t_id: 1, amount: '45.67', customer_id: 1 },
              { t_id: 2, amount: '75.67', customer_id: 1 }
            ],
            foreignKeys: [],
            statusNote: 'Query OK, 0 rows affected. Constraint "transactions_ibfk_1" dropped.'
          },
          keyTakeaways: [
            'Dropping a foreign key requires specifying the constraint symbol, not the column name.'
          ]
        },
        {
          id: 'step-6-3-2',
          stepNumber: 9,
          title: 'Add Explicit Named Constraint: fk_c_id',
          actionLabel: 'Add Named FK',
          sql: 'alter table transactions\nadd constraint fk_c_id\nforeign key(customer_id) references customers(c_id);',
          commandType: 'DDL',
          description: 'Re-bind customer_id to customers(c_id) with clean, explicit name fk_c_id.',
          explanation: [
            'MySQL scans existing rows in transactions (t_id 1 & 2 have customer_id = 1).',
            'Validates that c_id = 1 exists in customers table.',
            'Attaches named constraint "fk_c_id" to the schema catalog.'
          ],
          animationType: 'foreign_key_add',
          highlightDetails: {
            foreignKeyName: 'fk_c_id',
            columnName: 'customer_id',
            referencedTable: 'customers',
            referencedColumn: 'c_id'
          },
          beforeState: {
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, autoIncrement: true },
              { name: 'amount', type: 'decimal(6,2)' },
              { name: 'customer_id', type: 'int', isForeignKey: false }
            ],
            rows: [
              { t_id: 1, amount: '45.67', customer_id: 1 },
              { t_id: 2, amount: '75.67', customer_id: 1 }
            ],
            foreignKeys: []
          },
          afterState: {
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int', isPrimary: true, autoIncrement: true },
              { name: 'amount', type: 'decimal(6,2)' },
              { name: 'customer_id', type: 'int', isForeignKey: true, referencesTable: 'customers', referencesColumn: 'c_id' }
            ],
            rows: [
              { t_id: 1, amount: '45.67', customer_id: 1 },
              { t_id: 2, amount: '75.67', customer_id: 1 }
            ],
            foreignKeys: [
              { name: 'fk_c_id', column: 'customer_id', referencedTable: 'customers', referencedColumn: 'c_id' }
            ],
            statusNote: 'Query OK, 2 rows affected. Constraint "fk_c_id" active and verified.'
          },
          keyTakeaways: [
            'Always name your foreign key constraints explicitly (e.g. fk_c_id) for clear maintenance and error reporting.'
          ]
        },
        {
          id: 'step-6-3-3',
          stepNumber: 10,
          title: 'Attempt Parent Deletion (Error 1451 Triggered)',
          actionLabel: 'Referential Block',
          sql: 'delete from customers\nwhere c_id =1;',
          commandType: 'DML',
          description: 'Try to delete customer 1 while transactions referencing customer 1 exist. MySQL blocks this deletion!',
          explanation: [
            'MySQL inspects child tables for foreign keys referencing customers(c_id).',
            'Finds transactions rows (t_id 1, t_id 2) with customer_id = 1.',
            'Throws ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails.',
            'Customer 1 is NOT deleted; data integrity remains intact!'
          ],
          animationType: 'foreign_key_error',
          statusMessage: 'ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails (`pandiyan_store`.`transactions`, CONSTRAINT `fk_c_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`c_id`))',
          highlightDetails: {
            columnName: 'c_id',
            referencedTable: 'transactions',
            referencedColumn: 'customer_id',
            foreignKeyName: 'fk_c_id'
          },
          beforeState: {
            tableName: 'customers',
            columns: [
              { name: 'c_id', type: 'int', isPrimary: true, autoIncrement: true },
              { name: 'c_name', type: 'varchar(50)' },
              { name: 'age', type: 'int' }
            ],
            rows: [
              { c_id: 1, c_name: 'kishor', age: 18 },
              { c_id: 2, c_name: 'begam', age: 19 }
            ],
            secondaryTable: {
              name: 'transactions',
              columns: [
                { name: 't_id', type: 'int', isPrimary: true },
                { name: 'amount', type: 'decimal(6,2)' },
                { name: 'customer_id', type: 'int', isForeignKey: true, referencesTable: 'customers', referencesColumn: 'c_id' }
              ],
              rows: [
                { t_id: 1, amount: '45.67', customer_id: 1 },
                { t_id: 2, amount: '75.67', customer_id: 1 }
              ]
            }
          },
          afterState: {
            tableName: 'customers',
            columns: [
              { name: 'c_id', type: 'int', isPrimary: true, autoIncrement: true },
              { name: 'c_name', type: 'varchar(50)' },
              { name: 'age', type: 'int' }
            ],
            rows: [
              { c_id: 1, c_name: 'kishor', age: 18 },
              { c_id: 2, c_name: 'begam', age: 19 }
            ],
            secondaryTable: {
              name: 'transactions',
              columns: [
                { name: 't_id', type: 'int', isPrimary: true },
                { name: 'amount', type: 'decimal(6,2)' },
                { name: 'customer_id', type: 'int', isForeignKey: true, referencesTable: 'customers', referencesColumn: 'c_id' }
              ],
              rows: [
                { t_id: 1, amount: '45.67', customer_id: 1 },
                { t_id: 2, amount: '75.67', customer_id: 1 }
              ]
            },
            statusNote: 'DELETION PREVENTED: ERROR 1451. Child transactions reference customer 1.'
          },
          keyTakeaways: [
            'Foreign keys prevent orphan records by blocking the deletion of parent rows that still have child references.',
            'To legally delete customer 1, you must first remove or reassign the dependent transactions in the child table.'
          ]
        }
      ]
    }
  ]
};

export const PART_6_QUIZ: QuizQuestion[] = [
  {
    id: 'q6-1',
    topicId: 'topic-6-1',
    question: 'What is the requirement for a parent table column before it can be referenced by a foreign key in MySQL?',
    options: [
      'It must be named id',
      'It must have a UNIQUE or PRIMARY KEY index',
      'It must be a VARCHAR data type',
      'It must contain at least 10 rows'
    ],
    correctIndex: 1,
    explanation: 'In MySQL InnoDB, a foreign key can only reference columns that are indexed, almost always the PRIMARY KEY or a UNIQUE column of the parent table.'
  },
  {
    id: 'q6-2',
    topicId: 'topic-6-2',
    question: 'What happens when inserting into transactions with customer_id = 99 when no customer with c_id = 99 exists?',
    options: [
      'MySQL creates customer 99 automatically',
      'The insert succeeds with customer_id set to NULL',
      'MySQL raises ERROR 1452: Cannot add or update a child row (foreign key constraint fails)',
      'The table drops automatically'
    ],
    correctIndex: 2,
    explanation: 'MySQL enforces referential integrity on insert; if the referenced parent key does not exist, it throws ERROR 1452.'
  },
  {
    id: 'q6-3',
    topicId: 'topic-6-3',
    question: 'Why does "DELETE FROM customers WHERE c_id = 1;" fail with ERROR 1451 in the pandiyan_store database?',
    codeSnippet: 'delete from customers where c_id = 1;\n-- ERROR 1451 (23000): Cannot delete or update a parent row',
    options: [
      'Customers table is in READ ONLY mode',
      'The c_id is marked as AUTO_INCREMENT',
      'Child rows in transactions still reference customer_id = 1, violating referential integrity',
      'You must specify the customer name in the WHERE clause'
    ],
    correctIndex: 2,
    explanation: 'ERROR 1451 prevents orphan child records. Because transactions has rows pointing to customer 1, MySQL blocks deleting the parent row.'
  },
  {
    id: 'q6-4',
    topicId: 'topic-6-3',
    question: 'How do you remove a foreign key constraint named fk_c_id from the transactions table?',
    options: [
      'ALTER TABLE transactions DROP COLUMN fk_c_id;',
      'ALTER TABLE transactions DROP FOREIGN KEY fk_c_id;',
      'DROP FOREIGN KEY fk_c_id FROM transactions;',
      'DELETE CONSTRAINT fk_c_id;'
    ],
    correctIndex: 1,
    explanation: 'In MySQL, the syntax to drop a foreign key constraint is "ALTER TABLE table_name DROP FOREIGN KEY constraint_name;".'
  }
];

export const PART_6_PRESETS = [
  {
    label: 'P6: Use pandiyan_store',
    query: 'use pandiyan_store;'
  },
  {
    label: 'P6: Create Parent Table customers',
    query: 'create table customers(\nc_id int primary key auto_increment,\nc_name varchar(50),\nage int\n);'
  },
  {
    label: 'P6: Insert Customers (kishor, begam)',
    query: 'insert into customers(c_name,age)\nvalues ( "kishor",18),("begam" ,19);'
  },
  {
    label: 'P6: Select from transactions (check state)',
    query: 'select * from transactions;'
  },
  {
    label: 'P6: Create Child Table transactions with FK',
    query: 'create table transactions(\nt_id int primary key auto_increment,\namount decimal(6,2),\ncustomer_id int not null,\nforeign key(customer_id) references customers(c_id)\n);'
  },
  {
    label: 'P6: Insert Transaction 1 (amt 45.67, cust 1)',
    query: 'insert into transactions(amount,customer_id)\nvalues(45.67,1);'
  },
  {
    label: 'P6: Insert Transaction 2 (amt 75.67, cust 1)',
    query: 'insert into transactions(amount,customer_id)\nvalues(75.67,1);'
  },
  {
    label: 'P6: Drop Default FK transactions_ibfk_1',
    query: 'alter table transactions\ndrop foreign key transactions_ibfk_1;'
  },
  {
    label: 'P6: Add Named FK Constraint fk_c_id',
    query: 'alter table transactions\nadd constraint fk_c_id\nforeign key(customer_id) references customers(c_id);'
  },
  {
    label: 'P6: Delete Customer 1 [Error 1451 Blocked]',
    query: 'delete from customers\nwhere c_id =1;'
  }
];
