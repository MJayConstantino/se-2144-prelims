import { Calculator } from './calculator';

/**
 * Sets up all event listeners for calculator buttons
 * @param calculator - Instance of the Calculator class
 * 
 * This function attaches click event listeners to:
 * 1. Digit buttons (0-9)
 * 2. Operation buttons (+, -, ×, ÷)
 * 3. Decimal point button (.)
 * 4. Equals button (=)
 * 5. Special function buttons (backspace, clear, hello, bye)
 */
export function setupEventListeners(calculator: Calculator) {
    // Set up listeners for digit, operation, decimal, and equals buttons
    document.querySelectorAll('.digit, .operation, .decimal, .equals').forEach(button => {
        button.addEventListener('click', () => calculator.handleInput(button.textContent!));
    });

    // Set up listeners for special function buttons
    document.getElementById('backspace')?.addEventListener('click', () => calculator.handleBackspace());
    document.getElementById('clear')?.addEventListener('click', () => calculator.handleClear());
    document.getElementById('hello')?.addEventListener('click', () => calculator.handleHello());
    document.getElementById('bye')?.addEventListener('click', () => calculator.handleBye());
}