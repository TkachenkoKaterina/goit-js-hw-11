import './css/styles.css';
const axios = require('axios').default;
import Notiflix from 'notiflix';

const inputRef = document.querySelector('input');
const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreRef = document.querySelector('.load-more');
loadMoreRef.setAttribute('disabled', true);

const pfotoCardRef = document.querySelector('.photo-card');
const onFormhRef = formRef.addEventListener('submit', onSubmit);
const onLoadMoreRef = loadMoreRef.addEventListener('click', onLoadMore);

let page = 1;
let total = 0;

function onSubmit(event) {
  event.preventDefault();
  clearInput();
  const dataInput = inputRef.value;
  console.log('dataInput ->', dataInput);
  fetchGallery(dataInput)
    .then(renderGallery)
    .catch(error => console.log('Ошибочка'));
  loadMoreRef.removeAttribute('disabled', false);
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
  console.log(dataArrs);
  console.log(dataArrs.hits);
  console.log(dataArrs.totalHits);

  page += 1;
  console.log(page);
  return dataArrs;
}

function onInfo(dataArrs) {
  total = dataArrs.totalHits;

  console.log(total);
  if (page === 1) {
    console.log(total);
    Notiflix.Notify.info(`Hooray! We found ${total} images.`);
    total -= 40;
    return total;
  } else if (total / 40 < 1) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    return [];
  }
}

function renderGallery(dataArrs) {
  if (dataArrs.length === 0) {
    return Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    const markupGallery = dataArrs.hits
      .map(dataArr => renderGalleryItems(dataArr))
      .join('');

    galleryRef.insertAdjacentHTML('beforeend', markupGallery);
  }
}

function renderGalleryItems({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
  totalHits,
}) {
  return `
      <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" width="150" height="100"/>
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
  // console.log('dataInput ->', dataInput);
  fetchGallery(dataInput)
    .then(renderGallery)
    .then(onInfo)
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
