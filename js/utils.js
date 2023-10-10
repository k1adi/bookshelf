// -----------------------------------------------------
// Readme, Message, Modal, Alert & Toast
// -----------------------------------------------------

const closeModal = () => {
  modal.classList.add('hide');
}

const openReadme = () => {
  readme.classList.remove('hide');
  userActivity('openReadme');
}

const closeReadme = () => {
  readme.classList.add('hide');
}

const closeMessage = () => {
  let {visitPage, openReadme, openTab, changeTheme, addBook, deleteBook, filterBook, editStatus, addCategory, editCategory, deleteCategory, tryAllFeature} = dataActivity;
  
  if(!tryAllFeature){
    if(openReadme && openTab && changeTheme && addBook && deleteBook && editStatus && filterBook && addCategory && editCategory && deleteCategory){
      userActivity('tryAllFeature');
    }
  }
  message.classList.add('hide');
}

const closeQuestion = (elem) => {
  const questionContent = elem.parentNode;
  question.classList.add('hide');

  setTimeout(() => {
    question.removeChild(questionContent);
  }, 200);
}

const createQuestion = (dataId, dataType, dataName) => {
  const questionContent = document.createElement('div');
  questionContent.classList.add('alert-content');

  const questionIcon = document.createElement('img');
  questionIcon.setAttribute('src', 'assets/question.png');
  questionIcon.setAttribute('alt', 'Question icon');

  const questionTitle = document.createElement('h2');
  questionTitle.innerText = `Hapus ${dataName}`;

  const questionDesc = document.createElement('p');
  questionDesc.innerText = `${dataName} akan dihapus secara permanen!`;

  const buttonCancel = document.createElement('span');
  buttonCancel.setAttribute('class', 'button button-muted');
  buttonCancel.innerText = 'Batal';

  buttonCancel.addEventListener('click', (evt) => {
    closeQuestion(evt.currentTarget);
  });

  const buttonDelete = document.createElement('span');
  buttonDelete.setAttribute('class', 'button button-delete');
  buttonDelete.innerText = 'Hapus';

  buttonDelete.addEventListener('click', () => {
    loader.classList.remove('hide');
    buttonCancel.click();
    const indexTarget = findIndexData(dataId, dataType);

    setTimeout(() => {
      loader.classList.add('hide');
      if(dataType === 'book'){
        booksArr.splice(indexTarget, 1);
        createToast('Buku berhasil dihapus', 'success');
        userActivity('deleteBook');
      } else {
        categoriesArr.splice(indexTarget, 1);
        createToast('Kategori berhasil dihapus', 'success');
        userActivity('deleteCategory');
      }

      document.dispatchEvent(new Event(RENDER_BOOK));
      document.dispatchEvent(new Event(RENDER_CATEGORY));
    }, loaderTimer);
  });

  questionContent.append(questionIcon, questionTitle, questionDesc, buttonCancel, buttonDelete);

  return questionContent;
}

const createToast = (msg, variant) => {
  const toastContent = document.createElement('div');
  toastContent.classList.add('toast-content');

  const toastMsg = document.createElement('span');
  toastMsg.classList.add('toast-text', variant);
  toastMsg.innerText = msg;

  const toastClose = document.createElement('span');
  toastClose.classList.add('toast-close');
  toastClose.innerText = '✕';

  toastClose.addEventListener('click', (evt) => {
    removeToast(evt.currentTarget);
  });

  toastMsg.append(toastClose);
  toastContent.append(toastMsg);
  toast.append(toastContent);

  setTimeout(() => {
    toastContent.classList.add('show');
    setTimeout(() => {
      if(toast.contains(toastContent)){
        toastClose.click();
      }
    }, 5000);
  }, 500);
}

const removeToast = (elem) => {
  const parentToast = elem.parentNode.parentNode;
  parentToast.classList.remove('show');

  setTimeout(() => {
    toast.removeChild(parentToast);
  }, 300);
} 

// -----------------------------------------------------
//  Open Readme, Open Tab, Card Collapse & Change Theme
// -----------------------------------------------------

for(const link of tabLinks){
  link.addEventListener('click', (evt) => {    
    const targetLink = evt.target.dataset.section;
    const sectionTab = document.getElementById(targetLink);
    handleTabLinks(sectionTab);
    evt.target.classList.add('active');

    userActivity('openTab');
  });
}

const handleTabLinks = (sectionTarget) => {
  for(const section of tabSection){
    section.classList.remove('active');
  }
  sectionTarget.classList.add('active');

  for(const link of tabLinks){
    link.classList.remove('active');
  }
}

const handleSelectCategory = (elem) => {
  if(elem.value != null){
    elem.classList.add('active');
  } else {
    elem.classList.rewmove('active');
  }
} 

const tableCollapse = (elem) => {
  const parentCard = elem.parentNode.parentNode;
  const cardBody = parentCard.querySelector('.table');

  cardBody.classList.toggle('hide');
  elem.classList.toggle('rotate');
}

const changeTheme = (elem) => {
  const imgIcon = elem.children[0];
  if(body.classList.contains('dark')){
    body.classList.remove('dark');
    body.classList.add('light');
    imgIcon.setAttribute('src', 'assets/sun-icon.png');
    imgIcon.setAttribute('alt', 'Sun icon');
  } else {
    body.classList.add('dark');
    body.classList.remove('light');
    imgIcon.setAttribute('src', 'assets/moon-icon.png');
    imgIcon.setAttribute('alt', 'Moon Icon');
  }

  userActivity('changeTheme');
}

const wordCounter = (elem) => {
  const maxLength = elem.getAttribute('maxlength');
  const currentLength = elem.value.length;
  const wordCounter = elem.nextElementSibling;
  const counter = wordCounter.querySelector('.counter');

  if (currentLength <= (maxLength - 16)) {
    wordCounter.setAttribute('class', 'form-help word-counter')
  }

  if (currentLength >= (maxLength - 15) && currentLength < (maxLength - 1)) {
    wordCounter.setAttribute('class', 'form-help word-counter yellow')
  }

  if (currentLength == maxLength) {
    wordCounter.setAttribute('class', 'form-help word-counter red')
  }

  counter.innerText = currentLength;
}