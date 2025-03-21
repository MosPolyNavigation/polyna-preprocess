import {GoogleSpreadsheet} from 'google-spreadsheet';
import {Keys} from '../../configs/Keys.ts';
import config from '../../configs/config.json';
import {getSheetRows, minifyJSON, toBoolean} from '../../functions/commons.js';
import {filterRow} from './filter.ts';
import {Plan} from '../types.ts';

const toUndefIfEmpty = (value: string): string  => {
    return value === "" ? undefined : value
}

export async function makePlans(spreadsheet: GoogleSpreadsheet): Promise<Plan[]> {
    const rows = await getSheetRows(spreadsheet, config.sheetsIDs.plans);
    const plans = rows.filter(filterRow).map(row => {
        const plan: Plan = {
            id: row.get(Keys.id),
            floor: row.get(Keys.plans.floor),
            available: toBoolean(row.get(Keys.available)),
            wayToSvg: row.get(Keys.plans.wayToSvg),
            graph: JSON.parse(minifyJSON(row.get(Keys.plans.graph))),
            entrances: JSON.parse(minifyJSON(row.get(Keys.plans.entrances))),
            corpusId: row.get(Keys.plans.corpus),
            nearest: {
                enter: row.get(Keys.plans.nearest.enter),
                wm: toUndefIfEmpty(row.get(Keys.plans.nearest.wm)),
                ww: toUndefIfEmpty(row.get(Keys.plans.nearest.ww)),
                ws: toUndefIfEmpty(row.get(Keys.plans.nearest.ws)),
            }
        };
        return plan;
    });
    console.log('Планы (этажи) заполнены\n');
    return plans;
}
