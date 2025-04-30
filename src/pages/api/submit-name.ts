import type { APIRoute } from 'astro';
import { initDb, executeQuery } from '../../db/client.mjs';
import type { UserQueryResult } from '../../types/database.js';

// Initialize the database when the endpoint is first accessed
let dbInitialized = false;

// Define interface for request body
interface SubmitNameRequest {
  name: string;
}

// Define interface for response data
interface SubmitNameResponse {
  success: boolean;
  message: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Initialize the database if not already done
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    // Parse the JSON data from request body with type checking
    const data = await request.json() as SubmitNameRequest;
    const name = data.name;

    // Validate the name
    if (!name || typeof name !== 'string' || name.trim() === '') {
      const response: SubmitNameResponse = {
        success: false,
        message: 'Name is required'
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

    // Store the name in the database with proper typing
    await executeQuery<UserQueryResult>(
      'INSERT INTO users (name) VALUES (?)',
      [name.trim()]
    );

    // Return success response
    const response: SubmitNameResponse = {
      success: true,
      message: 'Name submitted successfully'
    };
    
    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error submitting name:', error);
    
    // Return error response with proper typing
    const errorResponse: SubmitNameResponse = {
      success: false,
      message: 'An error occurred while submitting your name'
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

