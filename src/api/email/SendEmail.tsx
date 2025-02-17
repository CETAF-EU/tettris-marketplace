import emailjs from "emailjs-com";

const SendEmail = (serviceName: string, message: string) => {
  try {
    emailjs
      .send(
          import.meta.env.VITE_EMAILJS_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          { service_name: serviceName, message: message },
          import.meta.env.VITE_EMAILJS_USER_ID
      )
  } catch (error) {
        console.error(error);

        throw (error);
    };
};

export default SendEmail;