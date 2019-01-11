// Book Class: Representa un libro
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

}

// UI Class: Gestionar tareas en UI
class UI {

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`
        const text = document.createTextNode(message);
        div.appendChild(text);
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //Desaparecer en 2 segundos
        setTimeout(() => {document.querySelector('.alert').remove()}, 2000);
    }



    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = ` 
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);

    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();

        }
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class : Gestiona Almacenamiento
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn ){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    
    }
    
}

// Evento: Mostrar libro

document.addEventListener('DOMContentLoaded', UI.displayBooks());


// Evento: Añadir libro

document.addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values 
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Por favor, rellene todos los campos del formulario', 'danger')
    } else {
        // Instantiate Book
        const book = new Book(title, author, isbn);

        // Add Book to UI
        UI.addBookToList(book);
        
        //Add Book to Store
        Store.addBook(book);

        // Show success message
        UI.showAlert('Libro añadido','success');

        // Clear Fields  
        UI.clearFields();


    };

});

// Evento: Borrar libro
document.querySelector('#book-list').addEventListener('click', (e) => {
    //Remove book from UI
    UI.deleteBook(e.target);
    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Libro eliminado','success');
});