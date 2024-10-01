// Import styles from external CSS file
import './style.css';

/**
 * Calculator Class
 * Implements a calculator with basic arithmetic operations
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
    handleInput(value: string): void {
        if (!this.isOn) return;

        if (this.helloIsActive) {
            this.clearDisplay();
        }

        switch (true) {
            case /[0-9]/.test(value):
                this.appendNumber(value);
                break;
            case value === '.':
                this.appendDecimal();
                break;
            case /[+−×÷]/.test(value):
                this.setOperation(value);
                break;
            case value === '=':
                this.calculate();
                break;
        }

        this.updateDisplay();
    }


    /**
     * cleasrs the display
     */
    clearDisplay() {
        this.currentOperation = '';  // Reset currentOperation
        this.result = '';            // Reset result
        this.specialText = '';       // Reset specialText
        this.previousResult = '';    // Reset previousResult
        this.helloIsActive = false;  // Reset hello flag
        this.byeIsActive = false;    // Reset bye flag 
        this.startBlinkingCursor();  // Restart cursor
        this.updateDisplay();        // Immediately update display
    }

    /**
     * Appends a number to the current operation
     * Prevents invalid number formats such as leading zeros
     * @param value - The digit to append
     */
    appendNumber(value: string): void {
        const currentNumber = this.getCurrentNumber();
        
        // Prevent leading zeros
        if (value === '0' && currentNumber === '0') return;
        if (currentNumber === '0' && value !== '.') {
            this.currentOperation = this.currentOperation.slice(0, -1);
        }
        
        this.currentOperation += value;
    }

    /**
     * Gets the current number being entered
     * @returns The current number as a string
     */
    getCurrentNumber(): string {
        const operators = ['+', '−', '×', '÷'];
        let lastIndex = -1;
        
        for (let i = this.currentOperation.length - 1; i >= 0; i--) {
            if (operators.includes(this.currentOperation[i])) {
                lastIndex = i;
                break;
            }
        }
        
        return this.currentOperation.slice(lastIndex + 1);
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
            if (selectedOperation === '−' && !this.previousResult.startsWith('-')) {
                this.currentOperation = '-' + this.previousResult; // Apply negative to previous result
            } else {
               this.currentOperation = this.previousResult + selectedOperation; 
            }
            this.previousResult = '';
        } else {
            if (this.currentOperation === '' && selectedOperation === '−') {
                // Allow initial negative sign
                this.currentOperation = '−';
            } else if (this.currentOperation === '−' && selectedOperation === '−') {
                // Prevent more than one initial negative sign
                return; // Or you could display an error message
            } else {
                const lastChar = this.currentOperation[this.currentOperation.length - 1];
                if ('+×÷'.includes(lastChar) && selectedOperation === '−') {
                    this.currentOperation += selectedOperation;
                } else if (!'+×÷−'.includes(lastChar)) { // Allow operator after number, but not after another operator (except initial -)
                    this.currentOperation += selectedOperation;
                }
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
        this.clearDisplay()
        this.isOn = true;
    }

    /**
     * Handles the hello functionality
     * Displays a random greeting in different languages
     */
    handleHello() {
        // List  of greetings in different languages
        const greetings = [
            "Hello",     // English
            "Hola",      // Spanish
            "Bonjour",   // French
            "Hallo",     // German
            "Ciao",      // Italian
            "Olá",       // Portuguese
            "Привет",    // Russian
            "こんにちは",  // Japanese (Konnichiwa)
            "안녕하세요",  // Korean (Annyeonghaseyo)
            "你好",       // Chinese (Nǐ hǎo)
            "Γειά σου",  // Greek (Yia sou)
            "Merhaba",   // Turkish
            "Namaste",   // Hindi
            "Salam",     // Arabic
            "Shalom"     // Hebrew
          ];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

        this.clearDisplay()
        this.helloIsActive = true;
        this.isOn = true;
        this.specialText = randomGreeting;
        this.stopBlinkingCursor();
        this.updateDisplay();
    }

    /**
     * Handles the power off functionality
     * Displays a goodbye message with an animation and then clears the calculator
     */
    handleBye() {
        if (this.byeIsActive) return;
        
        this.clearDisplay();   // Clear the display initially
        this.isOn = false;     // Turn off the calculator
        this.byeIsActive = true; // Prevents re-triggering
        
        const goodbyeText = 'Goodbye!';
        this.specialText = ''; // Start with an empty string

        let index = 0;
        
        // Reveal each letter one by one every 250ms over 2 seconds
        const interval = setInterval(() => {
            if (index < goodbyeText.length) {
                this.specialText += goodbyeText[index];
                this.updateDisplay(); // Update the display after adding each letter
                index++;
            } else {
                clearInterval(interval); // Stop the interval when all letters are displayed
                setTimeout(() => {
                    this.clearDisplay(); // Clear the display after 2 seconds
                }, 2000);
            }
        }, 250); // 250ms * 8 letters = 2 seconds total
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