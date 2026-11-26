import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import InsertTaxonomicService from 'api/taxonomicService/InsertTaxonomicService';
import { getStoredAuthToken } from 'api/auth/session';

vi.mock('axios', () => ({ default: { post: vi.fn() } }));
vi.mock('api/auth/session', () => ({ getStoredAuthToken: vi.fn() }));

describe('service registration notification', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getStoredAuthToken).mockReturnValue('synthetic-token');
    });

    it('creates the record once and never sends a separate notification', async () => {
        const saved = { taxonomicService: { '@id': '20.5000/test' } };
        vi.mocked(axios.post).mockResolvedValue({ data: { taxonomic_service: saved } });
        const result = await InsertTaxonomicService({
            taxonomicServiceRecord: { 'schema:service': { 'schema:name': 'Synthetic' } }, captchaSolution: 'test-solution',
        });
        expect(result).toEqual(saved);
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(
            expect.stringMatching(/\/cordra\/services$/),
            expect.objectContaining({ captcha_solution: 'test-solution', taxonomic_service_record: expect.objectContaining({ 'schema:status': 'proposed' }) }),
            expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer synthetic-token' }) }),
        );
    });

    it('does not send a notification when creation fails', async () => {
        vi.mocked(axios.post).mockRejectedValue(new Error('Synthetic failure'));
        await expect(InsertTaxonomicService({ taxonomicServiceRecord: {}, captchaSolution: 'test-solution' })).rejects.toThrow('Synthetic failure');
        expect(axios.post).toHaveBeenCalledTimes(1);
    });
});
