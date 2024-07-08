import axios from 'axios';
const APIURL = 'https://www.dnd5eapi.co/api';
const API2URL = 'https://api.open5e.com/monsters/?limit=25';
const API2BASEURL = 'https://api.open5e.com/monsters/';

axios.defaults.headers.common = {
  Accept: 'application/json',
};

// variable array that will temporarily store any monsters added to a dungeon
const dungeonMonstersList = [];

// helper function that get accepts the next or previous page of monsters and passes it along with the elem to the renderPagination function
const getMonstersPage = async (page, elem) => {
  try {
    const { data } = await axios.get(page);
    console.log('in getMonster Page', page, 'data:', data);
    renderPagination(data, elem);
  } catch (error) {
    console.error(error);
  }
};

const renderPagination = async function (res, elem) {
  elem.innerHTML = '';
  const { results, previous, next } = res;

  const monsterView = document.querySelector('.monster-view');
  renderMonsterView(results[0], monsterView);

  results.map((monster) => {
    let monsterRow = document.createElement('tr');
    let monsterBtn = document.createElement('button');
    monsterBtn.className = 'monster-btn';
    monsterBtn.textContent = `${monster.name}`;
    monsterBtn.setAttribute('data-index', `${monster.slug}`);

    monsterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      renderMonsterView(monster, monsterView);
    });

    monsterRow.appendChild(monsterBtn);
    elem.appendChild(monsterRow);
  });

  const pageControlsRow = document.createElement('tr');
  pageControlsRow.className = 'page-controls-row';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'prev-btn';
  prevBtn.textContent = 'Prev';

  if (previous === undefined) {
    prevBtn.classList.add('disabled');
  } else {
    prevBtn.classList.remove('disabled');
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      getMonstersPage(previous, elem);
    });
  }
  pageControlsRow.appendChild(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'next-btn';
  nextBtn.textContent = 'Next';

  if (next === undefined) {
    nextBtn.classList.add('disabled');
  } else {
    nextBtn.classList.remove('disabled');
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      getMonstersPage(next, elem);
    });
  }

  pageControlsRow.appendChild(nextBtn);
  elem.appendChild(pageControlsRow);

  rend;
};

// helper function that makes get request to monsters/ endpoint to and passes the results to the renderPagination helper
const getMonstersList = async function (elem) {
  try {
    const { data } = await axios.get(API2URL);

    renderPagination(data, elem);
  } catch (error) {
    console.error(error);
  }
};

/**
 * this function is passed an HTML element that it will append all the monster page content onto
 * @param {*} elem
 */
const renderMonsterPage = function (elem, dungeonList) {
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

  getMonstersList(monstersList);
};

/**
 * Function that accepts a selected monsterObject and an element to append the all the monster information
 * and content onto
 *
 * @param {*} monsterObj
 * @param {*} elem
 */
const renderMonsterView = function (monsterObj, elem) {
  console.log('in renderMonsterView:', monsterObj);

  elem.innerHTML = '';

  /* Add the monster image to the monster view */
  if (monsterObj.img_main !== null) {
    const monsterImage = document.createElement('img');
    monsterImage.className = 'monster-image';
    monsterImage.setAttribute('src', monsterObj.img_main);
    elem.appendChild(monsterImage);
  } else {
    let name = monsterObj.name;
    const imageUrl =
      APIURL +
      `/images/monsters/${name.toLowerCase().split(' ').join('-')}.png`;
    console.log(imageUrl);
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
      output += key + ' ' + monsterObj.speed[key] + ',';
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
    <td>${monsterObj.armor_class} (${monsterObj.armor_desc})</td>
  </tr>
  <tr class="trow">
    <td>Hit Points:</td>
    <td>${monsterObj.hit_points} (${monsterObj.hit_dice})</td>
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
  const skills = monsterObj.skills;
  let skillsStr = '';
  let sensesStr = '';

  if (skills !== undefined) {
    console.log('monsterObj.skills', monsterObj.skills);
    for (let key in skills) {
      console.log('key:', key, skills[key]);
      skillsStr += key + ' ' + skills[key] + ' ';
    }
  }

  if (monsterObj.charisma_save !== null) {
    savingsThrowStr += `Cha +${monsterObj.charisma_save}` + ' ';
  }
  if (monsterObj.dexterity_save !== null) {
    savingsThrowStr += `Dex +${monsterObj.dexterity_save}` + ' ';
  }
  if (monsterObj.constitution_save !== null) {
    savingsThrowStr += `Con +${monsterObj.constitution_save}` + ' ';
  }

  if (monsterObj.intelligence_save !== null) {
    savingsThrowStr += `Int +${monsterObj.intelligence_save}` + ' ';
  }

  if (monsterObj.strength_save !== null) {
    savingsThrowStr += `Str +${monsterObj.strength_save}` + ' ';
  }

  if (monsterObj.wisdom_save !== null) {
    savingsThrowStr += `Wis +${monsterObj.wisdom_save}` + ' ';
  }

  if (monsterObj.senses) {
    sensesStr = monsterObj.senses;
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
    <td>Challenge:</td><td>${monsterObj.challenge_rating}</td>
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
  if (monsterObj.legendary_actions !== null) {
    const monsterLegndActions = document.createElement('section');
    monsterLegndActions.className = 'monster-actions';
    const sectionHeader = document.createElement('h4');
    sectionHeader.className = 'section-header';
    sectionHeader.textContent = 'Legendary Actions';
    monsterLegndActions.appendChild(sectionHeader);
    if (monsterObj.legendary_desc !== null) {
      let description = document.createElement('p');
      description.className = 'legendary-description';
      description.textContent = monsterObj.legendary_desc;
      monsterLegndActions.appendChild(description);
    }

    // iterate over each legendary action
    // for each action create a paragraph element
    // append the paragraph onto the monsterLegndActions
    if (monsterObj.legendary_actions !== null) {
      monsterObj.legendary_actions.forEach((legend) => {
        let action = document.createElement('p');
        action.className = 'monster-action';
        // check if the legend has damage and attack bonus property
        action.innerHTML = `<span class="action-name">${legend.name} - </span>  ${legend.desc}`;
        monsterLegndActions.appendChild(action);
      });
    }
    elem.appendChild(monsterLegndActions);
  }
};

export {
  renderMonsterPage,
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
