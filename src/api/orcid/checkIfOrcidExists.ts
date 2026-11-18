import axios from 'axios';
import { getStoredAuthToken } from 'api/auth/session';
import { TaxonomicExpert, CordraResultArray, Dict } from 'app/Types';
/**
 * Checks if an expert with the given ORCID already exists.
 * @param orcid - The ORCID to check.
 * @returns Existing expert if found, otherwise null.
 */
const checkIfOrcidExists = async (orcid: string): Promise<TaxonomicExpert | null> => {

    console.log('Checking if orcid exists:', orcid);

    if (!orcid || typeof orcid !== 'string') {
        console.warn('ORCID is undefined or not a string:', orcid);
        return null;
    }

    let taxonomicExperts: TaxonomicExpert[] = [];
    // The API builds an authenticated ownership query; no private-field public search.

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

    const getExpertOrcid = (expert: TaxonomicExpert): string | null => {
        const person = (expert?.taxonomicExpert?.['schema:person'] ?? expert?.taxonomicExpert?.person) as Dict | undefined;
        const resolvedOrcid = person?.['schema:orcid'] ?? person?.orcid;
        return typeof resolvedOrcid === 'string' ? resolvedOrcid : null;
    };
    
    const normalizeExperts = (data: ({
        taxonomicExperts?: TaxonomicExpert[];
        taxonomic_experts?: TaxonomicExpert[];
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
        const authToken = getStoredAuthToken();
        if (!authToken) return null;

        const commonHeaders = {
            'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN,
            Authorization: `Bearer ${authToken}`,
        };

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/cordra/experts`, {
            params: {
                scope: 'mine',
                pageNumber: 1,
                pageSize: 100
            },
            headers: commonHeaders
        });

        taxonomicExperts = normalizeExperts(response.data as Dict);

        if (taxonomicExperts.length === 0 && response.data?.metadata?.totalRecords > 0) {
            const fallbackResponse = await axios.get(`${import.meta.env.VITE_API_URL}/cordra/experts`, {
                params: {
                    scope: 'mine',
                    pageNumber: 1,
                    pageSize: 100
                },
                headers: commonHeaders
            });

            taxonomicExperts = normalizeExperts(fallbackResponse.data as Dict);
        }

        const normalizedOrcid = orcid.trim().toUpperCase();
        const exactOrcidMatch = taxonomicExperts.find((expert) => {
            const expertOrcid = getExpertOrcid(expert);
            return typeof expertOrcid === 'string' && expertOrcid.trim().toUpperCase() === normalizedOrcid;
        }) ?? null;

        // Never substitute another profile when the ORCID does not match.
        const existingExpert = exactOrcidMatch;

        if (existingExpert) {
            console.log('Orcid exists:', existingExpert.taxonomicExpert?.['schema:person']?.['schema:orcid']);
            return existingExpert;
        }

        console.log('Orcid does not match:', orcid);
        return null;
    } catch (error) {
        console.error('Orcid existence check failed:', error);
        return null;
    }
};

export default checkIfOrcidExists;
