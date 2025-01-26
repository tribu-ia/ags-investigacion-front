import { google, sheets_v4 } from "googleapis";

export async function GET() {
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
      credentials, // Pass credentials directly
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

    return new Response(JSON.stringify(response.data.values || []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}
