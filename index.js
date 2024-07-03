import axios from 'axios';
import {
  renderMonsterStats,
  renderMonsterArmorStats,
  renderMonsterAttributes,
  renderMonsterProficiencies,
  renderMonsterSpecials,
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
  const imageUrl = REQURL + `/images/monsters/${monsterObj.index}.png`;
  console.log('in renderMonsterView:', monsterObj);

  currentMonsterView.innerHTML = '';

  /* Add the monster image to the monster view */
  if (monsterObj.image) {
    const monsterImage = document.createElement('img');
    monsterImage.className = 'monster-image';
    monsterImage.setAttribute('src', imageUrl);
    currentMonsterView.appendChild(monsterImage);
  }

  /* Add the monster stats table to the monster view */
  renderMonsterStats(monsterObj, currentMonsterView);

  /** Add the monster armor stats to the monster view */
  renderMonsterArmorStats(monsterObj, currentMonsterView);

  /* Add the monster attributes table to the monster view */
  renderMonsterAttributes(monsterObj, currentMonsterView);

  /* Add the monster proficiencies table to the monster view */
  renderMonsterProficiencies(monsterObj, currentMonsterView);

  /* Add the monster special abilities section to the monster view */
  renderMonsterSpecials(monsterObj, currentMonsterView);

  /* Add the monster actions sections to the monster view */
  renderMonsterActions(monsterObj, currentMonsterView);

  /* Add the monster legendary actions section to the monster view */
  renderMonsterLegendaryActions(monsterObj, currentMonsterView);
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
