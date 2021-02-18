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
const transactions = getStorage();

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

    const html = `
    <td class="description">${element.description}</td>
    <td class="${cssClass}">${amount}</td>
    <td class="date">${element.date}</td>
    <td><img onclick="removeTransaction(${index})" src="assets/minus.svg" alt="Remover transação"></td>
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
function getStorage() {
    return localStorage.getItem('dev.finances-transactions') !== null ? JSON.parse(localStorage.getItem('dev.finances-transactions')) : [];
}

function setStorage() {
    localStorage.setItem('dev.finances-transactions', JSON.stringify(transactions));
}

//Início / reload
function init() {
    createDOM();
    updateBalance();
    getStorage();
}

function reload() {
    init()
}

init();

