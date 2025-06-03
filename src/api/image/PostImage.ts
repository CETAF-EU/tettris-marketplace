import axios from 'axios';

export async function postImage(file: File | string): Promise<{ url: string }> {
    const formData = new FormData();

    // If file is a string (e.g., base64 or file path), convert it to a Blob or fetch the file
    if (typeof file === 'string') {
        // Example: If file is a base64 string
        const byteString = atob(file.split(',')[1]);
        const mimeString = file.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        formData.append('file', blob, 'image.png');
    } else {
        formData.append('file', file);
    }

    const response = await axios.post(
        'https://sandbox.cetaf.org/api/upload-image',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${import.meta.env.VITE_IMAGE_API}`,
            },
        }
    );

    return response.data;
}