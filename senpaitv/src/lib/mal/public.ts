import dotenv from 'dotenv';

dotenv.config();

fetch('https://api.myanimelist.net/v2/anime?q=one&limit=4', {
  headers: {
    'X-MAL-CLIENT-ID': process.env.MAL_CLIENT_ID!,
  },
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Data:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
