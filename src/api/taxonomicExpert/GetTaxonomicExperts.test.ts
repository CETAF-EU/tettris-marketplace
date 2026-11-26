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
      searchFilters: { location: 'United Kingdom', email: 'hidden@example.test', query: 'beetle' },
    });

    expect(result.metadata.totalRecords).toBe(1);
    expect(result.taxonomicExperts).toHaveLength(1);
    expect(axios.get).toHaveBeenCalledOnce();

    const [endpoint, requestOptions] = vi.mocked(axios.get).mock.calls[0];
    expect(endpoint).toContain('/cordra/experts');
    expect(requestOptions?.params?.query).toBe('beetle');
    expect(requestOptions?.params?.location).toBe('United Kingdom');
    expect(requestOptions?.params?.email).toBeUndefined();
    expect(requestOptions?.params?.pageNumber).toBe(1);
    expect(requestOptions?.params?.pageSize).toBe(10);
  });

  it.each([[0, 1], [1, 1], [2, 2]])('maps page %i to API page %i', async (requested, expected) => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { taxonomicExperts: [], metadata: { totalRecords: 0 } },
    });
    await GetTaxonomicExperts({ pageNumber: requested, pageSize: 1, searchFilters: {} });
    expect(axios.get).toHaveBeenCalledOnce();
    expect(vi.mocked(axios.get).mock.calls[0][1]?.params?.pageNumber).toBe(expected);
  });
});
