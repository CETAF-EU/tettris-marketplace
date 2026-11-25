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

    it.each([[0, 1], [1, 1], [2, 2]])('maps page %i to API page %i', async (requested, expected) => {
        const result = await GetTaxonomicServices({ pageNumber: requested, pageSize: 1, searchFilters: {} });
        expect(axios.get).toHaveBeenCalledOnce();
        expect(vi.mocked(axios.get).mock.calls[0][1]?.params?.pageNumber).toBe(expected);
        expect(result.metadata.totalRecords).toBe(0);
    });
});
