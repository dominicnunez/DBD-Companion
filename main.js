import CharacterController from './controller.js';

// Initialize the controller, which in turn initializes the model and the view
const controller = new CharacterController();

// Load characters and then update the UI
async function initApp() {
  await controller.model.loadCharacters();
  controller.handleTeamSelection(); // Update the UI based on the team selection
  controller.view.generateCharacterButtons(controller.model.characters, 'killer'); // Generate buttons for "killer" team
}

// Initialize the app
initApp();
