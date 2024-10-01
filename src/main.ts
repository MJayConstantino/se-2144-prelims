// Import styles from external CSS file
import './style.css';

/**
 * Calculator Class
 * Implements a retro-style calculator with basic arithmetic operations
 * and special greeting functionalities
 */
class Calculator {
    // DOM element references
    operationDisplay: HTMLDivElement;  // Shows current operation
    resultDisplay: HTMLDivElement;     // Shows calculation result
    specialDisplay: HTMLDivElement;    // Shows special messages (greetings)
    
    // State variables
    currentOperation: string = '';     // Current mathematical expression
    specialText: string = '';          // Text for special display (greetings)
    result: string = '';               // Calculated result
    previousResult: string = '';       // Stores last calculation for chaining
    isOn: boolean = true;              // Power state of calculator
    cursorInterval: number | null = null; // Controls blinking cursor animation
    helloIsActive: boolean = false;    // Tracks if greeting is displayed
    byeIsActive: boolean = false;      // Prevents multiple goodbye sequences

    constructor() {
        // Initialize DOM references
        this.operationDisplay = document.getElementById('operation-display') as HTMLDivElement;
        this.specialDisplay = document.getElementById('special-display') as HTMLDivElement;
        this.resultDisplay = document.getElementById('result-display') as HTMLDivElement;
        
        this.setupEventListeners();
        this.startBlinkingCursor();
    }

    /**
     * Sets up click event listeners for all calculator buttons
     */
    setupEventListeners() {
        // Set up number, operation, decimal, and equals buttons
        document.querySelectorAll('.digit, .operation, .decimal, .equals').forEach(button => {
            button.addEventListener('click', () => this.handleInput(button.textContent!));
        });

        // Set up special function buttons
        document.getElementById('backspace')?.addEventListener('click', () => this.handleBackspace());
        document.getElementById('clear')?.addEventListener('click', () => this.handleClear());
        document.getElementById('hello')?.addEventListener('click', () => this.handleHello());
        document.getElementById('bye')?.addEventListener('click', () => this.handleBye());
    }

    /**
     * Manages the blinking cursor animation in the operation display
     */
    startBlinkingCursor() {
        if (this.cursorInterval) {
            clearInterval(this.cursorInterval);
        }
        this.cursorInterval = window.setInterval(() => {
            if (this.isOn) {
                this.operationDisplay.classList.toggle('cursor');
            } else {
                this.operationDisplay.classList.remove('cursor');
            }
        }, 500);
    }

    /**
     * Stops the blinking cursor animation
     */
    stopBlinkingCursor() {
        if (this.cursorInterval) {
            clearInterval(this.cursorInterval);
            this.cursorInterval = null;
        }
        this.operationDisplay.classList.remove('cursor');
    }

    /**
     * Handles all button inputs (numbers, operations, decimal)
     */
    handleInput(value: string) {
        if (!this.isOn) return;

        // Reset if coming from a greeting
        if (this.helloIsActive) {
            this.currentOperation = '';
            this.result = '';
            this.specialText = '';
            this.startBlinkingCursor()
            this.helloIsActive = false;
        }

        // Route input to appropriate handler
        if ('0123456789'.includes(value)) {
            this.appendToOperation(value);
        } else if (value === '.') {
            this.appendDecimal();
        } else if ('+−×÷'.includes(value)) {
            this.setOperation(value);
        } else if (value === '=') {
            this.calculate();
        }

        this.updateDisplay();
    }

    /**
     * Appends a number to the current operation
     * @param value - The digit to append
     */
    appendToOperation(value: string) {
        this.currentOperation += value;
    }

    /**
     * Appends a decimal point to the current operand
     * Prevents multiple decimal points in the same operand
     */
    appendDecimal() {
        const lastOperand = this.getLastOperand();
        if (!lastOperand.includes('.')) {
            this.currentOperation += '.';
        }
    }

    /**
     * Handles mathematical operation inputs (+, −, ×, ÷)
     * - If there's a previous result, starts a new operation with that result
     * - Replaces the last operation if one exists
     * - Adds the operation if at the end of a number
     * @param selectedOperation - The mathematical operation symbol
     */
    setOperation(selectedOperation: string) {
        if (this.previousResult !== '') {
            // Start new operation with previous result
            this.currentOperation = this.previousResult + selectedOperation;
            this.previousResult = '';
        } else if (this.currentOperation.length > 0) {
            const lastChar = this.currentOperation[this.currentOperation.length - 1];
            if ('+−×÷'.includes(lastChar)) {
                // Replace existing operation
                this.currentOperation = this.currentOperation.slice(0, -1) + selectedOperation;
            } else {
                // Add operation to end of number
                this.currentOperation += selectedOperation;
            }
        }
    }

    /**
     * Extracts the last operand from the current operation
     * Used for decimal point validation and potential other operand-specific operations
     * @returns The last number in the current operation
     */
    getLastOperand(): string {
        const operators = ['+', '−', '×', '÷'];
        let lastOperatorIndex = -1;

        // Find the last operator in the current operation
        operators.forEach((operator) => {
            const index = this.currentOperation.lastIndexOf(operator);
            if (index > lastOperatorIndex) {
                lastOperatorIndex = index;
            }
        });

        // Return either the full operation (if no operators)
        // or just the part after the last operator
        return lastOperatorIndex === -1
            ? this.currentOperation
            : this.currentOperation.slice(lastOperatorIndex + 1);
    }

    /**
     * Performs the calculation based on the current operation
     * Handles errors by displaying "Error" if the calculation fails
     */
    calculate() {
        try {
            // Replace calculator symbols with JavaScript operators
            const formattedOperation = this.currentOperation
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-');
            
            // Evaluate the expression and store result
            this.result = eval(formattedOperation).toString();
            this.previousResult = this.result;
        } catch (error) {
            this.result = 'Error';
        }
    }

    /**
     * Handles the backspace functionality
     * Removes the last character from the current operation
     */
    handleBackspace() {
        if (!this.isOn) return;
        this.currentOperation = this.currentOperation.slice(0, -1);
        this.updateDisplay();
    }

    /**
     * Handles the clear functionality
     * Resets all calculator states to their initial values
     */
    handleClear() {
        this.currentOperation = '';
        this.result = '';
        this.previousResult = '';
        this.specialText = '';
        this.isOn = true;
        this.startBlinkingCursor();
        this.helloIsActive = false;
        this.byeIsActive = false;
        this.updateDisplay();
    }

    /**
     * Handles the hello functionality
     * Displays a random greeting in different languages
     */
    handleHello() {
        if (!this.isOn) return;
        this.helloIsActive = true;
        
        // Array of greetings in different languages
        const greetings = ['Hello', 'Hola', 'Bonjour', 'Ciao', 'Namaste', 'Merhaba', 'Kamusta', 'Konnichiwa'];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        
        // Clear current operation and display greeting
        this.currentOperation = '';
        this.previousResult = '';
        this.result = '';
        this.specialText = randomGreeting;
        this.stopBlinkingCursor();
        this.updateDisplay();
    }

    /**
     * Handles the power off functionality
     * Displays a goodbye message and then clears the calculator
     */
    handleBye() {
        if (this.byeIsActive) return;
        
        // Turn off calculator and show goodbye message
        this.isOn = false;
        this.currentOperation = '';
        this.previousResult = '';
        this.result = '';
        this.specialText = 'Goodbye!';
        this.updateDisplay();
        
        // Clear everything after 2 seconds
        setTimeout(() => {
            this.currentOperation = '';
            this.previousResult = '';
            this.result = '';
            this.specialText = '';
            this.byeIsActive = true;
            this.updateDisplay();
        }, 2000);
    }
    
    /**
     * Updates all display elements with current state
     * Handles truncation for long expressions/results
     */
    updateDisplay() {
        // Truncate long operations with ellipsis
        if (this.currentOperation.length > 20) {
            this.operationDisplay.textContent = this.currentOperation.slice(0, 17) + '...';
        } else {
            this.operationDisplay.textContent = this.currentOperation;
        }
        
        this.specialDisplay.textContent = this.specialText;
        
        // Truncate long results with ellipsis
        if (this.result.length > 14) {
            this.resultDisplay.textContent = this.result.slice(0, 12) + '..';
        } else {
            this.resultDisplay.textContent = this.result;
        }
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});