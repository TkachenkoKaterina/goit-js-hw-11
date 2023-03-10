import './css/styles.css';
const axios = require('axios').default;
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '32131085-77c33ae4af62fbdfe36accafe';
const inputRef = document.querySelector('input');
const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreRef = document.querySelector('.load-more');
loadMoreRef.style.visibility = 'hidden';

const pfotoCardRef = document.querySelector('.photo-card');
const onFormhRef = formRef.addEventListener('submit', onSubmit);
const onLoadMoreRef = loadMoreRef.addEventListener('click', onLoadMore);

let page = 1;
let totalLength = 80;

async function onSubmit(event) {
  event.preventDefault();
  loadMoreRef.style.visibility = 'hidden';
  clearInput();

  const dataInput = inputRef.value.trim();

  if (!dataInput) {
    clearInput();
    loadMoreRef.style.visibility = 'hidden';
    return Notiflix.Notify.warning('Please enter a valid value');
  }

  try {
    const { totalHits, hits } = await fetchGallery(dataInput);
    const totalPages = Math.ceil(totalHits / hits.length);
    const currentPage = page - 1;

    if (hits.length === 0) {
      loadMoreRef.style.visibility = 'hidden';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
      loadMoreRef.style.visibility = 'visible';

      if (totalPages <= currentPage) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreRef.style.visibility = 'hidden';
      }
    }
    renderGallery(hits);
  } catch (error) {
    console.log('Ошибочка');
  }
}

async function fetchGallery(dataInput) {
  loadMoreRef.style.visibility = 'hidden';
  const { data } = await axios.get(
    `https://pixabay.com/api/?key=${API_KEY}&q=${dataInput}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  page += 1;
  return data;
}

function renderGallery(hits) {
  const markupGallery = hits.map(data => renderGalleryItems(data)).join('');

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

async function onLoadMore() {
  const dataInput = inputRef.value;

  try {
    const { hits } = await fetchGallery(dataInput);
    if (hits.length === 40 && totalLength <= 500) {
      // console.log(totalLength);
      totalLength += 40;
      loadMoreRef.style.visibility = 'visible';
    } else {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreRef.style.visibility = 'hidden';
    }
    renderGallery(hits);
  } catch (error) {
    console.log('Ошибочка');
  }

  // START smooth scroll

  // const { height: cardHeight } = document
  //   .querySelector('.gallery')
  //   .firstElementChild.getBoundingClientRect();

  // window.scrollBy({
  //   top: cardHeight * 2,
  //   behavior: 'smooth',
  // });

  // END smooth scroll
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
