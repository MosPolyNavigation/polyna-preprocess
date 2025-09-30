#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_INDEX_URL = 'https://rasp.dmami.ru/';
const GROUP_API = (g) =>
  `https://rasp.dmami.ru/site/group?group=${encodeURIComponent(g)}&session=0`;
const DEFAULT_DELAY_MS = Number(process.env.DELAY_MS || 100);
const USER_AGENT =
  'Mozilla/5.0 (compatible; schedule-extractor/1.2; +https://github.com/sidecuter/polyna-preprocess)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function extractWrapperSource(html) {
  const assignRe = /\b(?:var|let|const)\s+globalListGroups\s*=\s*/;
  const m = assignRe.exec(html);
  if (!m) throw new Error('Не удалось найти присваивание globalListGroups в HTML.');
  let i = m.index + m[0].length;
  while (i < html.length && html[i] !== '{') i++;
  if (i >= html.length) throw new Error('Не найден открывающий "{" для объекта-обёртки.');
  let depth = 0;
  let inStr = false;
  let strQuote = '';
  let escaped = false;
  const start = i;
  for (; i < html.length; i++) {
    const ch = html[i];
    if (inStr) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === strQuote) {
        inStr = false;
        strQuote = '';
      }
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inStr = true;
      strQuote = ch;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        const candidate = html.slice(start, i + 1);
        const tail = html.slice(i + 1, i + 1 + 200);
        const groupsCall = /\.groups\s*;/.exec(tail) || /\.groups\s*[,)]/.exec(tail);
        if (!groupsCall) throw new Error('После объекта не обнаружено ".groups".');
        return candidate;
      }
    }
  }
  throw new Error('Не удалось сбалансировать фигурные скобки объекта-обёртки.');
}

function parseWrapperToObject(wrapperSource) {
  try {
    return JSON.parse(wrapperSource);
  } catch {
    try {
      const src = wrapperSource.trim().replace(/;+\s*$/, '');
      const fn = new Function(`"use strict"; return (${src});`);
      const obj = fn();
      if (!obj || typeof obj !== 'object') throw new Error('Объект-обёртка не является объектом.');
      return obj;
    } catch (e) {
      throw new Error('Не удалось интерпретировать объект-обёртку как JS-литерал: ' + e.message);
    }
  }
}

export async function fetchGroupsMapFromIndex(indexUrl = DEFAULT_INDEX_URL) {
  const res = await fetch(indexUrl, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml' },
  });
  if (!res.ok) throw new Error(`Не удалось получить index.html: ${res.status} ${res.statusText}`);
  const html = await res.text();
  const wrapperSource = extractWrapperSource(html);
  const wrapper = parseWrapperToObject(wrapperSource);
  if (!wrapper || typeof wrapper !== 'object' || !wrapper.groups || typeof wrapper.groups !== 'object') {
    throw new Error('Неверная структура: отсутствует поле .groups в обёртке.');
  }
  return {
    meta: {
      date: wrapper.date ?? null,
      time: wrapper.time ?? null,
      v: wrapper.v ?? null,
      copyright: wrapper.copyright ?? null,
    },
    groups: wrapper.groups,
  };
}

export async function fetchGroupSchedule(groupCode) {
  const url = GROUP_API(groupCode);
  const referer = `https://rasp.dmami.ru/?${encodeURIComponent(groupCode)}`;
  const commonHeaders = {
    'User-Agent': USER_AGENT,
    Accept: 'application/json,text/html;q=0.9,*/*;q=0.8',
    Referer: referer,
  };
  let res;
  try {
    res = await fetch(url, { headers: commonHeaders, redirect: 'manual' });
  } catch (e) {
    console.warn(`[WARN] ${groupCode}: сеть/запрос упал (${e.message}) -> {}`);
    return {};
  }
  let ctype = (res.headers.get('content-type') || '').toLowerCase();
  if (ctype.includes('application/json')) {
    try {
      return await res.json();
    } catch {}
  }
  let text;
  try {
    text = await res.text();
  } catch {
    console.warn(`[WARN] ${groupCode}: не удалось прочитать тело ответа -> {}`);
    return {};
  }
  const m =
    text.match(/document\.cookie\s*=\s*["']([^=;]+)=([^"';]+)[^"']*["']/i) ||
    text.match(/document\.cookie\s*=\s*([^=;]+)=([^;]+);/i);
  if (m) {
    const cookie = `${m[1]}=${m[2]}`;
    try {
      const res2 = await fetch(url, {
        headers: { ...commonHeaders, Cookie: cookie },
        redirect: 'manual',
      });
      const ctype2 = (res2.headers.get('content-type') || '').toLowerCase();
      if (ctype2.includes('application/json')) {
        return await res2.json();
      } else {
        const t2 = await res2.text();
        try {
          return JSON.parse(t2);
        } catch {}
      }
    } catch (e) {
      console.warn(`[WARN] ${groupCode}: повторный запрос с cookie упал (${e.message}) -> {}`);
      return {};
    }
  }
  try {
    return JSON.parse(text);
  } catch {
    console.warn(`[WARN] ${groupCode}: JSON не получен -> {}`);
    return {};
  }
}

export async function buildScheduleMap({ indexUrl = DEFAULT_INDEX_URL, delayMs = DEFAULT_DELAY_MS } = {}) {
  const { groups } = await fetchGroupsMapFromIndex(indexUrl);
  const entries = Object.entries(groups);
  const result = {};
  for (const [groupCode, flag] of entries) {
    if (flag === true) {
      const data = await fetchGroupSchedule(groupCode);
      result[groupCode] = data && typeof data === 'object' ? data : {};
      await sleep(delayMs);
    } else if (flag === false) {
      result[groupCode] = {};
    } else if (flag && typeof flag === 'object') {
      result[groupCode] = flag;
    } else {
      result[groupCode] = {};
    }
  }
  return result;
}

export async function getFullScheduleObject(options = {}) {
  return await buildScheduleMap(options);
}

export const _internal = {
  extractWrapperSource,
  fetchGroupsMapFromIndex,
  fetchGroupSchedule,
  buildScheduleMap,
};

export default {
  getFullScheduleObject,
  _internal,
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isMain) {
  (async () => {
    const args = process.argv.slice(2);
    const outIdx = args.indexOf('--out');
    const delayIdx = args.indexOf('--delay');
    const outPath = outIdx !== -1 && args[outIdx + 1] ? args[outIdx + 1] : null;
    const delayMs =
      delayIdx !== -1 && args[delayIdx + 1] ? Number(args[delayIdx + 1]) : DEFAULT_DELAY_MS;
    const data = await getFullScheduleObject({ delayMs });
    if (outPath) {
      const abs = path.resolve(process.cwd(), outPath);
      fs.writeFileSync(abs, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`Saved to ${abs}`);
    } else {
      process.stdout.write(JSON.stringify(data, null, 2));
    }
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
