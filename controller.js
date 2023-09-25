
// controller.js

import CharacterModel from './model.js';
import CharacterView from './view.js';

export default class CharacterController {
  constructor() {
    this.model = new CharacterModel();
    this.view = new CharacterView();

    // Initialize event listeners
    this.initEventListeners();
  }

  initEventListeners() {
    // Event listener for Survivor and Killer radio buttons
    this.view.survivorRadio.addEventListener('change', this.handleTeamSelection.bind(this));
    this.view.killerRadio.addEventListener('change', this.handleTeamSelection.bind(this));

    // Event listener for Normal and Cycle radio buttons
    this.view.normalRadio.addEventListener('change', this.handleModeSelection.bind(this));
    this.view.cycleRadio.addEventListener('change', this.handleModeSelection.bind(this));

    // Event listener for the "Select Character" button
    this.view.selectCharacterBtn.addEventListener('click', this.handleCharacterSelection.bind(this));

    // Event listener for moving the Character buttons
    document.addEventListener('characterMoved', this.handleCharacterMoved.bind(this));
  }

  // Handle team selection
  handleTeamSelection() {
    const team = this.view.survivorRadio.checked ? 'survivor' : 'killer';
    this.model.updateCharacterPools(); // This can be optimized to only update when needed
    const isVisible = this.model.excluded_characters[team].length > 0;
    this.view.updateExcludedListVisibility(isVisible);
    this.view.generateCharacterButtons(this.model.characters, team); // Generate buttons for the selected team
  }

  // Handle mode selection
  handleModeSelection() {
    this.model.selectionMode = this.view.cycleRadio.checked;
    this.view.updateSelectionMode(this.model.selectionMode);
  }

  // Handle character selection
  handleCharacterSelection() {
    const team = this.view.survivorRadio.checked ? 'survivor' : 'killer';
    let character;
    if (this.model.selectionMode) {
      character = this.model.getCycledCharacter(team);
    } else {
      character = this.model.getRandomCharacter(team);
    }
    this.view.updateCharacterLabel(character, team);
  }

  handleCharacterMoved(event) {
    const { characterName, team } = event.detail;
    if (this.model.isCharacterExcluded(characterName, team)) {
        this.model.includeCharacter(characterName, team);
        this.view.moveCharacterToIncluded(characterName, team);
    } else {
        this.model.excludeCharacter(characterName, team);
        this.view.moveCharacterToExcluded(characterName, team);
        }
  }
}
