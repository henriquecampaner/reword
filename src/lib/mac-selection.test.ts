import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatSelectionError, MAC_MODIFIER_MASK } from './mac-selection.ts';

describe('formatSelectionError', () => {
  it('explains a timed-out System Events copy', () => {
    assert.match(
      formatSelectionError({ code: 'ETIMEDOUT', stderr: '' }),
      /System Events/
    );
  });

  it('uses stderr when osascript returns a real error', () => {
    assert.equal(
      formatSelectionError({ stderr: '0:1: execution error: Boom (-2700)\n' }),
      '0:1: execution error: Boom (-2700)'
    );
  });
});

describe('MAC_MODIFIER_MASK', () => {
  it('includes shift and command bits', () => {
    assert.equal(MAC_MODIFIER_MASK & (1 << 17), 1 << 17);
    assert.equal(MAC_MODIFIER_MASK & (1 << 20), 1 << 20);
  });
});
