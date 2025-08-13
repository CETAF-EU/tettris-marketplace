import axios from 'axios';

interface OrcidRecord {
    name: string;
    identifier: string;
}

export async function GetOrcidByName(query: string): Promise<OrcidRecord[]> {
    // Remove any unwanted characters (optional strict filter)
    const safeQuery = query.replace(/[^\w\s\-'.]/gi, '').trim(); // allow letters, digits, _, space, hyphen, apostrophe, dot

    if (!safeQuery || safeQuery.length < 2) {
        throw new Error('Query must be at least 2 characters long');
    }

    try {
        const response = await axios.get(
            `https://sandbox.cetaf.org/orcid/api/orcid/search?q=${encodeURIComponent(safeQuery)}`
        );
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch ORCID data');
    }
}