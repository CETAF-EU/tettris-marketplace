import axios from 'axios';

interface OrcidRecord {
    name: string;
    identifier: string;
}

export async function GetOrcidByName(query: string): Promise<OrcidRecord[]> {
    try {
        const response = await axios.get(`https://sandbox.cetaf.org/orcid/api/orcid/search?q=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ORCID data:', error);
        throw new Error('Failed to fetch ORCID data');
    }
}