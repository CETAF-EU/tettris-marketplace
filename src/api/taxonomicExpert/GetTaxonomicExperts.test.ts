import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import GetTaxonomicExperts from './GetTaxonomicExperts';

vi.mock('axios', () => ({
  default: { get: vi.fn() },
}));

describe('expert search client baseline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends a filtered request and returns the API results without making network calls', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        taxonomicExperts: [{ taxonomicExpert: { '@id': 'synthetic-id' } }],
        metadata: { totalRecords: 1 },
      },
    });

    const result = await GetTaxonomicExperts({
      pageNumber: 1,
      pageSize: 10,
      searchFilters: {},
    });

    expect(result.metadata.totalRecords).toBe(1);
    expect(result.taxonomicExperts).toHaveLength(1);
    expect(axios.get).toHaveBeenCalledOnce();

    const [endpoint, requestOptions] = vi.mocked(axios.get).mock.calls[0];
    expect(endpoint).toContain('/cordra/experts');
    expect(requestOptions?.params?.query).toContain('schema\\:status:accepted');
    expect(requestOptions?.params?.pageNumber).toBe(1);
    expect(requestOptions?.params?.pageSize).toBe(10);
  });

  // This checks frontend behavior only. Server-side approval-state enforcement
  // remains a separate, currently unresolved security requirement (GAP-04).
});
