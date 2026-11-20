import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { storeAuthToken } from 'api/auth/session';
import checkIfEmailExists from './checkIfEmailExists';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

describe('verified owner email lookup', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('does not search expert email addresses without a login token', async () => {
        const result = await checkIfEmailExists('someone@example.invalid');
        expect(result).toBeNull();
        expect(axios.get).not.toHaveBeenCalled();
    });

    it('uses only the authenticated my-profiles endpoint', async () => {
        storeAuthToken('synthetic-auth');
        vi.mocked(axios.get).mockResolvedValue({
            data: {
                taxonomicExperts: [{
                    taxonomicExpert: {
                        '@id': '20.5000/synthetic',
                        'schema:person': { 'schema:email': 'owner@example.invalid' },
                    },
                }],
                metadata: { totalRecords: 1 },
            },
        });
        const result = await checkIfEmailExists('owner@example.invalid');
        expect(result?.taxonomicExpert?.['@id']).toBe('20.5000/synthetic');

        const [, options] = vi.mocked(axios.get).mock.calls[0];
        expect(options?.params?.scope).toBe('mine');
        expect(options?.params?.query).toBeUndefined();
        expect(options?.headers?.Authorization).toBe('Bearer synthetic-auth');
    });
});
