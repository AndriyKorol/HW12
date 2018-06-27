// Class Book
class Book {
    constructor(title, author, id) {
        this.title = title;
        this.author = author;
        this.id = id;
    }
}

// Class UI
class UI {
    addBookToList(book) {
        // Get book list
        const list = document.querySelector('.book-list tbody');
        // Create markup
        //додав стилі для іконки на кнопці, щоб вона не піддавалася ніяким діям мишки
        const tr = `
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.id}</td>
        <td>
            <button id=${book.id} class="waves-effect waves-light btn red right" >Delete <i style="pointer-events: none" class="material-icons right">close</i></button>
        </td>
      </tr>
    `;
        list.insertAdjacentHTML('afterbegin', tr);
    }

    //метод для видалення елемента з UI
    //приймає Ід кнопки, яку ми натиснули, і по ній шукає HTMLNode. потім бере батьківський елемет раз ( це буда комірка таблиці td),
    //а потім ще раз беремо баткьівським елемент (це буде рядок таблиц) а потім його видаляємо
    removeBookFromList(id) {
        // Get book list
        let line = document.getElementById(id);
        // Create markup
        line = line ? line.parentNode.parentNode : null;
        if (line) line.remove();
    }

    showAlert(message, type) {

        // Create markup
        const alert = `
      <div class="card alert ${type === 'error' ? 'red' : 'green'}">
        <div class="card-content white-text">
          <span class="card-title">${type === 'error' ? 'Error' : 'Success'}</span>
          <p>${message}</p>
        </div>
      </div>
    `;

        // Get title
        const cardTitle = document.querySelector('.card-title');
        // Get button
        const btn = document.querySelector('form button');
        // Disabled btn
        btn.disabled = true;

        // Insert alert
        cardTitle.insertAdjacentHTML('afterend', alert);

        setTimeout(function () {
            document.querySelector('.alert').remove();
            btn.disabled = false;
        }, 2000);
    }
    confirmationMsg(val){
        return confirm(val);
    }
}

// Class Local Storage
class Store {
    getBooks() {
        let books;
        if(!localStorage.getItem('books')) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books')); // Перегоняем их из json в обычный массив
        }
        return books;
    }

    addBook(book) {
        // Get books from localstorage
        const books = this.getBooks();
        // Add new book
        books.unshift(book);
        // Save localstorage
        localStorage.setItem('books', JSON.stringify(books));
        // 1. Получаем из хранилища книги
        // 2. Перегоняем их из json в обычный массив
        // 3. добавляем в полученный массив новую книгу
        // 4. перегоняем из обычного массива в json
        // 5. сохраняем в хранилище
    }

    //отримуємо всі книжки зі стору
    removeBook(id) {
        let books = this.getBooks();
        let index = books.findIndex(function(item) {
            return item.id == id;
        })
        if (index > -1) {
            books.splice(index, 1);
            localStorage.setItem('books', JSON.stringify(books));
            return true;
        }
        return false;
    }
}

// Event DOMContentLoaded
document.addEventListener('DOMContentLoaded', function (e) {
    // Создаем экземпляр класса Store
    const store = new Store();
    // Create ui
    const ui = new UI();
    // Получаем все книги из хранилища
    const books = store.getBooks();
    // Добавляем книги из хранилища в разметку
    books.forEach(book => ui.addBookToList(book));
    //delete item from the list
});

// Event submit
document.forms['addBookForm'].addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const title = this.elements['book_title'].value,
        author = this.elements['book_author'].value,
        id = this.elements['book_id'].value;

    // Create book
    const book = new Book(title, author, id);
    // Create ui
    const ui = new UI();
    // Get Store
    const store = new Store();

    // Validate
    if (title === '' || author === '' || id === '') {
        // Show error
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        // Add book to ui
        ui.addBookToList(book);
        // Show success message
        ui.showAlert('Book added!', 'success');
        // Add book to localstorage
        store.addBook(book);
    }
    document.forms['addBookForm'].reset();
});

//delete book from the list
//додав хендлер для ТБоді щоб хендлити кліки
//коли хендлиться клік, перевіряється чи id об'єкту по якому клікнули не пусте і виконується функція ремувБук зі стору а потім і з UI
items = document.querySelectorAll('.book-list');
items[0].addEventListener('click', function (e) {
    if (e.target.id != '') {
        const ui = new UI();
        let message = ui.confirmationMsg('Do you want to delete a book?');
        if(!message) return;
        let store = new Store();
        store.removeBook(e.target.id);
        ui.removeBookFromList(e.target.id);
        ui.showAlert('Book deleted!', 'success');
    }
});
