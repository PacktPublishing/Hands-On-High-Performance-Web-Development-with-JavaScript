const add = document.querySelector('#addRow');
const remove = document.querySelector('#remove');
const random = document.querySelector('#random');
const tableBody = document.querySelector('#tablebody');

add.addEventListener('click', (ev) => {
    fetch('/add').then((res) => res.text()).then((fin) =>  {
        const row = document.createElement('tr');
        row.innerHTML = fin;
        tableBody.appendChild(row);
    });
});
remove.addEventListener('click', (ev) => {
    while(tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
});
random.addEventListener('click', (ev) => {
    fetch('/row.template').then((res) => res.text()).then((fin) => {
        console.log(renderTemplate(fin, {id : 1, name : 'justin', description: 'thing', points: 10}));
    })
})
