import axios from 'axios';

const APIURL = 'https://www.dnd5eapi.co/api';
const API2URL = 'https://api.open5e.com/monsters/?limit=100';

axios.defaults.headers.common = {
  Accept: 'application/json',
};
// /* Axios interceptors */
// const requestInterceptor = axios.interceptors.request.use(function (request) {
axios.interceptors.request.use(function (request) {
  // store the time the request was sent
  let timeStart = new Date().getTime();
  // console.log('timeStart for the request:', timeStart);
  // assign metadata to the request object if it doesn't exist and add the startTime to the metadata object
  request.metadata = request.metadata || {};
  request.metadata.startTime = timeStart;
  // progressBar.style.width = '0%';
  // document.body.style.cursor = 'progress';
  return request;
});

// for the response interceptor axios passes the request object metadata property and sets it on the response.config
axios.interceptors.response.use(
  function (response) {
    let endTime = new Date().getTime();
    // create variable to store the amount of time request took to complete
    let duration = endTime - response.config.metadata.startTime;
    console.log('the duration of the request -> duration:', duration);
    // document.body.style.cursor = 'pointer';
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const renderCharactersBuildPage = function (elem) {
  console.log('render the character build page');
  elem.innerHtml = '';

  const characterView = document.createElement('div');
  characterView.className = 'character-view';

  const characterVitalsForm = document.createElement('div');
  characterVitalsForm.className = 'character-vitals';
  characterVitalsForm.innerHTML = `<table>
    <tr class="trow">
      <td>Character Name:</td>
      <td><input name="characterName" value=""/></td>
    </tr>
    <tr class="trow">
      <td>Class:</td>
      <td>
        <select id="classSelect" class="form-select"></select>
      </td>
    </tr>
    <tr class="trow">
      <td>Level:</td>
      <td>
        1
      </td>
    </tr>
    <tr class="trow">
      <td>Background:</td>
      <td>
        <select id="backgroundSelect" class="form-select"></select>
      </td>
    </tr>
    <tr class="trow">
      <td>Race:</td>
      <td>
        <select id="raceSelect" class="form-select"></select>
      </td>
    </tr>
    <tr class="trow">
      <td>Alignment:</td>
      <td>
        <select id="alignmentSelect" class="form-select"></select>
      </td>
    </tr>
    <tr class="trow">
      <td>Experience Points:</td>
      <td>
        0+
      </td>
    </tr>
  </table>`;

  const characterMainForm = document.createElement('section');
  characterMainForm.className = 'character-main';

  characterView.appendChild(characterVitalsForm);
  characterView.appendChild(characterMainForm);

  // elem.appendChild(characterFormContainer);
  elem.appendChild(characterView);

  getClasses();
  getRaces();
  // getBackgrounds();
  getAlignments();
};

const getClasses = async function () {
  try {
    let classesResponse = (await axios.get(APIURL + '/classes')).data.results;
    const classSelect = document.querySelector('#classSelect');
    let defaultOption = document.createElement('option');
    defaultOption.textContent = 'Choose a class';
    classSelect.appendChild(defaultOption);
    console.log('in getClasses ->', classesResponse);
    for (let i = 0; i < classesResponse.length; i++) {
      const { index, name, url } = classesResponse[i];
      let optionEl = document.createElement('option');
      optionEl.setAttribute('value', index);
      optionEl.textContent = `${name}`;
      classSelect.appendChild(optionEl);
    }
  } catch (error) {
    console.error(error);
  }
};

const getBackgrounds = async function () {
  try {
    let backgroundsResponse = (await axios.get(APIURL + '/backgrounds')).data
      .results;
    const backgroundSelect = document.querySelector('#backgroundSelect');
    let defaultOption = document.createElement('option');
    defaultOption.textContent = 'Choose a background';
    backgroundSelect.appendChild(defaultOption);
    console.log('in getBackgrounds ->', backgroundsResponse);
  } catch (error) {
    console.error(error);
  }
};

const getRaces = async function () {
  try {
    let raceResponse = (await axios.get(APIURL + '/races')).data.results;
    const raceSelect = document.querySelector('#raceSelect');
    let defaultOption = document.createElement('option');
    defaultOption.textContent = 'Choose a race';
    raceSelect.appendChild(defaultOption);

    console.log('in getRaces ->', raceResponse);
    raceResponse.forEach((race) => {
      const { index, name, url } = race;
      let optionEl = document.createElement('option');
      optionEl.setAttribute('value', index);
      optionEl.textContent = `${name}`;
      raceSelect.appendChild(optionEl);
    });
  } catch (error) {
    console.error(error);
  }
};

const getAlignments = async function () {
  try {
    let alignmentResponse = (await axios.get(APIURL + '/alignments')).data
      .results;
    const alignmentSelect = document.querySelector('#alignmentSelect');
    let defaultOption = document.createElement('option');
    defaultOption.textContent = 'Choose an alignment';
    alignmentSelect.appendChild(defaultOption);
    console.log('in getAlignments ->', alignmentResponse);
    alignmentResponse.forEach((alignment) => {
      const { index, name, url } = alignment;
      let optionEl = document.createElement('option');
      optionEl.setAttribute('value', index);
      optionEl.textContent = `${name}`;

      alignmentSelect.appendChild(optionEl);
    });
  } catch (error) {
    console.error(error);
  }
};
export { renderCharactersBuildPage };
