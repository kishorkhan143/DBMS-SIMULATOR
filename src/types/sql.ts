export type SQLCommandType = 'DDL' | 'DML' | 'DQL' | 'ADMIN';

export interface TableConstraint {
  name?: string;
  type: 'UNIQUE' | 'CHECK' | 'NOT_NULL' | 'DEFAULT';
  column?: string;
  expression?: string;
}

export interface ColumnSchema {
  name: string;
  type: string;
  isPrimary?: boolean;
  isPrimaryKey?: boolean;
  nullable?: boolean;
  isUnique?: boolean;
  defaultValue?: string;
  checkConstraint?: string;
}

export interface TableState {
  name: string;
  columns: ColumnSchema[];
  rows: Record<string, any>[];
  constraints?: TableConstraint[];
  statusNote?: string;
}

export interface DatabaseState {
  name: string;
  isReadOnly: boolean;
  tables: Record<string, TableState>;
}

export interface SystemCatalog {
  currentDatabase: string | null;
  databases: Record<string, DatabaseState>;
  autocommit?: boolean;
  sqlSafeUpdates?: boolean;
  transactionSnapshot?: Record<string, DatabaseState> | null;
}

export type AnimationType = 
  | 'create_db'
  | 'drop_db'
  | 'alter_db_readonly'
  | 'create_table'
  | 'rename_table'
  | 'add_column'
  | 'modify_column_type'
  | 'rename_column'
  | 'reorder_column_first'
  | 'reorder_column_after'
  | 'drop_column'
  | 'drop_table'
  | 'insert_row'
  | 'insert_multi'
  | 'insert_partial'
  | 'select_query'
  | 'select_alias'
  | 'select_where'
  | 'show_databases'
  | 'update_row'
  | 'delete_row'
  | 'set_autocommit'
  | 'rollback'
  | 'commit'
  | 'add_constraint'
  | 'drop_constraint'
  | 'alter_default'
  | 'temporal_query';

export interface CommandStep {
  id: string;
  title?: string;
  actionLabel?: string;
  stepNumber?: number;
  sql: string;
  commandType?: SQLCommandType;
  description?: string;
  explanation: string[] | string;
  animationType: AnimationType;
  statusMessage?: string;
  highlightDetails?: {
    columnName?: string;
    oldColumnName?: string;
    newColumnName?: string;
    oldType?: string;
    newType?: string;
    movedFromIndex?: number;
    movedToIndex?: number;
    databaseName?: string;
    isReadOnly?: boolean;
    highlightedRowIndices?: number[];
    filterCondition?: string;
    aliasMapping?: Record<string, string>;
  };
  beforeState?: {
    databaseName?: string;
    isReadOnly?: boolean;
    name?: string;
    tableName?: string;
    columns?: ColumnSchema[];
    rows?: Record<string, any>[];
    constraints?: TableConstraint[];
    availableDatabases?: string[];
  };
  afterState: {
    databaseName?: string;
    isReadOnly?: boolean;
    name?: string;
    tableName?: string;
    columns?: ColumnSchema[];
    rows?: Record<string, any>[];
    constraints?: TableConstraint[];
    availableDatabases?: string[];
    statusNote?: string;
  };
  keyTakeaways?: string[];
}

export interface Topic {
  id: string;
  title: string;
  summary?: string;
  commandCount?: number;
  category?: string;
  subtitle?: string;
  conceptBadge?: string;
  description?: string;
  commands?: string[];
  definitions?: {
    title: string;
    syntax: string;
    purpose: string;
    keyPoints: string[];
    example: string;
  }[];
  steps: CommandStep[];
}

export interface Part {
  id: string;
  number?: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  topics: Topic[];
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QueryExecutionResult {
  success: boolean;
  message: string;
  columns?: string[];
  rows?: any[][];
  affectedRows?: number;
  timeMs: number;
}
