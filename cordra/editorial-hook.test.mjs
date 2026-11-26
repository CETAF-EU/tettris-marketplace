import { describe, it, expect } from 'vitest';
import hook from './editorial-hook.cjs';

describe.each(['TaxonomicExpert', 'TaxonomicService'])('Cordra editorial hook %s', (type) => {
    const key = type === 'TaxonomicExpert' ? 'taxonomicExpert' : 'taxonomicService';
    function submitted() {
        return {type, content: {[key]: {'@id': 'test/new', '@type': 'Forged',
            'schema:status': 'accepted', 'schema:ratingValue': 99,
            'schema:ratingExplanation': 'forged', 'schema:comments': 'forged'}}};
    }
    it.each(['admin', 'untrusted'])('new records cannot self-approve (%s)', (userId) => {
        const record = hook.beforeSchemaValidation(submitted(), {isNew: true, userId}).content[key];
        expect(record).toMatchObject({'@type': type, 'schema:status': 'proposed', 'schema:ratingValue': 0});
        expect(record['schema:ratingExplanation']).toBeUndefined();
        expect(record['schema:comments']).toBeUndefined();
    });
    it('non-admin updates require renewed review and protect staff comments', () => {
        const originalObject = {content: {[key]: {'@id': 'test/original', 'schema:comments': 'staff'}}};
        const record = hook.beforeSchemaValidation(submitted(), {isNew: false, userId: 'user-id', originalObject}).content[key];
        expect(record).toMatchObject({'@id': 'test/original', 'schema:status': 'proposed', 'schema:ratingValue': 0, 'schema:comments': 'staff'});
    });
    it('admin can approve existing records', () => {
        const record = hook.beforeSchemaValidation(submitted(), {isNew: false, userId: 'admin'}).content[key];
        expect(record['schema:status']).toBe('accepted');
        expect(record['schema:ratingValue']).toBe(99);
    });
});
