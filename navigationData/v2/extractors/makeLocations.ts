import {GoogleSpreadsheet} from 'google-spreadsheet';
import {Keys} from '../../configs/Keys.ts';
import config from '../../configs/config.json';
import {getSheetRows, minifyJSON, toBoolean} from '../../functions/commons.js';
import {filterRow} from './filter.ts';
import {Location} from '../types.js';


export async function makeLocations(spreadsheet: GoogleSpreadsheet): Promise<Location[]> {
    const rows = await getSheetRows(spreadsheet, config.sheetsIDs.locations);
	const locations = rows.filter(filterRow).map(row => {
        // По каждой строке таблицы получаем его поля по ключу (заголовку столбца) и сохраняем в объект с локациями
        const location: Location = {
            id: row.get(Keys.id),
            title: row.get(Keys.title),
            short: row.get(Keys.short),
            available: toBoolean(row.get(Keys.available)),
            address: row.get(Keys.locations.address),
        };
        if(location.available) {
            if(row.get(Keys.locations.crossings) !== '') {
                location.crossings = JSON.parse(minifyJSON(row.get(Keys.locations.crossings)))
            }
        }
        return location
    });
    console.log('Локации (кампусы) заполнены\n');
	return locations;
}
