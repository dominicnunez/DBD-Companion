import CharacterSelector from './character-selector.js';

const characterSelector = new CharacterSelector();

// Get the necessary DOM elements from the characterSelector object
const survivorRadio = document.getElementById('survivor-radio');
const killerRadio = document.getElementById('killer-radio');
const normalRadio = document.getElementById('normal-radio');
const cycleRadio = document.getElementById('cycle-radio');
//const characterImage = document.querySelector('.character-image');
const selectCharacterBtn = document.getElementById('select-character-btn');

// Function to update the visibility of the excluded list container
function updateExcludedListVisibility() {
  const excludedListContainer = document.querySelector('.excluded-list-container');
  const team = characterSelector.lastSelectedTeam(survivorRadio)

  if (teamHasExcludedCharacters(team)) {
    excludedListContainer.style.display = 'block'; // Show the excluded list container
  } else {
    excludedListContainer.style.display = 'none'; // Hide the excluded list container
  }
}

function teamHasExcludedCharacters(team) {
  return characterSelector.excluded_characters[team].length > 0;
}

function displayExclusionLimitMessage(callback) {
  Swal.fire({
    title: 'Limit Reached',
    html: 'You have reached the maximum exclusion limit.',
    icon: 'warning',
    showConfirmButton: true,
    confirmButtonPosition: 'center',
    allowOutsideClick: false,
    allowEscapeKey: false
  }).then((result) => {
    if (result.isConfirmed && typeof callback === 'function') {
      callback();
    }
  });
}

// Function to handle character selection and toggling
function handleCharacterToggling(characterBtn, container) {
  // get name and team of the character button
  const team = characterSelector.lastSelectedTeam(survivorRadio);
  const key = characterBtn.getAttribute('data-character');
  const name = characterBtn.innerText;
  // get the character list container and it's current count
  const characterListContainer = document.querySelector('.character-list');
  const characterCount = characterListContainer.childElementCount;
  // get the array of currently excluded characters and define if a character is ecluded
  const excludedCharacters = characterSelector.excluded_characters[team];
  const isExcluded = excludedCharacters.includes(name);
  // set the exclusion limit variable
  const exclusionLimit = 3;
  
  // Move character from character list to excluded list
  if (container === characterListContainer && !isExcluded) {
    if (characterCount <= exclusionLimit) {
      displayExclusionLimitMessage();
      return;
    }
    // move the character to the exluded array and container
    moveCharacter(characterBtn, container, document.querySelector('.excluded-list'));
    characterSelector.addToExcluded(team, key, name);
    //addToBanned(team, key, name);
  }
  // Move character from excluded list to character list and remove them from excluded array
  else if (container.classList.contains('excluded-list')) {
    moveCharacter(characterBtn, container, characterListContainer);
    characterSelector.removeFromExcluded(team, key, name);
    //removeFromBanned(team, key, name);
  }
  // update the visibility of the excluded container
  updateExcludedListVisibility();
}

// Function to move a character button between containers
function moveCharacter(characterBtn, fromContainer, toContainer) {
    const team = characterSelector.lastSelectedTeam(survivorRadio)
    const excludedCharacters = characterSelector.excluded_characters[team];
  
    const key = characterBtn.getAttribute('data-character');
    const name = characterBtn.innerText;
    
    // Remove event listener from character button
    characterBtn.removeEventListener('click', () => {
      handleCharacterToggling(characterBtn, fromContainer);
    });
  
    // Insert the character button into the target container
    const characterButtons = Array.from(toContainer.getElementsByClassName('character-btn'));
  
    // Find the appropriate index based on the character's key
    let insertIndex = 0;
    for (let i = 0; i < characterButtons.length; i++) {
      const btnKey = characterButtons[i].getAttribute('data-character');
      if (btnKey > key) {
        break;
      }
      insertIndex++;
    }
  
    // Insert the character button at the determined index
    toContainer.insertBefore(characterBtn, characterButtons[insertIndex]);
  
    // Add event listener to character button
    characterBtn.addEventListener('click', () => {
      handleCharacterToggling(characterBtn, toContainer);
    });
  
    // Update the visibility of the excluded list container
    updateExcludedListVisibility();
  
    // Check if the character is excluded and update the body theme
    const isExcluded = excludedCharacters.includes(name);
    const theme = isExcluded && toContainer.classList.contains('excluded-list') ? 'survivor-theme' : '';
    updateBodyTheme(theme);
  }

// Function to handle mode selection
function handleModeSelection() {
  characterSelector.selectionMode = cycleRadio.checked;
}

// Function to create a character button
function createCharacterButton(key, name) {
  const characterBtn = document.createElement('button');
  characterBtn.innerText = name;
  characterBtn.classList.add('character-btn');
  characterBtn.setAttribute('data-character', key);
  return characterBtn;
}

// Function to generate the character buttons
function generateCharacterButtons(characterDictionary, containerClass) {
  const characterListContainer = document.querySelector(`.${containerClass}`);
  if (!characterListContainer) {
    console.error(`Container "${containerClass}" not found.`);
    return;
  }

  const excludedListContainer = document.querySelector('.excluded-list');
  const team = characterSelector.lastSelectedTeam(survivorRadio);
  const excludedCharacters = characterSelector.excluded_characters[team];

  const sortedCharacters = Object.entries(characterDictionary)
    .sort(([keyA], [keyB]) => Number(keyA) - Number(keyB));

  characterListContainer.innerHTML = '';
  excludedListContainer.innerHTML = '';

  sortedCharacters.forEach(([key, character]) => {
    const characterBtn = createCharacterButton(key, character);
    characterBtn.addEventListener('click', () => {
      handleCharacterToggling(characterBtn, characterListContainer);
    });

    if (excludedCharacters.hasOwnProperty(key)) {
      excludedListContainer.appendChild(characterBtn);
    } else {
      characterListContainer.appendChild(characterBtn);
    }
  });

  updateExcludedListVisibility();
}

// Function to handle team selection
function handleTeamSelection() {
  const team = characterSelector.lastSelectedTeam(survivorRadio);
  const Ready = characterSelector.characters[team];
  const Banned = characterSelector.exclusive_characters[team];

  // Generate character buttons for the character list container
  generateCharacterButtons(Ready, 'character-list');
  // Generate character buttons for the excluded list container
  generateCharacterButtons(Banned, 'excluded-list');

  updateExcludedListVisibility();

  if (team === 'survivor') {
    updateBodyTheme('survivor-theme');
    const killerExcluded = teamHasExcludedCharacters('killer');
    if (killerExcluded) {
      updateExcludedListVisibility();
    }
  } else {
    updateBodyTheme('');
    const survivorExcluded = teamHasExcludedCharacters('survivor');
    if (survivorExcluded) {
      updateExcludedListVisibility();
    }
  }
}

// Function to handle character selection
function handleCharacterSelection() {
  if (characterSelector.selectionMode) {
    characterSelector.cycleCharacters(survivorRadio);
  } else {
    characterSelector.randomCharacter(survivorRadio);
  }
}

// Function to update the body theme
function updateBodyTheme(theme) {
  document.body.classList.remove('survivor-theme');
  if (theme === 'survivor-theme') {
    document.body.classList.add(theme);
  }
}



// Load character data and initialize the team selection
characterSelector.loadCharacterData()
  .then(() => {
    handleTeamSelection();

    // Add event listeners to the UI elements
    survivorRadio.addEventListener('change', handleTeamSelection);
    killerRadio.addEventListener('change', handleTeamSelection);
    normalRadio.addEventListener('change', handleModeSelection);
    cycleRadio.addEventListener('change', handleModeSelection);
    selectCharacterBtn.addEventListener('click', handleCharacterSelection);
  })
  .catch((error) => {
    console.error('Failed to load character data:', error);
  });
