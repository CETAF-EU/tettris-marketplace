import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { storeAuthToken } from 'api/auth/session';
import GetTaxonomicExpert from './GetTaxonomicExpert';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

describe('expert profile lookup', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('includes bearer identity for the owner of a pending profile', async () => {
        storeAuthToken('synthetic-owner-token');
        vi.mocked(axios.get).mockResolvedValue({
            data: { taxonomicExpert: { taxonomicExpert: { '@id': '20.5000/synthetic' } } },
        });

        const result = await GetTaxonomicExpert({ handle: '20.5000/synthetic' });
        expect(result).toBeDefined();
        const [, options] = vi.mocked(axios.get).mock.calls[0];
        expect(options?.headers?.Authorization).toBe('Bearer synthetic-owner-token');
    });

    it('can load public profiles without bearer credentials', async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: { taxonomicExpert: { taxonomicExpert: { '@id': '20.5000/synthetic' } } },
        });
        await GetTaxonomicExpert({ handle: '20.5000/synthetic' });
        const [, options] = vi.mocked(axios.get).mock.calls[0];
        expect(options?.headers?.Authorization).toBeUndefined();
    });
});
