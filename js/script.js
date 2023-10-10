document.addEventListener('DOMContentLoaded', () => {
  if(checkStorage()){
    if(localStorage.getItem(USER_ACTIVITY) === null){
      const activityParsed = JSON.stringify(dataActivity);
      localStorage.setItem(USER_ACTIVITY, activityParsed);
    }

    if(sessionStorage.getItem(SESSION_NAME) === null){
      sessionStorage.setItem(SESSION_NAME, "");
    }

    if(sessionStorage.getItem(SESSION_CATEGORY) === null){
      sessionStorage.setItem(SESSION_CATEGORY, "");
    }

    loadLocalData();
    const localActivity = JSON.parse(localStorage.getItem(USER_ACTIVITY));
    if(localActivity.visitPage <= 1){
      message.classList.remove('hide');
      messageText.innerHTML = `
        <h2>Halo, selamat datang 🤗</h2>
        <p>Salam kenal, saya Rizki Adi pembuat website ini, sepertinya kamu baru pertama kali membuka website ini. Untuk panduan dalam menggunakan website ini kamu bisa klik icon <i class="fa-question text-muted"></i> pada navbar atau kamu bisa mencoba semuanya sendiri. Terimakasih atas waktu dan perhatiannya, selamat menggunakan website ini. 👋</p>
      `;
    }
  }

  formAddBook.addEventListener('submit', (evt) => {
    evt.preventDefault();
    addBook();
    resetCounter(evt.target);
    loader.classList.remove('hide');
  });

  formFilterBook.addEventListener('submit', (evt) => {
    evt.preventDefault();
    filterBook();
    loader.classList.remove('hide');
  });

  formAddCategory.addEventListener('submit', (evt) => {
    evt.preventDefault();
    addCategory();
    resetCounter(evt.target);
    loader.classList.remove('hide');
  });

  formEditCategory.addEventListener('submit', (evt) => {
    evt.preventDefault();
    updateCategory();
    loader.classList.remove('hide');
  });
});

document.addEventListener(RENDER_BOOK, () => {
  const tabUndone = document.getElementById('tab-undone');
  const tabDone = document.getElementById('tab-done');
  const sessionName = sessionStorage.getItem(SESSION_NAME);
  const sessionCategory = sessionStorage.getItem(SESSION_CATEGORY);

  tabUndone.innerHTML = '';
  tabDone.innerHTML = '';

  let filterNameBook = booksArr.filter(book => book.title.toLowerCase().includes(sessionName));
  let filterCategoryBook;
  if(sessionCategory){
    filterCategoryBook = filterNameBook.filter((data) => {
      return data.category == sessionCategory;
    });
  } else {
    filterCategoryBook = filterNameBook;
  }

  const bookUndone = [];
  const bookDone = [];

  for(const data of filterCategoryBook){
    const bookContent = createBookContent(data);

    if(!data.status){
      tabUndone.append(bookContent);
      bookUndone.push(data);
    } else {
      tabDone.append(bookContent);
      bookDone.push(data);
    }
  }

  if(!bookUndone.length){
    tabUndone.innerHTML = `
      <div class="book-empty">
        <p>Tambah buku baru untuk dibaca yuk!</p>
      </div>
    `;
  }

  if(!bookDone.length){
    tabDone.innerHTML = `
      <div class="book-empty">
        <p>Jangan lupa untuk selesaikan buku yang kamu baca ya!</p>
      </div>
    `;
  }
});

document.addEventListener(RENDER_CATEGORY, () => {
  const tbody = document.querySelector('.table tbody');
  const bookSelect = document.querySelector('select[name="book-category"]');
  const filterSelect = document.querySelector('select[name="filter-category"]');
  const selectedFilterCategory = sessionStorage.getItem(SESSION_CATEGORY);

  tbody.innerHTML = '';
  bookSelect.innerHTML = '';
  filterSelect.innerHTML = '';

  if(categoriesArr.length){
    bookSelect.insertAdjacentHTML('afterbegin', `
      <option value="" selected disabled>Kategori Buku</option>
    `);

    filterSelect.insertAdjacentHTML('afterbegin', `
      <option value="" selected>Semua</option>
    `);

    for(const data of categoriesArr){
      const categoryRow = createRowCategory(data);
      tbody.append(categoryRow);
    
      bookSelect.insertAdjacentHTML('beforeend', `
        <option value="${data.id}">${data.name}</option>
      `);
      
      filterSelect.insertAdjacentHTML('beforeend', `
        <option value="${data.id}" ${(data.id == selectedFilterCategory) ? 'selected' : '' } >${data.name}</option>
      `);
    }

    filterSelect.classList.add('active');
  } else {
    tbody.innerHTML = `
      <tr>
        <td class="empty">Data kategori masih kosong</td>
      </tr>
    `;

    bookSelect.innerHTML = '<option value="" selected disabled>Kategori masih kosong</option>';
    filterSelect.innerHTML = '<option value="" selected disabled>Kategori</option>';
    filterSelect.classList.remove('active');
  }
});