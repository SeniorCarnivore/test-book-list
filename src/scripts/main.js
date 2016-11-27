if( !localStorage.getItem('savedBooks') || localStorage.getItem('savedBooks') === "undefined") {
  localStorage.setItem('savedBooks', dummyBooks);
};

class APP {
  constructor() {
    this.savedBooks =  JSON.parse(localStorage.getItem('savedBooks'));
    this.handleEvents();
    this.booksDomOutput();
  }

  setStorageBooks() {
    localStorage.setItem('savedBooks', JSON.stringify(this.savedBooks));
    this.booksDomOutput();
  }

  getInputVal(selector) {
    const selectorValue = $('.editor input[name="' + selector + '"]').val();
    return selectorValue;
  }

  setInputVal(selector, value) {
    $('.editor input[name="' + selector + '"]').val(value);
  }

  someValidation() {
    let ready = false;

    if($('input[name="name"]').val() !== '' && $('input[name="author"]').val() !== '') {
      ready = true;
      $('.save').removeClass('disabled')
    } else {
      ready = false;
      $('.save').addClass('disabled')
    }
  }

  bookConstructor() {
    const bookObj = {
      id:     this.generateUUID(),
      name:   this.getInputVal('name'),
      author: this.getInputVal('author'),
      year:   this.getInputVal('year'),
      pages:  this.getInputVal('pages'),
    }

    this.savedBooks.push(bookObj);
    this.setStorageBooks();
    this.resetForm();
  }

  fillEditorData(id) {
    for(let bookData of this.savedBooks) {
      if(bookData.id === id) {
        this.setInputVal('name', bookData.name);
        this.setInputVal('author', bookData.author);
        this.setInputVal('year', bookData.year);
        this.setInputVal('pages', bookData.pages);
        this.setInputVal('id', bookData.id);
      }
    }
  }

  editExistingBook(id) {
    for(let saveTo of this.savedBooks) {
      console.log(id, saveTo.id);
      if(saveTo.id === id) {
        saveTo.name = this.getInputVal('name');
        console.log(saveTo.name);
        saveTo.author = this.getInputVal('author');
        saveTo.year =   this.getInputVal('year');
        saveTo.pages =  this.getInputVal('pages');
      }
    }

    this.setStorageBooks();
    this.resetForm();
  }

  removeBook(id) {
    let position,
        counter = 0;

    for(let removeMe of this.savedBooks) {
      counter += 1;
      if(removeMe.id === id) {
        position = counter - 1;
      }
    }

    this.savedBooks.splice(position, 1);
    this.setStorageBooks();
  }

  resetForm() {
    document.getElementById('editor').reset();
    $('input[name="id"]').val('');
  }

  booksDomOutput() {
    $('.books-list').html('');

    for(const book of this.savedBooks) {
      let bookTemplate = `
        <li class="book" data-id="${book.id}">
          <h3 class="book-name">${book.name}</h3>
          <p class="book-author">${book.author}</p>
          <a class="book-button book-edit" href="#">Edit</a>
          <a class="book-button book-remove" href="#">Remove</a>
        </li>
      `;

      $('.books-list').append(bookTemplate);
    }
  }

  generateUUID() {
    let d = new Date().getTime(),
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  handleEvents() {
    const t = this;

    $('.editor input').on('keyup', function () {
      t.someValidation();
    });

    $('.save').on('click', (e) => {
      e.preventDefault();
      const existingBookId = $('input[name="id"]').val();

      if(!existingBookId) {
        t.bookConstructor();
      } else {
        t.editExistingBook(existingBookId);
      }
    });


    $(document).on('click', '.book-button', (e) => {
      const bookIndex = $(e.target.parentNode).attr('data-id');

      if(e.target.className.indexOf('edit') >=0) {
        t.fillEditorData(bookIndex);
      } else {
        t.removeBook(bookIndex);
      }
    });

    $('.clear-storage').on('click', ()=> {
      localStorage.clear();
      this.savedBooks = {};
      t.booksDomOutput();
    });
  }
};

$(() => {
  new APP();
});
