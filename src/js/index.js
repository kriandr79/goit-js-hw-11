import ImagesApiService from './images-api-service.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const imagesService = new ImagesApiService();

hideElement(refs.loadMoreBtn); // за замовченням прячемо кнопку
lightboxRun();  // запускаемо Simplelightbox, будемо оновлювати refresh при додаванні розмітки

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);


function onSubmit(e) {
  e.preventDefault();

  hideElement(refs.loadMoreBtn);

  imagesService.query = e.target.searchQuery.value.trim();

  if (imagesService.query === '') {
    return Notiflix.Notify.failure('Input your real search query', {
      timeout: 2000,
    });
  }

  imagesService.resetPage();
  imagesService
    .fetchImages()
    .then(({ hits, total }) => {
      if (hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          {
            timeout: 2000,
          }
        );
      } else {
        clearCardsContainer();
        appendCardsMarkup(hits);
       

        Notiflix.Notify.success(`Hooray! We found ${total} images.`, {
          timeout: 2000,
        });
      }

      // якщо кількість карток більша за дефолтну кількість карток на сторінці - то показуємо кнопку "Завантажити ще"
      if (total > imagesService.perPage) {
        showElement(refs.loadMoreBtn); // показуємо кнопку
      }
    })
    .catch(console.log);
}

function onLoadMore() {
  const currentPage = imagesService.currentPage;
  const totalPages = imagesService.totalPages;

  imagesService
    .fetchImages()
    .then(({ hits, total }) => {
      console.log(totalPages);
      console.log(currentPage);

      appendCardsMarkup(hits);

      if (totalPages === currentPage) {
        hideElement(refs.loadMoreBtn);

        return Notiflix.Notify.failure(
          `We're sorry, but you've reached the end of search results - ${total} objects.`,
          {
            timeout: 2000,
          }
        );
      }
    })
    .catch(console.log);
}

function createMarkup(cards) {

  return cards
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: </b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views:</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments:</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads:</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>
`
    )
    .join('');
}

function appendCardsMarkup(cards) {
  refs.gallery.insertAdjacentHTML('beforeend', createMarkup(cards));
  lightbox.refresh();
}

function clearCardsContainer() {
  refs.gallery.innerHTML = '';
}

function showElement(element) {
  element.classList.remove('is-hidden');
}

function hideElement(element) {
  element.classList.add('is-hidden');
}

// Функція запуску плагіна SimpleLightbox
function lightboxRun() {
  return lightbox = new SimpleLightbox('.gallery a', {
    /* options */
    overlay: true,
    overlayOpacity: 0.7,
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
}




// Если пустой результат - обработку +++
// CSS
// скрол
// большая картинка  +++
// проверка на totalHits +++
