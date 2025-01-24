import {GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet} from 'google-spreadsheet';
import {Corpus, Location, Plan} from '../configs/types.js';

export function toBoolean(value: string | boolean): boolean {
	if(typeof value === 'string') {
		return value.toLowerCase() === 'true'
	}
	return value
} //Преобразование гугловского значения в булево

export function minifyJSON(json: string | undefined | null): string | null {
	if(!json) return null
	return json.replaceAll('\n','').replaceAll(' ','')
}

export async function getSheetRows(spreadsheet: GoogleSpreadsheet, sheetID: string): Promise<GoogleSpreadsheetRow[]> {
	const sheet: GoogleSpreadsheetWorksheet = spreadsheet.sheetsById[sheetID];
	return await sheet.getRows();
} //Получить лиси из книги

export function getLocationByID(id: string, locations: Location[]): Location | undefined {
	return locations.find(location => location.id === id)
}

export function getCorpusByID(id: string, locations: Location[]): Corpus | undefined {
	return locations.find(location => location.corpuses?.find(corpus => corpus.id === id))?.corpuses?.find(corpus => corpus.id === id)
}

export function getPlanID(id: string, locations: Location[]): Plan | undefined {
	// return locations.find(location => location.corpuses?.find(corpus => corpus.id === id))?.corpuses?.find(corpus => corpus.id === id)
	const corpuses = locations.map(location => location.corpuses).flat(1).filter(corpus => !!corpus)
	// console.log(corpuses)
	const plans = corpuses.map(corpus => corpus.plans).flat().filter(plan => plan)
	return plans.find(plan => plan.id === id)
}
