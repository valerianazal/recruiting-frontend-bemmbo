import type { Invoice } from "@/types";

interface ApiError {
  message: string;
  status: number;
}

/**
 * Fetches invoices from the API
 * @param token - Authentication token
 * @returns Promise with invoices array or error
 */
export async function getInvoices(
  token: string,
): Promise<Invoice[] | ApiError> {
  try {
    console.log('token', token);
    const response = await fetch(`https://recruiting.data.bemmbo.com/invoices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Invoice[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    
    if (error instanceof Error) {
      return {
        message: error.message,
        status: 500,
      };
    }

    return {
      message: 'An unknown error occurred',
      status: 500,
    };
  }
}