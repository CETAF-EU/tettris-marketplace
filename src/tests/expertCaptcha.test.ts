import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import InsertTaxonomicExpert from 'api/taxonomicExpert/InsertTaxonomicExpert';
import UpdateTaxonomicExpert from 'api/taxonomicExpert/UpdateTaxonomicExpert';

vi.mock('axios', () => ({ default: { post: vi.fn(), put: vi.fn() } }));
vi.mock('api/auth/session', () => ({ getStoredAuthToken: () => 'synthetic-token' }));
vi.mock('api/image/PostImage', () => ({ postImage: vi.fn() }));

describe('expert CAPTCHA submission', () => {
    beforeEach(() => { vi.clearAllMocks(); });
    const record = { 'schema:person': { 'schema:name': 'Synthetic' } };
    const saved = { taxonomicExpert: { '@id': '20.5000/test' } };

    it('sends the solution separately on expert creation', async () => {
        vi.mocked(axios.post).mockResolvedValue({ data: { taxonomic_expert: saved } });
        await InsertTaxonomicExpert({ taxonomicExpertRecord: record, captchaSolution: 'fresh-create' });
        expect(axios.post).toHaveBeenCalledOnce();
        expect(axios.post).toHaveBeenCalledWith(expect.stringMatching(/\/cordra\/experts$/),
            { taxonomic_expert_record: record, captcha_solution: 'fresh-create' }, expect.anything());
    });

    it('sends the solution separately on expert update', async () => {
        vi.mocked(axios.put).mockResolvedValue({ data: { taxonomic_expert: saved } });
        await UpdateTaxonomicExpert({ id: '20.5000/test', updatedData: record, captchaSolution: 'fresh-update' });
        expect(axios.put).toHaveBeenCalledOnce();
        expect(axios.put).toHaveBeenCalledWith(expect.stringMatching(/\/cordra\/experts\//),
            { taxonomic_expert_record: { 'schema:status': 'proposed', ...record }, captcha_solution: 'fresh-update' }, expect.anything());
    });
});
