let quotes = [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Make it work, make it right, make it fast.", category: "Motivation" }
];

// Load quotes from localStorage if available
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) quotes = JSON.parse(stored);
}
loadQuotes();

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show a random quote, filtered by selected category
function showRandomQuote() {
  const display = document.getElementById('quoteDisplay');
  const category = localStorage.getItem('selectedCategory') || "all";

  const filteredQuotes = category === "all"
    ? quotes
    : quotes.filter(q => q.category === category);

  if (filteredQuotes.length === 0) {
    display.textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  display.textContent = `"${quote.text}" - ${quote.category}`;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert("Both quote and category are required!");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  alert("Quote added!");
}

// Populate category dropdown
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  select.innerHTML = '<option value="all">All Categories</option>';

  uniqueCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.text = cat;
    select.appendChild(option);
  });

  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) select.value = savedCategory;
}

// Filter quotes by category
function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selected);
  showRandomQuote();
}

// Export quotes to JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error reading JSON file.");
    }
  };

  reader.readAsText(file);
}

// ✅ Simulate fetching quotes from server with async/await
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    const data = await response.json();
    return data.map(item => ({
      text: item.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Failed to fetch quotes from server.");
    return [];
  }
}

// ✅ Simulate posting quotes to server with async/await
async function postQuotesToServer(quotesToPost) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(quotesToPost),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const data = await response.json();
    console.log("Quotes posted to server:", data);
  } catch (error) {
    console.error("Post error:", error);
    alert("Failed to post quotes to server.");
  }
}

// ✅ Sync quotes with async/await
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  if (serverQuotes.length === 0) return;

  const userConfirmed = confirm("New server quotes found. Overwrite local quotes?");
  if (userConfirmed) {
    quotes = serverQuotes;
    saveQuotes();
    populateCategories();
    showRandomQuote();
    alert("Quotes synced from server!");
  }

  await postQuotesToServer(quotes);
}

// Periodic sync every 60 seconds
setInterval(syncQuotes, 60000);

// Event listener for "Show New Quote"
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initial setup
populateCategories();
showRandomQuote();
function createAddQuoteForm() {
  const container = document.createElement('div');

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.placeholder = 'Enter a new quote';
  container.appendChild(quoteInput);

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';
  container.appendChild(categoryInput);

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);
  container.appendChild(addButton);

  document.body.appendChild(container);
}
