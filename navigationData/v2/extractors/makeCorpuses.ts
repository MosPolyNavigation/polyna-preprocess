import {GoogleSpreadsheet} from 'google-spreadsheet';
import {Keys} from '../../configs/Keys.ts';
import config from '../../configs/config.json';
import {getSheetRows, minifyJSON, toBoolean} from '../../functions/commons.js';
import {Corpus} from '../types.js';

export async function makeCorpuses(spreadsheet: GoogleSpreadsheet): Promise<Corpus[]> {
    const rows = await getSheetRows(spreadsheet, config.sheetsIDs.corpuses);
    const corpuses = rows.map(row => {
        const corpus: Corpus = {
            id: row.get(Keys.id),
            title: row.get(Keys.title),
            available: toBoolean(row.get(Keys.available)),
            locationId: row.get(Keys.corpuses.location)
        };
        if (corpus.available && row.get(Keys.corpuses.stairs)) {
            corpus.stairs = JSON.parse(minifyJSON(row.get(Keys.corpuses.stairs)));
        }
        return corpus
    });
    console.log('Корпуса заполнены\n');
    return corpuses;
}
