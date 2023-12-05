import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const input = document.querySelector('.form-input');
const loadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

loadMore.style.display = 'none';

let page = 1;
const perPage = 40;
let isNewSearch = true;
let lightbox;

//fetch images

const fetchImages = async () => {
  loadMore.style.display = 'none';

  // URL settings
  const key = '41065725-d4e1c0e5c0158eb500d558a75';
  const q = input.value;
  const imageType = 'photo';
  const orientation = 'horizontal';
  const safeSearch = 'true';

  const apiUrl = `https://pixabay.com/api/?key=${key}&q=${q}&image_type=${imageType}&orientation=${orientation}&safesearch=${safeSearch}&page=${page}&per_page=${perPage}`;

  // if it is new search - clear gallery

  if (isNewSearch) {
    gallery.innerHTML = '';
    isNewSearch = false;
  }

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      Notiflix.Notify.failure(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const images = data.hits;

    //if arr is empty - return error

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMore.style.display = 'none';

      return;
    }

    //render img
    const totalHits = data.totalHits || 0;
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    // console.log(images);
    displayImages(images);

    //if img length = perPage - we display btn with load more, else error
    if (images.length === perPage) {
      loadMore.style.display = 'block';
    } else {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMore.style.display = 'none';
    }

    //lightbox
    lightbox.refresh();

    //add page
    page++;
  } catch (error) {
    Notiflix.Notify.failure('An error occurred. Please try again.');
    loadMore.style.display = 'none';
  }
};

//render images

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

//form submit

form.addEventListener('submit', function (evt) {
  evt.preventDefault();

  //defolt page
  page = 1;

  //new search
  isNewSearch = true;

  //fetch images
  fetchImages();

  //display btn load more
  loadMore.style.display = 'block';
});

// load more
loadMore.addEventListener('click', function () {
  //if it is not new search
  isNewSearch = false;
  fetchImages();
});

lightbox = new SimpleLightbox('.card-link', {
  captionsData: 'alt',
  captionDelay: 250,
});
