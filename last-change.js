let originalMembers = [];
let filteredMembers = [];

const tableBody = document.getElementById('tableBody');
const republicanCheckbox = document.getElementById('republicanCheckbox');
const democraticCheckbox = document.getElementById('democraticCheckbox');
const independentCheckbox = document.getElementById('independentCheckbox');
const dropdown = document.getElementById('stateDropdown');


// Clear existing options
dropdown.innerHTML = '';

let defaultOption = document.createElement('option');
defaultOption.text = 'All';
dropdown.appendChild(defaultOption);
dropdown.selectedIndex = 0;

// Fetch the local JSON file
fetch('/states_hash.json')  
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status Code: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const states = Array.isArray(data) ? data : Object.values(data);

    states.forEach(state => {
      let option = document.createElement('option');
      option.text = state.name;
      option.value = state.abbreviation;
      dropdown.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Fetch Error -', error);
  });

const dropdownButton = document.getElementById('stateDropdownBtn');
dropdownButton.addEventListener('click', filterByState);

// Extract "chamber" parameter from the URL
let params = new URL(document.location).searchParams;
let chamber = params.get("chamber");

// Fetch data based on the "chamber" parameter
let apiUrl = '';
if (chamber === "senate") {
  apiUrl = 'https://api.propublica.org/congress/v1/116/senate/members.json';
} else if (chamber === "house") {
  apiUrl = 'https://api.propublica.org/congress/v1/116/house/members.json';
  document.getElementById("chamber").innerHTML = "Representatives";
  document.getElementById("line1").innerHTML = "The major power of the House is to pass federal legislation that affects the entire country, although its bills must also be passed by the Senate and further agreed to by the U.S. President before becoming law (unless both the House and Senate re-pass the legislation with a two-thirds majority in each chamber). The House has some exclusive powers: the power to initiate revenue bills, to impeach officials (impeached officials are subsequently tried in the Senate), and to elect the U.S. President in case there is no majority in the Electoral College.";
  document.getElementById("line2").innerHTML = "Each U.S. state is represented in the House in proportion to its population as measured in the census, but every state is entitled to at least one representative.";

}
document.getElementById('spinner-container').style.display = 'block';

// Fetch data and store the original members' data
fetch(apiUrl, {
  method: 'GET',
  headers: {
    'X-API-KEY': '7K7BwVV5SlAlh13rWDa4licj8lcPKgB1WNroXVX9',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})
  .then(response => response.json())
  .then(data => {
    document.getElementById('spinner-container').style.display = 'none';

    originalMembers = data.results[0].members;
    populateTable(originalMembers);
  })
  .catch(error => {
    document.getElementById('spinner-container').style.display = 'none';

    console.error('Error:', error);
    console.log('Response:', error.responseText);
    console.log('Status:', error.status);

  });

// Event listeners for checkbox changes
republicanCheckbox.addEventListener('change', filterMembers);
democraticCheckbox.addEventListener('change', filterMembers);
independentCheckbox.addEventListener('change', filterMembers);

// Function to filter members by party
function filterMembers() {
  const selectedParties = [];

  if (republicanCheckbox.checked) selectedParties.push('R');
  if (democraticCheckbox.checked) selectedParties.push('D');
  if (chamber === "senate" && independentCheckbox.checked) selectedParties.push('ID');
  if (chamber === "house" && independentCheckbox.checked) selectedParties.push('I');


  if (selectedParties.length > 0) {
    filteredMembers = originalMembers.filter(mem => selectedParties.includes(mem.party));
    populateTable(filteredMembers);
  } else {
    populateTable(originalMembers);
  }
}

// Function to filter members by state
function filterByState() {
  const selectedState = dropdown.value;

  if (selectedState !== 'All') {
    filteredMembers = originalMembers.filter(mem => mem.state === selectedState);
    filterMembers(); 
  } else {
    populateTable(originalMembers);
  }
}

// Function to populate the table
function populateTable(members) {
  tableBody.innerHTML = ''; 
  for (let i = 0; i < members.length; i++) {
    const row = document.createElement('tr');
    const fullName = `${members[i].first_name} ${members[i].last_name}`;
    row.innerHTML = `
      <td><a href="${members[i].url}" target="_blank">${fullName}</a></td>
      <td>${members[i].party}</td>
      <td>${members[i].state}</td>
      <td>${members[i].seniority}</td>
      <td>${members[i].votes_with_party_pct}</td>
    `;
    tableBody.appendChild(row);
  }
}


function populateLessEngagedTable(members) {
  // Sort members by missed_votes_pct in ascending order
  const sortedMembers = members.slice().sort((a, b) => a.missed_votes_pct - b.missed_votes_pct);

  // Display the less engaged members
  for (let i = 0; i < 10; i++) { // Displaying the first 10 less engaged members
    const fullName = `${sortedMembers[i].first_name} ${sortedMembers[i].last_name}`;
    const row = tableBodyLessEngaged.insertRow(i);

    row.innerHTML = `
      <td><a href="${sortedMembers[i].url}" target="_blank">${fullName}</a></td>
      <td>${sortedMembers[i].missed_votes}</td>
      <td>${sortedMembers[i].missed_votes_pct}</td>
    `;
  }
}




