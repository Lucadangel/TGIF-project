const tableBody = document.getElementById('tableBody'); 

fetch('https://api.propublica.org/congress/v1/116/senate/members.json', {
  method: 'GET',
  headers: {
    'X-API-KEY': '7K7BwVV5SlAlh13rWDa4licj8lcPKgB1WNroXVX9',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})
  .then(response => response.json())
  .then(data => {

    console.log(data);
    populateTable(data.results[0].members); 
  })
  .catch(error => {
   
    console.error('Error:', error);
  });

function populateTable(members) {
  for (let i = 0; i < members.length; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `
    <tr> 
    <td>Republican</td>
    </tr>
    <tr> 
      <td>Democratic</td>
      </tr>
      <td>${members[i].party}</td>
      <td>${members[i].state}</td>

    `;

    tableBody.appendChild(row);
  }
}