/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FeedbackEntry, SpreadsheetConfig } from '../types';

/**
 * Searches the user's Google Drive for existing spreadsheets containing "Feedback" in the name.
 */
export async function findFeedbackSpreadsheets(accessToken: string): Promise<Array<{ id: string; name: string }>> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and name contains 'Feedback' and trashed = false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to search Google Drive:', errorText);
    return [];
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Creates a brand-new Google Spreadsheet with standard headers for Feedback Collection.
 */
export async function createFeedbackSpreadsheet(accessToken: string, customTitle?: string): Promise<SpreadsheetConfig> {
  const title = customTitle || 'Gemini Sheet Feedback Database';
  const createUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  
  // 1. Create Spreadsheet
  const createRes = await fetch(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: title,
      },
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Failed to create Google Spreadsheet: ${errText}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
  
  // Get the default sheet title (usually Sheet1 or equivalent in user's locale)
  const defaultSheetName = sheetData.sheets?.[0]?.properties?.title || 'Sheet1';

  // 2. Write Headings Row as the first action
  const headings = [
    'Timestamp',
    'User Name',
    'User Email',
    'Rating',
    'Feedback Type',
    'Message',
    'Platform',
    'Recommend'
  ];

  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${defaultSheetName}!A1:H1?valueInputOption=USER_ENTERED`;

  const writeHeadingsRes = await fetch(updateUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [headings],
    }),
  });

  if (!writeHeadingsRes.ok) {
    const errText = await writeHeadingsRes.text();
    throw new Error(`Failed to initialize headers in the spreadsheet: ${errText}`);
  }

  // 3. Optional: apply some basic typography styling (bold header row) using batchUpdate
  const batchUpdateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
  try {
    await fetch(batchUpdateUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: sheetData.sheets?.[0]?.properties?.sheetId || 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 8
              },
              cell: {
                userEnteredFormat: {
                  textFormat: {
                    bold: true,
                    fontSize: 11
                  },
                  backgroundColor: {
                    red: 0.95,
                    green: 0.95,
                    blue: 1.0
                  }
                }
              },
              fields: 'userEnteredFormat(textFormat,backgroundColor)'
            }
          }
        ]
      })
    });
  } catch (styleErr) {
    // Non-blocking, continue if styling batch update fails
    console.warn('Styling spreadsheet header row failed (non-blocking):', styleErr);
  }

  return {
    spreadsheetId,
    spreadsheetUrl,
    title,
    sheetName: defaultSheetName,
  };
}

/**
 * Appends a new feedback row into the Google Sheet.
 */
export async function appendFeedbackEntry(
  accessToken: string,
  spreadsheetId: string,
  entry: FeedbackEntry,
  sheetName: string = 'Sheet1'
): Promise<void> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A:H:append?valueInputOption=USER_ENTERED`;
  
  const rowValues = [
    entry.timestamp,
    entry.name,
    entry.email,
    entry.rating,
    entry.type,
    entry.message,
    entry.platform,
    entry.wouldRecommend
  ];

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [rowValues],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to append feedback row: ${errText}`);
  }
}

/**
 * Fetches all feedback rows from the Google Sheet, skipping the first row (headers).
 */
export async function fetchFeedbackEntries(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string = 'Sheet1'
): Promise<FeedbackEntry[]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A2:H1000`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to read spreadsheet entries: ${errText}`);
  }

  const data = await res.json();
  const rows: string[][] = data.values || [];
  
  return rows.map((row): FeedbackEntry => {
    return {
      timestamp: row[0] || '',
      name: row[1] || 'Anonymous',
      email: row[2] || '',
      rating: parseInt(row[3]) || 5,
      type: (row[4] as any) || 'Other',
      message: row[5] || '',
      platform: (row[6] as any) || 'Other',
      wouldRecommend: (row[7] as any) || 'Maybe'
    };
  });
}
