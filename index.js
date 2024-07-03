import axios from 'axios';
import {
  renderMonsterSpeed,
  renderMonsterDetails,
  renderMonsterProficiencies,
  renderMonsterActions,
  renderMonsterLegendaryActions,
} from './monster';
const REQURL = 'https://www.dnd5eapi.co/api';

axios.defaults.headers.common = {
  Accept: 'application/json',
};

/* App element */
const appElem = document.querySelector('#app');
appElem.style.display = 'flex';

// console.log('appElem', appElem);

const navElem = document.getElementsByClassName('navbar')[0];
navElem.style.width = '100%';
navElem.style.height = '14%';
navElem.style.backgroundColor = 'black';

// console.log('nav:', navElem);

/**NavHeader Elem */
const navHeader = document.querySelector('nav h2');
navHeader.textContent = 'D&D Character Builder';
navHeader.style.color = 'whitesmoke';
navHeader.style.marginLeft = '30px';
// console.log('nav elem:', navHeader);

const monstersListContainer = document.createElement('div');
monstersListContainer.style.width = '30%';
monstersListContainer.style.marginLeft = '50px';
monstersListContainer.style.borderRadius = '4px';
monstersListContainer.style.border = '.8px solid black';

const monstersListHeader = document.createElement('h2');
monstersListHeader.textContent = 'Monsters';
monstersListHeader.style.textAlign = 'center';
monstersListContainer.appendChild(monstersListHeader);
const monstersList = document.createElement('table');
monstersList.style.marginTop = '20px';
monstersListContainer.appendChild(monstersList);

const currentMonsterView = document.createElement('div');
currentMonsterView.style.backgroundColor = 'beige';
currentMonsterView.style.width = '60%';
currentMonsterView.style.height = '90%';
currentMonsterView.style.display = 'flex';
currentMonsterView.style.flexDirection = 'column';
currentMonsterView.style.borderRadius = '4px';
currentMonsterView.style.border = '.8px solid black';

appElem.appendChild(monstersListContainer);
appElem.appendChild(currentMonsterView);

const renderMonstersList = function () {
  let url = REQURL + '/monsters';
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
        monstersList.appendChild(monsterRow);
      });
    })
    .catch((err) => {
      console.log('error occured:', err);
    });
};

renderMonstersList();

const renderMonsterView = function (monsterObj) {
  const {
    index,
    name,
    size,
    type,
    alignment,
    actions,
    armor_class,
    challenge_rating,
    charisma,
    condition_immunities,
    constitution,
    damage_immunities,
    damage_resistance,
    damage_vulnerabilities,
    dexterity,
    hit_dice,
    hit_points,
    hit_points_roll,
    intelligence,
    languages,
    legendary_actions,
    proficiencies,
    proficiency_bonus,
    senses,
    special_abilities,
    speed,
    strength,
    wisdom,
    xp,
  } = monsterObj;
  const url = REQURL + `/images/monsters/${index}.png`;
  console.log('in renderMonsterView:', monsterObj);

  currentMonsterView.innerHTML = '';

  /* Add the monster image to the monster view */
  const monsterImage = document.createElement('img');
  monsterImage.className = 'monster-image';
  monsterImage.setAttribute('src', url);
  currentMonsterView.appendChild(monsterImage);

  const monsterInfo = document.createElement('div');
  monsterInfo.className = 'monster-info';
  monsterInfo.innerHTML = `<h3 class="name">${name}</h3>
  <p class="type">${size} ${type}, ${alignment}</p>
  `;
  currentMonsterView.appendChild(monsterInfo);

  const monsterArmor = document.createElement('table');
  monsterArmor.className = 'monster-armor';
  monsterArmor.innerHTML = `<tr class="trow">
    <td>Armor Class:</td>
    <td>${armor_class[0].value} (${armor_class[0].type} armor)</td>
  </tr>
  <tr class="trow">
    <td>Hit Points:</td>
    <td>${hit_points} (${hit_points_roll})</td>
  </tr>
  <tr class="trow">
    <td>Speed:</td>
    <td>${renderMonsterSpeed(monsterObj)}</td>
  </tr>
  `;
  currentMonsterView.appendChild(monsterArmor);
  currentMonsterView.appendChild(document.createElement('br'));

  const monsterAttributes = document.createElement('table');
  monsterAttributes.className = 'monster-attributes';
  monsterAttributes.innerHTML = `<tr>
    <td>Strength</td><td>Dexterity</td><td>Constitution</td><td>Intelligence</td><td>Wisdom</td><td>Charisma</td>
  </tr><tr><td>${strength}</td><td>${dexterity}</td><td>${constitution}</td><td>${intelligence}</td><td>${wisdom}</td><td>${charisma}</td></tr>
  `;
  currentMonsterView.appendChild(monsterAttributes);

  /* Add the monster details to the monster view */
  // const monsterDetails = document.createElement('table');
  // monsterDetails.className = 'monster-details';
  // currentMonsterView.appendChild(monsterDetails);
  renderMonsterDetails(monsterObj, currentMonsterView);
};

const getMonster = function (index) {
  axios
    .get(REQURL + '/monsters/' + index)
    .then((res) => {
      console.log('successful get MOnster:', res.data);
      renderMonsterView(res.data);
    })
    .catch((err) => {
      console.log('err:', err);
    });
};
