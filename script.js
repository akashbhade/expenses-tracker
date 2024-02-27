let expenses = [];

// Load expenses from localStorage when the page loads
window.onload = function() {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
        displayExpenses();
        calculateTotalExpenses();
        calculateCategoryWiseAnalysis();
    }
};

function addExpense() {
    const amountInput = document.getElementById('expense-amount');
    const categoryInput = document.getElementById('expense-category');
    const dateInput = document.getElementById('expense-date');

    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value.trim();
    const date = dateInput.value;

    if (isNaN(amount) || category === '' || date === '') {
        alert('Please fill in all fields correctly.');
        return;
    }

    const expense = {
        amount,
        category,
        date
    };

    expenses.push(expense);
    saveExpensesToLocalStorage(); // Save expenses to localStorage

    displayExpenses();
    calculateTotalExpenses();
    calculateCategoryWiseAnalysis();
    
    amountInput.value = '';
    categoryInput.value = '';
    dateInput.value = '';
}

function saveExpensesToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function displayExpenses() {
    const expensesList = document.getElementById('expenses-list');
    expensesList.innerHTML = '';

    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Amount:</strong> ₹${expense.amount.toFixed(2)} - <strong>Category:</strong> ${expense.category} - <strong>Date:</strong> ${expense.date} <button onclick="editExpense(${index})">Edit</button> <button onclick="deleteExpense(${index})">Delete</button>`;
        expensesList.appendChild(li);
    });
}

function calculateTotalExpenses() {
    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    document.getElementById('total-expenses').textContent = '₹' + totalExpenses.toFixed(2);
}

function calculateCategoryWiseAnalysis() {
    const categoryWiseAnalysis = {};
    expenses.forEach(expense => {
        if (categoryWiseAnalysis[expense.category]) {
            categoryWiseAnalysis[expense.category] += expense.amount;
        } else {
            categoryWiseAnalysis[expense.category] = expense.amount;
        }
    });

    const categoryWiseAnalysisElement = document.getElementById('category-wise-analysis');
    categoryWiseAnalysisElement.innerHTML = '<h3>Category-wise Analysis</h3>';
    for (const category in categoryWiseAnalysis) {
        const amountInRupees = categoryWiseAnalysis[category].toFixed(2);
        categoryWiseAnalysisElement.innerHTML += `<p>${category}: ₹${amountInRupees}</p>`;
    }
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    saveExpensesToLocalStorage(); // Save expenses to localStorage
    displayExpenses();
    calculateTotalExpenses();
    calculateCategoryWiseAnalysis();
}

function editExpense(index) {
    const expense = expenses[index];
    const amount = prompt('Enter new amount:', expense.amount);
    const category = prompt('Enter new category:', expense.category);
    const date = prompt('Enter new date:', expense.date);

    if (amount !== null && category !== null && date !== null) {
        expenses[index] = {
            amount: parseFloat(amount),
            category: category.trim(),
            date
        };
        saveExpensesToLocalStorage(); // Save expenses to localStorage
        displayExpenses();
        calculateTotalExpenses();
        calculateCategoryWiseAnalysis();
    }
}

function filterExpenses() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (startDate === '' || endDate === '') {
        alert('Please select both start and end dates.');
        return;
    }

    const filteredExpenses = expenses.filter(expense => {
        return expense.date >= startDate && expense.date <= endDate;
    });

    const expensesList = document.getElementById('expenses-list');
    expensesList.innerHTML = '';
    filteredExpenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Amount:</strong> ₹${expense.amount.toFixed(2)} - <strong>Category:</strong> ${expense.category} - <strong>Date:</strong> ${expense.date} <button onclick="editExpense(${index})">Edit</button> <button onclick="deleteExpense(${index})">Delete</button>`;
        expensesList.appendChild(li);
    });

    const totalExpenses = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
    document.getElementById('total-expenses').textContent = '₹' + totalExpenses.toFixed(2);
    calculateCategoryWiseAnalysis();
}
