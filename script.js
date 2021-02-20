//Modal / form
function openModal() {
    document.querySelector('.modal-overlay').classList.add('active');
}

function closeModal() {
    document.querySelector('.modal-overlay').classList.remove('active');
    removeErrorMessage();

    const { description, amount, date } = getValuesForm();

    description.value = '';
    amount.value = '';
    date.value = '';
}

function form(e) {
    e.preventDefault();
    removeErrorMessage();

    if (validateFields()) {
        addTransaction(formatValues(getValuesForm()));
        closeModal();
    }
}

function getValuesForm() {
    return {
        description: document.querySelector('input#description'),
        amount: document.querySelector('input#amount'),
        date: document.querySelector('input#date')
    };
}

function removeErrorMessage() {

    for (let error of document.querySelectorAll('.msg-error')) {
        error.remove();
    }
}

function validateFields() {
    let check = true;
    const { description, amount, date } = getValuesForm();
    const fields = [];

    fields.push(description, amount, date);

    fields.forEach((element) => {

        if (!element.value) {
            const p = document.createElement('p');

            element.insertAdjacentElement('afterend', p);
            p.innerHTML = 'Preencha o campo.';
            p.classList.add('msg-error');

            check = false;
        }
    })

    return check;
}

//Transação
function incomes() {
    let income = 0;

    transactions.forEach(element => {
        if (element.amount > 0) income += element.amount;
    });

    return income;
}

function expenses() {
    let expense = 0;

    transactions.forEach(element => {
        if (element.amount < 0) expense += element.amount;
    });

    return expense;
}

function total() {
    return incomes() + expenses();
}

//Tabela transações / balance
const transactions = getStorageTransactions();

function addTransaction(transaction) {
    transactions.push(transaction);
    setStorage();
    reload();
}

function removeTransaction(index) {
    transactions.splice(index, 1);
    setStorage();
    reload();
}

function createTransactions(element, index, cssClass) {
    const amount = formatCurrency(element.amount);
    const darkClass = checkCheckbox()? 'dark-mode-active' : '';
    const html = `
    <td class="description ${darkClass}">${element.description}</td>
    <td class="${cssClass} ${darkClass}">${amount}</td>
    <td class="date ${darkClass}">${element.date}</td>
    <td class="${darkClass}" style="cursor: pointer;"><img  onclick="removeTransaction(${index})" src="assets/minus.svg" alt="Remover transação"></td>
    ` ;

    return html;
}

function createDOM() {
    const tbody = document.querySelector('#data-table tbody');
    clearDOM(tbody);

    transactions.forEach((element, index) => {
        const cssClass = element.amount < 0 ? 'expense' : 'income';
        const tr = document.createElement('tr');

        addDOM(tr, tbody, createTransactions(element, index, cssClass));
    });
}

function addDOM(tr, tbody, transaction) {
    tr.innerHTML = transaction;
    tbody.appendChild(tr);
}

function updateBalance() {
    document.querySelector('#incomeDisplay')
        .innerHTML = formatCurrency(incomes());
    document.querySelector('#expenseDisplay')
        .innerHTML = formatCurrency(expenses());
    document.querySelector('#totalDisplay')
        .innerHTML = formatCurrency(total());
}

function clearDOM(tbody) {
    tbody.innerHTML = '';
}

//formatações
function formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : '';

    value = String(value).replace(/\D/g, '');
    value = Number(value) / 100;
    value = value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return signal + value;
}

function formatAmount(value) {
    value = Math.round(Number(value) * 100);

    return value;
}

function formatDate(value) {
    value = value.split('-');

    return `${value[2]}/${value[1]}/${value[0]}`;
}

function formatValues(values) {
    const description = values.description.value;
    const amount = formatAmount(values.amount.value);
    const date = formatDate(values.date.value);

    return {
        description,
        amount,
        date
    }
}

//Local storage
function getStorageTransactions() {
    return localStorage.getItem('dev.finances-transactions') !== null ? 
    JSON.parse(localStorage.getItem('dev.finances-transactions')) : [];
}

function getStorageDarkMode() {
    return localStorage.getItem('dark-mode')? true : false;
}

function setStorage(value) {
    localStorage.setItem('dev.finances-transactions', JSON.stringify(transactions));
    localStorage.setItem('dark-mode', value);
}

//dark mode
function darkMode() {

    if (checkCheckbox()) {
        document.querySelector('body').classList.add('dark-mode-active');
        document.querySelectorAll('.card')[0].classList.add('dark-mode-active');
        document.querySelectorAll('.card')[1].classList.add('dark-mode-active');
        document.querySelector('.card.total').classList.add('dark-mode-active');
        document.querySelector('a').classList.add('dark-mode-active');
        document.querySelectorAll('#data-table th')[0].classList.add('dark-mode-active');
        document.querySelectorAll('#data-table th')[1].classList.add('dark-mode-active');
        document.querySelectorAll('#data-table th')[2].classList.add('dark-mode-active');
        document.querySelectorAll('#data-table th')[3].classList.add('dark-mode-active');
        document.querySelector('.modal').classList.add('dark-mode-active');
        document.querySelector('input#description').classList.add('dark-mode-active');
        document.querySelector('input#amount').classList.add('dark-mode-active');
        document.querySelector('input#date').classList.add('dark-mode-active');
        document.querySelector('button').classList.add('dark-mode-active');
        document.querySelector('.input-group small').classList.add('dark-mode-active');
        document.querySelector('#form h2').classList.add('dark-mode-active');

        reload();
    }
    else {
        document.querySelector('body').classList.remove('dark-mode-active');
        document.querySelectorAll('.card')[0].classList.remove('dark-mode-active');
        document.querySelectorAll('.card')[1].classList.remove('dark-mode-active');
        document.querySelector('.card.total').classList.remove('dark-mode-active');
        document.querySelector('a').classList.remove('dark-mode-active');
        document.querySelector('#data-table th').classList.remove('dark-mode-active');
        document.querySelectorAll('#data-table th')[1].classList.remove('dark-mode-active');
        document.querySelectorAll('#data-table th')[2].classList.remove('dark-mode-active');
        document.querySelectorAll('#data-table th')[3].classList.remove('dark-mode-active');
        document.querySelector('.modal').classList.remove('dark-mode-active');
        document.querySelector('input#description').classList.remove('dark-mode-active');
        document.querySelector('input#amount').classList.remove('dark-mode-active');
        document.querySelector('input#date').classList.remove('dark-mode-active');
        document.querySelector('button').classList.remove('dark-mode-active');
        document.querySelector('.input-group small').classList.remove('dark-mode-active');
        document.querySelector('#form h2').classList.remove('dark-mode-active');
        
        reload();
    }
}

function checkCheckbox() {
    if (document.querySelector('input.dark-mode-checkbox').checked) {
        return true;
    }
    return false;
}

//Início / reload
function init() {
    createDOM();
    updateBalance();
    getStorageTransactions();
    console.log(getStorageDarkMode())
    getStorageDarkMode();
}

function reload() {
    init()
}

init();

