class CharacterSelector {

  constructor() {
    this.selectionMode = true; // true for random, false for cycling
    this.characters = {
      killer: {},
      survivor: {}
    };
    this.exclusive_characters = {
      killer: {},
      survivor: {}
    };
    this.character_pool = {
      killer: [],
      survivor: []
    };
    this.excluded_characters = {
      killer: [],
      survivor: []
    };
    this.previous_selection = {
      killer: null,
      survivor: null
    };
    this.selected_characters = {
      killer: [],
      survivor: []
    };
  }

  async loadCharacterData() {
    try {
      console.log('Loading character data...');
      const response = await fetch('characters.json');
      const data = await response.json();
      // assign killer and survivor data
      this.characters.killer = data.killers;
      this.characters.survivor = data.survivors;
      // assign exclusive killer and survivor data
      this.exclusive_characters.killer = data.exclusive_killers;
      this.exclusive_characters.survivor = data.exclusive_survivors;
      // Update the character pools
      this.character_pool['killer'] = Object.values(this.characters.killer);
      this.character_pool['survivor'] = Object.values(this.characters.survivor);
      // Update the excluded characters
      this.excluded_characters['killer'] = Object.values(this.exclusive_characters.killer);
      this.excluded_characters['survivor'] = Object.values(this.exclusive_characters.survivor);
      // Iterate over the excluded killers array
      this.excluded_characters['killer'].forEach((killer) => {
        this.character_pool['killer'].push(killer);
      });
      // Iterate over the excluded survivors array
      this.excluded_characters['survivor'].forEach((survivor) => {
        this.character_pool['survivor'].push(survivor);
      });
      console.log('Character data loaded successfully:', data);
      console.log('Excluded Killers: ', this.excluded_characters['killer']);
      console.log('Excluded Survivors: ', this.excluded_characters['survivor']);
    } catch (error) {
      console.error('Failed to load character data:', error);
    }
  }

  lastSelectedTeam(radio) {
    return radio.checked ? 'survivor' : 'killer';
  }

  getTeamInfo(radio) {
  const team = this.lastSelectedTeam(radio);
  return [team, this.character_pool[team]];
}


  availableForRandom(team, team_list) {
    return team_list.filter(
      i =>
      i !== this.previous_selection[team] &&
      !this.excluded_characters[team].includes(i)
    );
  }

  getRandomElement(array) {
    let currentIndex = array.length;
    let randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array[0];
  }

  printCharacterSelection(character, team) {
    const isSurvivor = team === 'survivor';
    let formattedCharacter = isSurvivor ? character : `The ${character}`;
    const selectedCharacterName = document.getElementById('selected-character-name');
    if (selectedCharacterName) {
      selectedCharacterName.textContent = formattedCharacter;
    } else {
      console.error('Selected character name element not found.');
    }
    console.log(`Play ${team}: ${formattedCharacter}\n`);
  }

  randomCharacter(radio) {
    console.log(`random...`);
    const [team, team_list] = this.getTeamInfo(radio);
    const available = this.availableForRandom(team, team_list);
    const character = this.getRandomElement(available);
    this.previous_selection[team] = character;
    this.printCharacterSelection(character, team);
  }

  avaiableForCycle(team, team_list) {
    console.log(`Excluded characters: `, this.excluded_characters[team]);
    let available = team_list.filter(
      i =>
      i !== this.previous_selection[team] &&
      !this.excluded_characters[team].includes(i) &&
      !this.selected_characters[team].includes(i)
    );

    if (available.length === 0) {
      this.selected_characters[team] = [];
      available = team_list.filter(
        i =>
        i !== this.previous_selection[team] &&
        !this.excluded_characters[team].includes(i)
      );
    }

    return available;
  }

  cycleCharacters(radio) {
    console.log(`cycle...`);
    const [team, team_list] = this.getTeamInfo(radio);
    let available = this.avaiableForCycle(team, team_list);
    const character = this.getRandomElement(available);
    this.selected_characters[team].push(character);
    this.previous_selection[team] = character;
    console.log('Hardcore removed: ', this.selected_characters[team]);
    this.printCharacterSelection(character, team)
  }

  consoleLogExcluded(name, team, array) {
    console.log(`Character '${name}' is now excluded for ${team}`);
    const arraySize = array.length;
    if (arraySize === 0) {
      console.log(`Excluded Array: EMPTY!`);
    } else {
    console.log('Excluded Array: ', array)
    }
  }

  removeFromExcluded(team, key, name) {
    let excludedList = this.excluded_characters[team];
    const index = excludedList.indexOf(name);
    if (index !== -1) {
      excludedList.splice(index, 1);
    }
    this.characters[team][key] = name;
    delete this.exclusive_characters[team][key];
    this.consoleLogExcluded(name, team, excludedList);
    console.log('Banned Object: ', this.exclusive_characters[team])
  }

  addToExcluded(team, key, name) {
    let excludedList = this.excluded_characters[team];
    excludedList.push(name);
    this.exclusive_characters[team][key] = name;
    delete this.characters[team][key];
    this.consoleLogExcluded(name, team, excludedList);
    console.log('Banned Object: ', this.exclusive_characters[team])
  }

}

export default CharacterSelector;