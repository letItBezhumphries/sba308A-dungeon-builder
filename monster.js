import axios from 'axios';
const APIURL = 'https://www.dnd5eapi.co/api';
const API2URL = 'https://api.open5e.com/monsters/?limit=100';

axios.defaults.headers.common = {
  Accept: 'application/json',
};

const getMonster = async function (index) {
  try {
    const monster = (await axios.get(APIURL + '/monsters/' + index)).data;
    console.log('in getMonster async:', monster);
    const monsterView = document.querySelector('.monster-view');
    renderMonsterView(monster, monsterView);
  } catch (error) {
    console.error(error);
  }
};

const getMonsters = async () => {
  try {
    const res = await axios.get(APIURL);

    console.log('res data for 2nd api monsters:', res.data);
  } catch (error) {
    console.log('error occurred', error);
  }
};

const renderMonstersList = function (elem) {
  let url = APIURL + '/monsters';
  axios
    .get(url)
    .then((res) => {
      // console.log('res:', res);
      res.data.results.map((monster) => {
        let monsterRow = document.createElement('tr');
        let monsterBtn = document.createElement('button');
        monsterBtn.className = 'monster-btn';
        monsterBtn.textContent = `${monster.name}`;
        monsterBtn.setAttribute('data-index', `${monster.index}`);

        monsterBtn.addEventListener('click', (e) => {
          e.preventDefault();
          console.log('e.target:', e.target.getAttribute('data-index'));
          getMonster(e.target.getAttribute('data-index'));
        });

        monsterRow.appendChild(monsterBtn);
        elem.appendChild(monsterRow);
      });
    })
    .catch((err) => {
      console.log('error occured:', err);
    });
};

const renderMonsterListPage = function (elem) {
  elem.innerHTML = ``;

  const monstersListContainer = document.createElement('div');
  monstersListContainer.className = 'monster-list-container';
  const monstersListHeader = document.createElement('h2');
  monstersListHeader.className = 'monster-list-header';
  monstersListHeader.textContent = 'Monsters';
  monstersListHeader.style.textAlign = 'center';
  monstersListContainer.appendChild(monstersListHeader);
  const monstersList = document.createElement('table');
  monstersList.className = 'monsters-list';
  monstersListContainer.appendChild(monstersList);
  const currentMonsterView = document.createElement('div');
  currentMonsterView.className = 'monster-view';

  elem.appendChild(monstersListContainer);
  elem.appendChild(currentMonsterView);

  renderMonstersList(monstersList);
};

const renderMonsterView = function (monsterObj, elem) {
  const imageUrl = APIURL + `/images/monsters/${monsterObj.index}.png`;
  console.log('in renderMonsterView:', monsterObj);

  elem.innerHTML = '';

  /* Add the monster image to the monster view */
  if (monsterObj.image) {
    const monsterImage = document.createElement('img');
    monsterImage.className = 'monster-image';
    monsterImage.setAttribute('src', imageUrl);
    elem.appendChild(monsterImage);
  }

  /* Add the monster stats table to the monster view */
  renderMonsterStats(monsterObj, elem);

  /** Add the monster armor stats to the monster view */
  renderMonsterArmorStats(monsterObj, elem);

  /* Add the monster attributes table to the monster view */
  renderMonsterAttributes(monsterObj, elem);

  /* Add the monster proficiencies table to the monster view */
  renderMonsterProficiencies(monsterObj, elem);

  /* Add the monster special abilities section to the monster view */
  renderMonsterSpecials(monsterObj, elem);

  /* Add the monster actions sections to the monster view */
  renderMonsterActions(monsterObj, elem);

  /* Add the monster legendary actions section to the monster view */
  renderMonsterLegendaryActions(monsterObj, elem);
};

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

  const proficienciesSection = document.createElement('section');
  proficienciesSection.className = 'proficiencies-section';
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
  proficienciesSection.appendChild(proficienciesTable);
  elem.appendChild(proficienciesSection);
};

const renderMonsterSpecials = function (monsterObj, elem) {
  if (monsterObj.special_abilities.length > 0) {
    const monsterSpecialAbilities = document.createElement('section');
    monsterSpecialAbilities.className = 'monster-specials';

    monsterObj.special_abilities.forEach((special) => {
      let spcl = document.createElement('p');
      spcl.className = 'special-ability';
      spcl.innerHTML = `<span class="ability-name">${special.name} - </span> ${special.desc}`;
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
      actn.innerHTML = `<span class="action-name">${action.name} -</span>  ${action.desc}`;
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
      action.innerHTML = `<span class="action-name">${legend.name} - </span>  ${legend.desc}`;
      monsterLegndActions.appendChild(action);
    });
    elem.appendChild(monsterLegndActions);
  }
};

export {
  renderMonsterListPage,
  // renderMonstersList,
  // renderMonsterView,
  // renderMonsterSpeed,
  // renderMonsterStats,
  // renderMonsterArmorStats,
  // renderMonsterAttributes,
  // renderMonsterProficiencies,
  // renderMonsterSpecials,
  // renderMonsterActions,
  // renderMonsterLegendaryActions,
};
