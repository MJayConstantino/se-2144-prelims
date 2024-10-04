// Import styles from external CSS file
import './style.css';
import { Calculator } from './components/calculator';
import { setupEventListeners } from './components/eventListeners';

/**
 * Initialize the calculator when the DOM is fully loaded
 * 
 * This ensures that all HTML elements are available before
 * attempting to attach event listeners
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create a new instance of the Calculator class
    const calculator = new Calculator();
    
    // Set up all event listeners for calculator buttons
    setupEventListeners(calculator);
});