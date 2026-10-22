const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Run the repository's pure TypeScript helpers without a second test framework.
const cache = new Map();
function load(file) {
  const absolute = path.resolve(__dirname, '..', file);
  if (cache.has(absolute)) return cache.get(absolute);
  const exports = {};
  cache.set(absolute, exports);
  const compiled = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(compiled, { exports, require: (name) => name.startsWith('@/') ? load(name.slice(2) + '.ts') : require(name) }, { filename: absolute });
  return exports;
}
const state = load('lib/account-state.ts');
const drawStatus = load('lib/draw-status.ts');
const metrics = load('lib/prize-helpers.ts');
const { formatCurrency } = load('lib/utils.ts');

test('missing and invalid balances never become a valid zero or NaN display', () => {
  for (const value of [undefined, null, '', '  ', 'wrong', Infinity, NaN]) assert.equal(state.finiteAmount(value), null);
  assert.equal(state.finiteAmount('0'), 0);
  assert.equal(state.finiteAmount('2970.25'), 2970.25);
  assert.equal(formatCurrency('bad'), 'Unavailable');
});
test('legacy win/bet aliases and explicit direction display correct money movement', () => {
  assert.equal(state.normalizeTransactionType('Win'), 'winnings');
  assert.equal(state.normalizeTransactionType('bet'), 'stake');
  assert.equal(state.transactionSign({type:'win'}), '+');
  assert.equal(state.transactionSign({type:'bet'}), '−');
  assert.equal(state.transactionSign({type:'unknown'}), '');
  assert.equal(state.transactionSign({type:'unknown',direction:'credit'}), '+');
});
test('ticket allocations are never invented and malformed records are excluded', () => {
  for (const payload of [undefined, {}, {ticketNumbers:null}, {ticketNumbers:'123'}]) assert.equal(state.ticketNumbersFromResponse(payload).length, 0);
  assert.deepEqual(Array.from(state.ticketNumbersFromResponse({ticketNumbers:[12,12,13,-1,'14',NaN,1.5]})), [12,13]);
});
function draw(claimStatus, claimType, shippingStatus) {
  return { product:{status:'completed',claimStatus,claimType,claimDetails:{shipment:{shippingStatus}}}, userParticipation:{isWinner:true} };
}
test('claimed cash/item, shipping, delivery, and receipt stay distinct', () => {
  assert.equal(drawStatus.getDrawStatus(draw('claimed_cash','cash')), 'claimed');
  assert.equal(drawStatus.getDrawStatus(draw('claimed_item','physical')), 'delivery_pending');
  assert.equal(drawStatus.getDrawStatus(draw('claimed_item','physical','shipped')), 'shipped');
  assert.equal(drawStatus.getDrawStatus(draw('claimed_item','physical','delivered')), 'delivered');
  assert.equal(drawStatus.getDrawStatus(draw('claimed_item','physical','received')), 'received');
  assert.equal(drawStatus.canClaimDraw(draw('claimed_cash','cash')), false);
  assert.equal(drawStatus.canClaimDraw(draw('unclaimed','physical')), true);
});
test('public slot counts override internal target arithmetic and empty progress stays zero', () => {
  const calculated = metrics.calculatePollMetrics({targetAmount:99999,ticketPrice:30,totalSlots:200,slotsLeft:199});
  assert.equal(calculated.totalSlots,200);
  assert.equal(calculated.filledSlots,1);
  assert.equal(calculated.progressPercent,0.5);
  assert.equal(metrics.calculatePollMetrics({totalSlots:200,slotsLeft:200}).progressPercent,0);
});

test('return navigation only accepts known account routes', () => {
  assert.equal(state.safeAccountReturnPath('/my-entries'), '/my-entries');
  assert.equal(state.safeAccountReturnPath('/polls/real-uuid'), '/polls/real-uuid');
  for (const path of ['https://example.com','//example.com','/admin/products','/polls/id?next=https://example.com',null]) assert.equal(state.safeAccountReturnPath(path), null);
});

test('malformed product amounts never generate NaN availability', () => {
  const calculated = metrics.calculatePollMetrics({targetAmount:'bad', ticketPrice:'bad', raisedAmount:'bad'});
  assert.equal(calculated.totalSlots, 0);
  assert.equal(calculated.remainingSlots, 0);
  assert.equal(calculated.progressPercent, 0);
});

const routes = load('constants/routes.ts');
test('route matching respects centralized templates and path boundaries', () => {
  assert.equal(routes.matchesAppRoute('/draws/item-1', routes.APP_ROUTES.DRAW_DETAIL), true);
  for (const path of ['/draws', '/draws/', '/draws/a/b', '/draws/a?query=1']) assert.equal(routes.matchesAppRoute(path, routes.APP_ROUTES.DRAW_DETAIL), false);
  assert.equal(routes.isRouteWithin('/admin/products', routes.APP_ROUTES.ADMIN_ROOT), true);
  assert.equal(routes.isRouteWithin('/administrator', routes.APP_ROUTES.ADMIN_ROOT), false);
  assert.equal(routes.isRouteWithin('/auth/login', routes.APP_ROUTES.AUTH_ROOT), true);
});

const presentation = load('lib/transaction-presentation.ts');
test('both transaction views share labels, direction, status and invalid-amount handling', () => {
  assert.equal(presentation.transactionLabel('bet'), 'Draw Entry');
  assert.equal(presentation.transactionLabel('win'), 'Prize Winnings');
  assert.equal(presentation.transactionAmount({type:'win',amount:'2500'}), '+$2,500.00');
  assert.equal(presentation.transactionAmount({type:'bet',amount:'30'}), '−$30.00');
  assert.equal(presentation.transactionAmount({type:'deposit',amount:''}), 'Unavailable');
  assert.equal(presentation.transactionStatus('pending').label, 'Pending');
});
