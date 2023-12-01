

document.addEventListener('DOMContentLoaded', function () {
  let tableBody = document.getElementById('houseTable').getElementsByTagName('tbody')[0];
  let dropdown = document.getElementById('statesDropdown');
  let republicanCheckbox = document.getElementById('republicanCheckbox');
  let democraticCheckbox = document.getElementById('democraticCheckbox');
  let independentCheckbox = document.getElementById('independentCheckbox');
  let url = 'https://api.propublica.org/congress/v1/116/house/members.json';

  // Fetch data and populate the initial table and dropdown
  fetchAndPopulateTable();

  function fetchAndPopulateTable(selectedState) {
    fetch(url, {
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((data) => {
        let members = data.results[0].members;

        // Filter members based on selected checkboxes
        members = members.filter((member) => {
          return (
            (republicanCheckbox.checked && member.party === 'R') ||
            (democraticCheckbox.checked && member.party === 'D') ||
            (independentCheckbox.checked && member.party === 'I')
          );
        });

        if (selectedState && selectedState !== 'All') {
          members = members.filter((member) => member.state === selectedState);
        }

        populateTable(members);
        populateDropdown(members, selectedState);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  function handleErrors(response) {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response;
  }

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
      `;

      tableBody.appendChild(row);
    }
  }

  function populateDropdown(members, selectedState) {
    let states = Array.from(new Set(members.map((member) => member.state))).sort(); // Sort states alphabetically

    dropdown.innerHTML = ''; // Clear existing dropdown items

    // Add option for all states
    addDropdownOption('All', selectedState);

    // Add options for other states
    states.forEach((state) => {
      addDropdownOption(state, selectedState);
    });
  }

  function addDropdownOption(state, selectedState) {
    let option = document.createElement('a');
    option.className = 'dropdown-item text-wrap';
    option.href = '#';
    option.setAttribute('data-state', state);
    getStateFullName(state).then((fullName) => {
      option.textContent = fullName;
      dropdown.appendChild(option);
    });

    // Set the selected state in the dropdown
    if (state === selectedState) {
      dropdown.setAttribute('data-selected-state', selectedState);
    }
  }

  // Add event listener for state selection
  dropdown.addEventListener('click', function (event) {
    event.preventDefault();
    const selectedState = event.target.getAttribute('data-state');
    console.log('Selected State:', selectedState);

    // Fetch and populate the table based on the selected state
    fetchAndPopulateTable(selectedState);
  });

  // Add event listeners for checkbox changes
  republicanCheckbox.addEventListener('change', function () {
    fetchAndPopulateTable(dropdown.getAttribute('data-selected-state'));
  });

  democraticCheckbox.addEventListener('change', function () {
    fetchAndPopulateTable(dropdown.getAttribute('data-selected-state'));
  });

  independentCheckbox.addEventListener('change', function () {
    fetchAndPopulateTable(dropdown.getAttribute('data-selected-state'));
  });

  // Helper function to get the full state name from the abbreviation
  async function getStateFullName(abbreviation) {
    try {
      const response = await fetch('https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_hash.json');
      const stateMap = await response.json();
      const fullName = stateMap[abbreviation];
      if (fullName) {
        return fullName;
      } else {
        console.warn(`Full name not found for state abbreviation: ${abbreviation}`);
        return abbreviation; // Return the abbreviation if the full name is not found
      }
    } catch (error) {
      console.error('Error fetching state names:', error);
      return abbreviation; // Return the abbreviation in case of an error
    }
  }
});
