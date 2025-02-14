import { google, sheets_v4 } from "googleapis";
import { cache } from 'react';

// Cached function with hourly revalidation
export const fetchGoogleSheetsData = cache(async () => {
  try {
    // Fetch and decode credentials from environment variables
    const credentialsBase64 = process.env.GOOGLE_CREDENTIALS_BASE64;
    const spreadsheetId = process.env.SPREADSHEETID;
    
    if (!credentialsBase64) {
      throw new Error("GOOGLE_CREDENTIALS_BASE64 is not defined in the environment variables.");
    }

    const credentials = JSON.parse(
      Buffer.from(credentialsBase64, "base64").toString("utf8")
    );

    // Authenticate using the credentials
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    // Get the auth client
    const authClient = (await auth.getClient()) as unknown as sheets_v4.Params$Resource$Spreadsheets$Values$Get["auth"];

    // Initialize the Sheets API
    const sheets: sheets_v4.Sheets = google.sheets({
      version: "v4",
      auth: authClient,
    });

    // Your spreadsheet ID
    const range = "Hoja 1!A1:E10"; // The range you want to fetch

    // Fetch data from the spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.data.values || [];
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    throw error;
  }
});

export async function GET() {
  try {
    // Fetch data with built-in caching
    const data = await fetchGoogleSheetsData();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Cache-Control header for hourly revalidation
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=59",
        // Add a custom tag for programmatic revalidation
        'X-Vercel-Cache-Tags': 'google-sheets-data'
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}

// Optional: Explicit revalidation function
export async function revalidateGoogleSheetsCache() {
  // This can be used to manually trigger a cache refresh
  await fetchGoogleSheetsData();
}