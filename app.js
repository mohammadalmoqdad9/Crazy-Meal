// app.js

const STORAGE_KEY = 'crazyMealOrders';

// Constructor function (أو class)
function Order(mealName, mealPrice, mealImage) {
  this.mealName = mealName;
  this.mealPrice = mealPrice;
  this.mealImage = mealImage; // dataURL 
  this.id = Date.now(); 
}


const orderForm = document.getElementById('orderForm');
const mealNameInput = document.getElementById('mealName');
const mealPriceInput = document.getElementById('mealPrice');
const mealImageInput = document.getElementById('mealImage');
const ordersList = document.getElementById('ordersList');
const clearAllBtn = document.getElementById('clearAllBtn');

document.getElementById('year').textContent = new Date().getFullYear();

// localStorage
function loadOrders() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse orders from storage', e);
    return [];
  }
}

// save orders localStorage
function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}


function renderOrders() {
  const orders = loadOrders();
  ordersList.innerHTML = ''; 
  if (orders.length === 0) {
    ordersList.innerHTML = '<tr><td colspan="4">There are Request yet.</td></tr>';
    return;
  }

  orders.forEach(order => {
    const tr = document.createElement('tr');

    const imgTd = document.createElement('td');
    const img = document.createElement('img');
    img.src = order.mealImage || 'images/placeholder.png';
    img.alt = order.mealName;
    imgTd.appendChild(img);

    const nameTd = document.createElement('td');
    nameTd.textContent = order.mealName;

    const priceTd = document.createElement('td');
    priceTd.textContent = order.mealPrice;

    const delTd = document.createElement('td');
    const delBtn = document.createElement('button');
    delBtn.textContent = 'حذف';
    delBtn.style.background = '#ff6b6b';
    delBtn.style.border = '0';
    delBtn.style.padding = '6px 10px';
    delBtn.style.borderRadius = '6px';
    delBtn.style.color = 'white';
    delBtn.addEventListener('click', () => {
      deleteOrder(order.id);
    });
    delTd.appendChild(delBtn);

    tr.appendChild(imgTd);
    tr.appendChild(nameTd);
    tr.appendChild(priceTd);
    tr.appendChild(delTd);

    ordersList.appendChild(tr);
  });
}


function deleteOrder(id) {
  const orders = loadOrders().filter(o => o.id !== id);
  saveOrders(orders);
  renderOrders();
}


function clearAllOrders() {
  if (!confirm('هل تريد مسح كل الطلبات؟')) return;
  localStorage.removeItem(STORAGE_KEY);
  renderOrders();
}

orderForm.addEventListener('submit', function(ev) {
  ev.preventDefault();

  const name = mealNameInput.value.trim();
  const price = mealPriceInput.value;
  const file = mealImageInput.files[0];

  if (!name || !price) {
    alert('Please Fill in The Name of The Meal and The Price.');
    return;
  }

  if (!file) {
    const order = new Order(name, price, '');
    const orders = loadOrders();
    orders.push(order);
    saveOrders(orders);
    orderForm.reset();
    renderOrders();
    return;
  }

  // Data URL
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const order = new Order(name, price, dataUrl);
    const orders = loadOrders();
    orders.push(order);
    saveOrders(orders);
    orderForm.reset();
    renderOrders();
  };
  reader.readAsDataURL(file);
});

clearAllBtn.addEventListener('click', clearAllOrders);

document.addEventListener('DOMContentLoaded', function() {
  renderOrders();
});