const tableBodyMostEngaged = document.getElementById('tableBodyMostEngaged');
const tableBodyLessEngaged = document.getElementById('tableBodyLessEngaged');
document.getElementById('spinner-container').style.display = 'block';


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
    document.getElementById('spinner-container').style.display = 'none';

    console.log(data);
    populateTable(data.results[0].members);
    displayLeastEngagedMembers(data.results[0].members);
    displayMostEngagedMembers(data.results[0].members);
  })
  .catch(error => {
    document.getElementById('spinner-container').style.display = 'none';

    console.error('Error:', error);
  });

function populateTable(members) {
  let republicanCount = 0;
  let democratCount = 0;
  let independentCount = 0;
  let totalRepublicanPercentage = 0;
  let totalDemocratPercentage = 0;
  let totalIndependentPercentage = 0;

  for (let i = 0; i < members.length; i++) {
    const party = members[i].party;

    if (party === 'R') {
      republicanCount++;
      totalRepublicanPercentage += members[i].votes_with_party_pct;
    } else if (party === 'D') {
      democratCount++;
      totalDemocratPercentage += members[i].votes_with_party_pct;
    } else if (party === 'ID') {
      independentCount++;
      totalIndependentPercentage += members[i].votes_with_party_pct;
    }
  }

  
  const averageRepublicanPercentage = republicanCount > 0 ? totalRepublicanPercentage / republicanCount : 0;
  const averageDemocratPercentage = democratCount > 0 ? totalDemocratPercentage / democratCount : 0;
  const averageIndependentPercentage = independentCount > 0 ? totalIndependentPercentage / independentCount : 0;

  document.getElementById('republicanCount').textContent = republicanCount;
  document.getElementById('democratCount').textContent = democratCount;
  document.getElementById('independentCount').textContent = independentCount;

  document.getElementById('republicanpercentuage').textContent = averageRepublicanPercentage.toFixed(2);
  document.getElementById('democratpercentuage').textContent = averageDemocratPercentage.toFixed(2);
  document.getElementById('independentpercentuage').textContent = averageIndependentPercentage.toFixed(2);
}

function findLeastEngagedMembers(members) {
  const sortedMembers = members.slice().sort((a, b) => b.votes_with_party_pct
  - a.votes_with_party_pct );

  const thresholdIndex = Math.floor(sortedMembers.length * 0.1);

  const leastEngagedMembers = sortedMembers.slice(0, thresholdIndex);

  return leastEngagedMembers;
}

function displayLeastEngagedMembers(members) {
  const tableBody = document.getElementById('tableBodyLessEngaged');

  const leastEngagedMembers = findLeastEngagedMembers(members);

  for (let i = 0; i < leastEngagedMembers.length; i++) {
    const fullName = `${leastEngagedMembers[i].first_name} ${leastEngagedMembers[i].last_name}`;
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td><a href="${leastEngagedMembers[i].url}" target="_blank">${fullName}</a></td>
      <td>${leastEngagedMembers[i].missed_votes}</td>
      <td>${leastEngagedMembers[i].votes_against_party_pct}</td>
    `;
  }
}

function displayMostEngagedMembers(members) {
    const tableBody = document.getElementById('tableBodyMostEngaged');
  
    const mostEngagedMembers = findMostEngagedMembers(members);
  
    for (let i = 0; i < mostEngagedMembers.length; i++) {
      const fullName = `${mostEngagedMembers[i].first_name} ${mostEngagedMembers[i].last_name}`;
      const row = tableBody.insertRow();
      row.innerHTML = `
        <td><a href="${mostEngagedMembers[i].url}" target="_blank">${fullName}</a></td>
        <td>${mostEngagedMembers[i].missed_votes}</td>
        <td>${mostEngagedMembers[i].votes_with_party_pct}</td>
      `;
    }
  }
  
  function findMostEngagedMembers(members) {
    const sortedMembers = members.slice().sort((a, b) => a.votes_with_party_pct
    - b.votes_with_party_pct );
  
    const thresholdIndex = Math.floor(sortedMembers.length * 0.1);
  
    const mostEngagedMembers = sortedMembers.slice(0, thresholdIndex);
  
    return mostEngagedMembers;
  }

