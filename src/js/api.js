import axios from 'axios';
import Notiflix from 'notiflix';

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
      Notiflix.Notify.failure(`No images found for the search term "${q}".`);
    }

    return {
      totalHits: response.data.totalHits,
      hits: response.data.hits,
    };
  } catch (error) {
    Notiflix.Notify.failure(`Error receiving images: ${error.message}`);
  }
};

export { fetchImages };
