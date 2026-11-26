import checkIfOrcidExists from 'api/orcid/checkIfOrcidExists';

// Ownership lookup requires a signed session. Never issue raw public queries.
const GetTaxonomicExpertByOrcid = async ({ orcidId }: { orcidId?: string }) => {
    if (!orcidId) return [];
    const profile = await checkIfOrcidExists(orcidId);
    return profile ? [profile] : [];
};
export default GetTaxonomicExpertByOrcid;
