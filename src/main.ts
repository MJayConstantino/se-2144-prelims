import './style.css';

class Calculator {
    operationDisplay: HTMLDivElement;
    resultDisplay: HTMLDivElement;
    specialDisplay: HTMLDivElement;
    currentOperation: string = '';
    specialText: string = '';
    result: string = '';
    previousResult: string = '';
    isOn: boolean = true;
    cursorInterval: number | null = null;
    helloIsActive: boolean = false;

    constructor() {
        this.operationDisplay = document.getElementById('operation-display') as HTMLDivElement;
        this.specialDisplay = document.getElementById('special-display') as HTMLDivElement;
        this.resultDisplay = document.getElementById('result-display') as HTMLDivElement;
        this.setupEventListeners();
        // this.startBlinkingCursor();
    }

    setupEventListeners() {
        document.querySelectorAll('.digit, .operation, .decimal, .equals').forEach(button => {
            button.addEventListener('click', () => this.handleInput(button.textContent!));
        });

        document.getElementById('backspace')?.addEventListener('click', () => this.handleBackspace());
        document.getElementById('clear')?.addEventListener('click', () => this.handleClear());
        document.getElementById('hello')?.addEventListener('click', () => this.handleHello());
        document.getElementById('bye')?.addEventListener('click', () => this.handleBye());
    }

    // startBlinkingCursor() {
    //     if (this.cursorInterval) {
    //         clearInterval(this.cursorInterval);
    //     }
    //     this.cursorInterval = window.setInterval(() => {
    //         if (this.isOn) {
    //             this.operationDisplay.classList.toggle('cursor');
    //         } else {
    //             this.operationDisplay.classList.remove('cursor');
    //         }
    //     }, 500);
    // }

    handleInput(value: string) {
        if (!this.isOn) return;

        if (this.helloIsActive) {
            this.currentOperation = '';
            this.result = '';
            this.specialText = '';
            this.helloIsActive = false;
        }

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

    appendToOperation(value: string) {
        this.currentOperation += value;
    }

    appendDecimal() {
        const lastOperand = this.getLastOperand();
        if (!lastOperand.includes('.')) {
            this.currentOperation += '.';
        }
    }

    setOperation(selectedOperation: string) {
        if (this.previousResult !== '') {
            this.currentOperation = this.previousResult + selectedOperation;
            this.previousResult = '';
        } else if (this.currentOperation.length > 0) {
            const lastChar = this.currentOperation[this.currentOperation.length - 1];
            if ('+−×÷'.includes(lastChar)) {
                this.currentOperation = this.currentOperation.slice(0, -1) + selectedOperation;
            } else {
                this.currentOperation += selectedOperation;
            }
        }
    }

    getLastOperand(): string {
        const operators = ['+', '−', '×', '÷'];
        let lastOperatorIndex = -1;

        operators.forEach((op) => {
            const index = this.currentOperation.lastIndexOf(op);
            if (index > lastOperatorIndex) {
                lastOperatorIndex = index;
            }
        });

        return lastOperatorIndex === -1
            ? this.currentOperation
            : this.currentOperation.slice(lastOperatorIndex + 1);
    }

    calculate() {
        try {
            const formattedOperation = this.currentOperation
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-');
            this.result = eval(formattedOperation).toString();
            this.previousResult = this.result;
        } catch (error) {
            this.result = 'Error';
        }
    }

    handleBackspace() {
        if (!this.isOn) return;
        this.currentOperation = this.currentOperation.slice(0, -1);
        this.updateDisplay();
    }

    handleClear() {
        this.currentOperation = '';
        this.result = '';
        this.previousResult = '';
        this.specialText = '';
        this.isOn = true;
        this.helloIsActive = false;
        this.updateDisplay();
    }

    handleHello() {
        if (!this.isOn) return;
        this.helloIsActive = true;
        const greetings = ['Hello', 'Hola', 'Bonjour', 'Ciao', 'Konnichiwa', 'Namaste', 'Merhaba', 'Kamusta'];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        this.currentOperation = '';
        this.previousResult = '';
        this.result = '';
        this.specialText = randomGreeting;
        this.updateDisplay();
    }

    handleBye() {
        this.isOn = false;
        this.currentOperation = '';
        this.previousResult = '';
        this.result = '';
        this.specialText = 'Goodbye!';
        this.updateDisplay();
        setTimeout(() => {
            this.currentOperation = '';
            this.previousResult = '';
            this.result = '';
            this.specialText = '';
            this.updateDisplay();
        }, 2000);
    }

    updateDisplay() {
        if (this.currentOperation.length > 20) {
            this.operationDisplay.textContent = this.currentOperation.slice(0, 17) + '...';
        } else {
            this.operationDisplay.textContent = this.currentOperation;
        }
        this.specialDisplay.textContent = this.specialText;
        this.resultDisplay.textContent = this.result.slice(0, 14);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});