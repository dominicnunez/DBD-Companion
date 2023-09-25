export default class CharacterView {
    constructor() {
        // Get DOM elements
        this.survivorRadio = document.getElementById('survivor-radio');
        this.killerRadio = document.getElementById('killer-radio');
        this.normalRadio = document.getElementById('normal-radio');
        this.cycleRadio = document.getElementById('cycle-radio');
        this.selectCharacterBtn = document.getElementById('select-character-btn');
        this.characterLabel = document.getElementById('selected-character-name');
        this.excludedListContainer = document.querySelector('.excluded-list-container');
        this.characterListContainer = document.querySelector('.character-list');
    }

    generateCharacterButtons(characters, excludedCharacters, team) {
        // Clear existing buttons
        this.characterListContainer.innerHTML = '';
        this.excludedListContainer.innerHTML = '';

        // Sort characters by key
        characters = Object.entries(characters[team]).sort((a, b) => a[0] - b[0]).reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});
        excludedCharacters = Object.entries(excludedCharacters[team]).sort((a, b) => a[0] - b[0]).reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

        // Generate buttons for available characters
        for (const characterName in characters) {
            const button = this.createCharacterButton(characterName, team);
            this.characterListContainer.appendChild(button);
        }

        // Generate buttons for excluded characters
        for (const characterName in excludedCharacters) {
            const button = this.createCharacterButton(characterName, team);
            this.excludedListContainer.appendChild(button);
        }
    }

    createCharacterButton(characterName, team) {
        const button = document.createElement('button');
        button.className = 'character-btn';
        button.textContent = characterName;
        button.dataset.team = team;
        button.dataset.characterName = characterName;

        // Attach event listener for moving character between lists
        button.addEventListener('click', this.moveCharacter.bind(this, button));

        return button;
    }

    moveCharacter(button) {
        const characterName = button.dataset.characterName;
        const team = button.dataset.team;

        if (this.model.isCharacterExcluded(characterName, team)) {
            this.model.includeCharacter(characterName, team);
            this.excludedListContainer.removeChild(button);
            this.characterListContainer.appendChild(button);
        } else {
            this.model.excludeCharacter(characterName, team);
            this.characterListContainer.removeChild(button);
            this.excludedListContainer.appendChild(button);
        }
    }

    // Method for updating the character label in the UI
    updateCharacterLabel(character, team) {
        const isSurvivor = team === 'survivor';
        let formattedCharacter = isSurvivor ? character : `The ${character}`;
        if (this.characterLabel) {
            this.characterLabel.textContent = formattedCharacter;
        } else {
            console.error('Selected character name element not found.');
        }
    }

    // Method for enabling or disabling buttons based on state
    setButtonState(state) {
        this.selectCharacterBtn.disabled = !state;
    }

    // Method for updating the selection mode (Random or Cycled)
    updateSelectionMode(isCycled) {
        if (isCycled) {
            this.normalRadio.checked = false;
            this.cycleRadio.checked = true;
        } else {
            this.normalRadio.checked = true;
            this.cycleRadio.checked = false;
        }
    }

    // Method for updating the visibility of the excluded list container
    updateExcludedListVisibility(isVisible) {
        if (isVisible) {
            this.excludedListContainer.style.display = 'block';
        } else {
            this.excludedListContainer.style.display = 'none';
        }
    }

    // Additional methods for DOM manipulations can be added here
}
