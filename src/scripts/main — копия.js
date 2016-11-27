let APP = {};

if( !localStorage.getItem('savedBooks') || localStorage.getItem('savedBooks') === "undefined") {
  localStorage.setItem('savedBooks', dummyBooks);
};

APP.savedBooks = JSON.parse(localStorage.getItem('savedBooks'));

APP.editor = {

  setStorageBooks() {
    localStorage.setItem('savedBooks', JSON.stringify(APP.savedBooks));
    this.booksDomOutput();
  },

  getInputVal(selector) {
    const selectorValue = $('.editor input[name="' + selector + '"]').val();
    return selectorValue;
  },

  setInputVal(selector, value) {
    $('.editor input[name="' + selector + '"]').val(value);
  },

  someValidation() {
    let ready = false;

    if($('input[name="name"]').val() !== '' && $('input[name="author"]').val() !== '') {
      ready = true;
      $('.save').removeClass('disabled')
    } else {
      ready = false;
      $('.save').addClass('disabled')
    }
  },

  bookConstructor() {
    const
      t = this,
      bookObj = {
        id:     APP.savedBooks.length,
        name:   this.getInputVal('name'),
        author: this.getInputVal('author'),
        year:   this.getInputVal('year'),
        pages:  this.getInputVal('pages'),
      }

    APP.savedBooks.push(bookObj);
    t.setStorageBooks();
  },

  fillEditorData(editableBook) {
    const bookData =  APP.savedBooks[editableBook];
    this.setInputVal('name', bookData.name);
    this.setInputVal('author', bookData.author);
    this.setInputVal('year', bookData.year);
    this.setInputVal('pages', bookData.pages);
    this.setInputVal('id', bookData.id);
  },

  editExistingBook(position) {
    const saveTo = APP.savedBooks[position - 1];

    saveTo.name = this.getInputVal('name');
    saveTo.author = this.getInputVal('author');
    saveTo.year =   this.getInputVal('year');
    saveTo.pages =  this.getInputVal('pages');
    this.setStorageBooks();
  },

  removeBook(position) {
    APP.savedBooks.splice(position,1);
    this.setStorageBooks();
  },

  resetForm() {
    document.getElementById('editor').reset();
  },

  booksDomOutput() {
    $('.books-list').html('');

    for(const book of APP.savedBooks) {
      let
        bookTemplate = `
          <li class="book">
            <h3 class="book-name">${book.name}</h3>
            <p class="book-author">${book.author}</p>
            <a class="book-button book-edit" href="#">Edit</a>
            <a class="book-button book-remove" href="#">Remove</a>
          </li>
        `;

      $('.books-list').append(bookTemplate);
    }
  },

  init() {
    const t = this;

    $('.editor input').on('keyup', function () {
      t.someValidation();
    });

    $('.save').on('click', (e) => {
      e.preventDefault();
      const existingBookId = parseInt($('input[name="id"]').val());

      if(!existingBookId) {
        t.bookConstructor();
      } else {
        t.editExistingBook(existingBookId);
      }

      t.resetForm();
    });


    $(document).on('click', '.book-button', (e) => {
      const bookIndex = $(e.target.parentNode).index();

      if(e.target.className.indexOf('edit') >=0) {
        t.fillEditorData(bookIndex);
      } else {
        t.removeBook(bookIndex);
      }
    });

    $('.clear-storage').on('click', ()=> {
      localStorage.clear();
      APP.savedBooks = {};
      t.booksDomOutput();
    });

    t.booksDomOutput();
  }
}

$(() => {
  APP.editor.init();
});
