// Load transactions from localStorage or initialize with an empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Select DOM elements
const balanceEl = document.getElementById('balance'); // Display balance
const formEl = document.getElementById('transactionForm'); // Form element
const descriptionEl = document.getElementById('description'); // Transaction description input
const amountEl = document.getElementById('amount'); // Transaction amount input
const typeEl = document.getElementById('type'); // Transaction type dropdown
const tableEl = document.getElementById('transactionsTable').getElementsByTagName('tbody')[0]; // Table body
const exportBtn = document.getElementById('exportButton'); // Export button

// Function to calculate and update the balance
function updateBalance() {
    const balance = transactions.reduce((total, transaction) => {
        return transaction.type === 'income'
            ? total + transaction.amount
            : total - transaction.amount;
    }, 0);

    balanceEl.textContent = `Balance: ₹${balance.toFixed(2)}`;
}

// Function to add a transaction to the table
function addTransactionToTable(transaction, index) {
    const row = tableEl.insertRow();
    row.innerHTML = `
        <td>${transaction.description}</td>
        <td>₹${transaction.amount.toFixed(2)}</td>
        <td>${transaction.type}</td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
    `;
}

// Function to display a "No transactions" message
function displayEmptyMessage() {
    tableEl.innerHTML = `
        <tr class="empty-message">
            <td colspan="4">
                <img src="img1.jpg" alt="No data" style="height:250px;width:350px;display:block;margin:0 auto;">
                <p style="color:red;text-align:center;font-weight:bold">No transactions yet</p>
            </td>
        </tr>
    `;
}

// Function to display transactions in the table
function displayTransactions() {
    tableEl.innerHTML = '';
    if (transactions.length === 0) {
        displayEmptyMessage();
    } else {
        transactions.forEach((transaction, index) => {
            addTransactionToTable(transaction, index);
        });
    }
    updateBalance();
}

// Function to add a new transaction
function addTransaction(e) {
    e.preventDefault(); // Prevent form submission
    const transaction = {
        description: descriptionEl.value,
        amount: parseFloat(amountEl.value),
        type: typeEl.value
    };
    transactions.push(transaction); // Add transaction to the array
    localStorage.setItem('transactions', JSON.stringify(transactions)); // Save to localStorage
    displayTransactions(); // Refresh the display
    formEl.reset(); // Reset the form
}

// Function to delete a transaction
function deleteTransaction(index) {
    transactions.splice(index, 1); // Remove transaction by index
    localStorage.setItem('transactions', JSON.stringify(transactions)); // Update localStorage
    displayTransactions(); // Refresh the display
}

// Function to export transactions to PDF
function exportTransactionsToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text('Transactions Report', 20, 20); // Add title
    doc.autoTable({
        head: [['Description', 'Amount', 'Type']], // Table headers
        body: transactions.map(transaction => [
            transaction.description,
            `₹${transaction.amount.toFixed(2)}`,
            transaction.type
        ]),
    });

    doc.save('transactions.pdf'); // Save the PDF
}

// Event listener for form submission
formEl.addEventListener('submit', addTransaction);

// Event listener for table row actions
tableEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        deleteTransaction(e.target.dataset.index); // Delete transaction
    }
});

// Event listener for exporting to PDF
exportBtn.addEventListener('click', exportTransactionsToPDF);

// Initial display of transactions
displayTransactions();