const bookForm = document.getElementById("book-form");
const searchForm = document.getElementById("search-form");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const yearInput = document.getElementById("year");
const isCompleteInput = document.getElementById("isComplete");
const searchInput = document.getElementById("searchInput");

const container = document.getElementById("container");
const unfinishedList = document.getElementById("unfinished-list");
const finishedList = document.getElementById("finished-list");

const noBook = document.getElementById("no-book");

const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-form");
const editTitle = document.getElementById("editTitle");
const editAuthor = document.getElementById("editAuthor");
const editYear = document.getElementById("editYear");
const closeModal = document.getElementById("closeModal");
let idBookEdit;
let newTitle;
let newAuthor;
let newYear;

const booksKey = "BOOKS";

document.addEventListener("DOMContentLoaded", function () {

    const getBooksFromLocalStorage = () => JSON.parse(localStorage.getItem(booksKey)) || [];
    const saveBooksToLocalStorage = (books) => localStorage.setItem(booksKey, JSON.stringify(books));

    function addBookToShelf(title, author, year, isComplete) {
        const book = {
            id: +new Date(),
            title,
            author,
            year,
            isComplete
        };

        const books = getBooksFromLocalStorage();
        books.push(book);
        saveBooksToLocalStorage(books);

        renderBooks();
    }

    bookForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = titleInput.value;
        const author = authorInput.value;
        const year = parseInt(yearInput.value);
        const isComplete = isCompleteInput.checked;

        addBookToShelf(title, author, year, isComplete);

        clearFormInputs();
    });

    function createBookElement(book) {
        const bookContainer = document.createElement("div");
        bookContainer.classList.add("book");

        const bookImage = createBookImage();
        const titleContainer = createTitleContainer(book);
        const actionButtons = createActionButtons(book);

        bookContainer.appendChild(bookImage);
        bookContainer.appendChild(titleContainer);

        const shelfContainer = document.createElement("div");
        shelfContainer.classList.add("shelf");

        shelfContainer.appendChild(bookContainer);
        actionButtons.forEach((actionButton) =>
            shelfContainer.appendChild(actionButton));

        return shelfContainer;
    }

    function renderBooks(b) {
        const books = b != undefined ? b : getBooksFromLocalStorage();

        clearBookshelves();
        displayBooks(books);
        toggleNoBookMessage(books.length);
    }

    const toggleNoBookMessage = (bookCount) => noBook.style.visibility = bookCount === 0 ? "visible" : "hidden";

    function displayBooks(books) {
        books.forEach((book) => {
            const bookElement = createBookElement(book);
            const targetList = book.isComplete ? finishedList : unfinishedList;

            targetList.appendChild(bookElement);
        });
    }

    function clearBookshelves() {
        unfinishedList.innerHTML = "";
        finishedList.innerHTML = "";
    }

    function toggleBookCompletion(id) {
        const books = getBooksFromLocalStorage();
        const index = books.findIndex((book) => book.id === id);
        books[index].isComplete = !books[index].isComplete;
        saveBooksToLocalStorage(books);
        renderBooks();
    }

    function searchBooks(keyword) {
        const books = getBooksFromLocalStorage();
        const filteredBooks = books.filter((book) => {
            const bookInfo = `${book.title} ${book.author} ${book.year}`;
            return bookInfo.toLowerCase().includes(keyword.toLowerCase());
        });

        renderBooks(filteredBooks);
    }

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const keyword = searchInput.value.trim();
        searchBooks(keyword);
    });

    function editBook(id, newTitle, newAuthor, newYear) {
        const books = getBooksFromLocalStorage();
        const index = books.findIndex((book) => book.id === id);

        if (index !== -1) {
            books[index].title = newTitle;
            books[index].author = newAuthor;
            books[index].year = parseInt(newYear);
            saveBooksToLocalStorage(books);
            renderBooks();
        }
    }

    function deleteBook(id) {
        const books = getBooksFromLocalStorage();
        const filteredBooks = books.filter((book) => book.id !== id);
        saveBooksToLocalStorage(filteredBooks);
        renderBooks();
    }

    editForm.addEventListener("submit", function (event) {
        event.preventDefault();

        newTitle = editTitle.value;
        newAuthor = editAuthor.value;
        newYear = editYear.value;
        editBook(idBookEdit, newTitle, newAuthor, newYear);

        closeEditModal();
    });

    const displayEditModal = () => editModal.style.display = "block";
    const closeEditModal = () => editModal.style.display = "none";

    closeModal.addEventListener("click", closeEditModal);

    function createBookImage() {
        const bookImage = document.createElement("img");
        bookImage.src = "assets/image/default-book.png";
        bookImage.alt = "Gambar Buku";
        bookImage.title = "Buku";

        return bookImage;
    }

    function createTitleContainer(book) {
        const titleContainer = document.createElement("div");
        titleContainer.classList.add("title");

        const titleHeader = document.createElement("h3");
        titleHeader.innerHTML = book.title;

        const authorParagraph = document.createElement("p");
        authorParagraph.innerHTML = `oleh ${book.author}`;

        const yearParagraph = document.createElement("p");
        yearParagraph.innerHTML = `tahun ${book.year}`;

        titleContainer.appendChild(titleHeader);
        titleContainer.appendChild(authorParagraph);
        titleContainer.appendChild(yearParagraph);

        return titleContainer;
    }

    function createActionButtons(book) {
        const actionButtons = [
            createButton("move-button", book.isComplete ? "Pindahkan ke Belum Selesai" : "Pindahkan ke Selesai", function () {
                toggleBookCompletion(book.id);
            }),
            createButton("edit-button", "Edit", function () {
                prepareEditModal(book);
                displayEditModal();
            }),
            createButton("remove-button", "Hapus", function () {
                deleteBook(book.id);
            }),
        ];

        return actionButtons;
    }

    function createButton(className, text, clickHandler) {
        const button = document.createElement("button");
        button.classList.add(className);
        button.innerHTML = text;
        button.addEventListener("click", clickHandler);
        return button;
    }

    function prepareEditModal(book) {
        idBookEdit = book.id;
        editTitle.value = book.title;
        editAuthor.value = book.author;
        editYear.value = book.year;
    }

    function clearFormInputs() {
        titleInput.value = "";
        authorInput.value = "";
        yearInput.value = "";
        isCompleteInput.checked = false;
    }

    renderBooks();
});