import { getCurrentNumber, getLastOperand } from './utility';

/**
 * Calculator Class
 * Implements a calculator with basic arithmetic operations,
 * power on/off functionality, and special greeting features.
 */
export class Calculator {
    // DOM element references
    operationDisplay: HTMLDivElement;  // Display for showing current operation
    resultDisplay: HTMLDivElement;     // Display for showing the calculated result
    specialDisplay: HTMLDivElement;    // Display for special text (like greetings)

    // State variables
    currentOperation: string = '';     // Current mathematical expression being entered
    specialText: string = '';          // Text for special display (greetings)
    result: string = '';               // Calculated result after evaluation
    previousResult: string = '';       // Stores last calculation for chaining operations
    isOn: boolean = true;              // Power state of the calculator (on/off)
    cursorInterval: number | null = null; // Interval for blinking cursor animation
    helloIsActive: boolean = false;    // Flag to track if a greeting is currently displayed
    byeIsActive: boolean = false;      // Flag to prevent multiple goodbye sequences

    /**
     * Initializes the Calculator instance.
     * Sets up DOM references and starts cursor blinking.
     */
    constructor() {
        this.operationDisplay = document.getElementById('operation-display') as HTMLDivElement;
        this.specialDisplay = document.getElementById('special-display') as HTMLDivElement;
        this.resultDisplay = document.getElementById('result-display') as HTMLDivElement;

        this.startBlinkingCursor();
    }

    /**
     * Starts the blinking cursor animation by toggling the 'cursor' class.
     * Clears any existing cursor interval before starting a new one.
     */
    startBlinkingCursor() {
        if (this.cursorInterval) {
            clearInterval(this.cursorInterval); // Clear any previous cursor interval
        }
        this.cursorInterval = window.setInterval(() => {
            if (this.isOn) {
                this.operationDisplay.classList.toggle('cursor'); // Toggle cursor class to create blinking effect
            } else {
                this.operationDisplay.classList.remove('cursor'); // Remove cursor if calculator is off
            }
        }, 500);
    }

    /**
     * Stops the blinking cursor animation by clearing the interval.
     */
    stopBlinkingCursor() {
        if (this.cursorInterval) {
            clearInterval(this.cursorInterval); // Clear cursor interval
            this.cursorInterval = null;         // Reset cursorInterval state
        }
        this.operationDisplay.classList.remove('cursor'); // Ensure cursor is not visible
    }

    /**
     * Clears the calculator display and resets all state variables.
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
     * Updates the display elements (operation, result, special) based on current state.
     * Truncates long strings to fit the display.
     */
    updateDisplay() {
        // Truncate long operations with ellipsis
        if (this.currentOperation.length > 20) {
            this.operationDisplay.textContent = this.currentOperation.slice(0, 17) + '...';
        } else {
            this.operationDisplay.textContent = this.currentOperation;
        }

        // Set special text (for greetings or goodbye)
        this.specialDisplay.textContent = this.specialText;

        // Truncate long results with ellipsis
        if (this.result.length > 14) {
            this.resultDisplay.textContent = this.result.slice(0, 12) + '..';
        } else {
            this.resultDisplay.textContent = this.result;
        }
    }

    /**
     * Handles the backspace functionality, which removes the last character
     * from the current operation string.
     */
    handleBackspace() {
        if (!this.isOn) return; // Do nothing if the calculator is off
        this.currentOperation = this.currentOperation.slice(0, -1); // Remove last character
        this.updateDisplay();   // Update display with new operation
    }

    /**
     * Handles the clear functionality by resetting the calculator display and turning it on.
     */
    handleClear() {
        this.clearDisplay(); // Reset all display values
        this.isOn = true;    // Turn the calculator back on
    }

    /**
     * Handles input events for digits, operators, decimal points, and equals.
     * @param value - The value of the button pressed (digit, operator, etc.)
     */
    handleInput(value: string): void {
        if (!this.isOn) return; // Do nothing if the calculator is off

        // Clear display if hello greeting is active
        if (this.helloIsActive) {
            this.clearDisplay();
        }

        // Determine type of input and handle accordingly
        switch (true) {
            case /[0-9]/.test(value):  // Digit input (0-9)
                this.appendNumber(value);
                break;
            case value === '.':        // Decimal point input
                this.appendDecimal();
                break;
            case /[+−×÷]/.test(value): // Operator input (+, −, ×, ÷)
                this.setOperation(value);
                break;
            case value === '=':        // Equals input (trigger calculation)
                this.calculate();
                break;
        }

        this.updateDisplay(); // Update display after handling input
    }

    /**
     * Appends a number to the current operation string, preventing invalid formats.
     * @param value - The digit to append
     */
    appendNumber(value: string): void {
        const currentNumber = getCurrentNumber(this.currentOperation);
        
        // Prevent leading zeros
        if (value === '0' && currentNumber === '0') return;
        if (currentNumber === '0' && value !== '.') {
            this.currentOperation = this.currentOperation.slice(0, -1); // Remove leading zero
        }

        this.currentOperation += value; // Append the new digit
    }

    /**
     * Appends a decimal point to the current number, preventing multiple decimals.
     */
    appendDecimal() {
        const lastOperand = getLastOperand(this.currentOperation);
        if (!lastOperand.includes('.')) {
            this.currentOperation += '.'; // Add decimal if not already present
        }
    }

    /**
     * Sets the mathematical operation (e.g., +, −, ×, ÷) in the expression.
     * Replaces any existing operation or appends one if valid.
     * @param selectedOperation - The operator symbol to append
     */
    setOperation(selectedOperation: string) {
        if (this.previousResult !== '') {
            // Start new operation with previous result if available
            this.currentOperation = this.previousResult + selectedOperation;
            this.previousResult = '';
        } else {
            const lastChar = this.currentOperation[this.currentOperation.length - 1];
            if ('+×÷'.includes(lastChar) && selectedOperation == '−') {
                this.currentOperation += selectedOperation; // Add negative operator if after an operator
            } else if (!'+×÷−'.includes(lastChar)) {
                this.currentOperation += selectedOperation; // Add operator if valid
            }
        }
    }

    /**
     * Calculates the result of the current mathematical expression.
     * Displays an error message if evaluation fails.
     */
    calculate() {
        try {
            // Replace calculator symbols with actual JavaScript operators
            const formattedOperation = this.currentOperation
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-');

            // Evaluate the expression and store result
            this.result = eval(formattedOperation).toString();
            this.previousResult = this.result; // Save result for next operation
        } catch (error) {
            this.result = 'Error'; // Display error if evaluation fails
        }
    }

    /**
     * Handles the "Hello" functionality by displaying a random greeting
     * in various languages and stopping the blinking cursor.
     */
    handleHello() {
        const greetings = [
            "Hello", "Hola", "Bonjour", "Hallo", "Ciao", "Olá", "Привет", 
            "こんにちは", "안녕하세요", "你好", "Γειά σου", "Merhaba", 
            "Namaste", "Salam", "Shalom"
        ];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

        this.clearDisplay();         // Clear display before showing greeting
        this.helloIsActive = true;   // Set hello flag
        this.isOn = true;            // Ensure calculator is on
        this.specialText = randomGreeting; // Display random greeting
        this.stopBlinkingCursor();   // Stop cursor blinking
        this.updateDisplay();        // Update the display with greeting
    }

    /**
     * Handles the "Goodbye" functionality by displaying a goodbye message with
     * a letter-by-letter animation, then turning off the calculator.
     */
    handleBye() {
        if (this.byeIsActive) return; // Do nothing if already saying goodbye

        this.clearDisplay();          // Clear display before goodbye message
        this.isOn = false;            // Turn off the calculator
        this.byeIsActive = true;      // Set bye flag to prevent re-triggering

        const goodbyeText = 'Goodbye!'; // Goodbye message
        this.specialText = '';         // Reset special text
        let index = 0;

        // Display each character of goodbye message one by one
        const interval = setInterval(() => {
            if (index < goodbyeText.length) {
                this.specialText += goodbyeText[index]; // Append next letter
                this.updateDisplay();                   // Update display
                index++;
            } else {
                clearInterval(interval);  // Stop animation when complete
                setTimeout(() => {
                    this.clearDisplay();  // Clear display after a short pause
                }, 2000);
            }
        }, 250); // Display each character every 250ms
    }
}
