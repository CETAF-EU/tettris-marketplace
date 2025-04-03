import axios from 'axios';

interface OrcidUser {
    orcid: string;
    name: string;
    email?: string;
    otherDetails?: any;
}

export async function getOrcidById(orcidId: string): Promise<OrcidUser | null> {
    const baseUrl = 'https://pub.orcid.org/v3.0';
    const url = `${baseUrl}/${orcidId}`;

    try {
        const response = await axios.get(url, {
            headers: {
                Accept: 'application/json',
            },
        });

        const data = response.data;

        const user: OrcidUser = {
            orcid: data['orcid-identifier'].path,
            name: data['person']['name']['given-names'].value + ' ' + data['person']['name']['family-name'].value,
            email: data['person']['emails']?.email?.[0]?.email || undefined,
            otherDetails: data,
        };

        return user;
    } catch (error) {
        console.error('Error fetching ORCID data:', error);
        return null;
    }
}