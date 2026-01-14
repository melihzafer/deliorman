# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets to automatically save all orders from your restaurant.

## 📋 What Gets Saved

Every order (both cash and card payments) will be automatically saved to Google Sheets with the following information:

| Column | Description |
|--------|-------------|
| Timestamp (ISO) | Full timestamp in ISO format |
| Date (Formatted) | Human-readable date/time in Bulgarian format |
| Order ID | Unique order identifier (e.g., ORD-1737123456-ABC123) |
| Customer Name | Full name of the customer |
| Phone | Customer phone number |
| Address | Delivery address |
| Email | Customer email (if provided) |
| Items | Summary of ordered items (e.g., "2x Шопска салата (12.50 лв.), 1x Кебапче (8.00 лв.)") |
| Total (BGN) | Total amount in Bulgarian Leva |
| Payment Method | CASH or CARD |
| Payment Status | PAID (for card) or PENDING (for cash) |
| Notes | Any additional notes from the customer |

## 🚀 Setup Steps

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Deliorman Orders" (or any name you prefer)
4. Rename the first sheet to "Orders" (important!)
5. Copy the Spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`
   - Example: If your URL is `https://docs.google.com/spreadsheets/d/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4/edit`
   - Your Spreadsheet ID is: `1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4`

### Step 2: Create a Google Cloud Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select an existing one):
   - Click "Select a project" → "New Project"
   - Name it "Deliorman Restaurant" → Create

3. Enable the Google Sheets API:
   - In the search bar, type "Google Sheets API"
   - Click "Google Sheets API" → "Enable"

4. Create a Service Account:
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Name: `deliorman-orders`
   - Description: `Service account for saving restaurant orders`
   - Click "Create and Continue"
   - Skip the optional steps (click "Done")

5. Create Service Account Key:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Select "JSON" → "Create"
   - A JSON file will download automatically - **SAVE THIS FILE SECURELY!**

### Step 3: Share the Google Sheet with the Service Account

1. Open the downloaded JSON file
2. Find the `client_email` field (looks like: `deliorman-orders@project-id.iam.gserviceaccount.com`)
3. Copy this email address
4. Go back to your Google Sheet
5. Click "Share" button (top right)
6. Paste the service account email
7. Give it "Editor" permissions
8. Uncheck "Notify people"
9. Click "Share"

### Step 4: Configure Environment Variables

1. Open your `.env` file
2. Update the following variables:

```env
# Google Sheets Integration (Server-side)
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_from_step_1
GOOGLE_SHEETS_CLIENT_EMAIL=service-account-email-from-json-file
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key from JSON file\n-----END PRIVATE KEY-----"
```

**How to fill these in:**

1. **GOOGLE_SHEETS_SPREADSHEET_ID**:
   - Paste the ID you copied in Step 1

2. **GOOGLE_SHEETS_CLIENT_EMAIL**:
   - Open the downloaded JSON file
   - Copy the value of `client_email` field
   - Paste it here (without quotes)

3. **GOOGLE_SHEETS_PRIVATE_KEY**:
   - Open the downloaded JSON file
   - Copy the ENTIRE value of `private_key` field (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
   - Paste it here, keeping it in double quotes
   - **Important**: The key contains `\n` characters - keep them as is!

**Example:**

```env
GOOGLE_SHEETS_SPREADSHEET_ID=1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4
GOOGLE_SHEETS_CLIENT_EMAIL=deliorman-orders@deliorman-restaurant.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### Step 5: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Place a test order through your website

3. Check your Google Sheet - a new row should appear automatically!

## 🔧 Features

### Automatic Headers
The first time an order is saved, the system will automatically create column headers in your sheet. You don't need to add them manually!

### Error Handling
If Google Sheets fails for any reason (network issue, permissions, etc.), the order will still be processed normally via Telegram. The system won't break if Sheets is down.

### Optional Integration
If you don't configure the Google Sheets environment variables, the system will work fine without it. Orders will still be sent via Telegram.

## 📊 Google Sheets Features You Can Add

Once orders are being saved to Google Sheets, you can:

### 1. **Create Charts/Graphs**
- Daily revenue trends
- Most popular items
- Cash vs Card payment distribution

### 2. **Use Formulas**
- Sum total revenue: `=SUM(I:I)`
- Count total orders: `=COUNTA(C:C)-1`
- Average order value: `=AVERAGE(I:I)`

### 3. **Filter and Sort**
- Filter by date range
- Sort by total amount
- Filter by payment status

### 4. **Export Data**
- Download as Excel (File → Download → Microsoft Excel)
- Download as PDF (File → Download → PDF)
- Download as CSV (File → Download → CSV)

### 5. **Share with Team**
- Share the spreadsheet with your staff
- They can view orders in real-time
- Set different permission levels (View only, Editor, etc.)

## 🔒 Security Notes

1. **Never commit the `.env` file to Git** - it contains sensitive credentials
2. **Keep the JSON key file secure** - anyone with this file can access your sheet
3. **Only give Editor access to the service account email** - don't make the sheet public
4. **Use a dedicated Google Cloud project** - don't mix with other projects

## ❓ Troubleshooting

### Orders not appearing in the sheet?

1. **Check the logs** - look for error messages in your terminal
2. **Verify environment variables** - make sure they're set correctly
3. **Check sheet name** - must be exactly "Orders" (case-sensitive)
4. **Verify permissions** - service account email must have Editor access
5. **Check API is enabled** - Google Sheets API must be enabled in Google Cloud Console

### "Missing environment variables" warning?

This is normal if you haven't configured Google Sheets yet. The system will still work via Telegram only.

### Private key format issues?

Make sure:
- The key is wrapped in double quotes
- All `\n` characters are preserved
- The entire key (including BEGIN/END markers) is on one line in the .env file

## 📞 Support

If you need help with setup, check:
- Google Cloud Console: https://console.cloud.google.com
- Google Sheets API Documentation: https://developers.google.com/sheets/api
- Service Account Guide: https://cloud.google.com/iam/docs/service-accounts

---

✅ Once configured, every order will automatically save to Google Sheets!
