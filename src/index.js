const axios = require('axios').default;
import Notiflix from 'notiflix';

let page = 1;

const inputRef = document.querySelector('input');
const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreRef = document.querySelector('.load-more');
const pfotoCardRef = document.querySelector('.photo-card');

const onInputRef = inputRef.addEventListener('input', onInput);
const onFormhRef = formRef.addEventListener('submit', onSubmit);
const onLoadMoreRef = formRef.addEventListener('click', onLoadMore);

function onInput() {
  //   console.log(inputRef.value);
}

function onSubmit(event) {
  event.preventDefault();
  clearInput();
  const dataInput = inputRef.value;
  //   console.log('dataInput ->', dataInput);
  fetchGallery(dataInput)
    .then(renderGallery)
    .catch(error => console.log('Ошибочка'));
}

async function fetchGallery(dataInput) {
  page += 1;
  const response = await axios.get(
    `https://pixabay.com/api/?key=32131085-77c33ae4af62fbdfe36accafe&q=
        ${dataInput}
        &image_type=photo
        &iorientation=horizontal
        &safesearch=true
        &per_page=40
        &page=${page}`
  );

  const dataArrs = response.data.hits;
  console.log(dataArrs);
  return dataArrs;
}

function renderGallery(dataArrs) {
  //   console.log(dataArrs);
  if (dataArrs.length === 0) {
    return Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    const markupGallery = dataArrs
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
  page,
}) {
  return `
      <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" width="auto"/>
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
                <p class="info-item">
                    <b>page ${page}</b>
                </p>
            </div>
        </div>
    `;
}

function onLoadMore() {
  loadMoreRef.style.visibility = 'hidden';
}

function clearInput() {
  galleryRef.innerHTML = '';
  page = 1;
}

galleryRef.style.display = 'flex';
galleryRef.style.justifyContent = 'center';
galleryRef.style.flexWrap = 'wrap';
galleryRef.style.gap = '30px';

// pfotoCardRef.style.width = '350px';
// pfotoCardRef.style.height = '200px';
// pfotoCardRef.style.outlineWidth = '5px dotted green';
// pfotoCardRef.style.outlineColor = 'coral';
// pfotoCardRef.style.outlineStyle = 'solid';
