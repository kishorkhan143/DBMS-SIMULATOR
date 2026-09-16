import { Part, QuizQuestion } from '../types/sql';

export const PART_3: Part = {
  id: 'part-3',
  title: 'Part 3: Data Mutation & Transactions',
  subtitle: 'Update Query (1:18:29) • Delete Query (1:21:46) • RollBack & Timestamps',
  description: 'Master in-place data mutations with UPDATE, targeted row deletions with DELETE and NULL conditions, ACID safety via SET autocommit, ROLLBACK, and COMMIT, and temporal queries with CURRENT_DATE(), NOW(), and CURRENT_TIME().',
  badge: 'Part 3 • Mutation & Transactions',
  topics: [
    {
      id: 'topic-3-1',
      title: 'Topic 3.1: UPDATE Query & Safe Updates Mode',
      subtitle: 'Update Query (1:18:29) • Modifying existing records with WHERE clauses',
      conceptBadge: 'DML UPDATE',
      description: 'Learn how to alter existing row values using the UPDATE statement. Understand MySQL Safe Updates mode (sql_safe_updates) and how to update rows filtered by WHERE conditions.',
      commands: [
        'use pandiyan_store;',
        'select * from emp;',
        'set sql_safe_updates=0;',
        'update emp set join_date ="2007-08-01" where id =1;',
        'select * from emp;'
      ],
      steps: [
        {
          id: 'step-3-1-1',
          stepNumber: 1,
          sql: 'use pandiyan_store;',
          actionLabel: 'Select Active Database',
          explanation: 'Switch session context to pandiyan_store to access the employee table.',
          animationType: 'show_databases',
          statusMessage: 'Database changed to pandiyan_store.',
          afterState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
              { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
              { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
            ],
            statusNote: 'Active context: pandiyan_store.emp with 4 records'
          }
        },
        {
          id: 'step-3-1-2',
          stepNumber: 2,
          sql: 'select * from emp;',
          actionLabel: 'Inspect Existing Rows',
          explanation: 'Check the baseline state of table emp. Notice row 1 (kishor) has join_date "2001-01-01" and row 4 (kishor) has join_date NULL.',
          animationType: 'select_query',
          statusMessage: '4 rows in set (0.001 sec)',
          afterState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
              { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
              { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
            ],
            statusNote: 'All 4 employee rows retrieved'
          }
        },
        {
          id: 'step-3-1-3',
          stepNumber: 3,
          sql: 'set sql_safe_updates=0;',
          actionLabel: 'Disable Safe Updates Safeguard',
          explanation: 'By default, MySQL blocks UPDATE and DELETE queries that lack a key index in the WHERE clause (ERROR 1175). Setting sql_safe_updates=0 permits updates without a primary key constraint.',
          animationType: 'alter_db_readonly',
          statusMessage: 'Query OK, 0 rows affected (0.000 sec)',
          afterState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
              { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
              { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
            ],
            statusNote: 'Session: Safe updates disabled (sql_safe_updates = 0)'
          }
        },
        {
          id: 'step-3-1-4',
          stepNumber: 4,
          sql: 'update emp\nset join_date ="2007-08-01"\nwhere id =1;',
          actionLabel: 'Execute UPDATE Query (id = 1)',
          explanation: 'Finds all records where id = 1 (both row 1 and row 4) and modifies their join_date to "2007-08-01".',
          animationType: 'update_row',
          statusMessage: 'Query OK, 2 rows affected (0.001 sec) - Rows matched: 2  Changed: 2  Warnings: 0',
          beforeState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507823' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
              { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
              { id: 1, name: 'kishor', salary: null, join_date: null, ph_no: null }
            ]
          },
          afterState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2007-08-01', ph_no: '7094507823' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
              { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
              { id: 1, name: 'kishor', salary: null, join_date: '2007-08-01', ph_no: null }
            ],
            statusNote: 'Updated join_date to 2007-08-01 for records with id = 1'
          }
        },
        {
          id: 'step-3-1-5',
          stepNumber: 5,
          sql: 'select * from emp;',
          actionLabel: 'Verify Updated Records',
          explanation: 'Observe that both row 1 and row 4 now reflect join_date 2007-08-01.',
          animationType: 'select_query',
          statusMessage: '4 rows in set (0.001 sec)',
          afterState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2007-08-01', ph_no: '7094507823' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
              { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
              { id: 1, name: 'kishor', salary: null, join_date: '2007-08-01', ph_no: null }
            ],
            statusNote: 'Table verification complete'
          }
        }
      ]
    },
    {
      id: 'topic-3-2',
      title: 'Topic 3.2: DELETE Query & NULL Handling',
      subtitle: 'Delete Query (1:21:46) • Removing rows matching predicates',
      conceptBadge: 'DML DELETE',
      description: 'Learn how to remove rows from a table using DELETE with WHERE conditions. See how "WHERE ph_no IS NULL" selectively purges records with missing phone numbers.',
      commands: [
        'delete from emp where ph_no is null;',
        'select * from emp;'
      ],
      steps: [
        {
          id: 'step-3-2-1',
          stepNumber: 1,
          sql: 'delete from emp \nwhere ph_no is null;',
          actionLabel: 'Delete Incomplete Row (ph_no is null)',
          explanation: 'Evaluates each row. Row 4 has ph_no IS NULL, so it is permanently deleted from emp. Rows with valid phone numbers are retained.',
          animationType: 'delete_row',
          statusMessage: 'Query OK, 1 row affected (0.001 sec)',
          beforeState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2007-08-01', ph_no: '7094507823' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
              { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' },
              { id: 1, name: 'kishor', salary: null, join_date: '2007-08-01', ph_no: null }
            ]
          },
          afterState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2007-08-01', ph_no: '7094507823' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
              { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' }
            ],
            statusNote: '1 row deleted (ph_no IS NULL). 3 clean rows remain.'
          }
        },
        {
          id: 'step-3-2-2',
          stepNumber: 2,
          sql: 'select * from emp;',
          actionLabel: 'Inspect Cleaned Dataset',
          explanation: 'Confirms that only the 3 valid employee rows remain in the table.',
          animationType: 'select_query',
          statusMessage: '3 rows in set (0.001 sec)',
          afterState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2007-08-01', ph_no: '7094507823' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
              { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' }
            ],
            statusNote: 'Dataset cleaned of null entries'
          }
        }
      ]
    },
    {
      id: 'topic-3-3',
      title: 'Topic 3.3: Transactions, Autocommit & RollBack',
      subtitle: 'RollBack (1:21:46) • Transaction control & accidental delete recovery',
      conceptBadge: 'TCL Transactions',
      description: 'Understand transactional isolation and atomicity. Learn why "SET autocommit=0;" provides a crucial safety net allowing you to reverse catastrophic mass deletions with "ROLLBACK;" or persist changes with "COMMIT;".',
      commands: [
        'set autocommit=0;',
        'select * from emp;',
        'delete from emp;',
        'select * from emp;',
        'rollback;',
        'select * from emp;',
        'commit;'
      ],
      steps: [
        {
          id: 'step-3-3-1',
          stepNumber: 1,
          sql: 'set autocommit=0;',
          actionLabel: 'Disable Autocommit Mode',
          explanation: 'Disables automatic commit. Future DML changes remain uncommitted in memory until you run COMMIT or ROLLBACK.',
          animationType: 'set_autocommit',
          statusMessage: 'Query OK, 0 rows affected (0.000 sec) - Transaction mode active',
          afterState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2007-08-01', ph_no: '7094507823' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
              { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' }
            ],
            statusNote: 'Autocommit disabled (autocommit = 0). Transaction active.'
          }
        },
        {
          id: 'step-3-3-2',
          stepNumber: 2,
          sql: 'select * from emp;',
          actionLabel: 'Check Active State Before Deletion',
          explanation: 'Verify 3 rows present before testing uncommitted deletion.',
          animationType: 'select_query',
          statusMessage: '3 rows in set (0.001 sec)',
          afterState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2007-08-01', ph_no: '7094507823' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
              { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' }
            ],
            statusNote: '3 rows verified'
          }
        },
        {
          id: 'step-3-3-3',
          stepNumber: 3,
          sql: 'delete from emp;',
          actionLabel: 'Execute Unqualified DELETE (Delete All Rows)',
          explanation: 'Simulates an accidental deletion where all rows are purged because no WHERE clause was provided.',
          animationType: 'delete_row',
          statusMessage: 'Query OK, 3 rows affected (0.001 sec)',
          beforeState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2007-08-01', ph_no: '7094507823' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
              { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' }
            ]
          },
          afterState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: [],
            statusNote: 'All rows wiped from view (Transaction uncommitted)'
          }
        },
        {
          id: 'step-3-3-4',
          stepNumber: 4,
          sql: 'select * from emp;',
          actionLabel: 'Verify Table is Empty',
          explanation: 'Shows 0 rows in set. Without transactions, this would be an unrecoverable disaster.',
          animationType: 'select_query',
          statusMessage: 'Empty set (0.000 sec)',
          afterState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: [],
            statusNote: 'Empty set (0 rows)'
          }
        },
        {
          id: 'step-3-3-5',
          stepNumber: 5,
          sql: 'rollback;',
          actionLabel: 'Execute ROLLBACK (Undo Accidental Deletion)',
          explanation: 'Reverts the active transaction! All deleted rows are restored from the transaction log back into the active table.',
          animationType: 'rollback',
          statusMessage: 'Query OK, 0 rows affected (0.001 sec) - Transaction rolled back',
          beforeState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: []
          },
          afterState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2007-08-01', ph_no: '7094507823' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
              { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' }
            ],
            statusNote: 'All 3 rows safely resurrected via ROLLBACK'
          }
        },
        {
          id: 'step-3-3-6',
          stepNumber: 6,
          sql: 'commit;',
          actionLabel: 'Execute COMMIT (Make State Permanent)',
          explanation: 'Persists the current state to disk storage, cementing all changes and concluding the transaction.',
          animationType: 'commit',
          statusMessage: 'Query OK, 0 rows affected (0.000 sec) - Transaction committed',
          afterState: {
            name: 'emp',
            columns: [
              { name: 'id', type: 'int' },
              { name: 'name', type: 'varchar(50)' },
              { name: 'salary', type: 'decimal(5,2)' },
              { name: 'join_date', type: 'date' },
              { name: 'ph_no', type: 'varchar(15)' }
            ],
            rows: [
              { id: 1, name: 'kishor', salary: '400.00', join_date: '2007-08-01', ph_no: '7094507823' },
              { id: 2, name: 'rakesh', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507824' },
              { id: 2, name: 'manish', salary: '400.00', join_date: '2001-01-01', ph_no: '7094507825' }
            ],
            statusNote: 'Transaction committed to durable storage'
          }
        }
      ]
    },
    {
      id: 'topic-3-4',
      title: 'Topic 3.4: Timestamps & Temporal Functions',
      subtitle: 'DATE • DATETIME • TIME • CURRENT_DATE() • NOW() • CURRENT_TIME()',
      conceptBadge: 'Temporal SQL',
      description: 'Explore temporal SQL types and real-time clock functions. Learn DATE (YYYY-MM-DD), DATETIME (YYYY-MM-DD HH:MM:SS), and TIME (neram). Insert live timestamps and delete records by current date.',
      commands: [
        'create table timestamps(dateofjoin date, dateandtime datetime, neram time);',
        'select * from timestamps;',
        'insert into timestamps values(current_date(),now(),current_time());',
        'delete from timestamps where dateofjoin = current_date();'
      ],
      steps: [
        {
          id: 'step-3-4-1',
          stepNumber: 1,
          sql: 'create table timestamps(\ndateofjoin date,\ndateandtime datetime,\nneram time\n);',
          actionLabel: 'Create Timestamps Table',
          explanation: 'Creates a table dedicated to temporal types: dateofjoin (DATE), dateandtime (DATETIME), and neram (TIME - Tamil for time).',
          animationType: 'create_table',
          statusMessage: 'Query OK, 0 rows affected (0.002 sec)',
          afterState: {
            name: 'timestamps',
            columns: [
              { name: 'dateofjoin', type: 'date' },
              { name: 'dateandtime', type: 'datetime' },
              { name: 'neram', type: 'time' }
            ],
            rows: [],
            statusNote: 'Table timestamps created with 3 temporal columns'
          }
        },
        {
          id: 'step-3-4-2',
          stepNumber: 2,
          sql: 'select * from timestamps;',
          actionLabel: 'Inspect Empty Timestamps Table',
          explanation: 'Displays empty table structure.',
          animationType: 'select_query',
          statusMessage: 'Empty set (0.000 sec)',
          afterState: {
            name: 'timestamps',
            columns: [
              { name: 'dateofjoin', type: 'date' },
              { name: 'dateandtime', type: 'datetime' },
              { name: 'neram', type: 'time' }
            ],
            rows: [],
            statusNote: '0 rows in table'
          }
        },
        {
          id: 'step-3-4-3',
          stepNumber: 3,
          sql: 'insert into timestamps\nvalues(current_date(),now(),current_time());',
          actionLabel: 'Insert Live Server Clock Values',
          explanation: 'Calls current_date() for today\'s date, now() for full timestamp, and current_time() for the time of execution.',
          animationType: 'insert_row',
          statusMessage: 'Query OK, 1 row affected (0.001 sec)',
          afterState: {
            name: 'timestamps',
            columns: [
              { name: 'dateofjoin', type: 'date' },
              { name: 'dateandtime', type: 'datetime' },
              { name: 'neram', type: 'time' }
            ],
            rows: [
              {
                dateofjoin: '2026-09-16',
                dateandtime: '2026-09-16 10:00:00',
                neram: '10:00:00'
              }
            ],
            statusNote: 'Live temporal values captured and stored'
          }
        },
        {
          id: 'step-3-4-4',
          stepNumber: 4,
          sql: 'select * from timestamps;',
          actionLabel: 'Inspect Captured Timestamps',
          explanation: 'Retrieves the inserted temporal values.',
          animationType: 'select_query',
          statusMessage: '1 row in set (0.001 sec)',
          afterState: {
            name: 'timestamps',
            columns: [
              { name: 'dateofjoin', type: 'date' },
              { name: 'dateandtime', type: 'datetime' },
              { name: 'neram', type: 'time' }
            ],
            rows: [
              {
                dateofjoin: '2026-09-16',
                dateandtime: '2026-09-16 10:00:00',
                neram: '10:00:00'
              }
            ],
            statusNote: '1 row in set'
          }
        },
        {
          id: 'step-3-4-5',
          stepNumber: 5,
          sql: 'delete from timestamps\nwhere dateofjoin = current_date();',
          actionLabel: 'Delete Matching Today\'s Date',
          explanation: 'Demonstrates temporal filtering in WHERE clauses: evaluates current_date() dynamically and deletes rows matching today.',
          animationType: 'delete_row',
          statusMessage: 'Query OK, 1 row affected (0.001 sec)',
          afterState: {
            name: 'timestamps',
            columns: [
              { name: 'dateofjoin', type: 'date' },
              { name: 'dateandtime', type: 'datetime' },
              { name: 'neram', type: 'time' }
            ],
            rows: [],
            statusNote: 'Row deleted by temporal predicate'
          }
        }
      ]
    }
  ]
};

export const PART_4: Part = {
  id: 'part-4',
  title: 'Part 4: Data Integrity & Constraints',
  subtitle: 'Constraints • NOT NULL • UNIQUE • CHECK • DEFAULT Values',
  description: 'Enforce relational data integrity at the database engine level using NOT NULL to reject missing keys, UNIQUE to prevent duplicate values, CHECK constraints to enforce domain logic, and DEFAULT to auto-fill omitted attributes.',
  badge: 'Part 4 • Constraints',
  topics: [
    {
      id: 'topic-4-1',
      title: 'Topic 4.1: NOT NULL & UNIQUE Constraints',
      subtitle: 'Preventing NULL values & enforcing column uniqueness',
      conceptBadge: 'NOT NULL & UNIQUE',
      description: 'Learn how to enforce column-level data rules when creating tables. See how UNIQUE blocks duplicate product names (e.g. "colgate") and how to add constraints dynamically via ALTER TABLE.',
      commands: [
        'use pandiyan_store;',
        'create table product(p_id int not null, p_name varchar(30) unique, price decimal(10,2));',
        'insert into product value (123,"colgate",10.5),(132 ,"pen",5.5);',
        'insert into product value (128,"colgate",10.55);',
        'select * from product;',
        'alter table product add constraint unique(p_id);',
        'alter table product modify price decimal(10,2) not null;',
        'drop table product;'
      ],
      steps: [
        {
          id: 'step-4-1-1',
          stepNumber: 1,
          sql: 'use pandiyan_store;',
          actionLabel: 'Use Database Context',
          explanation: 'Select pandiyan_store as current working database.',
          animationType: 'show_databases',
          statusMessage: 'Database changed to pandiyan_store.',
          afterState: {
            name: 'product',
            columns: [],
            rows: []
          }
        },
        {
          id: 'step-4-1-2',
          stepNumber: 2,
          sql: 'create table product(\np_id int not null,\np_name varchar(30) unique,\nprice decimal(10,2)\n);',
          actionLabel: 'Create Table with NOT NULL & UNIQUE',
          explanation: 'Defines table product: p_id cannot be null (NOT NULL), and p_name cannot contain duplicates (UNIQUE).',
          animationType: 'create_table',
          statusMessage: 'Query OK, 0 rows affected (0.002 sec)',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)' }
            ],
            rows: [],
            statusNote: 'Table product defined with NOT NULL and UNIQUE rules'
          }
        },
        {
          id: 'step-4-1-3',
          stepNumber: 3,
          sql: 'insert into product\nvalue (123,"colgate",10.5),(132 ,"pen",5.5);',
          actionLabel: 'Insert Valid Product Tuples',
          explanation: 'Inserts 2 distinct rows. Both satisfy p_id NOT NULL and distinct p_name UNIQUE requirements.',
          animationType: 'insert_multi',
          statusMessage: 'Query OK, 2 rows affected (0.001 sec)\nRecords: 2  Duplicates: 0  Warnings: 0',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)' }
            ],
            rows: [
              { p_id: 123, p_name: 'colgate', price: '10.50' },
              { p_id: 132, p_name: 'pen', price: '5.50' }
            ],
            statusNote: '2 valid products inserted'
          }
        },
        {
          id: 'step-4-1-4',
          stepNumber: 4,
          sql: 'insert into product\nvalue (128,"colgate",10.55);',
          actionLabel: 'Attempt Duplicate Insert (UNIQUE Violation)',
          explanation: 'Tries to insert product name "colgate" which already exists in row 1! MySQL blocks the query with ERROR 1062.',
          animationType: 'insert_row',
          statusMessage: 'ERROR 1062 (23000): Duplicate entry \'colgate\' for key \'product.p_name\'',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)' }
            ],
            rows: [
              { p_id: 123, p_name: 'colgate', price: '10.50' },
              { p_id: 132, p_name: 'pen', price: '5.50' }
            ],
            statusNote: 'Query rejected by MySQL UNIQUE constraint key'
          }
        },
        {
          id: 'step-4-1-5',
          stepNumber: 5,
          sql: 'select * from product;',
          actionLabel: 'Inspect Product Catalog',
          explanation: 'Displays the 2 valid records. The rejected duplicate row was not added.',
          animationType: 'select_query',
          statusMessage: '2 rows in set (0.001 sec)',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)' }
            ],
            rows: [
              { p_id: 123, p_name: 'colgate', price: '10.50' },
              { p_id: 132, p_name: 'pen', price: '5.50' }
            ],
            statusNote: '2 rows in set'
          }
        },
        {
          id: 'step-4-1-6',
          stepNumber: 6,
          sql: 'alter table product\nadd constraint unique(p_id);',
          actionLabel: 'Add UNIQUE Constraint to p_id via ALTER',
          explanation: 'Applies a UNIQUE constraint to existing column p_id, ensuring no future rows can share the same product ID.',
          animationType: 'add_constraint',
          statusMessage: 'Query OK, 0 rows affected (0.001 sec)\nRecords: 0  Duplicates: 0  Warnings: 0',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false, isUnique: true },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)' }
            ],
            rows: [
              { p_id: 123, p_name: 'colgate', price: '10.50' },
              { p_id: 132, p_name: 'pen', price: '5.50' }
            ],
            statusNote: 'UNIQUE constraint added to p_id'
          }
        },
        {
          id: 'step-4-1-7',
          stepNumber: 7,
          sql: 'alter table product \nmodify price decimal(10,2) not null;',
          actionLabel: 'Modify Price Column to NOT NULL',
          explanation: 'Upgrades the price column schema to enforce NOT NULL.',
          animationType: 'modify_column_type',
          statusMessage: 'Query OK, 0 rows affected (0.001 sec)\nRecords: 0  Duplicates: 0  Warnings: 0',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false, isUnique: true },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)', nullable: false }
            ],
            rows: [
              { p_id: 123, p_name: 'colgate', price: '10.50' },
              { p_id: 132, p_name: 'pen', price: '5.50' }
            ],
            statusNote: 'price column modified to NOT NULL'
          }
        },
        {
          id: 'step-4-1-8',
          stepNumber: 8,
          sql: 'drop table product;',
          actionLabel: 'Drop Product Table',
          explanation: 'Removes table product to prepare for CHECK constraint demonstration.',
          animationType: 'drop_table',
          statusMessage: 'Query OK, 0 rows affected (0.001 sec)',
          afterState: {
            name: 'product',
            columns: [],
            rows: [],
            statusNote: 'Table product dropped'
          }
        }
      ]
    },
    {
      id: 'topic-4-2',
      title: 'Topic 4.2: CHECK Constraint Validation',
      subtitle: 'Enforcing numeric ranges & business rules (price <= 200)',
      conceptBadge: 'CHECK Constraint',
      description: 'Use CHECK constraints to ensure column values meet specific criteria (e.g. price <= 200). Learn how MySQL validates incoming data, rejects out-of-range values, and how to drop and re-add check rules.',
      commands: [
        'create table product(p_id int not null, p_name varchar(30) unique, price decimal(10,2) constraint check_price check (price <= 200));',
        'insert into product values(12,"Boost",600);',
        'insert into product values(12,"horlicks",100);',
        'select * from product;',
        'alter table product drop constraint check_price;',
        'alter table product add constraint check_price check(price <200);',
        'drop table product;'
      ],
      steps: [
        {
          id: 'step-4-2-1',
          stepNumber: 1,
          sql: 'create table product(\np_id int not null,\np_name varchar(30) unique,\nprice decimal(10,2)\nconstraint check_price check (price <= 200)\n);',
          actionLabel: 'Create Table with CHECK Constraint (price <= 200)',
          explanation: 'Defines table product with named CHECK constraint check_price: price must be less than or equal to 200.',
          animationType: 'create_table',
          statusMessage: 'Query OK, 0 rows affected (0.002 sec)',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)', checkConstraint: 'price <= 200' }
            ],
            rows: [],
            constraints: [
              { name: 'check_price', type: 'CHECK', expression: 'price <= 200' }
            ],
            statusNote: 'Table product created with check_price rule (price <= 200)'
          }
        },
        {
          id: 'step-4-2-2',
          stepNumber: 2,
          sql: 'insert into product\nvalues(12,"Boost",600);',
          actionLabel: 'Attempt Invalid Insert (Price 600 > 200)',
          explanation: 'Tries to insert product Boost with price 600. Since 600 violates check_price (price <= 200), MySQL rejects the statement!',
          animationType: 'insert_row',
          statusMessage: 'ERROR 3819 (HY000): Check constraint \'check_price\' is violated.',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)', checkConstraint: 'price <= 200' }
            ],
            rows: [],
            statusNote: 'Statement rejected: 600 exceeds 200 threshold'
          }
        },
        {
          id: 'step-4-2-3',
          stepNumber: 3,
          sql: 'insert into product\nvalues(12,"horlicks",100);',
          actionLabel: 'Insert Valid Product (Price 100 <= 200)',
          explanation: 'Inserts product horlicks with price 100. 100 <= 200 is true, so the insertion succeeds.',
          animationType: 'insert_row',
          statusMessage: 'Query OK, 1 row affected (0.001 sec)',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)', checkConstraint: 'price <= 200' }
            ],
            rows: [
              { p_id: 12, p_name: 'horlicks', price: '100.00' }
            ],
            statusNote: '1 row successfully added (passes check constraint)'
          }
        },
        {
          id: 'step-4-2-4',
          stepNumber: 4,
          sql: 'select * from product;',
          actionLabel: 'Inspect Product Table',
          explanation: 'Shows the single valid record in the table.',
          animationType: 'select_query',
          statusMessage: '1 row in set (0.001 sec)',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)', checkConstraint: 'price <= 200' }
            ],
            rows: [
              { p_id: 12, p_name: 'horlicks', price: '100.00' }
            ],
            statusNote: '1 row in set'
          }
        },
        {
          id: 'step-4-2-5',
          stepNumber: 5,
          sql: 'alter table product\ndrop constraint check_price;',
          actionLabel: 'Drop CHECK Constraint',
          explanation: 'Removes the check_price rule using ALTER TABLE table_name DROP CONSTRAINT constraint_name.',
          animationType: 'drop_constraint',
          statusMessage: 'Query OK, 0 rows affected (0.001 sec)\nRecords: 0  Duplicates: 0  Warnings: 0',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)' }
            ],
            rows: [
              { p_id: 12, p_name: 'horlicks', price: '100.00' }
            ],
            statusNote: 'Constraint check_price dropped'
          }
        },
        {
          id: 'step-4-2-6',
          stepNumber: 6,
          sql: 'alter table product\nadd constraint check_price check(price <200);',
          actionLabel: 'Add Stricter CHECK Constraint (price < 200)',
          explanation: 'Re-adds check_price with a strict inequality: price must be strictly less than 200.',
          animationType: 'add_constraint',
          statusMessage: 'Query OK, 0 rows affected (0.001 sec)\nRecords: 0  Duplicates: 0  Warnings: 0',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)', checkConstraint: 'price < 200' }
            ],
            rows: [
              { p_id: 12, p_name: 'horlicks', price: '100.00' }
            ],
            statusNote: 'New constraint check_price (price < 200) active'
          }
        },
        {
          id: 'step-4-2-7',
          stepNumber: 7,
          sql: 'drop table product;',
          actionLabel: 'Drop Product Table',
          explanation: 'Cleans up the product table.',
          animationType: 'drop_table',
          statusMessage: 'Query OK, 0 rows affected (0.001 sec)',
          afterState: {
            name: 'product',
            columns: [],
            rows: [],
            statusNote: 'Table product dropped'
          }
        }
      ]
    },
    {
      id: 'topic-4-3',
      title: 'Topic 4.3: DEFAULT Constraint & Alter Default',
      subtitle: 'Auto-filling omitted columns & setting default values',
      conceptBadge: 'DEFAULT Constraint',
      description: 'Learn how to set default values for columns (e.g. price DEFAULT 5.0). Discover how omitted columns in INSERT statements automatically take on their predefined defaults, and how to update default values with ALTER TABLE.',
      commands: [
        'create table product(p_id int not null, p_name varchar(30) unique, price decimal(10,2) default 5.0, order_id int);',
        'insert into product (p_id,p_name) values (123,"kishor");',
        'select * from product;',
        'alter table product alter order_id set default 12345;',
        'select * from product;'
      ],
      steps: [
        {
          id: 'step-4-3-1',
          stepNumber: 1,
          sql: 'create table product(\np_id int not null,\np_name varchar(30) unique,\nprice decimal(10,2) default 5.0,\norder_id int \n);',
          actionLabel: 'Create Table with DEFAULT Price (5.0)',
          explanation: 'Specifies default 5.0 on price. If an insert omits price, MySQL supplies 5.0 automatically.',
          animationType: 'create_table',
          statusMessage: 'Query OK, 0 rows affected (0.002 sec)',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)', defaultValue: '5.0' },
              { name: 'order_id', type: 'int' }
            ],
            rows: [],
            statusNote: 'Table product created with price default = 5.0'
          }
        },
        {
          id: 'step-4-3-2',
          stepNumber: 2,
          sql: 'insert into product (p_id,p_name)\nvalues (123,"kishor");',
          actionLabel: 'Insert Partial Columns (Omit price & order_id)',
          explanation: 'Only specifies p_id and p_name. MySQL assigns 5.0 to price because of DEFAULT 5.0, and NULL to order_id.',
          animationType: 'insert_partial',
          statusMessage: 'Query OK, 1 row affected (0.001 sec)',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)', defaultValue: '5.0' },
              { name: 'order_id', type: 'int' }
            ],
            rows: [
              { p_id: 123, p_name: 'kishor', price: '5.00', order_id: null }
            ],
            statusNote: '1 row added with auto-filled default price 5.00'
          }
        },
        {
          id: 'step-4-3-3',
          stepNumber: 3,
          sql: 'select * from product;',
          actionLabel: 'Inspect Auto-filled Default Values',
          explanation: 'Notice that price was automatically populated with 5.00 without being explicitly stated in the INSERT query!',
          animationType: 'select_query',
          statusMessage: '1 row in set (0.001 sec)',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)', defaultValue: '5.0' },
              { name: 'order_id', type: 'int' }
            ],
            rows: [
              { p_id: 123, p_name: 'kishor', price: '5.00', order_id: null }
            ],
            statusNote: 'Row shows price: 5.00 (Default)'
          }
        },
        {
          id: 'step-4-3-4',
          stepNumber: 4,
          sql: 'alter table product \nalter order_id set default 12345;',
          actionLabel: 'Set Default on order_id via ALTER TABLE',
          explanation: 'Uses ALTER TABLE table_name ALTER column_name SET DEFAULT value to set a default for order_id.',
          animationType: 'alter_default',
          statusMessage: 'Query OK, 0 rows affected (0.001 sec)\nRecords: 0  Duplicates: 0  Warnings: 0',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)', defaultValue: '5.0' },
              { name: 'order_id', type: 'int', defaultValue: '12345' }
            ],
            rows: [
              { p_id: 123, p_name: 'kishor', price: '5.00', order_id: null }
            ],
            statusNote: 'order_id default set to 12345'
          }
        },
        {
          id: 'step-4-3-5',
          stepNumber: 5,
          sql: 'select * from product;',
          actionLabel: 'Final Schema Inspection',
          explanation: 'Review the final table product state demonstrating both price and order_id defaults.',
          animationType: 'select_query',
          statusMessage: '1 row in set (0.001 sec)',
          afterState: {
            name: 'product',
            columns: [
              { name: 'p_id', type: 'int', nullable: false },
              { name: 'p_name', type: 'varchar(30)', isUnique: true },
              { name: 'price', type: 'decimal(10,2)', defaultValue: '5.0' },
              { name: 'order_id', type: 'int', defaultValue: '12345' }
            ],
            rows: [
              { p_id: 123, p_name: 'kishor', price: '5.00', order_id: null }
            ],
            statusNote: 'Constraints and default values active'
          }
        }
      ]
    }
  ]
};

export const PART_3_4_QUIZ: QuizQuestion[] = [
  {
    id: 'q12',
    topicId: 'topic-3-1',
    question: 'Why does MySQL Workbench display ERROR 1175 when you execute `UPDATE emp SET join_date = "2007-08-01" WHERE id = 1;`?',
    options: [
      'Because join_date is a read-only date format.',
      'Because Safe Updates mode (sql_safe_updates=1) is active and the WHERE clause does not reference a PRIMARY KEY.',
      'Because the UPDATE keyword is only valid in SQLite.',
      'Because date strings require single quotes only.'
    ],
    correctIndex: 1,
    explanation: 'MySQL safe updates mode prevents updates or deletes that do not use a key column in the WHERE clause. Setting `SET sql_safe_updates=0;` disables this restriction for the session.'
  },
  {
    id: 'q13',
    topicId: 'topic-3-2',
    question: 'What happens when you run `DELETE FROM emp WHERE ph_no IS NULL;`?',
    options: [
      'All rows in the table are deleted.',
      'Only the ph_no column is emptied to NULL for every row.',
      'Only records whose ph_no column contains NULL are removed from the table.',
      'The entire table schema is dropped.'
    ],
    correctIndex: 2,
    explanation: 'DELETE FROM emp removes entire rows where the predicate evaluates to true. `ph_no IS NULL` specifically targets rows with missing phone numbers.'
  },
  {
    id: 'q14',
    topicId: 'topic-3-3',
    question: 'If you run `SET autocommit = 0; DELETE FROM emp;` and then realize it was a mistake, how can you restore the deleted rows?',
    options: [
      'Execute `UNDO DELETE;`',
      'Execute `ROLLBACK;`',
      'Execute `REVERT;`',
      'Restart the MySQL server service.'
    ],
    correctIndex: 1,
    explanation: 'With autocommit disabled (`autocommit = 0`), DML changes are uncommitted. Running `ROLLBACK;` cancels the transaction and restores the database to its state at the beginning of the transaction.'
  },
  {
    id: 'q15',
    topicId: 'topic-3-4',
    question: 'Which MySQL built-in function returns the current system date in YYYY-MM-DD format without the time component?',
    codeSnippet: 'INSERT INTO timestamps VALUES (_______, NOW(), CURRENT_TIME());',
    options: [
      'CURRENT_DATE()',
      'NOW()',
      'DATE_FORMAT()',
      'TIME_STAMP()'
    ],
    correctIndex: 0,
    explanation: 'CURRENT_DATE() (or CURDATE()) returns the current date in "YYYY-MM-DD" format, while NOW() includes both date and time, and CURRENT_TIME() includes only the time.'
  },
  {
    id: 'q16',
    topicId: 'topic-4-1',
    question: 'What is the key difference between a NOT NULL constraint and a UNIQUE constraint?',
    options: [
      'NOT NULL allows duplicates but forbids NULL; UNIQUE forbids duplicates but may allow NULL.',
      'NOT NULL encrypts data; UNIQUE compresses data.',
      'UNIQUE only applies to string columns; NOT NULL only applies to numeric columns.',
      'There is no difference; they are interchangeable keywords.'
    ],
    correctIndex: 0,
    explanation: 'NOT NULL guarantees that a column will never store a NULL value. UNIQUE guarantees that every non-null value in the column is distinct across all rows.'
  },
  {
    id: 'q17',
    topicId: 'topic-4-2',
    question: 'What happens when you execute `INSERT INTO product VALUES(12, "Boost", 600);` if the table has `CONSTRAINT check_price CHECK (price <= 200)`?',
    codeSnippet: 'price decimal(10,2) constraint check_price check (price <= 200)',
    options: [
      'The price is automatically truncated to 200 and inserted.',
      'The query fails with ERROR 3819 (HY000): Check constraint "check_price" is violated.',
      'The row is inserted, but price is recorded as 0.00.',
      'The table is locked in read-only mode.'
    ],
    correctIndex: 1,
    explanation: 'MySQL evaluates CHECK expressions on INSERT and UPDATE. Because 600 <= 200 is false, MySQL rejects the statement with a Check constraint violation error.'
  },
  {
    id: 'q18',
    topicId: 'topic-4-3',
    question: 'How do you modify an existing column `order_id` in table `product` to have a default value of 12345?',
    options: [
      'ALTER TABLE product ALTER order_id SET DEFAULT 12345;',
      'UPDATE product SET DEFAULT order_id = 12345;',
      'CHANGE TABLE product order_id DEFAULT = 12345;',
      'MODIFY DEFAULT 12345 ON product.order_id;'
    ],
    correctIndex: 0,
    explanation: 'In SQL standards and MySQL, `ALTER TABLE table_name ALTER column_name SET DEFAULT value;` is the dedicated DDL syntax to assign a default value to an existing column.'
  }
];

export const PART_3_4_PRESETS = [
  // --- PART 3 PRESETS ---
  { label: 'P3: Use pandiyan_store', query: 'use pandiyan_store;' },
  { label: 'P3: Select * from emp', query: 'select * from emp;' },
  { label: 'P3: Set sql_safe_updates = 0', query: 'set sql_safe_updates=0;' },
  { label: 'P3: Update join_date where id = 1', query: 'update emp\nset join_date ="2007-08-01"\nwhere id =1;' },
  { label: 'P3: Delete where ph_no is null', query: 'delete from emp \nwhere ph_no is null;' },
  { label: 'P3: Set autocommit = 0 (Start Tx)', query: 'set autocommit=0;' },
  { label: 'P3: Select * from emp before delete', query: 'select * from emp;' },
  { label: 'P3: Delete all from emp (Test Rollback)', query: 'delete from emp;' },
  { label: 'P3: Select * from emp (Empty Check)', query: 'select * from emp;' },
  { label: 'P3: Rollback Transaction (Undo Delete)', query: 'rollback;' },
  { label: 'P3: Select * from emp (Restored)', query: 'select * from emp;' },
  { label: 'P3: Commit Transaction', query: 'commit;' },
  { label: 'P3: Create table timestamps', query: 'create table timestamps(\ndateofjoin date,\ndateandtime datetime,\nneram time\n);' },
  { label: 'P3: Select * from timestamps', query: 'select * from timestamps;' },
  { label: 'P3: Insert dynamic clock timestamps', query: 'insert into timestamps\nvalues(current_date(),now(),current_time());' },
  { label: 'P3: Delete where dateofjoin = current_date()', query: 'delete from timestamps\nwhere dateofjoin = current_date();' },

  // --- PART 4 PRESETS ---
  { label: 'P4: Use pandiyan_store', query: 'use pandiyan_store;' },
  { label: 'P4: Create product (NOT NULL, UNIQUE)', query: 'create table product(\np_id int not null,\np_name varchar(30) unique,\nprice decimal(10,2)\n);' },
  { label: 'P4: Insert valid products (colgate, pen)', query: 'insert into product\nvalue (123,"colgate",10.5),(132 ,"pen",5.5);' },
  { label: 'P4: Insert duplicate colgate (Triggers UNIQUE error)', query: 'insert into product\nvalue (128,"colgate",10.55);' },
  { label: 'P4: Select * from product', query: 'select * from product;' },
  { label: 'P4: Alter product add constraint unique(p_id)', query: 'alter table product\nadd constraint unique(p_id);' },
  { label: 'P4: Alter product modify price decimal(10,2) not null', query: 'alter table product \nmodify price decimal(10,2) not null;' },
  { label: 'P4: Drop table product', query: 'drop table product;' },
  { label: 'P4: Create product with CHECK (price <= 200)', query: 'create table product(\np_id int not null,\np_name varchar(30) unique,\nprice decimal(10,2)\nconstraint check_price check (price <= 200)\n);' },
  { label: 'P4: Insert Boost 600 (Triggers CHECK violation error)', query: 'insert into product\nvalues(12,"Boost",600);' },
  { label: 'P4: Insert horlicks 100 (Valid Check)', query: 'insert into product\nvalues(12,"horlicks",100);' },
  { label: 'P4: Alter drop constraint check_price', query: 'alter table product\ndrop constraint check_price;' },
  { label: 'P4: Alter add constraint check_price check(price <200)', query: 'alter table product\nadd constraint check_price check(price <200);' },
  { label: 'P4: Drop table product', query: 'drop table product;' },
  { label: 'P4: Create product with DEFAULT price 5.0', query: 'create table product(\np_id int not null,\np_name varchar(30) unique,\nprice decimal(10,2) default 5.0,\norder_id int \n);' },
  { label: 'P4: Insert partial (p_id, p_name) only', query: 'insert into product (p_id,p_name)\nvalues (123,"kishor");' },
  { label: 'P4: Select * from product (Inspect default price 5.00)', query: 'select * from product;' },
  { label: 'P4: Alter order_id set default 12345', query: 'alter table product \nalter order_id set default 12345;' },
  { label: 'P4: Select * from product (Inspect schema)', query: 'select * from product;' },
  { label: 'P4: Clean up drop table product', query: 'drop table product;' }
];
