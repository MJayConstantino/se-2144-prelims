import './style.css'

class Calculator {
    operationDisplay: HTMLDivElement;
    resultDisplay: HTMLDivElement;
    currentOperation: string = '';
    result: string = '';
    previousResult: string = '';
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

        if ('0123456789.'.includes(value) && !this.helloIsActive) {
            this.appendToOperation(value);
        } else if ('+−×÷'.includes(value) && !this.helloIsActive) {
            this.setOperation(value);
        } else if (value === '=') {
            this.calculate();
        }

        this.updateDisplay();
    }

    appendToOperation(value: string) {
        if (this.currentOperation.length < 15) {
            this.currentOperation += value;
        }
    }

    setOperation(selectedOperation: string) {
        if (this.previousResult !== '') {
            this.currentOperation = this.previousResult + selectedOperation;
            console.log(this.currentOperation)
        } else if (this.currentOperation.length > 0 && !'+−×÷'.includes(this.currentOperation[this.currentOperation.length - 1])) {
            if (this.currentOperation.length < 15) {
                this.currentOperation += selectedOperation;
            }
        }
    }

    calculate() {
        try {
            const formattedOperation = this.currentOperation.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
            this.result = eval(formattedOperation).toString();
            this.previousResult = this.result;
        } catch (error) {
            this.result = `${error}`;
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
        this.result = randomGreeting;
        this.updateDisplay();
    }

    handleBye() {
        this.isOn = false;
        this.currentOperation = '';
        this.result = 'Goodbye!';
        this.updateDisplay();
        setTimeout(() => {
            this.currentOperation = '';
            this.result = '';
            this.updateDisplay();
        }, 2000);
    }

    updateDisplay() {
        if (this.currentOperation.length > 15) {
            this.operationDisplay.textContent = this.currentOperation.slice(0, 12) + '...';
        } else {
            this.operationDisplay.textContent = this.currentOperation;
        }
        this.resultDisplay.textContent = this.result.slice(0, 15);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});