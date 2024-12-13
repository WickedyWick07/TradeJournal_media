const FormData = require('form-data');
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  // Assume the uploaded file comes in `event.body`
  const formData = new FormData();
  const file = event.body; // File should be sent as raw binary data

  // Define your target path for images
  const netlifyMediaPath = 'https://radiant-cocada-ffd780.netlify.app/journal_images/';

  try {
    // Send the image to the Netlify hosting URL
    formData.append('file', file);

    const response = await fetch(netlifyMediaPath, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      return {
        statusCode: 500,
        body: 'Error uploading image.',
      };
    }

    // Construct the URL for the uploaded image
    const uploadedImageUrl = `${netlifyMediaPath}${file.name}`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Image uploaded successfully',
        imageUrl: uploadedImageUrl,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error: ${error.message}`,
    };
  }
};
