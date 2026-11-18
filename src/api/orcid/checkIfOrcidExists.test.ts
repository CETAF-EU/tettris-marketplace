import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { storeAuthToken } from 'api/auth/session';
import checkIfOrcidExists from './checkIfOrcidExists';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

describe('ORCID owner-only lookup', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('does not perform a Cordra search without a bearer token', async () => {
        const result = await checkIfOrcidExists('0000-0002-1825-0097');
        expect(result).toBeNull();
        expect(axios.get).not.toHaveBeenCalled();
    });

    it('queries mine and rejects a different ORCID record', async () => {
        storeAuthToken('synthetic-auth');
        vi.mocked(axios.get).mockResolvedValue({
            data: {
                taxonomicExperts: [{
                    taxonomicExpert: {
                        '@id': '20.5000/other',
                        'schema:person': { 'schema:orcid': '0000-0003-1111-2222' },
                    },
                }],
                metadata: { totalRecords: 1 },
            },
        });
        const result = await checkIfOrcidExists('0000-0002-1825-0097');
        expect(result).toBeNull();

        const [, options] = vi.mocked(axios.get).mock.calls[0];
        expect(options?.params?.scope).toBe('mine');
        expect(options?.params?.query).toBeUndefined();
        expect(options?.headers?.Authorization).toBe('Bearer synthetic-auth');
    });
});
