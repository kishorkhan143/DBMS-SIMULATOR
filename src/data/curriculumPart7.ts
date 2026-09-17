import { Part, QuizQuestion } from '../types/sql';

export const PART_7: Part = {
  id: 'part-7',
  number: 7,
  title: 'Part 7: SQL Joins (INNER, LEFT, RIGHT)',
  subtitle: 'Relational Joins • INNER JOIN • LEFT JOIN • RIGHT JOIN • NULL Handling in Outer Joins',
  description: 'Master multi-table relational queries in pandiyan_store: explore baseline tables, seed new customers without transaction history (zehra, khan), and compare INNER JOIN, LEFT JOIN, and RIGHT JOIN behaviors with column projections and NULL representation.',
  badge: 'Part 7 • Joins',
  topics: [
    {
      id: 'topic-7-1',
      title: 'Topic 7.1: Pre-Join Catalog Inspection & Seeding Customers',
      subtitle: 'Inspecting existing transactions and inserting unmatched customers to observe join differences',
      conceptBadge: 'DATA SETUP & SEEDING',
      description: 'Set active database context to pandiyan_store. Inspect existing transactions and customers tables, then insert new customer records (zehra, khan) without transactions to contrast join behavior.',
      commands: [
        'use pandiyan_store;',
        'select * from transactions;',
        'select * from customers;',
        'insert into customers\nvalues (3,"zehra",5);',
        'insert into customers\nvalues (4,"khan" ,7);'
      ],
      definitions: [
        {
          title: 'Relational Join Setup',
          syntax: 'SELECT ... FROM table1 [JOIN_TYPE] JOIN table2 ON table1.key = table2.key;',
          purpose: 'Combines columns from two or more tables based on a related column between them (foreign key to primary key).',
          keyPoints: [
            'pandiyan_store contains parent entity customers and child entity transactions.',
            'transactions.customer_id acts as the foreign key referencing customers.c_id.',
            'Inserting customers who have made 0 transactions creates unmatched right-side keys that highlight outer join behavior.'
          ],
          example: 'select * from transactions inner join customers on transactions.customer_id = customers.c_id;'
        },
        {
          title: 'Direct Multi-Column INSERT',
          syntax: 'INSERT INTO table VALUES (val1, val2, ...);',
          purpose: 'Appends a new record supplying values in the exact positional sequence of the table schema columns.',
          keyPoints: [
            'For customers, the column order is (c_id, c_name, age).',
            'Values (3, "zehra", 5) explicitly sets c_id = 3, c_name = "zehra", and age = 5.',
            'Values (4, "khan", 7) explicitly sets c_id = 4, c_name = "khan", and age = 7.'
          ],
          example: 'insert into customers values (3,"zehra",5);'
        }
      ],
      steps: [
        {
          id: 'step-7-1-1',
          stepNumber: 1,
          title: 'Activate pandiyan_store Database Context',
          actionLabel: 'USE Database',
          sql: 'use pandiyan_store;',
          commandType: 'ADMIN',
          description: 'Switch active schema context to pandiyan_store where customers and transactions reside.',
          explanation: [
            'Directs MySQL to execute all subsequent relational queries against the pandiyan_store catalog.',
            'Ensures unqualified table references resolve to pandiyan_store.'
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
            statusNote: 'Database changed to "pandiyan_store"'
          },
          keyTakeaways: [
            'Both participating tables in a JOIN query must exist in the accessible database scope.'
          ]
        },
        {
          id: 'step-7-1-2',
          stepNumber: 2,
          title: 'Inspect transactions Child Table',
          actionLabel: 'Query Transactions',
          sql: 'select * from transactions;',
          commandType: 'DQL',
          description: 'View baseline rows in the child transactions table.',
          explanation: [
            'Table transactions contains records for t_id 1 (45.67) and t_id 2 (75.67).',
            'Both transactions have customer_id = 1, referencing customer kishor.'
          ],
          animationType: 'select_query',
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
            statusNote: '2 rows in set. Only customer_id = 1 has purchase transactions.'
          },
          keyTakeaways: [
            'Currently, all child transactions belong to customer 1.'
          ]
        },
        {
          id: 'step-7-1-3',
          stepNumber: 3,
          title: 'Inspect customers Parent Table',
          actionLabel: 'Query Customers',
          sql: 'select * from customers;',
          commandType: 'DQL',
          description: 'View baseline records in parent customers table before adding new profiles.',
          explanation: [
            'Parent customers currently contains c_id 1 (kishor) and c_id 2 (begam).',
            'Customer 2 (begam) has no associated transactions in the transactions table.'
          ],
          animationType: 'select_query',
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
            ]
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
            statusNote: '2 rows in set. kishor has transactions, while begam has 0 transactions.'
          },
          keyTakeaways: [
            'In relational schemas, parent records can exist without corresponding child records.'
          ]
        },
        {
          id: 'step-7-1-4',
          stepNumber: 4,
          title: 'Insert Customer 3: zehra',
          actionLabel: 'Insert zehra',
          sql: 'insert into customers\nvalues (3,"zehra",5);',
          commandType: 'DML',
          description: 'Insert new customer record for zehra with c_id 3 and age 5.',
          explanation: [
            'Explicitly assigns primary key c_id = 3, c_name = "zehra", and age = 5.',
            'Zehra has no transactions registered in the transactions table.'
          ],
          animationType: 'insert_row',
          highlightDetails: {
            columnName: 'c_name'
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
            ]
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
              { c_id: 2, c_name: 'begam', age: 19 },
              { c_id: 3, c_name: 'zehra', age: 5 }
            ],
            statusNote: 'Query OK, 1 row affected. Added customer 3 (zehra).'
          },
          keyTakeaways: [
            'Zehra becomes another unmatched parent record that will be tested in join queries.'
          ]
        },
        {
          id: 'step-7-1-5',
          stepNumber: 5,
          title: 'Insert Customer 4: khan',
          actionLabel: 'Insert khan',
          sql: 'insert into customers\nvalues (4,"khan" ,7);',
          commandType: 'DML',
          description: 'Insert new customer record for khan with c_id 4 and age 7.',
          explanation: [
            'Explicitly assigns primary key c_id = 4, c_name = "khan", and age = 7.',
            'Customers table now holds 4 users: kishor (c_id 1), begam (c_id 2), zehra (c_id 3), and khan (c_id 4).'
          ],
          animationType: 'insert_row',
          highlightDetails: {
            columnName: 'c_name'
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
              { c_id: 2, c_name: 'begam', age: 19 },
              { c_id: 3, c_name: 'zehra', age: 5 }
            ]
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
              { c_id: 2, c_name: 'begam', age: 19 },
              { c_id: 3, c_name: 'zehra', age: 5 },
              { c_id: 4, c_name: 'khan', age: 7 }
            ],
            statusNote: 'Query OK, 1 row affected. Customers 2, 3, and 4 currently have no purchases.'
          },
          keyTakeaways: [
            'Having multiple customers without transactions sets up clear comparisons between INNER, LEFT, and RIGHT joins.'
          ]
        }
      ]
    },
    {
      id: 'topic-7-2',
      title: 'Topic 7.2: INNER JOIN (Key Intersection)',
      subtitle: 'Matching records between transactions and customers on customer_id = c_id',
      conceptBadge: 'INNER JOIN (INTERSECTION)',
      description: 'Perform an INNER JOIN between transactions and customers. Understand why only rows with matching keys in BOTH tables appear in the result set, and practice column attribute projection.',
      commands: [
        'select * from transactions inner join customers\n on transactions.customer_id = customers.c_id;',
        'select t_id,amount,c_name from transactions inner join customers \non transactions.customer_id = customers.c_id;'
      ],
      definitions: [
        {
          title: 'INNER JOIN Concept',
          syntax: 'SELECT cols FROM table1 INNER JOIN table2 ON table1.fk = table2.pk;',
          purpose: 'Returns strictly the intersection of rows where the join condition evaluates to TRUE.',
          keyPoints: [
            'Any row in the left table without a corresponding key in the right table is excluded.',
            'Any row in the right table without a corresponding key in the left table is excluded.',
            'begam (2), zehra (3), and khan (4) do not appear in an INNER JOIN because they have no transactions.'
          ],
          example: 'select * from transactions inner join customers on transactions.customer_id = customers.c_id;'
        },
        {
          title: 'Selective Projection with Joins',
          syntax: 'SELECT t1.colA, t2.colB FROM t1 INNER JOIN t2 ON t1.id = t2.id;',
          purpose: 'Reduces bandwidth and visual clutter by projecting only the necessary domain columns across joined entities.',
          keyPoints: [
            'Selecting t_id, amount, and c_name combines purchase detail with customer identity in a clean result view.',
            'If column names are unique across both tables, table prefixing is optional in MySQL.'
          ],
          example: 'select t_id,amount,c_name from transactions inner join customers on transactions.customer_id = customers.c_id;'
        }
      ],
      steps: [
        {
          id: 'step-7-2-1',
          stepNumber: 6,
          title: 'INNER JOIN: Full Schema Projection (*)',
          actionLabel: 'INNER JOIN *',
          sql: 'select * from transactions inner join customers\n on transactions.customer_id = customers.c_id;',
          commandType: 'DQL',
          description: 'Join all columns of transactions and customers where transactions.customer_id matches customers.c_id.',
          explanation: [
            'The engine checks each transaction against customers.c_id.',
            'Transaction 1 (customer_id 1) pairs with customer 1 (kishor).',
            'Transaction 2 (customer_id 1) pairs with customer 1 (kishor).',
            'Customers 2, 3, and 4 have no matches in transactions, so they are omitted.',
            'Result displays all 6 columns: t_id, amount, customer_id, c_id, c_name, age.'
          ],
          animationType: 'join_inner',
          highlightDetails: {
            columnName: 'customer_id'
          },
          beforeState: {
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int' },
              { name: 'amount', type: 'decimal(6,2)' },
              { name: 'customer_id', type: 'int' }
            ],
            rows: [
              { t_id: 1, amount: '45.67', customer_id: 1 },
              { t_id: 2, amount: '75.67', customer_id: 1 }
            ],
            secondaryTable: {
              name: 'customers',
              columns: [
                { name: 'c_id', type: 'int' },
                { name: 'c_name', type: 'varchar(50)' },
                { name: 'age', type: 'int' }
              ],
              rows: [
                { c_id: 1, c_name: 'kishor', age: 18 },
                { c_id: 2, c_name: 'begam', age: 19 },
                { c_id: 3, c_name: 'zehra', age: 5 },
                { c_id: 4, c_name: 'khan', age: 7 }
              ]
            }
          },
          afterState: {
            tableName: 'transactions ⨝ customers',
            columns: [
              { name: 't_id', type: 'int' },
              { name: 'amount', type: 'decimal(6,2)' },
              { name: 'customer_id', type: 'int' },
              { name: 'c_id', type: 'int' },
              { name: 'c_name', type: 'varchar(50)' },
              { name: 'age', type: 'int' }
            ],
            rows: [
              { t_id: 1, amount: '45.67', customer_id: 1, c_id: 1, c_name: 'kishor', age: 18 },
              { t_id: 2, amount: '75.67', customer_id: 1, c_id: 1, c_name: 'kishor', age: 18 }
            ],
            statusNote: '2 rows in set. Only matching keys (customer 1) appear in INNER JOIN.'
          },
          keyTakeaways: [
            'INNER JOIN acts as a filter: only rows that satisfy the ON predicate on both sides are returned.'
          ]
        },
        {
          id: 'step-7-2-2',
          stepNumber: 7,
          title: 'INNER JOIN: Specific Column Projection',
          actionLabel: 'Targeted Projection',
          sql: 'select t_id,amount,c_name from transactions inner join customers \non transactions.customer_id = customers.c_id;',
          commandType: 'DQL',
          description: 'Project only transaction ID, amount, and customer name for a cleaner business report.',
          explanation: [
            'Retrieves t_id and amount from transactions, alongside c_name from customers.',
            'Redundant ID columns (customer_id and c_id) are excluded from the output.',
            'Outputs the 2 transactions made by kishor.'
          ],
          animationType: 'join_inner',
          highlightDetails: {
            columnName: 'c_name'
          },
          beforeState: {
            tableName: 'transactions ⨝ customers',
            columns: [
              { name: 't_id', type: 'int' },
              { name: 'amount', type: 'decimal(6,2)' },
              { name: 'customer_id', type: 'int' },
              { name: 'c_id', type: 'int' },
              { name: 'c_name', type: 'varchar(50)' },
              { name: 'age', type: 'int' }
            ],
            rows: [
              { t_id: 1, amount: '45.67', customer_id: 1, c_id: 1, c_name: 'kishor', age: 18 },
              { t_id: 2, amount: '75.67', customer_id: 1, c_id: 1, c_name: 'kishor', age: 18 }
            ]
          },
          afterState: {
            tableName: 'Projected Join View',
            columns: [
              { name: 't_id', type: 'int' },
              { name: 'amount', type: 'decimal(6,2)' },
              { name: 'c_name', type: 'varchar(50)' }
            ],
            rows: [
              { t_id: 1, amount: '45.67', c_name: 'kishor' },
              { t_id: 2, amount: '75.67', c_name: 'kishor' }
            ],
            statusNote: '2 rows in set. Projected 3 focused attributes across both tables.'
          },
          keyTakeaways: [
            'Selective column lists avoid transporting unnecessary columns over the database network.'
          ]
        }
      ]
    },
    {
      id: 'topic-7-3',
      title: 'Topic 7.3: Outer Joins (LEFT JOIN & RIGHT JOIN)',
      subtitle: 'Preserving unmatched records from the left or right table with NULL substitution',
      conceptBadge: 'OUTER JOINS & NULLs',
      description: 'Explore LEFT JOIN and RIGHT JOIN mechanics. Learn how outer joins preserve rows that have no match in the opposing table by filling missing attributes with NULL.',
      commands: [
        'select t_id,amount,c_name from transactions left join customers \non transactions.customer_id = customers.c_id;',
        'select t_id,amount,c_name from transactions right join customers\n on transactions.customer_id = customers.c_id;'
      ],
      definitions: [
        {
          title: 'LEFT JOIN (Left Outer Join)',
          syntax: 'SELECT cols FROM left_table LEFT JOIN right_table ON left_table.key = right_table.key;',
          purpose: 'Returns all records from the left table, and the matched records from the right table. Unmatched right attributes return NULL.',
          keyPoints: [
            'Guarantees every row in the left table (transactions) appears at least once.',
            'Because every transaction in pandiyan_store currently has a valid customer_id (1), all left rows find a match.',
            'If a transaction existed with customer_id NULL or 99, c_name would appear as NULL.'
          ],
          example: 'select t_id,amount,c_name from transactions left join customers on transactions.customer_id = customers.c_id;'
        },
        {
          title: 'RIGHT JOIN (Right Outer Join)',
          syntax: 'SELECT cols FROM left_table RIGHT JOIN right_table ON left_table.key = right_table.key;',
          purpose: 'Returns all records from the right table, and the matched records from the left table. Unmatched left attributes return NULL.',
          keyPoints: [
            'Guarantees every row in the right table (customers) appears in the output.',
            'Customers without transactions (begam, zehra, khan) are preserved in the result.',
            'For these customers, transaction columns (t_id, amount) evaluate to NULL.'
          ],
          example: 'select t_id,amount,c_name from transactions right join customers on transactions.customer_id = customers.c_id;'
        }
      ],
      steps: [
        {
          id: 'step-7-3-1',
          stepNumber: 8,
          title: 'LEFT JOIN: Preserve All Transactions',
          actionLabel: 'LEFT JOIN',
          sql: 'select t_id,amount,c_name from transactions left join customers \non transactions.customer_id = customers.c_id;',
          commandType: 'DQL',
          description: 'Execute LEFT JOIN with transactions as the driving left table.',
          explanation: [
            'All records from the left table (transactions) are preserved.',
            'Transaction 1 matches customer 1 (kishor).',
            'Transaction 2 matches customer 1 (kishor).',
            'Since all transactions currently have an existing customer, the output is identical to INNER JOIN here (2 rows).'
          ],
          animationType: 'join_left',
          highlightDetails: {
            columnName: 'customer_id'
          },
          beforeState: {
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int' },
              { name: 'amount', type: 'decimal(6,2)' },
              { name: 'customer_id', type: 'int' }
            ],
            rows: [
              { t_id: 1, amount: '45.67', customer_id: 1 },
              { t_id: 2, amount: '75.67', customer_id: 1 }
            ],
            secondaryTable: {
              name: 'customers',
              columns: [
                { name: 'c_id', type: 'int' },
                { name: 'c_name', type: 'varchar(50)' }
              ],
              rows: [
                { c_id: 1, c_name: 'kishor' },
                { c_id: 2, c_name: 'begam' },
                { c_id: 3, c_name: 'zehra' },
                { c_id: 4, c_name: 'khan' }
              ]
            }
          },
          afterState: {
            tableName: 'LEFT JOIN (transactions ⟕ customers)',
            columns: [
              { name: 't_id', type: 'int' },
              { name: 'amount', type: 'decimal(6,2)' },
              { name: 'c_name', type: 'varchar(50)' }
            ],
            rows: [
              { t_id: 1, amount: '45.67', c_name: 'kishor' },
              { t_id: 2, amount: '75.67', c_name: 'kishor' }
            ],
            statusNote: '2 rows in set. All left table rows (transactions) preserved.'
          },
          keyTakeaways: [
            'A LEFT JOIN will never discard a row from the left table, regardless of match status.'
          ]
        },
        {
          id: 'step-7-3-2',
          stepNumber: 9,
          title: 'RIGHT JOIN: Preserve All Customers & NULL Filling',
          actionLabel: 'RIGHT JOIN',
          sql: 'select t_id,amount,c_name from transactions right join customers\n on transactions.customer_id = customers.c_id;',
          commandType: 'DQL',
          description: 'Execute RIGHT JOIN with customers as the driving right table, observing NULL values for customers without transactions.',
          explanation: [
            'All records from the right table (customers) are preserved in the result.',
            'Customer 1 (kishor) matches 2 transactions (t_id 1 and 2), creating 2 rows.',
            'Customer 2 (begam) has no transactions: t_id and amount are populated with NULL.',
            'Customer 3 (zehra) has no transactions: t_id and amount are populated with NULL.',
            'Customer 4 (khan) has no transactions: t_id and amount are populated with NULL.',
            'Total result set contains 5 rows, perfectly illustrating outer join NULL generation.'
          ],
          animationType: 'join_right',
          highlightDetails: {
            columnName: 'c_name'
          },
          beforeState: {
            tableName: 'transactions',
            columns: [
              { name: 't_id', type: 'int' },
              { name: 'amount', type: 'decimal(6,2)' },
              { name: 'customer_id', type: 'int' }
            ],
            rows: [
              { t_id: 1, amount: '45.67', customer_id: 1 },
              { t_id: 2, amount: '75.67', customer_id: 1 }
            ],
            secondaryTable: {
              name: 'customers',
              columns: [
                { name: 'c_id', type: 'int' },
                { name: 'c_name', type: 'varchar(50)' }
              ],
              rows: [
                { c_id: 1, c_name: 'kishor' },
                { c_id: 2, c_name: 'begam' },
                { c_id: 3, c_name: 'zehra' },
                { c_id: 4, c_name: 'khan' }
              ]
            }
          },
          afterState: {
            tableName: 'RIGHT JOIN (transactions ⟖ customers)',
            columns: [
              { name: 't_id', type: 'int' },
              { name: 'amount', type: 'decimal(6,2)' },
              { name: 'c_name', type: 'varchar(50)' }
            ],
            rows: [
              { t_id: 1, amount: '45.67', c_name: 'kishor' },
              { t_id: 2, amount: '75.67', c_name: 'kishor' },
              { t_id: null, amount: null, c_name: 'begam' },
              { t_id: null, amount: null, c_name: 'zehra' },
              { t_id: null, amount: null, c_name: 'khan' }
            ],
            statusNote: '5 rows in set. begam, zehra, and khan appear with NULL for transaction attributes.'
          },
          keyTakeaways: [
            'RIGHT JOIN ensures every entity in the right table is reported, revealing inactive customers via NULL values.'
          ]
        }
      ]
    }
  ]
};

export const PART_7_QUIZ: QuizQuestion[] = [
  {
    id: 'q-7-1',
    topicId: 'topic-7-2',
    question: 'In MySQL, what does an INNER JOIN between transactions and customers return?',
    options: [
      'All customers regardless of whether they have transactions',
      'All transactions regardless of whether they have a customer',
      'Only rows where transactions.customer_id equals customers.c_id in both tables',
      'A cartesian product of every transaction multiplied by every customer'
    ],
    correctIndex: 2,
    explanation: 'An INNER JOIN strictly returns the intersection where the ON predicate evaluates to TRUE. Unmatched records from either table are excluded.'
  },
  {
    id: 'q-7-2',
    topicId: 'topic-7-3',
    question: 'In the query "select t_id,amount,c_name from transactions right join customers on transactions.customer_id = customers.c_id;", why do begam, zehra, and khan have NULL for t_id and amount?',
    options: [
      'Because the database experienced a syntax error',
      'Because RIGHT JOIN preserves all customers, and these customers have zero rows in transactions',
      'Because the columns were declared as NOT NULL',
      'Because customer_id is a primary key'
    ],
    correctIndex: 1,
    explanation: 'RIGHT JOIN preserves every row from the right table (customers). When a customer has no matching record in the left table (transactions), MySQL fills the missing transaction columns with NULL.'
  },
  {
    id: 'q-7-3',
    topicId: 'topic-7-3',
    question: 'How many total rows are produced by "select t_id,amount,c_name from transactions right join customers on transactions.customer_id = customers.c_id;" with 2 transactions for kishor and 3 customers with no purchases?',
    options: [
      '2 rows',
      '3 rows',
      '4 rows',
      '5 rows'
    ],
    correctIndex: 3,
    explanation: 'Kishor has 2 transactions (2 rows). Begam, Zehra, and Khan each have 0 transactions but appear once with NULLs (3 rows). 2 + 3 = 5 total rows.'
  },
  {
    id: 'q-7-4',
    topicId: 'topic-7-3',
    question: 'What is the key difference between LEFT JOIN and RIGHT JOIN?',
    options: [
      'LEFT JOIN is faster than RIGHT JOIN in InnoDB',
      'LEFT JOIN preserves all rows from the first (left) table; RIGHT JOIN preserves all rows from the second (right) table',
      'LEFT JOIN sorts ascending, while RIGHT JOIN sorts descending',
      'RIGHT JOIN cannot use the ON keyword'
    ],
    correctIndex: 1,
    explanation: 'LEFT JOIN keeps every record from the left table and substitutes NULL for missing right values. RIGHT JOIN keeps every record from the right table and substitutes NULL for missing left values.'
  }
];

export const PART_7_PRESETS = [
  {
    label: 'P7: Use pandiyan_store',
    query: 'use pandiyan_store;'
  },
  {
    label: 'P7: Select * from transactions',
    query: 'select * from transactions;'
  },
  {
    label: 'P7: Select * from customers',
    query: 'select * from customers;'
  },
  {
    label: 'P7: Insert zehra (3)',
    query: 'insert into customers\nvalues (3,"zehra",5);'
  },
  {
    label: 'P7: Insert khan (4)',
    query: 'insert into customers\nvalues (4,"khan" ,7);'
  },
  {
    label: 'P7: INNER JOIN (*)',
    query: 'select * from transactions inner join customers\n on transactions.customer_id = customers.c_id;'
  },
  {
    label: 'P7: INNER JOIN (Projected)',
    query: 'select t_id,amount,c_name from transactions inner join customers \non transactions.customer_id = customers.c_id;'
  },
  {
    label: 'P7: LEFT JOIN (Projected)',
    query: 'select t_id,amount,c_name from transactions left join customers \non transactions.customer_id = customers.c_id;'
  },
  {
    label: 'P7: RIGHT JOIN (Projected)',
    query: 'select t_id,amount,c_name from transactions right join customers\n on transactions.customer_id = customers.c_id;'
  }
];
