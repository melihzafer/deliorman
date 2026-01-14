import { google } from 'googleapis';
import { OrderData } from './payment/types';

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  credentials: {
    client_email: string;
    private_key: string;
  };
}

export class GoogleSheetsService {
  private sheets;
  private spreadsheetId: string;

  constructor(config: GoogleSheetsConfig) {
    const auth = new google.auth.GoogleAuth({
      credentials: config.credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = config.spreadsheetId;
  }

  /**
   * Append a new order row to the Google Sheet
   * Auto-initializes the sheet if it doesn't exist
   */
  async appendOrder(order: OrderData, paymentMethod: 'cash' | 'card'): Promise<void> {
    console.log(`📝 Attempting to save order ${order.orderId} to Google Sheets...`);

    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleString('bg-BG', {
      timeZone: 'Europe/Sofia',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Format items as a readable string
    const itemsSummary = order.items
      .map(item => `${item.quantity}x ${item.name} (${item.price} лв.)`)
      .join(', ');

    const totalAmount = (order.amount / 100).toFixed(2); // Convert from stotinki to leva

    // Prepare row data matching the sheet columns
    const row = [
      timestamp,                          // A: Timestamp (ISO)
      formattedDate,                      // B: Date (Formatted)
      order.orderId,                      // C: Order ID
      order.customer.name,                // D: Customer Name
      order.customer.phone,               // E: Phone
      order.customer.address,             // F: Address
      order.customer.email || '',         // G: Email
      itemsSummary,                       // H: Items
      totalAmount,                        // I: Total Amount (BGN)
      paymentMethod.toUpperCase(),        // J: Payment Method
      paymentMethod === 'card' ? 'PAID' : 'PENDING', // K: Payment Status
      order.notes || '',                  // L: Notes
    ];

    console.log(`📊 Row data prepared:`, {
      orderId: order.orderId,
      customer: order.customer.name,
      total: totalAmount,
      paymentMethod: paymentMethod.toUpperCase(),
    });

    try {
      console.log(`🚀 Sending data to Google Sheets (Spreadsheet: ${this.spreadsheetId})...`);

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Orders!A:L', // Append to "Orders" sheet
        valueInputOption: 'RAW',
        requestBody: {
          values: [row],
        },
      });

      console.log(`✅ Order ${order.orderId} saved to Google Sheets successfully!`);
      console.log(`   Updated range: ${response.data.updates?.updatedRange}`);
      console.log(`   Updated rows: ${response.data.updates?.updatedRows}`);
    } catch (error: any) {
      // If the error is "Unable to parse range", it means the sheet doesn't exist
      if (error?.message?.includes('Unable to parse range')) {
        console.log(`⚠️  "Orders" sheet doesn't exist. Creating it now...`);

        try {
          await this.ensureSheetExists();
          console.log(`✅ "Orders" sheet created. Retrying save...`);

          // Retry the append after creating the sheet
          const retryResponse = await this.sheets.spreadsheets.values.append({
            spreadsheetId: this.spreadsheetId,
            range: 'Orders!A:L',
            valueInputOption: 'RAW',
            requestBody: {
              values: [row],
            },
          });

          console.log(`✅ Order ${order.orderId} saved to Google Sheets successfully!`);
          console.log(`   Updated range: ${retryResponse.data.updates?.updatedRange}`);
          console.log(`   Updated rows: ${retryResponse.data.updates?.updatedRows}`);
        } catch (retryError) {
          console.error(`❌ Failed to create sheet and save order:`, retryError);
          throw retryError;
        }
      } else {
        // Different error, log it
        console.error(`❌ Failed to save order ${order.orderId} to Google Sheets:`, error);
        if (error instanceof Error) {
          console.error('   Error name:', error.name);
          console.error('   Error message:', error.message);
          if ('code' in error) {
            console.error('   Error code:', error.code);
          }
          if ('errors' in error) {
            console.error('   Error details:', error.errors);
          }
        }
        // Don't throw - we don't want to fail the order if sheets fails
      }
    }
  }

  /**
   * Ensure the "Orders" sheet exists, create it if it doesn't
   */
  private async ensureSheetExists(): Promise<void> {
    try {
      // First, try to get the spreadsheet metadata to see what sheets exist
      const spreadsheet = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const sheets = spreadsheet.data.sheets || [];
      const ordersSheet = sheets.find(sheet => sheet.properties?.title === 'Orders');

      if (ordersSheet) {
        console.log(`✅ "Orders" sheet already exists`);
        // Initialize headers if needed
        await this.initializeSheet();
        return;
      }

      // Sheet doesn't exist, create it
      console.log(`🔧 Creating "Orders" sheet...`);

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: 'Orders',
                  gridProperties: {
                    rowCount: 1000,
                    columnCount: 12,
                    frozenRowCount: 1, // Freeze header row
                  },
                },
              },
            },
          ],
        },
      });

      console.log(`✅ "Orders" sheet created successfully`);

      // Add headers to the new sheet
      await this.initializeSheet();
    } catch (error) {
      console.error(`❌ Failed to ensure "Orders" sheet exists:`, error);
      throw error;
    }
  }

  /**
   * Initialize the spreadsheet with headers if it doesn't exist
   */
  async initializeSheet(): Promise<void> {
    try {
      const headers = [
        'Timestamp (ISO)',
        'Date (Formatted)',
        'Order ID',
        'Customer Name',
        'Phone',
        'Address',
        'Email',
        'Items',
        'Total (BGN)',
        'Payment Method',
        'Payment Status',
        'Notes',
      ];

      // Check if the sheet exists and has headers
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Orders!A1:L1',
      });

      if (!response.data.values || response.data.values.length === 0) {
        // Sheet is empty, add headers
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: 'Orders!A1:L1',
          valueInputOption: 'RAW',
          requestBody: {
            values: [headers],
          },
        });

        console.log('✅ Google Sheets headers initialized');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets:', error);
    }
  }
}

/**
 * Get the singleton Google Sheets service instance
 */
export function getGoogleSheetsService(): GoogleSheetsService | null {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  // Debug logging
  console.log('🔍 Google Sheets Environment Check:');
  console.log('  - SPREADSHEET_ID:', spreadsheetId ? '✅ Set' : '❌ Missing');
  console.log('  - CLIENT_EMAIL:', clientEmail ? '✅ Set' : '❌ Missing');
  console.log('  - PRIVATE_KEY:', privateKey ? '✅ Set' : '❌ Missing');

  // If any config is missing, return null (service disabled)
  if (!spreadsheetId || !clientEmail || !privateKey) {
    console.warn('⚠️  Google Sheets integration disabled - missing environment variables');
    if (!spreadsheetId) console.warn('  Missing: GOOGLE_SHEETS_SPREADSHEET_ID');
    if (!clientEmail) console.warn('  Missing: GOOGLE_SHEETS_CLIENT_EMAIL');
    if (!privateKey) console.warn('  Missing: GOOGLE_SHEETS_PRIVATE_KEY');
    return null;
  }

  try {
    console.log('🔧 Initializing Google Sheets service...');
    const service = new GoogleSheetsService({
      spreadsheetId,
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'), // Fix escaped newlines
      },
    });
    console.log('✅ Google Sheets service initialized successfully');
    return service;
  } catch (error) {
    console.error('❌ Failed to initialize Google Sheets service:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
      console.error('   Error stack:', error.stack);
    }
    return null;
  }
}
