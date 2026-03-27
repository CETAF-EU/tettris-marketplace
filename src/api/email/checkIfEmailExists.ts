import axios from 'axios';
import { TaxonomicExpert, CordraResultArray, Dict } from 'app/Types';
/**
 * Checks if an expert with the given email already exists.
 * @param email - The email to check.
 * @returns Existing expert if found, otherwise null.
 */
const checkIfEmailExists = async (email: string): Promise<TaxonomicExpert | null> => {

    console.log('Checking if email exists:', email);

    let taxonomicExperts: TaxonomicExpert[] = [];
    const filters = String.raw`/taxonomicExpert/@type:TaxonomicExpert AND (/taxonomicExpert/schema\:person/schema\:email:"${email}")`;

    const extractExpertRecord = (candidate: unknown): TaxonomicExpert['taxonomicExpert'] | null => {
        if (!candidate || typeof candidate !== 'object') {
            return null;
        }

        const source = candidate as Dict;
        const content = source.attributes?.content as Dict | undefined;

        const normalizedRecord = (
            source.taxonomicExpert
            ?? source.taxonomic_expert
            ?? content?.taxonomicExpert
            ?? content?.taxonomic_expert
            ?? (content && typeof content === 'object' && (content['schema:person'] || content.person) ? content : null)
            ?? ((source['schema:person'] || source.person) ? source : null)
        ) as TaxonomicExpert['taxonomicExpert'] | null;

        return normalizedRecord && typeof normalizedRecord === 'object'
            ? normalizedRecord
            : null;
    };

    const normalizeExpert = (candidate: unknown): TaxonomicExpert | null => {
        const expertRecord = extractExpertRecord(candidate);
        if (!expertRecord) {
            return null;
        }

        const source = candidate as Dict;
        const id = source.id ?? source['@id'] ?? source.attributes?.id;

        return {
            taxonomicExpert: {
                ...expertRecord,
                ...(id ? { '@id': id } : {}),
            },
        };
    };

    const getExpertEmail = (expert: TaxonomicExpert): string | null => {
        const person = (expert?.taxonomicExpert?.['schema:person'] ?? expert?.taxonomicExpert?.person) as Dict | undefined;
        const resolvedEmail = person?.['schema:email'] ?? person?.email;
        return typeof resolvedEmail === 'string' ? resolvedEmail : null;
    };

    const normalizeExperts = (data: ({
        taxonomicExperts?: unknown[];
        taxonomic_experts?: unknown[];
        results?: CordraResultArray['results'];
    } & Partial<CordraResultArray> & Dict)): TaxonomicExpert[] => {
        const normalizedExperts: TaxonomicExpert[] = [];

        if (Array.isArray(data.taxonomicExperts)) {
            data.taxonomicExperts.forEach((expertCandidate) => {
                const normalized = normalizeExpert(expertCandidate);
                if (normalized) {
                    normalizedExperts.push(normalized);
                }
            });
        } else if (Array.isArray(data.taxonomic_experts)) {
            data.taxonomic_experts.forEach((expertCandidate) => {
                const normalized = normalizeExpert(expertCandidate);
                if (normalized) {
                    normalizedExperts.push(normalized);
                }
            });
        } else if (Array.isArray(data.results)) {
            data.results.forEach((dataFragment) => {
                const normalized = normalizeExpert({
                    ...dataFragment.attributes?.content,
                    id: dataFragment.id,
                    attributes: dataFragment.attributes,
                });

                if (normalized) {
                    normalizedExperts.push(normalized);
                }
            });
        }

        return normalizedExperts;
    };
    
    try {
        const commonHeaders = {
            'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN,
        };

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/cordra/experts`, {
            params: {
                query: filters,
                pageNumber: 0,
                pageSize: 1,
            },
            headers: commonHeaders,
        });


        const data = response.data as {
            taxonomicExperts?: TaxonomicExpert[];
            taxonomic_experts?: TaxonomicExpert[];
        } & Partial<CordraResultArray>;

        taxonomicExperts = normalizeExperts(data as Dict);

        if (taxonomicExperts.length === 0 && (data as Dict)?.metadata?.totalRecords > 0) {
            const fallbackResponse = await axios.get(`${import.meta.env.VITE_API_URL}/cordra/experts`, {
                params: {
                    query: filters,
                    pageNumber: 1,
                    pageSize: 1,
                },
                headers: commonHeaders,
            });

            taxonomicExperts = normalizeExperts(fallbackResponse.data as Dict);
        }

        const normalizedEmail = email.trim().toLowerCase();
        const exactEmailMatch = taxonomicExperts.find((expert) => {
            const expertEmail = getExpertEmail(expert);
            return typeof expertEmail === 'string' && expertEmail.trim().toLowerCase() === normalizedEmail;
        }) ?? null;

        // The Cordra query already filters by email. Keep first normalized match as fallback
        // when profile keys are shaped differently and exact email extraction misses it.
        const existingExpert = exactEmailMatch ?? taxonomicExperts[0] ?? null;

        if (existingExpert) {
            console.log('Email exists:', existingExpert.taxonomicExpert?.['schema:person']?.['schema:email']);
            return existingExpert;
        }

        console.log('Email does not match:', email);
        return null;
    } catch (error) {
        console.error('Email existence check failed:', error);
        return null;
    }
};

export default checkIfEmailExists;
