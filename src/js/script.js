import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './api';

//----------------------------------------------

const form = document.querySelector('.search-form');
const input = document.querySelector('.form-input');
const loadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.card-link', {
  captionsData: 'alt',
  captionDelay: 250,
});

//----------------------------------------------

const key = '41065725-d4e1c0e5c0158eb500d558a75';
let isNewSearch = true;
const perPage = 40;
let page = 1;
let totalPages = 0;
loadMore.style.display = 'none';

//----------------------------------------------

const handleFetchError = error => {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  loadMore.style.display = 'none';
};

//----------------------------------------------

const fetchAndDisplayImages = async () => {
  loadMore.style.display = 'block';

  const query = input.value.trim();

  if (!query) {
    Notiflix.Notify.warning('Request cannot be empty');
    loadMore.style.display = 'none';
    return;
  }

  try {
    const imagesResponse = await fetchImages({ key, q: query, page, perPage });

    if (isNewSearch) {
      const totalHits = imagesResponse.totalHits || 0;
      totalPages = Math.floor(totalHits / perPage);
      Notiflix.Notify.success(
        `Hooray! We found ${totalHits} images on ${totalPages} pages.`
      );
      gallery.innerHTML = '';
      isNewSearch = false;
    }

    const images = imagesResponse.hits || [];

    if (images.length === 0) {
      Notiflix.Notify.failure('No more images available.');
      loadMore.style.display = 'none';
      return;
    }

    displayImages(images);

    if (page < totalPages) {
      loadMore.style.display = 'block';
    } else {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMore.style.display = 'none';
    }

    lightbox.refresh();

    Notiflix.Notify.info(`Page ${page} of ${totalPages}`);

    page++;
  } catch (error) {
    handleFetchError(error);
  }
};

//----------------------------------------------

form.addEventListener('submit', function (evt) {
  evt.preventDefault();
  page = 1;
  isNewSearch = true;
  fetchAndDisplayImages();
  loadMore.style.display = 'none';
});

//----------------------------------------------

loadMore.addEventListener('click', function () {
  isNewSearch = false;
  fetchAndDisplayImages();
});

//----------------------------------------------

const displayImages = images => {
  images.forEach(image => {
    const galleryCard = `
		
      <div class="photo-card">
					<a class="card-link" href="${image.largeImageURL}">
						<img clas="card-img" width="640" height="420" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
					</a>
        <div class="info">
          <p class="info-item">
            <b>Likes:</b> ${image.likes}
          </p>
          <p class="info-item">
            <b>Views:</b> ${image.views}
          </p>
          <p class="info-item">
            <b>Comments:</b> ${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads:</b> ${image.downloads}
          </p>
        </div>
      </div>
			
    `;

    gallery.innerHTML += galleryCard;
  });
};
