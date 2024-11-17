import {GoogleSpreadsheet} from 'google-spreadsheet';
import {Keys} from '../configs/Keys.ts';
import config from '../configs/config.json';
import {getSheetRows, minifyJSON, toBoolean} from '../functions/commons.js';
import {Location} from '../configs/types.js';


export async function makeLocations(spreadsheet: GoogleSpreadsheet): Promise<Location[]> {

	const locations: Location[] = []; //Итоговый объект с локациями
	await (getSheetRows(spreadsheet, config.sheetsIDs.locations).then(rows => {
		rows.forEach(row => {
			// По каждой строке таблицы получаем его поля по ключу (заголовку столбца) и сохраняем в объект с локациями
			const location: Location = {
				id: row.get(Keys.id),
				title: row.get(Keys.title),
				short: row.get(Keys.short),
				available: toBoolean(row.get(Keys.available)),
				address: row.get(Keys.locations.address),
			};
			if(location.available) {
				location.corpuses = [];
				if(row.get(Keys.locations.crossings) !== '') {
					location.crossings = JSON.parse(minifyJSON(row.get(Keys.locations.crossings)))
				}
			}
			locations.push(location);
		});

		console.log('Локации (кампусы) заполнены\n');
	}));
	return locations;
}
