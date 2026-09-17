import { SystemCatalog, QueryExecutionResult, ColumnSchema, TableState, TableConstraint } from '../types/sql';

export function createInitialCatalog(): SystemCatalog {
  return {
    currentDatabase: 'pandiyan_store',
    autocommit: true,
    sqlSafeUpdates: true,
    transactionSnapshot: null,
    databases: {
      information_schema: {
        name: 'information_schema',
        isReadOnly: true,
        tables: {}
      },
      mysql: {
        name: 'mysql',
        isReadOnly: true,
        tables: {}
      },
      performance_schema: {
        name: 'performance_schema',
        isReadOnly: true,
        tables: {}
      },
      sys: {
        name: 'sys',
        isReadOnly: true,
        tables: {}
      },
      july: {
        name: 'july',
        isReadOnly: false,
        tables: {
          orders_archive: {
            name: 'orders_archive',
            columns: [
              { name: 'order_id', type: 'int' },
              { name: 'amount', type: 'decimal(7,2)' }
            ],
            rows: [
              { order_id: 501, amount: '120.50' }
            ]
          }
        }
      },
      pandiyan_store: {
        name: 'pandiyan_store',
        isReadOnly: false,
        tables: {
          emp: {
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
          }
        }
      }
    }
  };
}

// Temporal helper to compute current timestamp strings
function getTemporalValue(expr: string): string {
  const lower = expr.trim().toLowerCase();
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const dateTimeStr = `${dateStr} ${timeStr}`;

  if (lower === 'current_date()' || lower === 'curdate()' || lower === 'current_date') {
    return dateStr;
  }
  if (lower === 'now()' || lower === 'current_timestamp()' || lower === 'current_timestamp') {
    return dateTimeStr;
  }
  if (lower === 'current_time()' || lower === 'curtime()' || lower === 'current_time') {
    return timeStr;
  }
  return expr;
}

// Split comma-separated tokens outside parentheses
function splitTopLevelCommas(str: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let cur = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if ((ch === "'" || ch === '"') && !inQuotes) {
      inQuotes = true;
      quoteChar = ch;
      cur += ch;
    } else if (ch === quoteChar && inQuotes) {
      inQuotes = false;
      cur += ch;
    } else if (!inQuotes && ch === '(') {
      depth++;
      cur += ch;
    } else if (!inQuotes && ch === ')') {
      depth--;
      cur += ch;
    } else if (!inQuotes && ch === ',' && depth === 0) {
      parts.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

// Helper to evaluate WHERE predicates
function evaluateWherePredicate(row: Record<string, any>, whereExpr: string): boolean {
  const trimmed = whereExpr.trim();

  // IS NOT NULL
  const isNotNullMatch = trimmed.match(/^([a-zA-Z0-9_]+)\s+is\s+not\s+null$/i);
  if (isNotNullMatch) {
    const col = isNotNullMatch[1];
    const val = row[col];
    return val !== null && val !== undefined && val !== 'NULL';
  }

  // IS NULL
  const isNullMatch = trimmed.match(/^([a-zA-Z0-9_]+)\s+is\s+null$/i);
  if (isNullMatch) {
    const col = isNullMatch[1];
    const val = row[col];
    return val === null || val === undefined || val === 'NULL';
  }

  // Binary comparison operators: = , != , <> , >= , <= , > , <
  const compMatch = trimmed.match(/^([a-zA-Z0-9_]+)\s*(=|!=|<>|>=|<=|>|<)\s*(.+)$/i);
  if (compMatch) {
    const col = compMatch[1];
    const op = compMatch[2];
    let expectedRaw = compMatch[3].trim();

    // Check temporal functions on RHS (e.g. current_date())
    expectedRaw = getTemporalValue(expectedRaw);

    if ((expectedRaw.startsWith("'") && expectedRaw.endsWith("'")) ||
        (expectedRaw.startsWith('"') && expectedRaw.endsWith('"'))) {
      expectedRaw = expectedRaw.slice(1, -1);
    }

    const rowVal = row[col];
    if (rowVal === null || rowVal === undefined) {
      return false;
    }

    const isNumeric = !isNaN(Number(expectedRaw)) && !isNaN(Number(rowVal));
    if (isNumeric) {
      const numRow = Number(rowVal);
      const numExp = Number(expectedRaw);
      switch (op) {
        case '=': return numRow === numExp;
        case '!=':
        case '<>': return numRow !== numExp;
        case '>': return numRow > numExp;
        case '<': return numRow < numExp;
        case '>=': return numRow >= numExp;
        case '<=': return numRow <= numExp;
        default: return false;
      }
    } else {
      const strRow = String(rowVal).toLowerCase();
      const strExp = expectedRaw.toLowerCase();
      switch (op) {
        case '=': return strRow === strExp;
        case '!=':
        case '<>': return strRow !== strExp;
        default: return false;
      }
    }
  }

  return true;
}

// Helper to evaluate check constraints
function evaluateCheckCondition(row: Record<string, any>, checkExpr: string): boolean {
  const match = checkExpr.trim().match(/^([a-zA-Z0-9_]+)\s*(=|!=|<>|>=|<=|>|<)\s*(.+)$/i);
  if (!match) return true;
  const col = match[1];
  const op = match[2];
  let limitValStr = match[3].trim();
  if ((limitValStr.startsWith("'") && limitValStr.endsWith("'")) || (limitValStr.startsWith('"') && limitValStr.endsWith('"'))) {
    limitValStr = limitValStr.slice(1, -1);
  }
  const rowVal = row[col];
  if (rowVal === null || rowVal === undefined) return true;

  const numRow = Number(rowVal);
  const numLimit = Number(limitValStr);
  if (!isNaN(numRow) && !isNaN(numLimit)) {
    switch (op) {
      case '<=': return numRow <= numLimit;
      case '<': return numRow < numLimit;
      case '>=': return numRow >= numLimit;
      case '>': return numRow > numLimit;
      case '=': return numRow === numLimit;
      case '!=':
      case '<>': return numRow !== numLimit;
      default: return true;
    }
  }
  return true;
}

export function executeQuery(rawSql: string, catalog: SystemCatalog): {
  result: QueryExecutionResult;
  updatedCatalog: SystemCatalog;
} {
  const start = performance.now();
  // Clone catalog deeply to avoid direct mutation
  const updatedCatalog: SystemCatalog = JSON.parse(JSON.stringify(catalog));
  const cleanSql = rawSql.trim().replace(/;+$/, '').replace(/\s+/g, ' ');

  if (!cleanSql) {
    return {
      result: {
        success: false,
        message: 'Empty query submitted.',
        timeMs: 0
      },
      updatedCatalog
    };
  }

  // 1. SET variable = value (e.g. set sql_safe_updates = 0; set autocommit = 0;)
  const setMatch = cleanSql.match(/^set\s+([a-zA-Z0-9_]+)\s*=\s*([0-9a-zA-Z_]+)$/i);
  if (setMatch) {
    const varName = setMatch[1].toLowerCase();
    const varVal = setMatch[2].toLowerCase();

    if (varName === 'sql_safe_updates') {
      updatedCatalog.sqlSafeUpdates = varVal === '1' || varVal === 'true';
      return {
        result: {
          success: true,
          message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec)`,
          affectedRows: 0,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    if (varName === 'autocommit') {
      const isAuto = varVal === '1' || varVal === 'true';
      updatedCatalog.autocommit = isAuto;
      if (!isAuto && !updatedCatalog.transactionSnapshot) {
        // Capture baseline snapshot for rollback
        updatedCatalog.transactionSnapshot = JSON.parse(JSON.stringify(updatedCatalog.databases));
      }
      return {
        result: {
          success: true,
          message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec)`,
          affectedRows: 0,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    return {
      result: {
        success: true,
        message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec)`,
        affectedRows: 0,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 2. ROLLBACK
  if (/^rollback$/i.test(cleanSql)) {
    if (updatedCatalog.transactionSnapshot) {
      updatedCatalog.databases = JSON.parse(JSON.stringify(updatedCatalog.transactionSnapshot));
    }
    return {
      result: {
        success: true,
        message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec) - Transaction rolled back to last snapshot.`,
        affectedRows: 0,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 3. COMMIT
  if (/^commit$/i.test(cleanSql)) {
    if (updatedCatalog.autocommit === false) {
      updatedCatalog.transactionSnapshot = JSON.parse(JSON.stringify(updatedCatalog.databases));
    }
    return {
      result: {
        success: true,
        message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec) - Transaction committed.`,
        affectedRows: 0,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 4. SHOW DATABASES
  if (/^show\s+databases$/i.test(cleanSql)) {
    const dbs = Object.keys(updatedCatalog.databases).sort();
    const duration = +(performance.now() - start).toFixed(2);
    return {
      result: {
        success: true,
        message: `${dbs.length} rows in set (${(duration / 1000).toFixed(3)} sec)`,
        columns: ['Database'],
        rows: dbs.map(d => [d]),
        timeMs: duration
      },
      updatedCatalog
    };
  }

  // 5. SHOW TABLES
  if (/^show\s+tables$/i.test(cleanSql)) {
    const curDb = updatedCatalog.currentDatabase;
    if (!curDb || !updatedCatalog.databases[curDb]) {
      return {
        result: {
          success: false,
          message: 'ERROR 1046 (3D000): No database selected. Select the default database first using USE <database>;',
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }
    const tableNames = Object.keys(updatedCatalog.databases[curDb].tables).sort();
    const duration = +(performance.now() - start).toFixed(2);
    return {
      result: {
        success: true,
        message: `${tableNames.length} rows in set (${(duration / 1000).toFixed(3)} sec)`,
        columns: [`Tables_in_${curDb}`],
        rows: tableNames.map(t => [t]),
        timeMs: duration
      },
      updatedCatalog
    };
  }

  // 6. USE database
  const useMatch = cleanSql.match(/^use\s+([a-zA-Z0-9_]+)$/i);
  if (useMatch) {
    const dbName = useMatch[1];
    if (!updatedCatalog.databases[dbName]) {
      if (dbName.toLowerCase() === 'pandiyan_store') {
        updatedCatalog.databases['pandiyan_store'] = {
          name: 'pandiyan_store',
          isReadOnly: false,
          tables: {
            emp: {
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
            }
          }
        };
      } else {
        return {
          result: {
            success: false,
            message: `ERROR 1049 (42000): Unknown database '${dbName}'`,
            timeMs: +(performance.now() - start).toFixed(2)
          },
          updatedCatalog
        };
      }
    }
    updatedCatalog.currentDatabase = dbName;
    return {
      result: {
        success: true,
        message: `Database changed to '${dbName}'`,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 7. CREATE DATABASE [IF NOT EXISTS] db_name
  const createDbMatch = cleanSql.match(/^create\s+database\s+(?:if\s+not\s+exists\s+)?([a-zA-Z0-9_]+)$/i);
  if (createDbMatch) {
    const dbName = createDbMatch[1];
    if (updatedCatalog.databases[dbName]) {
      return {
        result: {
          success: false,
          message: `ERROR 1007 (HY000): Can't create database '${dbName}'; database exists`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }
    updatedCatalog.databases[dbName] = {
      name: dbName,
      isReadOnly: false,
      tables: {}
    };
    return {
      result: {
        success: true,
        message: `Query OK, 1 row affected (${((performance.now() - start) / 1000).toFixed(3)} sec)`,
        affectedRows: 1,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 8. DROP DATABASE [IF EXISTS] db_name
  const dropDbMatch = cleanSql.match(/^drop\s+database\s+(?:if\s+exists\s+)?([a-zA-Z0-9_]+)$/i);
  if (dropDbMatch) {
    const dbName = dropDbMatch[1];
    const targetDb = updatedCatalog.databases[dbName];
    if (!targetDb) {
      return {
        result: {
          success: false,
          message: `ERROR 1008 (HY000): Can't drop database '${dbName}'; database doesn't exist`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }
    if (targetDb.isReadOnly) {
      return {
        result: {
          success: false,
          message: `ERROR 3989 (HY000): Schema '${dbName}' is in read only mode. Set READ ONLY = 0 before dropping.`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }
    delete updatedCatalog.databases[dbName];
    if (updatedCatalog.currentDatabase === dbName) {
      updatedCatalog.currentDatabase = null;
    }
    return {
      result: {
        success: true,
        message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec) - Database '${dbName}' dropped.`,
        affectedRows: 0,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 9. ALTER DATABASE [db_name] READ ONLY = {1 | 0}
  const alterDbMatch = cleanSql.match(/^alter\s+database(?:\s+([a-zA-Z0-9_]+))?\s+read\s+only\s*=\s*([01])$/i);
  if (alterDbMatch) {
    const targetDbName = alterDbMatch[1] || updatedCatalog.currentDatabase;
    if (!targetDbName || !updatedCatalog.databases[targetDbName]) {
      return {
        result: {
          success: false,
          message: 'ERROR 1046 (3D000): No database selected and none specified in ALTER DATABASE statement.',
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }
    const isRo = alterDbMatch[2] === '1';
    updatedCatalog.databases[targetDbName].isReadOnly = isRo;
    return {
      result: {
        success: true,
        message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec) - Database '${targetDbName}' READ ONLY = ${isRo ? 1 : 0}.`,
        affectedRows: 0,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // Check current DB for table operations
  const curDbName = updatedCatalog.currentDatabase;
  if (!curDbName || !updatedCatalog.databases[curDbName]) {
    return {
      result: {
        success: false,
        message: 'ERROR 1046 (3D000): No database selected. Run "USE pandiyan_store;" or "SHOW DATABASES;" first.',
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  const currentDb = updatedCatalog.databases[curDbName];

  // Guard read-only DB from DDL / DML modifications
  const isModifyingCommand = /^(create|drop|alter|rename|insert|update|delete|truncate)/i.test(cleanSql);
  if (currentDb.isReadOnly && isModifyingCommand) {
    return {
      result: {
        success: false,
        message: `ERROR 3989 (HY000): Schema '${curDbName}' is in read only mode. Execute 'ALTER DATABASE READ ONLY = 0;' to permit modifications.`,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 10. DROP TABLE [IF EXISTS] table_name
  const dropTableMatch = cleanSql.match(/^drop\s+table\s+(?:if\s+exists\s+)?([a-zA-Z0-9_]+)$/i);
  if (dropTableMatch) {
    const tableName = dropTableMatch[1];
    if (!currentDb.tables[tableName]) {
      if (!/if\s+exists/i.test(cleanSql)) {
        return {
          result: {
            success: false,
            message: `ERROR 1051 (42S02): Unknown table '${curDbName}.${tableName}'`,
            timeMs: +(performance.now() - start).toFixed(2)
          },
          updatedCatalog
        };
      }
    } else {
      delete currentDb.tables[tableName];
    }
    return {
      result: {
        success: true,
        message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec)`,
        affectedRows: 0,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 11. CREATE TABLE table_name (...)
  const createTableMatch = cleanSql.match(/^create\s+table\s+([a-zA-Z0-9_]+)\s*\(([\s\S]+)\)$/i);
  if (createTableMatch) {
    const tableName = createTableMatch[1];
    if (currentDb.tables[tableName]) {
      return {
        result: {
          success: false,
          message: `ERROR 1050 (42S01): Table '${tableName}' already exists`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }
    const tokenList = splitTopLevelCommas(createTableMatch[2]);
    const parsedColumns: ColumnSchema[] = [];
    const constraints: TableConstraint[] = [];

    for (const item of tokenList) {
      const trimmed = item.trim();

      // Check for table-level check constraint: [constraint name] check (expr)
      const tableCheckMatch = trimmed.match(/^(?:constraint\s+([a-zA-Z0-9_]+)\s+)?check\s*\(([\s\S]+)\)$/i);
      if (tableCheckMatch) {
        constraints.push({
          name: tableCheckMatch[1] || 'check',
          type: 'CHECK',
          expression: tableCheckMatch[2].trim()
        });
        continue;
      }

      // Check for table-level unique constraint: [constraint name] unique (col)
      const tableUniqueMatch = trimmed.match(/^(?:constraint\s+([a-zA-Z0-9_]+)\s+)?unique\s*\(\s*([a-zA-Z0-9_]+)\s*\)$/i);
      if (tableUniqueMatch) {
        constraints.push({
          name: tableUniqueMatch[1] || 'unique',
          type: 'UNIQUE',
          column: tableUniqueMatch[2].trim()
        });
        continue;
      }

      // Column definition
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 2) {
        const colName = parts[0];
        let colType = parts[1];

        // Handle types with precision like decimal(10,2) or varchar(30)
        let restIdx = 2;
        if (colType.includes('(') && !colType.includes(')')) {
          colType += ' ' + parts[2];
          restIdx = 3;
        }
        const modifiers = parts.slice(restIdx).join(' ');

        const isPrimary = /primary\s+key/i.test(modifiers) || /primary\s+key/i.test(trimmed);
        const isAutoIncrement = /auto_increment/i.test(modifiers) || /auto_increment/i.test(trimmed);
        const isNotNull = /not\s+null/i.test(modifiers) || isPrimary;
        const isUnique = /\bunique\b/i.test(modifiers) || isPrimary;

        let defaultValue: string | undefined = undefined;
        const defaultMatch = modifiers.match(/default\s+([^\s,]+)/i);
        if (defaultMatch) {
          defaultValue = defaultMatch[1].replace(/['"]/g, '');
        }

        // Inline check constraint on column e.g. constraint check_price check (price <= 200)
        const inlineCheckMatch = trimmed.match(/(?:constraint\s+([a-zA-Z0-9_]+)\s+)?check\s*\(([\s\S]+)\)/i);
        if (inlineCheckMatch) {
          constraints.push({
            name: inlineCheckMatch[1] || 'check',
            type: 'CHECK',
            column: colName,
            expression: inlineCheckMatch[2].trim()
          });
        }

        parsedColumns.push({
          name: colName,
          type: colType,
          isPrimary,
          nullable: !isNotNull,
          isUnique,
          defaultValue,
          autoIncrement: isAutoIncrement
        });
      }
    }

    currentDb.tables[tableName] = {
      name: tableName,
      columns: parsedColumns,
      rows: [],
      constraints,
      autoIncrementValue: 1
    };

    return {
      result: {
        success: true,
        message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec) - Table '${tableName}' created with ${parsedColumns.length} columns.`,
        affectedRows: 0,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 12. RENAME TABLE old TO new
  const renameMatch = cleanSql.match(/^rename\s+table\s+([a-zA-Z0-9_]+)\s+to\s+([a-zA-Z0-9_]+)$/i);
  if (renameMatch) {
    const oldName = renameMatch[1];
    const newName = renameMatch[2];
    if (!currentDb.tables[oldName]) {
      return {
        result: {
          success: false,
          message: `ERROR 1146 (42S02): Table '${curDbName}.${oldName}' doesn't exist`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }
    if (currentDb.tables[newName]) {
      return {
        result: {
          success: false,
          message: `ERROR 1050 (42S01): Table '${newName}' already exists`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }
    const existingTable = currentDb.tables[oldName];
    existingTable.name = newName;
    currentDb.tables[newName] = existingTable;
    delete currentDb.tables[oldName];

    return {
      result: {
        success: true,
        message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec) - Table renamed from '${oldName}' to '${newName}'.`,
        affectedRows: 0,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 13. ALTER TABLE product ADD CONSTRAINT check_price CHECK (...) / UNIQUE (...) / PRIMARY KEY (...)
  const alterAddConstraintMatch = cleanSql.match(/^alter\s+table\s+([a-zA-Z0-9_]+)\s+add(?:\s+constraint(?:\s+([a-zA-Z0-9_]+))?)?\s+(unique|check|primary\s+key)\s*\(([\s\S]+)\)$/i);
  if (alterAddConstraintMatch) {
    const tableName = alterAddConstraintMatch[1];
    const constraintName = alterAddConstraintMatch[2] || alterAddConstraintMatch[3].toLowerCase();
    const rawConstraintType = alterAddConstraintMatch[3].toUpperCase().replace(/\s+/g, ' ');
    const clauseBody = alterAddConstraintMatch[4].trim();

    const table = currentDb.tables[tableName];
    if (!table) {
      return {
        result: {
          success: false,
          message: `ERROR 1146 (42S02): Table '${curDbName}.${tableName}' doesn't exist`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    if (!table.constraints) table.constraints = [];

    if (rawConstraintType === 'PRIMARY KEY') {
      const colName = clauseBody.replace(/['"`]/g, '').trim();
      const col = table.columns.find(c => c.name.toLowerCase() === colName.toLowerCase());
      if (!col) {
        return {
          result: {
            success: false,
            message: `ERROR 1054 (42S22): Unknown column '${colName}' in '${tableName}'`,
            timeMs: +(performance.now() - start).toFixed(2)
          },
          updatedCatalog
        };
      }
      // Check if primary key already exists
      const existingPk = table.columns.find(c => c.isPrimary);
      if (existingPk) {
        return {
          result: {
            success: false,
            message: 'ERROR 1068 (42000): Multiple primary key defined',
            timeMs: +(performance.now() - start).toFixed(2)
          },
          updatedCatalog
        };
      }
      col.isPrimary = true;
      col.nullable = false;
      col.isUnique = true;
      table.constraints.push({
        name: constraintName,
        type: 'PRIMARY_KEY',
        column: colName
      });
    } else if (rawConstraintType === 'UNIQUE') {
      const colName = clauseBody.replace(/['"`]/g, '').trim();
      const col = table.columns.find(c => c.name.toLowerCase() === colName.toLowerCase());
      if (col) col.isUnique = true;
      table.constraints.push({
        name: constraintName,
        type: 'UNIQUE',
        column: colName
      });
    } else if (rawConstraintType === 'CHECK') {
      table.constraints.push({
        name: constraintName,
        type: 'CHECK',
        expression: clauseBody
      });
    }

    return {
      result: {
        success: true,
        message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec)\nRecords: 0  Duplicates: 0  Warnings: 0`,
        affectedRows: 0,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 13b. ALTER TABLE table AUTO_INCREMENT = 200
  const alterAutoIncMatch = cleanSql.match(/^alter\s+table\s+([a-zA-Z0-9_]+)\s+auto_increment\s*=\s*([0-9]+)$/i);
  if (alterAutoIncMatch) {
    const tableName = alterAutoIncMatch[1];
    const newSeed = parseInt(alterAutoIncMatch[2], 10);
    const table = currentDb.tables[tableName];
    if (!table) {
      return {
        result: {
          success: false,
          message: `ERROR 1146 (42S02): Table '${curDbName}.${tableName}' doesn't exist`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }
    table.autoIncrementValue = newSeed;
    return {
      result: {
        success: true,
        message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec)\nRecords: 0  Duplicates: 0  Warnings: 0`,
        affectedRows: 0,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 14. ALTER TABLE product DROP CONSTRAINT check_price
  const alterDropConstraintMatch = cleanSql.match(/^alter\s+table\s+([a-zA-Z0-9_]+)\s+drop\s+constraint\s+([a-zA-Z0-9_]+)$/i);
  if (alterDropConstraintMatch) {
    const tableName = alterDropConstraintMatch[1];
    const constraintName = alterDropConstraintMatch[2];

    const table = currentDb.tables[tableName];
    if (!table) {
      return {
        result: {
          success: false,
          message: `ERROR 1146 (42S02): Table '${curDbName}.${tableName}' doesn't exist`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    if (table.constraints) {
      table.constraints = table.constraints.filter(c => c.name?.toLowerCase() !== constraintName.toLowerCase());
    }

    return {
      result: {
        success: true,
        message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec)\nRecords: 0  Duplicates: 0  Warnings: 0`,
        affectedRows: 0,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 15. ALTER TABLE product ALTER [COLUMN] col SET DEFAULT val
  const alterSetDefaultMatch = cleanSql.match(/^alter\s+table\s+([a-zA-Z0-9_]+)\s+alter(?:\s+column)?\s+([a-zA-Z0-9_]+)\s+set\s+default\s+([^\s;]+)$/i);
  if (alterSetDefaultMatch) {
    const tableName = alterSetDefaultMatch[1];
    const colName = alterSetDefaultMatch[2];
    let defaultVal = alterSetDefaultMatch[3].trim().replace(/['"]/g, '');

    const table = currentDb.tables[tableName];
    if (!table) {
      return {
        result: {
          success: false,
          message: `ERROR 1146 (42S02): Table '${curDbName}.${tableName}' doesn't exist`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    const col = table.columns.find(c => c.name.toLowerCase() === colName.toLowerCase());
    if (!col) {
      return {
        result: {
          success: false,
          message: `ERROR 1054 (42S22): Unknown column '${colName}' in '${tableName}'`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    col.defaultValue = defaultVal;

    return {
      result: {
        success: true,
        message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec)\nRecords: 0  Duplicates: 0  Warnings: 0`,
        affectedRows: 0,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 16. ALTER TABLE emp ADD [COLUMN] ...
  const alterAddMatch = cleanSql.match(/^alter\s+table\s+([a-zA-Z0-9_]+)\s+add(?:\s+column)?\s+([a-zA-Z0-9_]+)\s+([^;,]+?)(?:\s+(first|after\s+[a-zA-Z0-9_]+))?$/i);
  if (alterAddMatch) {
    const tableName = alterAddMatch[1];
    const colName = alterAddMatch[2];
    const colType = alterAddMatch[3].trim();
    const positionClause = alterAddMatch[4];

    const table = currentDb.tables[tableName];
    if (!table) {
      return {
        result: {
          success: false,
          message: `ERROR 1146 (42S02): Table '${curDbName}.${tableName}' doesn't exist`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }
    if (table.columns.some(c => c.name.toLowerCase() === colName.toLowerCase())) {
      return {
        result: {
          success: false,
          message: `ERROR 1060 (42S21): Duplicate column name '${colName}'`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    const newCol: ColumnSchema = { name: colName, type: colType };
    if (!positionClause) {
      table.columns.push(newCol);
    } else if (/^first$/i.test(positionClause)) {
      table.columns.unshift(newCol);
    } else {
      const afterMatch = positionClause.match(/^after\s+([a-zA-Z0-9_]+)$/i);
      if (afterMatch) {
        const afterCol = afterMatch[1];
        const idx = table.columns.findIndex(c => c.name.toLowerCase() === afterCol.toLowerCase());
        if (idx !== -1) {
          table.columns.splice(idx + 1, 0, newCol);
        } else {
          table.columns.push(newCol);
        }
      } else {
        table.columns.push(newCol);
      }
    }

    // Populate existing rows with null
    for (const r of table.rows) {
      r[colName] = null;
    }

    return {
      result: {
        success: true,
        message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec)\nRecords: 0  Duplicates: 0  Warnings: 0`,
        affectedRows: 0,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 17. ALTER TABLE emp MODIFY [COLUMN] ...
  const alterModifyMatch = cleanSql.match(/^alter\s+table\s+([a-zA-Z0-9_]+)\s+modify(?:\s+column)?\s+([a-zA-Z0-9_]+)\s+([\s\S]+?)(?:\s+(first|after\s+[a-zA-Z0-9_]+))?$/i);
  if (alterModifyMatch) {
    const tableName = alterModifyMatch[1];
    const colName = alterModifyMatch[2];
    const restDefinition = alterModifyMatch[3].trim();
    const positionClause = alterModifyMatch[4];

    const table = currentDb.tables[tableName];
    if (!table) {
      return {
        result: {
          success: false,
          message: `ERROR 1146 (42S02): Table '${curDbName}.${tableName}' doesn't exist`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    const colIndex = table.columns.findIndex(c => c.name.toLowerCase() === colName.toLowerCase());
    if (colIndex === -1) {
      return {
        result: {
          success: false,
          message: `ERROR 1054 (42S22): Unknown column '${colName}' in '${tableName}'`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    const [existingCol] = table.columns.splice(colIndex, 1);
    const parts = restDefinition.split(/\s+/);
    let newType = parts[0];
    if (newType.includes('(') && !newType.includes(')')) {
      newType += ' ' + parts[1];
    }
    existingCol.type = newType;

    if (/not\s+null/i.test(restDefinition)) {
      existingCol.nullable = false;
    }

    if (/auto_increment/i.test(restDefinition)) {
      existingCol.autoIncrement = true;
      if (!table.autoIncrementValue) {
        table.autoIncrementValue = 1;
      }
    }

    // Handle positioning
    if (positionClause) {
      if (/^first$/i.test(positionClause)) {
        table.columns.unshift(existingCol);
      } else {
        const afterMatch = positionClause.match(/^after\s+([a-zA-Z0-9_]+)$/i);
        if (afterMatch) {
          const afterCol = afterMatch[1];
          const afterIdx = table.columns.findIndex(c => c.name.toLowerCase() === afterCol.toLowerCase());
          if (afterIdx !== -1) {
            table.columns.splice(afterIdx + 1, 0, existingCol);
          } else {
            table.columns.push(existingCol);
          }
        } else {
          table.columns.push(existingCol);
        }
      }
    } else {
      table.columns.splice(colIndex, 0, existingCol);
    }

    return {
      result: {
        success: true,
        message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec)\nRecords: 0  Duplicates: 0  Warnings: 0`,
        affectedRows: 0,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 18. ALTER TABLE emp RENAME COLUMN old TO new
  const alterRenameColMatch = cleanSql.match(/^alter\s+table\s+([a-zA-Z0-9_]+)\s+rename\s+column\s+([a-zA-Z0-9_]+)\s+to\s+([a-zA-Z0-9_]+)$/i);
  if (alterRenameColMatch) {
    const tableName = alterRenameColMatch[1];
    const oldCol = alterRenameColMatch[2];
    const newCol = alterRenameColMatch[3];

    const table = currentDb.tables[tableName];
    if (!table) {
      return {
        result: {
          success: false,
          message: `ERROR 1146 (42S02): Table '${curDbName}.${tableName}' doesn't exist`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    const target = table.columns.find(c => c.name.toLowerCase() === oldCol.toLowerCase());
    if (!target) {
      return {
        result: {
          success: false,
          message: `ERROR 1054 (42S22): Unknown column '${oldCol}' in '${tableName}'`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    target.name = newCol;
    for (const r of table.rows) {
      if (oldCol in r) {
        r[newCol] = r[oldCol];
        delete r[oldCol];
      }
    }

    return {
      result: {
        success: true,
        message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec)\nRecords: 0  Duplicates: 0  Warnings: 0`,
        affectedRows: 0,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 19. ALTER TABLE emp DROP [COLUMN] col
  const alterDropColMatch = cleanSql.match(/^alter\s+table\s+([a-zA-Z0-9_]+)\s+drop(?:\s+column)?\s+([a-zA-Z0-9_]+)$/i);
  if (alterDropColMatch) {
    const tableName = alterDropColMatch[1];
    const colName = alterDropColMatch[2];

    const table = currentDb.tables[tableName];
    if (!table) {
      return {
        result: {
          success: false,
          message: `ERROR 1146 (42S02): Table '${curDbName}.${tableName}' doesn't exist`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    const idx = table.columns.findIndex(c => c.name.toLowerCase() === colName.toLowerCase());
    if (idx === -1) {
      return {
        result: {
          success: false,
          message: `ERROR 1091 (42000): Can't DROP '${colName}'; check that column/key exists`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    table.columns.splice(idx, 1);
    for (const r of table.rows) {
      delete r[colName];
    }

    return {
      result: {
        success: true,
        message: `Query OK, 0 rows affected (${((performance.now() - start) / 1000).toFixed(3)} sec)\nRecords: 0  Duplicates: 0  Warnings: 0`,
        affectedRows: 0,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 20. UPDATE table SET col1 = val1, ... [WHERE condition]
  const updateMatch = cleanSql.match(/^update\s+([a-zA-Z0-9_]+)\s+set\s+([\s\S]+?)(?:\s+where\s+([\s\S]+))?$/i);
  if (updateMatch) {
    const tableName = updateMatch[1];
    const setClause = updateMatch[2].trim();
    const whereExpr = updateMatch[3] ? updateMatch[3].trim() : null;

    const table = currentDb.tables[tableName];
    if (!table) {
      return {
        result: {
          success: false,
          message: `ERROR 1146 (42S02): Table '${curDbName}.${tableName}' doesn't exist`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    // Parse assignment tokens: e.g. join_date ="2007-08-01", salary = 500
    const assignments = setClause.split(',').map(s => s.trim());
    const parsedAssignments: { col: string; val: any }[] = [];

    for (const assign of assignments) {
      const eqIdx = assign.indexOf('=');
      if (eqIdx === -1) continue;
      const col = assign.substring(0, eqIdx).trim();
      let rawVal = assign.substring(eqIdx + 1).trim();
      rawVal = getTemporalValue(rawVal);
      if ((rawVal.startsWith("'") && rawVal.endsWith("'")) || (rawVal.startsWith('"') && rawVal.endsWith('"'))) {
        rawVal = rawVal.slice(1, -1);
      } else if (rawVal.toLowerCase() === 'null') {
        rawVal = null as any;
      }
      parsedAssignments.push({ col, val: rawVal });
    }

    // If transaction snapshot not yet captured in uncommitted mode
    if (updatedCatalog.autocommit === false && !updatedCatalog.transactionSnapshot) {
      updatedCatalog.transactionSnapshot = JSON.parse(JSON.stringify(updatedCatalog.databases));
    }

    let matched = 0;
    let changed = 0;

    for (const row of table.rows) {
      if (!whereExpr || evaluateWherePredicate(row, whereExpr)) {
        matched++;
        let hasChanged = false;
        for (const assign of parsedAssignments) {
          if (row[assign.col] !== assign.val) {
            row[assign.col] = assign.val;
            hasChanged = true;
          }
        }
        if (hasChanged) changed++;
      }
    }

    return {
      result: {
        success: true,
        message: `Query OK, ${changed} ${changed === 1 ? 'row' : 'rows'} affected (${((performance.now() - start) / 1000).toFixed(3)} sec)\nRows matched: ${matched}  Changed: ${changed}  Warnings: 0`,
        affectedRows: changed,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 21. DELETE FROM table [WHERE condition]
  const deleteMatch = cleanSql.match(/^delete\s+from\s+([a-zA-Z0-9_]+)(?:\s+where\s+([\s\S]+))?$/i);
  if (deleteMatch) {
    const tableName = deleteMatch[1];
    const whereExpr = deleteMatch[2] ? deleteMatch[2].trim() : null;

    const table = currentDb.tables[tableName];
    if (!table) {
      return {
        result: {
          success: false,
          message: `ERROR 1146 (42S02): Table '${curDbName}.${tableName}' doesn't exist`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    // Capture transaction snapshot if autocommit is disabled
    if (updatedCatalog.autocommit === false && !updatedCatalog.transactionSnapshot) {
      updatedCatalog.transactionSnapshot = JSON.parse(JSON.stringify(updatedCatalog.databases));
    }

    const initialCount = table.rows.length;
    if (!whereExpr) {
      table.rows = [];
    } else {
      table.rows = table.rows.filter(row => !evaluateWherePredicate(row, whereExpr));
    }
    const deletedCount = initialCount - table.rows.length;

    return {
      result: {
        success: true,
        message: `Query OK, ${deletedCount} ${deletedCount === 1 ? 'row' : 'rows'} affected (${((performance.now() - start) / 1000).toFixed(3)} sec)`,
        affectedRows: deletedCount,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 22. INSERT INTO table [VALUE | VALUES] (...)
  const insertMatch = cleanSql.match(/^insert\s+into\s+([a-zA-Z0-9_]+)(?:\s*\(([^)]+)\))?\s*(?:values|value)\s*([\s\S]+)$/i);
  if (insertMatch) {
    const tableName = insertMatch[1];
    let table = currentDb.tables[tableName];

    if (!table) {
      return {
        result: {
          success: false,
          message: `ERROR 1146 (42S02): Table '${curDbName}.${tableName}' doesn't exist`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    let targetCols: string[];
    if (insertMatch[2]) {
      targetCols = insertMatch[2].split(',').map(s => s.trim());
    } else {
      targetCols = table.columns.map(c => c.name);
    }

    const valString = insertMatch[3];
    // Extract row tuples
    const valTuples: string[] = [];
    let depth = 0;
    let currentTuple = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < valString.length; i++) {
      const char = valString[i];
      if ((char === "'" || char === '"') && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
        if (depth > 0) currentTuple += char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        if (depth > 0) currentTuple += char;
      } else if (!inQuotes && char === '(') {
        depth++;
        if (depth === 1) {
          currentTuple = '';
        } else {
          currentTuple += char;
        }
      } else if (!inQuotes && char === ')') {
        depth--;
        if (depth === 0) {
          valTuples.push(currentTuple.trim());
          currentTuple = '';
        } else {
          currentTuple += char;
        }
      } else if (depth > 0) {
        currentTuple += char;
      }
    }

    if (valTuples.length === 0) {
      return {
        result: {
          success: false,
          message: `ERROR 1064 (42000): You have an error in your SQL syntax near '${cleanSql}'`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    // Capture transaction snapshot if autocommit is disabled
    if (updatedCatalog.autocommit === false && !updatedCatalog.transactionSnapshot) {
      updatedCatalog.transactionSnapshot = JSON.parse(JSON.stringify(updatedCatalog.databases));
    }

    const preparedRows: Record<string, any>[] = [];

    for (const tupleStr of valTuples) {
      const rawValues = splitTopLevelCommas(tupleStr);

      // Validate column count vs value count when no explicit column list is given
      if (!insertMatch[2] && rawValues.length !== table.columns.length) {
        return {
          result: {
            success: false,
            message: `ERROR 1136 (21S01): Column count doesn't match value count at row ${preparedRows.length + 1}`,
            timeMs: +(performance.now() - start).toFixed(2)
          },
          updatedCatalog
        };
      }

      const rowObj: Record<string, any> = {};

      // Initialize with column defaults or null
      for (const c of table.columns) {
        rowObj[c.name] = c.defaultValue !== undefined ? c.defaultValue : null;
      }

      targetCols.forEach((colName, idx) => {
        let v = rawValues[idx];
        if (typeof v === 'string') {
          v = getTemporalValue(v);
          if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
            v = v.slice(1, -1);
          } else if (v.toLowerCase() === 'null') {
            v = null;
          }
        }
        rowObj[colName] = v;
      });

      // Auto-increment column resolution
      for (const c of table.columns) {
        if (c.autoIncrement) {
          if (rowObj[c.name] === null || rowObj[c.name] === undefined) {
            const nextVal = table.autoIncrementValue ?? 1;
            rowObj[c.name] = nextVal;
            table.autoIncrementValue = nextVal + 1;
          } else {
            const numericVal = Number(rowObj[c.name]);
            if (!isNaN(numericVal) && numericVal >= (table.autoIncrementValue ?? 1)) {
              table.autoIncrementValue = numericVal + 1;
            }
          }
        }
      }

      // Constraint Validation 1: NOT NULL & PRIMARY KEY
      for (const c of table.columns) {
        const isMandatory = c.nullable === false || c.isPrimary;
        if (isMandatory && (rowObj[c.name] === null || rowObj[c.name] === undefined)) {
          return {
            result: {
              success: false,
              message: `ERROR 1048 (23000): Column '${c.name}' cannot be null`,
              timeMs: +(performance.now() - start).toFixed(2)
            },
            updatedCatalog
          };
        }
      }

      // Constraint Validation 2: UNIQUE & PRIMARY KEY
      for (const c of table.columns) {
        const isColUnique = c.isUnique || c.isPrimary || (table.constraints && table.constraints.some(tc => (tc.type === 'UNIQUE' || tc.type === 'PRIMARY_KEY') && tc.column?.toLowerCase() === c.name.toLowerCase()));
        if (isColUnique && rowObj[c.name] !== null && rowObj[c.name] !== undefined) {
          const valToCheck = String(rowObj[c.name]).toLowerCase();
          const existsInTable = table.rows.some(r => r[c.name] !== null && String(r[c.name]).toLowerCase() === valToCheck);
          const existsInBatch = preparedRows.some(r => r[c.name] !== null && String(r[c.name]).toLowerCase() === valToCheck);
          if (existsInTable || existsInBatch) {
            const keyDesc = c.isPrimary ? 'PRIMARY' : c.name;
            return {
              result: {
                success: false,
                message: `ERROR 1062 (23000): Duplicate entry '${rowObj[c.name]}' for key '${table.name}.${keyDesc}'`,
                timeMs: +(performance.now() - start).toFixed(2)
              },
              updatedCatalog
            };
          }
        }
      }

      // Constraint Validation 3: CHECK
      if (table.constraints) {
        for (const tc of table.constraints) {
          if (tc.type === 'CHECK' && tc.expression) {
            const passes = evaluateCheckCondition(rowObj, tc.expression);
            if (!passes) {
              return {
                result: {
                  success: false,
                  message: `ERROR 3819 (HY000): Check constraint '${tc.name || 'check'}' is violated.`,
                  timeMs: +(performance.now() - start).toFixed(2)
                },
                updatedCatalog
              };
            }
          }
        }
      }

      preparedRows.push(rowObj);
    }

    table.rows.push(...preparedRows);
    const rowsAdded = preparedRows.length;

    return {
      result: {
        success: true,
        message: `Query OK, ${rowsAdded} ${rowsAdded === 1 ? 'row' : 'rows'} affected (${((performance.now() - start) / 1000).toFixed(3)} sec)\nRecords: ${rowsAdded}  Duplicates: 0  Warnings: 0`,
        affectedRows: rowsAdded,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // 23. SELECT ... FROM table [WHERE condition]
  const selectMatch = cleanSql.match(/^select\s+([\s\S]+?)\s+from\s+([a-zA-Z0-9_]+)(?:\s+where\s+([\s\S]+))?$/i);
  if (selectMatch) {
    const colExpr = selectMatch[1].trim();
    const tableName = selectMatch[2].trim();
    const whereExpr = selectMatch[3] ? selectMatch[3].trim() : null;

    const table = currentDb.tables[tableName];

    if (!table) {
      return {
        result: {
          success: false,
          message: `ERROR 1146 (42S02): Table '${curDbName}.${tableName}' doesn't exist`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    interface ProjectedColumn {
      sourceCol: string;
      displayCol: string;
    }
    const projectedCols: ProjectedColumn[] = [];

    if (colExpr === '*') {
      for (const c of table.columns) {
        projectedCols.push({ sourceCol: c.name, displayCol: c.name });
      }
    } else {
      const items = splitTopLevelCommas(colExpr);
      for (const item of items) {
        const aliasMatch = item.match(/^([a-zA-Z0-9_]+)(?:\s+(?:as\s+)?([a-zA-Z0-9_]+))?$/i);
        if (aliasMatch) {
          const source = aliasMatch[1];
          const display = aliasMatch[2] || source;
          projectedCols.push({ sourceCol: source, displayCol: display });
        } else {
          projectedCols.push({ sourceCol: item, displayCol: item });
        }
      }
    }

    let matchedRows = table.rows;
    if (whereExpr) {
      matchedRows = matchedRows.filter(row => evaluateWherePredicate(row, whereExpr));
    }

    const outColumns = projectedCols.map(p => p.displayCol);
    const gridRows = matchedRows.map(r =>
      projectedCols.map(p => {
        const val = r[p.sourceCol];
        return val !== undefined && val !== null ? String(val) : 'NULL';
      })
    );
    const duration = +(performance.now() - start).toFixed(2);

    return {
      result: {
        success: true,
        message: `${gridRows.length} ${gridRows.length === 1 ? 'row' : 'rows'} in set (${(duration / 1000).toFixed(3)} sec)`,
        columns: outColumns,
        rows: gridRows,
        timeMs: duration
      },
      updatedCatalog
    };
  }

  // 24. DESCRIBE table
  const descMatch = cleanSql.match(/^(?:describe|desc)\s+([a-zA-Z0-9_]+)$/i);
  if (descMatch) {
    const tableName = descMatch[1];
    const table = currentDb.tables[tableName];
    if (!table) {
      return {
        result: {
          success: false,
          message: `ERROR 1146 (42S02): Table '${curDbName}.${tableName}' doesn't exist`,
          timeMs: +(performance.now() - start).toFixed(2)
        },
        updatedCatalog
      };
    }

    const gridRows = table.columns.map(c => [
      c.name,
      c.type,
      c.nullable !== false ? 'YES' : 'NO',
      c.isPrimary ? 'PRI' : c.isUnique ? 'UNI' : '',
      c.defaultValue !== undefined ? c.defaultValue : 'NULL',
      ''
    ]);

    return {
      result: {
        success: true,
        message: `${gridRows.length} rows in set (${((performance.now() - start) / 1000).toFixed(3)} sec)`,
        columns: ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra'],
        rows: gridRows,
        timeMs: +(performance.now() - start).toFixed(2)
      },
      updatedCatalog
    };
  }

  // Fallback unrecognized
  return {
    result: {
      success: false,
      message: `ERROR 1064 (42000): You have an error in your SQL syntax near '${cleanSql.slice(0, 35)}...'`,
      timeMs: +(performance.now() - start).toFixed(2)
    },
    updatedCatalog
  };
}
