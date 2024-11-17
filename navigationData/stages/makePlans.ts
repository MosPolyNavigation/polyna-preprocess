import {GoogleSpreadsheet} from 'google-spreadsheet';
import {Keys} from '../configs/Keys.ts';
import config from '../configs/config.json';
import {getCorpusByID, getSheetRows, minifyJSON, toBoolean} from '../functions/commons.js';
import {Location, Plan} from '../configs/types.js';

export async function makePlans(spreadsheet: GoogleSpreadsheet, locations: Location[]): Promise<void> {
	await (getSheetRows(spreadsheet, config.sheetsIDs.plans)
		.then(rows => {
			rows.forEach(row => {
				const corpus = getCorpusByID(row.get(Keys.plans.corpus), locations);

				if(corpus && corpus.available) {

					const plan: Plan = {
						id: row.get(Keys.id),
						floor: row.get(Keys.plans.floor),
						available: toBoolean(row.get(Keys.available)),
						wayToSvg: row.get(Keys.plans.wayToSvg),
						graph: JSON.parse(minifyJSON(row.get(Keys.plans.graph))),
						entrances: JSON.parse(minifyJSON(row.get(Keys.plans.entrances))),
					};
					// if(plan.available) {
					// 	plan.rooms = []
					// }
					corpus.plans.push(plan); // Добавляем план в корпус

				}
			});
			console.log('Планы (этажи) заполнены\n');
		}));
}

