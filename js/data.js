const booksArr = [];
const categoriesArr = [];

const RENDER_BOOK = 'render-book';
const RENDER_CATEGORY = 'render-category';
const STORAGE_BOOK = 'BOOKS';
const STORAGE_CATEGORY = 'CATEGORIES';
const USER_ACTIVITY = 'ACTIVITY';
const SESSION_NAME = 'SESSION_BOOK_NAME';
const SESSION_CATEGORY = 'SESSION_BOOK_CATEGORY';

let dataActivity = {
  visitPage: 0,
  openReadme: 0,
  openTab: 0,
  changeTheme: 0,
  addBook: 0,
  deleteBook: 0,
  filterBook: 0,
  editStatus: 0,
  addCategory: 0,
  editCategory: 0,
  deleteCategory: 0,
  tryAllFeature: 0
}