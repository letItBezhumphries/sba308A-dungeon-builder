const renderMonsterSpeed = function (monsterObj) {
  let output = '';
  if (monsterObj) {
    for (let key in monsterObj.speed) {
      output += key + ' ' + monsterObj.speed[key] + ' ';
    }
  }
  return output;
};

const renderMonsterStats = function (monsterObj, elem) {
  const monsterInfo = document.createElement('div');
  monsterInfo.className = 'monster-info';
  monsterInfo.innerHTML = `<h3 class="name">${monsterObj.name}</h3>
  <p class="type">${monsterObj.size} ${monsterObj.type}, ${monsterObj.alignment}</p>
  `;
  if (monsterObj.desc) {
    const description = document.createElement('p');
    description.className = 'monster-description';
    description.innerHTML = `${monsterObj.desc}`;
    monsterInfo.appendChild(description);
  }
  elem.appendChild(monsterInfo);
};

const renderMonsterArmorStats = function (monsterObj, elem) {
  const monsterArmor = document.createElement('table');
  monsterArmor.className = 'monster-armor';
  monsterArmor.innerHTML = `<tr class="trow">
    <td>Armor Class:</td>
    <td>${monsterObj.armor_class[0].value} (${
    monsterObj.armor_class[0].type
  } armor)</td>
  </tr>
  <tr class="trow">
    <td>Hit Points:</td>
    <td>${monsterObj.hit_points} (${monsterObj.hit_points_roll})</td>
  </tr>
  <tr class="trow">
    <td>Speed:</td>
    <td>${renderMonsterSpeed(monsterObj)}</td>
  </tr>
  `;

  elem.appendChild(monsterArmor);
};

const renderMonsterAttributes = function (monsterObj, elem) {
  const monsterAttributes = document.createElement('table');
  monsterAttributes.className = 'monster-attributes';
  monsterAttributes.innerHTML = `<tr>
    <td>Strength</td><td>Dexterity</td><td>Constitution</td><td>Intelligence</td><td>Wisdom</td><td>Charisma</td>
  </tr><tr><td>${monsterObj.strength}</td><td>${monsterObj.dexterity}</td><td>${monsterObj.constitution}</td><td>${monsterObj.intelligence}</td><td>${monsterObj.wisdom}</td><td>${monsterObj.charisma}</td></tr>
  `;
  elem.appendChild(monsterAttributes);
};

const renderMonsterProficiencies = function (monsterObj, elem) {
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

  const proficienciesTable = document.createElement('table');
  proficienciesTable.className = 'monster-proficiencies';
  proficienciesTable.innerHTML = `<tr class="trow">
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
  elem.appendChild(proficienciesTable);
};

const renderMonsterSpecials = function (monsterObj, elem) {
  if (monsterObj.special_abilities.length > 0) {
    const monsterSpecialAbilities = document.createElement('section');
    monsterSpecialAbilities.className = 'monster-specials';

    monsterObj.special_abilities.forEach((special) => {
      let spcl = document.createElement('p');
      spcl.className = 'special-ability';
      spcl.innerHTML = `<span class="name">${special.name}</span> ${special.desc}`;
      monsterSpecialAbilities.appendChild(spcl);
    });

    elem.appendChild(monsterSpecialAbilities);
  }
};

const renderMonsterActions = function (monsterObj, elem) {
  if (monsterObj.actions.length > 0) {
    const monsterActionsSection = document.createElement('section');
    monsterActionsSection.className = 'monster-actions';
    const sectionHeader = document.createElement('h4');
    sectionHeader.className = 'section-header';
    sectionHeader.textContent = 'Actions';
    monsterActionsSection.appendChild(sectionHeader);
    // iterate over each action
    // for each action create a paragraph elem and add each name and desc property to the paragraph
    monsterObj.actions.forEach((action) => {
      let actn = document.createElement('p');
      actn.className = 'monster-action';
      // check if the action object has an actions array as a property?
      actn.innerHTML = `<span class="action-name">${action.name}</span>  ${action.desc}`;
      monsterActionsSection.appendChild(actn);
    });
    elem.appendChild(monsterActionsSection);
  }
};

const renderMonsterLegendaryActions = function (monsterObj, elem) {
  if (monsterObj.legendary_actions.length > 0) {
    const monsterLegndActions = document.createElement('section');
    monsterLegndActions.className = 'monster-actions';
    const sectionHeader = document.createElement('h4');
    sectionHeader.className = 'section-header';
    sectionHeader.textContent = 'Legendary Actions';
    monsterLegndActions.appendChild(sectionHeader);
    // iterate over each legendary action
    // for each action create a paragraph element
    // append the paragraph onto the monsterLegndActions
    monsterObj.legendary_actions.forEach((legend) => {
      let action = document.createElement('p');
      action.className = 'monster-action';
      // check if the legend has damage and attack bonus property
      action.innerHTML = `<span class="action-name">${legend.name}</span>  ${legend.desc}`;
      monsterLegndActions.appendChild(action);
    });
    elem.appendChild(monsterLegndActions);
  }
};

export {
  renderMonsterSpeed,
  renderMonsterStats,
  renderMonsterArmorStats,
  renderMonsterAttributes,
  renderMonsterProficiencies,
  renderMonsterSpecials,
  renderMonsterActions,
  renderMonsterLegendaryActions,
};
