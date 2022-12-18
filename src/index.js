import './css/styles.css';
const axios = require('axios').default;
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const inputRef = document.querySelector('input');
const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreRef = document.querySelector('.load-more');
loadMoreRef.style.visibility = 'hidden';

const pfotoCardRef = document.querySelector('.photo-card');
const onFormhRef = formRef.addEventListener('submit', onSubmit);
const onLoadMoreRef = loadMoreRef.addEventListener('click', onLoadMore);

let page = 1;

function onSubmit(event) {
  event.preventDefault();
  clearInput();

  const dataInput = inputRef.value;

  if (!dataInput) {
    clearInput();
    loadMoreRef.style.visibility = 'hidden';
    return Notiflix.Notify.warning('Please enter a valid value');
  }

  fetchGallery(dataInput)
    .then(({ totalHits, hits }) => {
      const totalPages = Math.ceil(totalHits / hits.length);
      const currentPage = page - 1;

      if (hits.length === 0) {
        loadMoreRef.style.visibility = 'hidden';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);

        if (totalPages <= currentPage) {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
          loadMoreRef.style.visibility = 'hidden';
        }
      }
      renderGallery(hits);
    })
    .catch(error => console.log('Ошибочка'));
  loadMoreRef.style.visibility = 'visible';
}

async function fetchGallery(dataInput) {
  const response = await axios.get(
    `https://pixabay.com/api/?key=32131085-77c33ae4af62fbdfe36accafe&q=
        ${dataInput}
        &image_type=photo
        &iorientation=horizontal
        &safesearch=true
        &per_page=40
        &page=${page}`
  );

  const dataArrs = response.data;
  page += 1;
  return dataArrs;
}

function renderGallery(hits) {
  const markupGallery = hits
    .map(dataArr => renderGalleryItems(dataArr))
    .join('');

  galleryRef.insertAdjacentHTML('beforeend', markupGallery);
  var lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function renderGalleryItems({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
      <div class="photo-card">
          <div class="gallery">
            <a href="${largeImageURL}">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" width="150" height="100"/>
            </a>
          </div>
            <div class="info">
                <p class="info-item">
                    <b>Likes ${likes}</b>
                </p>
                <p class="info-item">
                    <b>Views ${views}</b>
                </p>
                <p class="info-item">
                    <b>Comments ${comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads ${downloads}</b>
                </p>
            </div>
        </div>
    `;
}

function onLoadMore() {
  const dataInput = inputRef.value;

  fetchGallery(dataInput)
    .then(renderGallery)
    .catch(error => console.log('Ошибочка'));
}

function clearInput() {
  page = 1;
  galleryRef.innerHTML = '';
}

galleryRef.style.display = 'flex';
galleryRef.style.justifyContent = 'center';
galleryRef.style.flexWrap = 'wrap';

loadMoreRef.style.margin = '25px auto';
loadMoreRef.style.display = 'block';
