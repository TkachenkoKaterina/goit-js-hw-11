const axios = require('axios').default;
import Notiflix from 'notiflix';

const inputRef = document.querySelector('input');
const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreRef = document.querySelector('.load-more');
loadMoreRef.setAttribute('disabled', true);

const pfotoCardRef = document.querySelector('.photo-card');

const onFormhRef = formRef.addEventListener('submit', onSubmit);
const onLoadMoreRef = formRef.addEventListener('click', onLoadMore);

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
  let page = 1;
  console.log(page);
  const response = await axios.get(
    `https://pixabay.com/api/?key=32131085-77c33ae4af62fbdfe36accafe&q=
        ${dataInput}
        &image_type=photo
        &iorientation=horizontal
        &safesearch=true
        &per_page=40
        &page=${page}`
  );
  console.log(response);
  console.log(response.data);

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
                <p class="info-item">
                    <b>page ${page}</b>
                </p>
            </div>
        </div>
    `;
}

function onLoadMore() {
  // loadMoreRef.style.visibility = 'hidden';
  let page = 1;
  fetchGallery();
  page += 1;
  console.log(page);
}

function clearInput() {
  galleryRef.innerHTML = '';
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

// .thumb {
//   height: 400px;
//   width: 300px;
// }

// Второй - изображение необходимо «вместить» в контейнер, задав высоту и ширину 100%.

// .thumb > img {
//   display: block;
//   height: 100%;
//   width: 100%;
// }

// После этого к изображению можно применять свойство object-fit.

// .thumb > img {
//   display: block;
//   height: 100%;
//   width: 100%;

//   object-fit: cover;
// }
