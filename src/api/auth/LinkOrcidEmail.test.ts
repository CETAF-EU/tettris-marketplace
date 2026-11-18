import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getStoredAuthToken, storeAuthToken } from './session';
import linkOrcidEmail from './LinkOrcidEmail';

vi.mock('axios', () => ({ default: { post: vi.fn() } }));

const ORCID = '0000-0002-1825-0097';

describe('linking email to ORCID', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('sends the verified ORCID bearer and stores the linked token', async () => {
        storeAuthToken('existing-orcid-bearer');
        vi.mocked(axios.post).mockResolvedValue({
            data: {
                access_token: 'linked-orcid-and-email-bearer',
                user: { orcid_id: ORCID, email: 'owner@example.invalid' },
            },
        });
        expect(await linkOrcidEmail('owner@example.invalid', '123456', ORCID)).toBe(true);
        expect(getStoredAuthToken()).toBe('linked-orcid-and-email-bearer');
        const [url, body, options] = vi.mocked(axios.post).mock.calls[0];
        expect(url).toContain('/auth/link-orcid-email');
        expect(body).toEqual({ email: 'owner@example.invalid', code: '123456' });
        expect(options?.headers?.Authorization).toBe('Bearer existing-orcid-bearer');
    });

    it('does not call the backend without the original ORCID bearer', async () => {
        await expect(linkOrcidEmail('owner@example.invalid', '123456', ORCID)).rejects.toThrow();
        expect(axios.post).not.toHaveBeenCalled();
    });

    it('rejects an unexpected ORCID claim without replacing the stored token', async () => {
        storeAuthToken('existing-orcid-bearer');
        vi.mocked(axios.post).mockResolvedValue({
            data: {
                access_token: 'wrong-bearer',
                user: { orcid_id: '0000-0003-1111-2222', email: 'owner@example.invalid' },
            },
        });
        await expect(linkOrcidEmail('owner@example.invalid', '123456', ORCID)).rejects.toThrow();
        expect(getStoredAuthToken()).toBe('existing-orcid-bearer');
    });

    it('rejects responses with missing email verification or token', async () => {
        storeAuthToken('existing-orcid-bearer');
        vi.mocked(axios.post).mockResolvedValue({
            data: { user: { orcid_id: ORCID, email: 'other@example.invalid' } },
        });
        await expect(linkOrcidEmail('owner@example.invalid', '123456', ORCID)).rejects.toThrow();
        expect(getStoredAuthToken()).toBe('existing-orcid-bearer');
    });
});
