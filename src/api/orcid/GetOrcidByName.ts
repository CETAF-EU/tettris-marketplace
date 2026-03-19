import axios from 'axios';

interface OrcidRecord {
    name: string;
    identifier: string;
}

export async function GetOrcidByName(query: string): Promise<OrcidRecord[]> {
    // Remove any unwanted characters (optional strict filter)
    const safeQuery = query.replaceAll(/[^\w\s\-'.]/gi, '').trim(); // allow letters, digits, _, space, hyphen, apostrophe, dot

    if (!safeQuery || safeQuery.length < 2) {
        throw new Error('Query must be at least 2 characters long');
    }

    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/orcid/search?q=${encodeURIComponent(safeQuery)}`,
        {
            headers: import.meta.env.VITE_MARKETPLACE_API_TOKEN
                ? { 'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN }
                : undefined
        }
    );
    return response.data;
}