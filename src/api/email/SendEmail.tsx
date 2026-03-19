import axios from 'axios';

const SendEmail = async (serviceName: string, message: string) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/email/send`,
            {
                service_name: serviceName,
                service_url: message
            },
            {
                headers: {
                    "x-marketplace-token": import.meta.env.VITE_MARKETPLACE_API_TOKEN
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Email send failed:", error);
        return false;
    }
};

export default SendEmail;