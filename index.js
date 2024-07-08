import { renderMonsterListPage } from './monster';
import { renderCharactersBuildPage } from './character';

/* App element */
const appElem = document.querySelector('#app');

/* Create the navigation bar and add it to the body */
const navElem = document.createElement('nav');
navElem.className = 'navbar';
const headerElem = document.createElement('h2');
headerElem.className = 'nav-header';
headerElem.textContent = 'D&D Character Builder';
headerElem.style.marginLeft = '30px';
navElem.appendChild(headerElem);
document.body.prepend(navElem);

/** Create the nav links list and append it to the nav */
const navLinks = document.createElement('ul');
navLinks.innerHTML = `<li class="nav-link characters-link"><a href="#character">Characters</a></li>
<li class="nav-link monsters-link"><a href="#monsters">Monsters</a></li>`;

navElem.appendChild(navLinks);

/* temporary solution to render the character build page or the monster list page */
const characterLink = document.querySelector('.characters-link a');
characterLink.addEventListener('click', (e) => {
  e.preventDefault();
  renderCharactersBuildPage(appElem);
});

const monstersLink = document.querySelector('.monsters-link a');
monstersLink.addEventListener('click', (e) => {
  e.preventDefault();
  renderMonsterListPage(appElem);
});
