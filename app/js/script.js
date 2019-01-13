// God save the Dev
'use strict';

// Rendering stuff table

let stuffListUrl = '../db.json',
  stuffList,
  loader = document.getElementById('loader'),
  tableLoader = document.getElementById('table-loader'),
  pagination = document.getElementById('pagination'),
  searchInput = document.getElementById('searchInput'),
  itemsOnPage = 20;

// Get data from server:
const getStuff = () => {
  fetch(stuffListUrl)
    .then(response => {
      if (response.status !== 200) {
        alert(
          'Looks like with getting stuff list was a problem. Status Code: ' +
            response.status
        );
        return;
      }

      response.json().then(data => {
        setTimeout(function() {
          loader.style.display = 'none';
        }, 1000);
        stuffList = data;
        initPagination(stuffList.length);
        renderStuff(stuffList, 1);
        return;
      });
    })
    .catch(error => {
      alert(
        'There has been a problem with your fetch operation: ' + error.message
      );
    });
};
getStuff();

// Initialize table pagination:
const initPagination = stuffQuontity => {
  let pagesQuontity = Math.ceil(stuffQuontity / itemsOnPage);
  for (let i = 0; i < pagesQuontity; i++) {
    let page = document.createElement('a');
    if (i == 0) page.classList.add('active');
    page.href = '/';
    page.setAttribute('data-page', `${i + 1}`);
    page.innerHTML = i + 1;
    pagination.appendChild(page);
  }
};

// Pagination functionality:
const makePaging = event => {
  event.preventDefault();
  let target = event.target;
  if (target.tagName == 'A') {
    tableLoader.style.display = 'block';
    var elems = document.querySelectorAll('#pagination a.active');
    for (var i = 0; i < elems.length; i++) {
      elems[i].classList.remove('active');
    }
    target.classList.add('active');
    let selectedPage = target.attributes.getNamedItem('data-page').value;
    renderStuff(stuffList, selectedPage);
  }
};

// Add event on pagination:
pagination.addEventListener('click', makePaging, true);

// Clearing the table contents:
const clean = () => {
  let table = document.getElementById('innerContent');
  while (table.firstChild) {
    table.firstChild.remove();
  }
};

// Rendering of the stuff table:
const renderStuff = (stuff, page) => {
  clean();
  searchInput.value = '';
  let table = document.getElementById('innerContent');
  let startItem = (page - 1) * itemsOnPage;
  let endItem = page * itemsOnPage;
  for (let i = startItem; i < endItem; i++) {
    let tr = document.createElement('tr');
    for (let key in stuff[i]) {
      let td = document.createElement('td');
      td.innerHTML = `${stuff[i][key]}`;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  tableLoader.style.display = 'none';
};

const sortStuffAlphabetically = n => {
  let table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById('table');
  rows = table.rows;

  switching = true;
  dir = 'asc';

  while (switching) {
    switching = false;
    // Loop through all table rows (except the first and the last, which contains table headers and footer:
    for (i = 1; i < rows.length - 2; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName('TD')[n];
      y = rows[i + 1].getElementsByTagName('TD')[n];
      if (dir == 'asc') {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == 'desc') {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else if (switchcount == 0 && dir == 'asc') {
      dir = 'desc';
      switching = true;
    }
  }
};

const sortStuffByPrice = n => {
  let table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById('table');
  switching = true;
  dir = 'asc';
  while (switching) {
    switching = false;
    rows = table.rows;
    // Loop through all table rows (except the first and the last, which contains table headers and footer:
    for (i = 1; i < rows.length - 2; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName('TD')[n];
      y = rows[i + 1].getElementsByTagName('TD')[n];
      if (dir == 'asc') {
        if (Number(x.innerHTML) > Number(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == 'desc') {
        if (Number(x.innerHTML) < Number(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == 'asc') {
        dir = 'desc';
        switching = true;
      }
    }
  }
};

const searchByTitle = n => {
  // Declare variables
  let filter, table, tr, td, i, txtValue;
  filter = searchInput.value.toUpperCase();
  table = document.getElementById('table');
  tr = table.getElementsByTagName('tr');

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[n];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    }
  }
};
