import axios from 'axios';

interface OrcidRecord {
    name: string;
    orcid: string;
}

export async function getOrcidByName(name: string): Promise<OrcidRecord[]> {
    try {
        const response = await axios.get(`https://pub.orcid.org/v3.0/search?q=given-names:${encodeURIComponent(name)} OR family-name:${encodeURIComponent(name)}`, {
            headers: {
            Accept: 'application/json',
            },
        });

        const results = response.data['result'] || [];
        return results.map((record: any) => ({
            name: record['person']['name']['given-names']['value'] + ' ' + record['person']['name']['family-name']['value'],
            orcid: record['orcid-identifier']['path'],
        }));
    } catch (error) {
        console.error('Error fetching ORCID data:', error);
        throw new Error('Failed to fetch ORCID data');
    }
}