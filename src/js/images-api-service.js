import axios from 'axios';

const API_KEY = '38931219-81f95ff04be64d9b8b5d6502d';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImagesApiService {
  constructor() {
    this.totalPages = 0;
    this.params = {
      q: '',
      page: 1,
      per_page: 40,
      key: API_KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    };
  }

  async fetchImages() {
    
    try {
      const data = await axios.get(`${BASE_URL}`, { params: this.params });

      this.totalPages = Math.ceil(data.data.total / this.params.per_page); // рахуємо, скільки буде всього сторінок для вибраної кількості картинок
      this.nextPage();
      return data.data;

    } catch (err) {
      console.log(err);
    }
  }

  nextPage() {
    this.params.page += 1;
  }

  resetPage() {
    this.params.page = 1;
  }

  get currentPage() {
    return this.params.page;
  }

  get perPage() {
    return this.params.per_page;
  }

  get query() {
    return this.params.q;
  }

  set query(newQuery) {
    this.params.q = newQuery;
  }
}