const requestMaker = document.querySelector('#makeRequest');
const tableBody = document.querySelector('#body');
const requestAmount = document.querySelector('#outstanding');
const stopRequests = document.querySelector('#stop');

let numRequests = 0;
requestMaker.addEventListener('click', (ev) => {
    numRequests += 1;
    requestAmount.textContent = numRequests;
    fetch('/request').then((res) => res.json()).then((fin) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${fin.id}</td>
        <td>${fin.name}</td>
        <td>${fin.phone}</td>
        <td><button id=${fin.id}>Delete</button></td>
        `
        row.querySelector('button').addEventListener('click', (ev) => {
            fetch(`/delete/${ev.target.id}`).then(() => {
                tableBody.removeChild(row);
            });
        });
        tableBody.appendChild(row);
        numRequests -= 1;
        requestAmount.textContent = numRequests;
    })
});
stopRequests.addEventListener('click', (ev) => {    
    fetch('/stop').then((res) => {
        numRequests = 0;
        requestAmount.textContent = numRequests;
    });
});