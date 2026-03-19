/* Import Dependencies */
import axios from 'axios';
import { format } from 'date-fns';
import { getStoredAuthToken } from 'api/auth/session';

/* Import Types */
import { TaxonomicExpert, Dict } from 'app/Types';
import { postImage } from 'api/image/PostImage';

/**
 * Function to update an existing taxonomic expert object in Cordra.
 * @param id The Cordra ID of the taxonomic expert.
 * @param updatedData The updated fields to merge into the taxonomic expert.
 * @returns The updated TaxonomicExpert or undefined.
 */
const UpdateTaxonomicExpert = async ({ id, updatedData }: { id: string; updatedData: Dict;}): Promise<TaxonomicExpert | undefined> => {
    let updatedExpert: TaxonomicExpert | undefined;

    if (!id || !updatedData) return;

    const taxonomicExpertRecord: Dict = {
        'schema:status': 'proposed',
        ...updatedData,
    };

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

        const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/cordra/experts/${encodeURIComponent(id)}`,
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

        const data: Dict = response.data;
        updatedExpert = (
            data.taxonomicExpert ??
            data.taxonomic_expert ??
            data.attributes?.content
        ) as TaxonomicExpert;

        if (!updatedExpert?.taxonomicExpert) {
            throw new Error('Failed to update taxonomic expert record.');
        }

        const metadata = data.metadata ?? data.attributes?.metadata;

        // Timestamps
        if (metadata?.modifiedOn) {
            updatedExpert.taxonomicExpert['schema:dateModified'] = format(
                new Date(metadata.modifiedOn),
                "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
            );
        }

    } catch (error) {
        console.error('UpdateTaxonomicExpert error:', error);
        throw error;
    }

    return updatedExpert;
};

export default UpdateTaxonomicExpert;
