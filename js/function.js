const generateId = () => {
  return +new Date();
}

const checkStorage = () => {
  if(typeof (Storage) === undefined){
    alert('Browser tidak mendukung local stroage');
    return false;
  }

  return true;
}

const generateBookObject = (id, title, category, author, release, status) => {
  return {
    id,
    title,
    category,
    author, 
    release,
    status
  }
}

const generateCategoryObject = (id, name) => {
  return {
    id,
    name
  }
}

const userActivity = (action) => {
  let {visitPage, openReadme, openTab, changeTheme, addBook, deleteBook, filterBook, editStatus, addCategory, editCategory, deleteCategory, tryAllFeature} = dataActivity;

  switch(action) {
    case 'visitPage':
      dataActivity.visitPage += 1;
    break;
    case 'openReadme':
      if(openReadme == 0){
        dataActivity.openReadme = 1;
      }
    break;
    case 'openTab':
      if(openTab == 0){
        dataActivity.openTab = 1;
      }
    break;
    case 'changeTheme':
      if(changeTheme == 0){
        dataActivity.changeTheme = 1;
      }
    break;
    case 'addCategory':
      if(addCategory == 0){
        dataActivity.addCategory = 1;
      }
    break;
    case 'editCategory':
      if(editCategory == 0){
        dataActivity.editCategory = 1;
      }
    break;
    case 'deleteCategory':
      if(deleteCategory == 0){
        dataActivity.deleteCategory = 1;
      }
    break;
    case 'addBook':
      if(addBook == 0){
        dataActivity.addBook = 1;
      }
    break;
    case 'editStatus':
      if(editStatus == 0){
        dataActivity.editStatus = 1;
      }
    break;
    case 'filterBook':
      if(filterBook == 0){
        dataActivity.filterBook = 1;
      }
    break;
    case 'deleteBook':
      if(deleteBook == 0){
        dataActivity.deleteBook = 1;
      }
    break;
    case 'tryAllFeature':
      if(tryAllFeature == 0){
        dataActivity.tryAllFeature = 1;
      }
    break;
  }

  if(!tryAllFeature){
    if(openReadme && openTab && changeTheme && addBook && deleteBook && editStatus && filterBook && addCategory && editCategory && deleteCategory){
      message.classList.remove('hide');
      messageText.innerHTML = `
        <h2>Yeay, selamat 🤩</h2>
        <p>Kamu sudah mencoba semua fitur yang ada di web ini, terimakasih banyak sudah mau mencobanya 🥳</p>
      `;
    }
  }

  saveLocalData();
}

const loadLocalData = () => {
  const localBook = localStorage.getItem(STORAGE_BOOK);
  const localCategory = localStorage.getItem(STORAGE_CATEGORY);
  const localActivity = localStorage.getItem(USER_ACTIVITY);
  const sessionName = sessionStorage.getItem(SESSION_NAME);

  const bookJson = JSON.parse(localBook);
  const categoryJson = JSON.parse(localCategory);
  const activityJson = JSON.parse(localActivity);

  if(bookJson !== null){
    for(const book of bookJson){
      booksArr.push(book);
    }
  }

  if(categoryJson !== null){
    for(const category of categoryJson){
      categoriesArr.push(category);
    }
  }

  filterName.value = sessionName;

  dataActivity = activityJson;
  userActivity('visitPage');

  document.dispatchEvent(new Event(RENDER_CATEGORY));
  document.dispatchEvent(new Event(RENDER_BOOK));
}

const saveLocalData = () => {
  if(checkStorage()){
    const bookParsed = JSON.stringify(booksArr);
    const categoryParsed = JSON.stringify(categoriesArr);
    const acttivityParsed = JSON.stringify(dataActivity);

    localStorage.setItem(STORAGE_BOOK, bookParsed);
    localStorage.setItem(STORAGE_CATEGORY, categoryParsed);
    localStorage.setItem(USER_ACTIVITY, acttivityParsed);
  }
}

const findIndexData = (id, type) => {
  if(type == 'book'){
    for(const index in booksArr){
      if(booksArr[index].id === id){
        return index
      }
    }
  
    return -1;
  } else {
    for(const index in categoriesArr){
      if(categoriesArr[index].id === id){
        return index
      }
    }
  
    return -1;
  }
}

const findData = (id, type) => {
  if(type == 'book'){
    for(const book of booksArr){
      if(book.id === id) return book;
    }

    return null;
  } else {
    for(const category of categoriesArr){
      if(category.id === id) return category;
    }

    return null;
  }
}

const findCategoryName = (id) => {
  for(const category of categoriesArr){
    if(category.id === id) return category.name;
  }

  return 'Kategori sudah dihapus';
}

const confirmDelete = (id, type, name) => {
  const questionContent = createQuestion(id, type, name);
  question.classList.remove('hide');
  question.append(questionContent);
}

// -----------------------------------------------------
//  CATEGORY
// -----------------------------------------------------

const createRowCategory = (categoryJson) => {
  const trData = document.createElement('tr');
  trData.setAttribute('row-id', categoryJson.id);
  
  trData.addEventListener('click', (evt) => {
    evt.stopPropagation();
    getDetailCategory(categoryJson.id);
  });

  const tdData = document.createElement('td');
  const spanName = document.createElement('span');
  spanName.innerText = categoryJson.name;

  const buttonDelete = document.createElement('button');
  buttonDelete.classList.add('button', 'button-delete');

  buttonDelete.addEventListener('click', (evt) => {
    evt.stopPropagation();
    confirmDelete(categoryJson.id, 'category', 'kategori');
  });

  const iconDelete = document.createElement('i');
  iconDelete.classList.add('fa-trash');

  buttonDelete.append(iconDelete);
  tdData.append(spanName, buttonDelete);
  trData.append(tdData);

  return trData;
}

const addCategory = () => {
  const generatedId = generateId();
  const categoryName = document.querySelector('input[name="category-name"]').value;
  const categoryObject = generateCategoryObject(generatedId, categoryName);

  setTimeout(() => {
    loader.classList.add('hide');
    categoriesArr.push(categoryObject);
    document.dispatchEvent(new Event(RENDER_CATEGORY));
    userActivity('addCategory');
    createToast('Kategori berhasil ditambahkan', 'success');
  }, loaderTimer);

  formAddCategory.reset();
}

const getDetailCategory = (id) => {
  const dataTarget = findData(id, 'category');
  const inputId = document.querySelector('input[name="update-category-id"]');
  const inputName = document.querySelector('input[name="update-category-name"]');
  inputId.value = dataTarget.id;
  inputName.value = dataTarget.name;
  modal.classList.remove('hide');
}

const updateCategory = () => {
  const inputId = parseInt(document.querySelector('input[name="update-category-id"]').value);
  const inputName = document.querySelector('input[name="update-category-name"]').value;
  const dataTarget = findData(inputId, 'category');
  modal.classList.add('hide');

  setTimeout(() => {
    loader.classList.add('hide');

    if(dataTarget === null){
      createToast('Katgeori gagal diubah', 'failed');
      return;
    }
    
    dataTarget.name = inputName;
    document.dispatchEvent(new Event(RENDER_BOOK));
    document.dispatchEvent(new Event(RENDER_CATEGORY));
    userActivity('editCategory');
    createToast('Kategori berhasil diubah', 'success');
  }, loaderTimer);
}

// -----------------------------------------------------
//  BOOK
// -----------------------------------------------------

const createBookContent = (bookJson) => {
  const bookWrapper = document.createElement('div') ;
  bookWrapper.classList.add('book-wrapper');

  const bookBody = document.createElement('div');
  const bookCategory = findCategoryName(bookJson.category);
  bookBody.classList.add('book-body');
  bookBody.innerHTML = `
    <h3 class="book-title">${bookJson.title} <small class="text-normal">(${bookJson.release})</small></h3>
    <p class="text-muted">${bookCategory}</p>
    <p class="book-author">${bookJson.author}</p>
  `;

  const bookFooter = document.createElement('div');
  bookFooter.classList.add('book-footer');

  const buttonDelete = document.createElement('button');
  buttonDelete.classList.add('button', 'button-delete');
  buttonDelete.innerHTML = '<i class="fa-trash"></i> Hapus';

  buttonDelete.addEventListener('click', () => {
    confirmDelete(bookJson.id, 'book', 'buku');
  });

  if(bookJson.status){
    const buttonRepeat = document.createElement('button');
    buttonRepeat.classList.add('button', 'button-repeat');
    buttonRepeat.innerHTML = '<i class="fa-repeat"></i> Baca Ulang';

    buttonRepeat.addEventListener('click', () => {
      loader.classList.remove('hide');
      updateStatus(bookJson.id, false);
    });

    bookFooter.append(buttonRepeat, buttonDelete);
  } else {
    const buttonDone = document.createElement('button');
    buttonDone.classList.add('button', 'button-success');
    buttonDone.innerHTML = '<i class="fa-success"></i> Selesai';

    buttonDone.addEventListener('click', () => {
      loader.classList.remove('hide');
      updateStatus(bookJson.id, true);
    });

    bookFooter.append(buttonDone, buttonDelete);
  }

  bookWrapper.append(bookBody, bookFooter);

  return bookWrapper;
}

const addBook = () => {
  const generatedId = generateId();
  const bookTitle = document.querySelector('input[name="book-title"]').value;
  const bookCategory = document.querySelector('select[name="book-category"]');
  const bookCategoryValue = parseInt(bookCategory.value);
  const bookAuthor = document.querySelector('input[name="book-author"]').value;
  const bookReleaseDate = document.querySelector('input[name="book-release"]').value;
  const bookStatus = document.querySelector('input[name="book-status"]').checked;
  const bookObject = generateBookObject(generatedId, bookTitle, bookCategoryValue, bookAuthor, bookReleaseDate, bookStatus);

  setTimeout(() => {
    loader.classList.add('hide');
    booksArr.push(bookObject);
    document.dispatchEvent(new Event(RENDER_BOOK));
    userActivity('addBook');
    createToast('Buku berhasil ditambahkan', 'success');
  }, loaderTimer);

  formAddBook.reset();
  bookCategory.classList.remove('active');
}

const updateStatus = (id, bookStatus) => {
  const dataTarget = findData(id, 'book');

  setTimeout(() => {
    loader.classList.add('hide');

    if(dataTarget === null){
      createToast('Status buku gagal diubah', 'failed');
      return;
    }
    
    dataTarget.status = bookStatus;
    document.dispatchEvent(new Event(RENDER_BOOK));
    userActivity('editStatus');
    createToast('Status buku berhasil diubah', 'success');
  }, loaderTimer);
}

const filterBook = () => {
  const bookName = filterName.value.toLowerCase();
  const bookCategory = filterCategory.value.toLowerCase();

  sessionStorage.setItem(SESSION_NAME, bookName);
  sessionStorage.setItem(SESSION_CATEGORY, bookCategory);

  setTimeout(() => {
    loader.classList.add('hide');

    document.dispatchEvent(new Event(RENDER_BOOK));
    document.dispatchEvent(new Event(RENDER_CATEGORY));
    userActivity('filterBook');
  }, loaderTimer);
}

const handleFilterName = (elem) => {
  if(elem.key === 'Enter'){
    filterBook();
  }
}

const handleFilterCategory = () => {
  loader.classList.remove('hide');
  filterBook();
}

const resetCounter = (elem) => {
  const wordCounters = elem.querySelectorAll('.word-counter')

  for(counter of wordCounters) {
    counter.setAttribute('class', 'form-help word-counter');
    counter.querySelector('.counter').innerText = '0';
  }
}