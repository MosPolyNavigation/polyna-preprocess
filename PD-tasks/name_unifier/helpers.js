import {transliterate} from 'transliteration';

const AV_REG = /ав(?<cor>\d)(?<num>\d{3})\/?(?<sub>[а-я]|\d)?/i;
const PR_REG = /пр[ ]?(?:.*[(])?(?<cor>\d)(?<num>\d{3})[ ]?(?<sub>[а-я]{1}(?![а-я]{3}))?/i;
const M_REG = /м((?<cor>\d)(?<num>\d{3}))?\s?(?<sub>[а-я]{1,6})?/i;
const PK_REG = /пк(?<num>\d{3})[( ]?(?<sub>[а-я])?/i;
const BS_REG = /(?<cor>а|б|в|нд|н)-?(?<num>\d{1,3})?(?<sub>[а-я]{1,3})?/i;

export const av = (aud) => {
    let groups = aud.match(AV_REG).groups;
    let nums = `-${groups.cor}-${groups.num}`;
    let sub = groups.sub !== undefined ? `-${transliterate(groups.sub)}` : "";
    return `av${nums+sub}`;
};

export const pr = (aud) => {
    let groups = aud.match(PR_REG).groups;
    let nums = `-${groups.cor}-${groups.num}`;
    let sub = groups.sub !== undefined ? `-${transliterate(groups.sub)}` : "";
    return `pr${nums+sub}`;
};

export const m = (aud) => {
    let groups = aud.match(M_REG).groups;
    let nums = groups.cor !== undefined && groups.num !== undefined ? `-${groups.cor}-${groups.num}` : "";
    let sub = groups.sub !== undefined ? `-${transliterate(groups.sub)}` : "";
    return `m${nums+sub}`;
};

export const pk = (aud) => {
    let groups = aud.match(PK_REG).groups;
    let nums = `-${groups.num}`;
    let sub = groups.sub !== undefined ? `-${transliterate(groups.sub)}` : "";
    return `pk${nums+sub}`;
};

export const bs = (aud) => {
    let groups = aud.match(BS_REG).groups;
    let cor = transliterate(groups.cor);
    let nums = groups.num !== undefined ? `-${groups.num}` : "";
    let sub = groups.sub !== undefined ? `-${transliterate(groups.sub)}` : "";
    return `${cor+nums+sub}`;
};

export default { av, pr, m, pk, bs };
