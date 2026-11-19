import test from 'node:test';import assert from 'node:assert/strict';
import handler from '../api/reflect.js';
function response(){return {statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v;return this},status(n){this.statusCode=n;return this},json(v){this.value=v;return this}}}
const req={method:'POST',headers:{'content-type':'application/json'},body:{period:'day',entries:[{date:'2026-11-19',morning:{mood:'unsure',note:'No feeling'},evening:null}],accessCode:'private-test-code'}};
test('rejects non-POST',async()=>{const res=response();await handler({...req,method:'GET'},res);assert.equal(res.statusCode,405)});
test('requires env configuration',async()=>{const res=response();await handler(req,res);assert.equal(res.statusCode,503)});
test('rejects invalid access code with env configured',async()=>{process.env.CF_ACCOUNT_ID='test';process.env.CF_API_TOKEN='not-a-real-token';process.env.SED_AI_ACCESS_CODE='private-test-code';const res=response();await handler({...req,body:{...req.body,accessCode:'wrong'}},res);assert.equal(res.statusCode,403);delete process.env.CF_ACCOUNT_ID;delete process.env.CF_API_TOKEN;delete process.env.SED_AI_ACCESS_CODE});
