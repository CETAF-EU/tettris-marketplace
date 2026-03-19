/* Import Dependencies */
import axios from 'axios';
import { getStoredAuthToken } from 'api/auth/session';

/* Import Types */
import { TaxonomicExpert, Dict } from 'app/Types';
import { postImage } from 'api/image/PostImage';

const InsertTaxonomicExpert = async ({
    taxonomicExpertRecord,
}: {
    taxonomicExpertRecord?: Dict;
}) => {
    let taxonomicExpert: TaxonomicExpert | undefined;

    if (taxonomicExpertRecord) {
        const imageValue = taxonomicExpertRecord?.['schema:person']?.['schema:ProfilePicture'];

        const shouldUploadImage =
            imageValue instanceof File ||
            (typeof imageValue === 'string' && imageValue.startsWith('data:'));

        if (shouldUploadImage) {
            const pictureUrl = await postImage(imageValue);
            taxonomicExpertRecord['schema:person']['schema:ProfilePicture'] = pictureUrl.url;
        }

        try {
            const authToken = getStoredAuthToken();
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/cordra/experts`,
                {
                    taxonomic_expert_record: taxonomicExpertRecord,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN,
                        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
                    },
                }
            );

            taxonomicExpert = response.data.taxonomic_expert as TaxonomicExpert;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return taxonomicExpert;
};

export default InsertTaxonomicExpert;
