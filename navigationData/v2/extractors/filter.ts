import {GoogleSpreadsheetRow} from 'google-spreadsheet';
import {Keys} from '../../configs/Keys.ts';

export const filterRow = (spreadsheetRow: GoogleSpreadsheetRow<Record<string, any>>) => spreadsheetRow.get(Keys.id) !== "";