import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GetTaxonomicServices from './GetTaxonomicServices';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

describe('service catalogue pagination', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(axios.get).mockResolvedValue({
            data: { taxonomicServices: [], metadata: { totalRecords: 0 } },
        });
    });

    it('sends only named filters and maps catalogue selector', async () => {
        await GetTaxonomicServices({pageNumber: 1, pageSize: 10, searchFilters: {serviceType: 'referenceCollection', language: 'en', query: 'beetle', status: 'rejected'}});
        expect(vi.mocked(axios.get).mock.calls[0][1]?.params).toEqual({pageNumber: 1, pageSize: 10, serviceType: 'Reference collection', language: 'en', query: 'beetle'});
    });

    it.each([[0, 1], [1, 1], [2, 2]])('maps page %i to API page %i', async (requested, expected) => {
        const result = await GetTaxonomicServices({ pageNumber: requested, pageSize: 1, searchFilters: {} });
        expect(axios.get).toHaveBeenCalledOnce();
        expect(vi.mocked(axios.get).mock.calls[0][1]?.params?.pageNumber).toBe(expected);
        expect(result.metadata.totalRecords).toBe(0);
    });
});
