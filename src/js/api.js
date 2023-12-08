import axios from 'axios';

const fetchImages = async ({ key, q, page, perPage }) => {
  const imageType = 'photo';
  const orientation = 'horizontal';
  const safeSearch = 'true';

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key,
        q,
        image_type: imageType,
        orientation,
        safesearch: safeSearch,
        page,
        per_page: perPage,
      },
    });

    if (!response.data.hits.length) {
      throw new Error(`No images found for the search term "${q}".`);
    }

    return {
      totalHits: response.data.totalHits,
      hits: response.data.hits,
    };
  } catch (error) {
    throw new Error(`Error receiving images: ${error.message}`);
  }
};

export { fetchImages };
