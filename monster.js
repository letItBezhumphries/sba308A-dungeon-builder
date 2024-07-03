const renderMonsterSpeed = function (monsterObj) {
  let output = '';
  if (monsterObj) {
    for (let key in monsterObj.speed) {
      output += key + ' ' + monsterObj.speed[key] + ' ';
    }
  }
  return output;
};

const renderMonsterDetails = function (monsterObj, elem) {
  let savingsThrowStr = '';
  let skillsStr = '';
  let sensesStr = '';

  if (monsterObj.proficiencies.length > 0) {
    for (let i = 0; i < monsterObj.proficiencies.length; i++) {
      let currentProficiency = monsterObj.proficiencies[i];
      if (
        currentProficiency.proficiency.name
          .toLowerCase()
          .includes('saving throw')
      ) {
        let tmpStr =
          currentProficiency.proficiency.name.split(':')[1] +
          ' +' +
          currentProficiency.value;
        savingsThrowStr += tmpStr;
      }

      if (currentProficiency.proficiency.name.toLowerCase().includes('skill')) {
        let tmpStr =
          currentProficiency.proficiency.name.split(':')[1] +
          ' +' +
          currentProficiency.value +
          ',';
        skillsStr += tmpStr;
      }
    }
  }

  if (monsterObj.senses) {
    for (let key in monsterObj.senses) {
      sensesStr += `${key.split('_').join(' ')} ${monsterObj.senses[key]}, `;
    }
  }

  const detailsTable = document.createElement('table');
  detailsTable.className = 'monster-details';
  detailsTable.innerHTML = `<tr class="trow">
    <td>Savings Throw:</td><td>${savingsThrowStr}</td>
  </tr><tr class="trow">
    <td>Skills:</td><td>${skillsStr}</td>
  </tr><tr class="trow">
    <td>Senses:</td><td>${sensesStr}</td>
  </tr>
  <tr class="trow">
    <td>Languages:</td><td>${monsterObj.languages}</td>
  </tr>
  <tr class="trow">
    <td>Challenge:</td><td>${monsterObj.challenge_rating} (${monsterObj.xp} XP)</td>
  </tr>
  `;
  elem.appendChild(detailsTable);
};

const renderMonsterProficiencies = function (proficiencies, elem) {};

const renderMonsterActions = function (monsterObj, elem) {};

const renderMonsterLegendaryActions = function (monsterObj, elem) {};

export {
  renderMonsterSpeed,
  renderMonsterProficiencies,
  renderMonsterDetails,
  renderMonsterActions,
  renderMonsterLegendaryActions,
};
