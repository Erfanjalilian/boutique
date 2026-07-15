const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword, verifyPassword } = require('./password');

test('hashes and verifies a password', async () => {
  const password = 'MySecret123!';
  const hash = await hashPassword(password);

  assert.ok(hash);
  assert.notEqual(hash, password);
  assert.equal(await verifyPassword(password, hash), true);
  assert.equal(await verifyPassword('wrong-password', hash), false);
});
