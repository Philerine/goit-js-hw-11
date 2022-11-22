import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const KEY = '31417578-856302b05e9be1bd780d83d86';

export default class ImagesApi {
  constructor() {
    this.query = '';
    this.page = 1;
  }

  async fetchImages() {
    const filters = `key=${KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    const { data } = await axios.get(`${URL}?${filters}`);
    const { totalHits } = data;

    const totalPages = Math.ceil(totalHits / 40);

    if (this.page > totalPages && totalHits !== 0) {
      return null;
    }

    data.page = this.page;

    this.page += 1;

    return data;
  }

  resetPage() {
    this.page = 1;
  }
}
