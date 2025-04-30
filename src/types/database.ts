/**
 * Type definitions for database entities and query results
 */

/**
 * Represents a user in the database
 */
export interface User {
  ID: number;
  name: string;
}

/**
 * Database query results for users
 */
export interface UserQueryResult {
  rows: User[];
  rowsAffected?: number;
  lastInsertRowid?: number | bigint;
}

