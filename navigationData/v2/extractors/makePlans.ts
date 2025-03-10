import {GoogleSpreadsheet} from 'google-spreadsheet';
import {Keys} from '../../configs/Keys.ts';
import config from '../../configs/config.json';
import {getSheetRows, minifyJSON, toBoolean} from '../../functions/commons.js';
import {Plan} from '../types.ts';

export async function makePlans(spreadsheet: GoogleSpreadsheet): Promise<Plan[]> {
    const rows = await getSheetRows(spreadsheet, config.sheetsIDs.plans);
    const plans = rows.map(row => {
        const plan: Plan = {
            id: row.get(Keys.id),
            floor: row.get(Keys.plans.floor),
            available: toBoolean(row.get(Keys.available)),
            wayToSvg: row.get(Keys.plans.wayToSvg),
            graph: JSON.parse(minifyJSON(row.get(Keys.plans.graph))),
            entrances: JSON.parse(minifyJSON(row.get(Keys.plans.entrances))),
            corpusId: row.get(Keys.plans.corpus)
        };
        return plan;
    });
    console.log('Планы (этажи) заполнены\n');
    return plans;
}

