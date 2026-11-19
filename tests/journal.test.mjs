import test from 'node:test';import assert from 'node:assert/strict';
import{dateKey,parseDay,periodDates,normalizeBackup,normalizeEntry,getStats}from'../src/js/journal.js';
test('real dates only',()=>{assert.equal(parseDay('2026-02-29'),null);assert.equal(dateKey(parseDay('2024-02-29')),'2024-02-29')});
test('week starts on Monday',()=>{assert.deepEqual(periodDates('week','2026-11-19'),['2026-11-16','2026-11-17','2026-11-18','2026-11-19','2026-11-20','2026-11-21','2026-11-22'])});
test('month can cross years',()=>{assert.equal(periodDates('month','2024-02-15').length,29);assert.equal(periodDates('month','2026-12-15').at(-1),'2026-12-31')});
test('reject oversized and unsupported backup',()=>{assert.throws(()=>normalizeBackup({app:'wrong',version:1,entries:[]}));assert.throws(()=>normalizeBackup({app:'sed-journal',version:1,entries:[{date:'2026-11-19',morning:{mood:'made-up'}}]}))});
test('neutral and unsure do not create false zero scores',()=>{const e=normalizeEntry({date:'2026-11-19',morning:{mood:'unsure',note:'nothing'},evening:{mood:'even'}});assert.deepEqual(getStats([e]),{days:1,checkins:2,average:3})});
test('supports empty but valid backup',()=>{assert.deepEqual(normalizeBackup({app:'sed-journal',version:1,entries:[]}).entries,[])});

test('text-only journal does not fabricate a mood',()=>{const e=normalizeEntry({date:'2026-11-19',morning:{mood:null,note:'Just words'}});assert.deepEqual(getStats([e]),{days:1,checkins:1,average:null})});
