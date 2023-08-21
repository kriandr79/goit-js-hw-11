import axios from 'axios';

const API_KEY = '38931219-81f95ff04be64d9b8b5d6502d';
const BASE_URL = 'https://pixabay.com/api/';

axios.defaults.params = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalPages = 0;
    this.params = {
      per_page: 40,
    };
  }

  async fetchImages() {
    axios.defaults.params['q'] = this.searchQuery;
    axios.defaults.params['page'] = this.page;

    try {
      const data = await axios.get(`${BASE_URL}`, { params: this.params });

      this.totalPages = Math.ceil(data.data.total / this.params.per_page);

      this.nextPage();
      return data.data;
    } catch (err) {
      console.log(err);
    }
  }

  nextPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get currentPage() {
    return this.page;
  }
  get perPage() {
    return this.params.per_page;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
