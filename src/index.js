import refs from './js/refs';
import ImagesApi from './js/fetchImages';
import smoothScroll from './js/smoothScroll';

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const images = new ImagesApi();

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function isHiddenLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

function onSearch(e) {
  e.preventDefault();
  clearGallery();
  isHiddenLoadMoreBtn();

  images.query = e.currentTarget.elements.searchQuery.value.trim();

  
  if (images.query === '') {
    Notiflix.Notify.failure('Empty request!');
    return;
  }

  images.resetPage();

  const queryImg = true;
  createGalleryMarkup(queryImg);
}

async function createGalleryMarkup(queryImg = false) {
  try {
    const data = await images.fetchImages();
    const { hits, totalHits, page } = data;
    if (data === null) return;

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (queryImg) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    const markup = hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<a class="photo-card" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>${likes}
      </p>
      <p class="info-item">
        <b>Views</b>${views}
      </p>
      <p class="info-item">
        <b>Comments</b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>${downloads}
      </p>
    </div>
  </a>`;
        }
      )
      .join('');

    refs.gallery.insertAdjacentHTML('beforeend', markup);

    showLoadMoreBtn();
    new SimpleLightbox('.gallery a', {
      captionDelay: 250,
    });

    if (page * 40 >= totalHits) {
      isHiddenLoadMoreBtn();

      Notiflix.Notify.failure(
        "You've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreBtn() {
  const queryImg = false;
  await createGalleryMarkup(queryImg);
  smoothScroll();
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}







