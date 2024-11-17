import {GoogleSpreadsheet} from 'google-spreadsheet';
import {Keys} from '../configs/Keys.ts';
import config from '../configs/config.json';
import {getLocationByID, getSheetRows, minifyJSON, toBoolean} from '../functions/commons.js';
import {Corpus, Location} from '../configs/types.js';

export async function makeCorpuses(spreadsheet: GoogleSpreadsheet, locations: Location[]): Promise<void> {
	await (getSheetRows(spreadsheet, config.sheetsIDs.corpuses)
		.then(rows => {
			rows.forEach(row => {
				const location = getLocationByID(row.get(Keys.corpuses.location), locations);

				if(location && location.available) {

					const corpus: Corpus = {
						id: row.get(Keys.id),
						title: row.get(Keys.title),
						available: toBoolean(row.get(Keys.available)),
					};
					if(corpus.available) {
						corpus.plans = [];
						if(row.get(Keys.corpuses.stairs) !== '') {
							corpus.stairs = JSON.parse(minifyJSON(row.get(Keys.corpuses.stairs)))
						}
					}
					location.corpuses.push(corpus); // Пушим корпус в локацию

				}
			});
			console.log('Корпуса заполнены\n');
		}));
}
