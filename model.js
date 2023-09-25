
// model.js

export default class CharacterModel {
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
  
    // Method to load characters from a data source (e.g., JSON file)
    async loadCharacters() {
      try {
        const response = await fetch('characters.json');
        const data = await response.json();
        this.characters.killer = data.killers;
        this.characters.survivor = data.survivors;
        this.exclusive_characters.killer = data.exclusive_killers;
        this.exclusive_characters.survivor = data.exclusive_survivors;
        this.updateCharacterPools();
        console.log('Character data loaded successfully:', data);
      } catch (error) {
        console.error('Failed to load character data:', error);
      }
    }
  
    updateCharacterPools() {
      this.character_pool['killer'] = Object.values(this.characters.killer);
      this.character_pool['survivor'] = Object.values(this.characters.survivor);
      this.excluded_characters['killer'] = Object.values(this.exclusive_characters.killer);
      this.excluded_characters['survivor'] = Object.values(this.exclusive_characters.survivor);
      this.excluded_characters['killer'].forEach(killer => this.character_pool['killer'].push(killer));
      this.excluded_characters['survivor'].forEach(survivor => this.character_pool['survivor'].push(survivor));
    }
  
    // Method for getting a random character based on type ("killer" or "survivor")
    getRandomCharacter(type) {
      const available = this.character_pool[type].filter(
        i => i !== this.previous_selection[type] && !this.excluded_characters[type].includes(i)
      );
      const character = this.getRandomElement(available);
      this.previous_selection[type] = character;
      return character;
    }
  
    // Method for getting the next character in a cycle (not implemented)
    getCycledCharacter(type) {
      let available = this.character_pool[type].filter(
        i => i !== this.previous_selection[type] && 
        !this.excluded_characters[type].includes(i) &&
        !this.selected_characters[type].includes(i)
      );
      
      if (available.length === 0) {
        this.selected_characters[type] = [];
        available = this.character_pool[type].filter(
          i => i !== this.previous_selection[type] && !this.excluded_characters[type].includes(i)
        );
      }
      
      const character = this.getRandomElement(available);
      this.selected_characters[type].push(character);
      this.previous_selection[type] = character;
      return character;
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
  
    // Additional methods related to excluded characters can be added here
  }
  