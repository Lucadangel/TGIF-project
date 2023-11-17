document.addEventListener("DOMContentLoaded", function () {
  const url = 'https://api.propublica.org/congress/v1/116/house/members.json';
  const tableBody = document.getElementById("houseTable").getElementsByTagName("tbody")[0];

  // Fetch data and populate the initial table
  fetchAndPopulateTable();

  // Add event listeners to checkboxes
  const republicanCheckbox = document.getElementById("republicanCheckbox");
  const democraticCheckbox = document.getElementById("democraticCheckbox");
  const independentCheckbox = document.getElementById("independentCheckbox");

  republicanCheckbox.addEventListener("change", fetchAndPopulateTable);
  democraticCheckbox.addEventListener("change", fetchAndPopulateTable);
  independentCheckbox.addEventListener("change", fetchAndPopulateTable);

  function fetchAndPopulateTable() {
    fetch(url, {
      method: 'GET',
      headers: {
        'X-API-KEY': '7K7BwVV5SlAlh13rWDa4licj8lcPKgB1WNroXVX9',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(),
    })
      .then((response) => response.json())
      .then((data) => {
        // Filter members based on selected checkboxes
        let members = data.results[0].members.filter(member => {
          return (
            (republicanCheckbox.checked && member.party === 'R') ||
            (democraticCheckbox.checked && member.party === 'D') ||
            (independentCheckbox.checked && member.party === 'I')
          );
        });

        // Clear existing rows
        tableBody.innerHTML = '';

        // Populate the table with the filtered members
        for (let i = 0; i < members.length; i++) {
          const row = document.createElement("tr");
          const fullName = `${members[i].first_name} ${members[i].last_name}`;
          row.innerHTML = `
            <td><a href="${members[i].url}" target="_blank">${fullName}</a></td>
            <td>${members[i].party}</td>
            <td>${members[i].state}</td>
            <td>${members[i].seniority}</td>
          `;

          tableBody.appendChild(row);
        }
      })
      .catch((error) => console.error(error));
  }
});
