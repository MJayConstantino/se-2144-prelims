import './style.css'

class Calculator {
    operationDisplay: HTMLDivElement;
    resultDisplay: HTMLDivElement;
    currentOperation: string = '';
    result: string = '';
    isOn: boolean = true;
    cursorInterval: number | null = null;
    helloIsActive: boolean = false;

    constructor() {
        this.operationDisplay = document.getElementById('operation-display') as HTMLDivElement;
        this.resultDisplay = document.getElementById('result-display') as HTMLDivElement;
        this.setupEventListeners();
        this.startBlinkingCursor();
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

    handleInput(value: string) {
        if (!this.isOn) return;

        if ('0123456789+−×÷.'.includes(value) && !this.helloIsActive) {
            this.currentOperation += value;
        } else if (value === '=') {
            this.calculate();
        }

        this.updateDisplay();
    }

    calculate() {
        try {
            const formattedOperation = this.currentOperation.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
            this.result = eval(formattedOperation).toString().slice(0, 10);
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
        this.isOn = true;
        this.helloIsActive = false;
        this.updateDisplay();
    }

    handleHello() {
        if (!this.isOn) return;
        this.helloIsActive = true;
        const greetings = ['Hello', 'Hola', 'Bonjour', 'Ciao', 'Konnichiwa', 'Namaste', 'Merhaba', 'Kamusta'];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        this.currentOperation = randomGreeting;
        this.updateDisplay();
    }

    handleBye() {
        this.isOn = false;
        this.currentOperation = 'Goodbye';
        this.result = '';
        this.updateDisplay();
        window.setTimeout(() => {
            this.currentOperation = '';
            this.result = '';
            this.updateDisplay();
        }, 2000);
    }

    updateDisplay() {
        this.operationDisplay.textContent = this.currentOperation;
        this.resultDisplay.textContent = this.result;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});