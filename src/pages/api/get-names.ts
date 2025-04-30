import type { APIRoute } from 'astro';
import { initDb, executeQuery } from '../../db/client.mjs';
import type { User, UserQueryResult } from '../../types/database.js';

// Initialize the database when the endpoint is first accessed
let dbInitialized = false;

// Define response type for better type checking
interface GetNamesResponse {
  success: boolean;
  names: Array<{ id: number; name: string }>;
  message?: string;
}

export const GET: APIRoute = async () => {
  try {
    // Initialize the database if not already done
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    // Query the database for all names with proper typing
    const result = await executeQuery<UserQueryResult>('SELECT * FROM users ORDER BY ID DESC');
    
    // Transform the data to the expected format with proper type annotations
    const names = result.rows.map((row: User) => ({
      id: row.ID,
      name: row.name
    }));

    // Return success response
    const responseData: GetNamesResponse = {
      success: true,
      names: names
    };

    return new Response(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching names:', error);
    
    // Return error response
    const errorResponse: GetNamesResponse = {
      success: false,
      message: 'An error occurred while fetching names',
      names: []
    };

    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};

