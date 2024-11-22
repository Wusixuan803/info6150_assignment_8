const apiBaseURL = "https://my-json-server.typicode.com/Wusixuan803/myproject";

// Simulated local database for front-end-only operations
let books = [];

// Fetch and render books on the homepage
if (window.location.pathname.includes("index.html")) {
  fetch(apiBaseURL + "/books")
    .then((response) => response.json())
    .then((fetchedBooks) => {
      books = fetchedBooks; // Store fetched books in the local array
      renderBooks(); // Render the books dynamically
    })
    .catch((error) => console.error("Error fetching books:", error));
}

// Function to render books dynamically
function renderBooks() {
  const bookList = document.getElementById("book-list");
  if (!bookList) {
    console.error("Error: #book-list container not found in index.html.");
    return;
  }

  bookList.innerHTML = ""; // Clear previous content

  books.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("book-item");

    bookItem.innerHTML = `
      <img src="${book.image_url}" alt="${book.title}" class="book-image">
      <div class="book-info">
        <a href="book.html?id=${book.id}">${book.title}</a>
        <p class="book-author">by ${book.author}</p>
        <button class="delete-button" data-id="${book.id}">Delete</button>
        <a href="edit.html?id=${book.id}"><button>Edit</button></a>
      </div>`;
    bookList.appendChild(bookItem);
  });

  // Add delete event listeners to dynamically created delete buttons
  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const bookId = parseInt(event.target.getAttribute("data-id"));
      deleteBook(bookId);
    });
  });
}

// Delete a book and refresh the UI
function deleteBook(bookId) {
  const stringBookId = bookId.toString();

  const bookIndex = books.findIndex((book) => book.id === stringBookId);

  if (bookIndex === -1) {
    alert(`Error: Book with ID ${bookId} not found.`);
    console.error(`Book with ID ${bookId} not found.`);
    return;
  }

  books.splice(bookIndex, 1);

  renderBooks();

  alert(`Book with ID ${bookId} deleted successfully!`);
}

// Fetch and display a single book's details
if (window.location.pathname.includes("book.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = parseInt(urlParams.get("id"));

  fetch(apiBaseURL + "/books/" + bookId)
    .then((response) => response.json())
    .then((book) => {
      const bookDetails = document.getElementById("book-details");
      bookDetails.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.image_url}" alt="${
        book.title
      }" class="book-detail-image">
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Published:</strong> ${book.publish_date}</p>
        <p><strong>Pages:</strong> ${book.page_count}</p>
        <p><strong>Subjects:</strong> ${book.subjects.join(", ")}</p>`;
    })
    .catch((error) => console.error("Error fetching book details:", error));
}

// Edit a book and display its current details
if (window.location.pathname.includes("edit.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id");

  if (books.length === 0) {
    fetch(apiBaseURL + "/books")
      .then((response) => response.json())
      .then((fetchedBooks) => {
        books = fetchedBooks;
        loadBookDetails(bookId);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        alert("Failed to load book data. Redirecting to homepage.");
        window.location.href = "index.html";
      });
  } else {
    loadBookDetails(bookId);
  }
}

function loadBookDetails(bookId) {
  const book = books.find((b) => b.id === bookId);

  if (book) {
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("publish_date").value = book.publish_date;
    document.getElementById("page_count").value = book.page_count;
    document.getElementById("subjects").value = book.subjects.join(", ");
    document.getElementById("image_url").value = book.image_url;

    document
      .getElementById("editForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();

        book.title = document.getElementById("title").value;
        book.author = document.getElementById("author").value;
        book.publish_date = document.getElementById("publish_date").value;
        book.page_count = document.getElementById("page_count").value;
        book.subjects = document
          .getElementById("subjects")
          .value.split(",")
          .map((subject) => subject.trim());
        book.image_url = document.getElementById("image_url").value;

        console.log("Updated book data:", book);

        alert("Book updated successfully!");

        window.location.href = "index.html";
      });
  } else {
    console.error(`Book with ID ${bookId} not found.`);
    alert(`Error: Book with ID ${bookId} not found.`);
    window.location.href = "index.html";
  }
}

// Add a new book
if (window.location.pathname.includes("create.html")) {
  document
    .getElementById("create-book-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const newBook = {
        id: books.length ? books[books.length - 1].id + 1 : 1, // Generate a new ID
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        publish_date: document.getElementById("publish_date").value,
        page_count: document.getElementById("page_count").value,
        subjects: document
          .getElementById("subjects")
          .value.split(",")
          .map((subject) => subject.trim()),
        image_url: document.getElementById("image_url").value || "",
      };

      books.push(newBook); // Add to simulated local database
      console.log("Simulated book creation:", newBook);
      alert("Book created successfully!");

      document.getElementById("create-book-form").reset();
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    });
}
