import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearStoredAuthToken,
  extractAuthToken,
  getStoredAuthToken,
  storeAuthToken,
} from './session';

describe('local authentication session baseline', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with no token and can save and remove a token', () => {
    expect(getStoredAuthToken()).toBeNull();

    storeAuthToken('synthetic-local-token');
    expect(getStoredAuthToken()).toBe('synthetic-local-token');

    clearStoredAuthToken();
    expect(getStoredAuthToken()).toBeNull();
  });

  it('extracts a token from the current snake_case API response', () => {
    expect(extractAuthToken({ access_token: 'example-token' })).toBe('example-token');
  });

  it('extracts a token from nested API responses', () => {
    expect(extractAuthToken({ data: { result: { accessToken: 'nested-token' } } }))
      .toBe('nested-token');
  });

  it('returns null rather than throwing on missing or malformed payloads', () => {
    expect(extractAuthToken(null)).toBeNull();
    expect(extractAuthToken('not-an-object')).toBeNull();
    expect(extractAuthToken({ success: false })).toBeNull();
  });
});
