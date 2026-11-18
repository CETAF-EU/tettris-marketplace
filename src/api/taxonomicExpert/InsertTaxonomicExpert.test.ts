import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { storeAuthToken } from '../auth/session';
import InsertTaxonomicExpert from './InsertTaxonomicExpert';

vi.mock('axios', () => ({
  default: { post: vi.fn() },
}));

describe('expert registration client baseline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('includes the stored bearer token when submitting a synthetic expert', async () => {
    storeAuthToken('synthetic-local-token');
    const record = { 'schema:person': { 'schema:name': 'Synthetic Expert' } };
    vi.mocked(axios.post).mockResolvedValue({
      data: { taxonomic_expert: { taxonomicExpert: record } },
    });

    await InsertTaxonomicExpert({ taxonomicExpertRecord: record });

    expect(axios.post).toHaveBeenCalledOnce();
    const [endpoint, body, options] = vi.mocked(axios.post).mock.calls[0];
    expect(endpoint).toContain('/cordra/experts');
    expect(body).toEqual({ taxonomic_expert_record: record });
    expect(options?.headers?.Authorization).toBe('Bearer synthetic-local-token');
  });

  it('does not make an API request when no expert record is provided', async () => {
    const result = await InsertTaxonomicExpert({});
    expect(result).toBeUndefined();
    expect(axios.post).not.toHaveBeenCalled();
  });
});
