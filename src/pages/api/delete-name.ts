import type { APIRoute } from 'astro';
import { initDb, executeQuery } from '../../db/client.mjs';
import type { UserQueryResult } from '../../types/database.js';

// Initialize the database when the endpoint is first accessed
let dbInitialized = false;

// Define request body interface for type checking
interface DeleteNameRequest {
  id: number | string;
}

// Define response interface for type checking
interface DeleteNameResponse {
  success: boolean;
  message: string;
}

export const DELETE: APIRoute = async ({ request }) => {
  try {
    // Initialize the database if not already done
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    // Parse the request body to get the ID with type checking
    const data = await request.json() as DeleteNameRequest;
    const id = data.id;

    // Validate the ID with strong type checking
    if (id === undefined || id === null || (typeof id !== 'number' && (typeof id !== 'string' || isNaN(Number(id))))) {
      const response: DeleteNameResponse = {
        success: false,
        message: 'Valid ID is required'
      };
      
      return new Response(
        JSON.stringify(response),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Convert ID to number for consistency
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    // Delete the name from the database with proper typing
    const result = await executeQuery<UserQueryResult>(
      'DELETE FROM users WHERE ID = ?',
      [numericId]
    );

    // Check if any rows were affected
    if (!result.rowsAffected || result.rowsAffected === 0) {
      const notFoundResponse: DeleteNameResponse = {
        success: false,
        message: 'No record found with the specified ID'
      };
      
      return new Response(
        JSON.stringify(notFoundResponse),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Return success response
    const successResponse: DeleteNameResponse = {
      success: true,
      message: 'Name deleted successfully'
    };
    
    return new Response(
      JSON.stringify(successResponse),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error deleting name:', error);
    
    // Return error response with proper typing
    const errorResponse: DeleteNameResponse = {
      success: false,
      message: 'An error occurred while deleting the name'
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

