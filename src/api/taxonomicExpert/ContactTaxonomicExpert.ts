import axios from 'axios';
import { getStoredAuthToken } from 'api/auth/session';

type ContactTaxonomicExpertArgs = {
    expertId: string;
    subject: string;
    message: string;
};

const ContactTaxonomicExpert = async ({
    expertId,
    subject,
    message,
}: ContactTaxonomicExpertArgs): Promise<string> => {
    const authToken = getStoredAuthToken();

    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/email/experts/contact`,
        {
            expertId,
            subject,
            message,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN,
                ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            },
        }
    );

    return response.data?.message ?? 'Email sent successfully';
};

export default ContactTaxonomicExpert;
