// Simple and efficient calculator logic
class Calculator {
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetDisplay = false;
    }

    // Update the display
    updateDisplay() {
        this.displayElement.textContent = this.currentInput;
    }

    // Handle number input
    inputNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentInput = '';
            this.shouldResetDisplay = false;
        }

        // Prevent multiple decimals
        if (number === '.' && this.currentInput.includes('.')) {
            return;
        }

        // Handle initial zero
        if (this.currentInput === '0' && number !== '.') {
            this.currentInput = number;
        } else {
            this.currentInput += number;
        }

        this.updateDisplay();
    }

    // Handle operator input
    inputOperator(operator) {
        if (this.operation !== null && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.previousInput = this.currentInput;
        this.operation = operator;
        this.shouldResetDisplay = true;
    }

    // Perform calculation
    calculate() {
        if (this.operation === null || this.shouldResetDisplay) {
            return;
        }

        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);

        if (isNaN(prev) || isNaN(current)) {
            return;
        }

        let result;
        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    result = 'Error';
                } else {
                    result = prev / current;
                }
                break;
            default:
                return;
        }

        // Format result to avoid floating point issues
        if (typeof result === 'number') {
            result = parseFloat(result.toFixed(10));
            // Remove trailing zeros
            result = result.toString();
            if (result.includes('.')) {
                result = result.replace(/\.?0+$/, '');
            }
        }

        this.currentInput = result.toString();
        this.operation = null;
        this.previousInput = '';
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    // Clear everything
    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    // Delete last character
    delete() {
        if (this.shouldResetDisplay) {
            return;
        }

        if (this.currentInput.length === 1) {
            this.currentInput = '0';
        } else {
            this.currentInput = this.currentInput.slice(0, -1);
        }

        this.updateDisplay();
    }

    // Handle equals
    equals() {
        this.calculate();
        this.operation = null;
        this.previousInput = '';
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const calculator = new Calculator(display);

    // Number buttons
    document.querySelectorAll('.btn-number').forEach(button => {
        button.addEventListener('click', () => {
            const num = button.getAttribute('data-num');
            calculator.inputNumber(num);
        });
    });

    // Operator buttons
    document.querySelectorAll('.btn-operator').forEach(button => {
        button.addEventListener('click', () => {
            const op = button.getAttribute('data-op');
            calculator.inputOperator(op);
        });
    });

    // Clear button (handles both C and AC)
    document.querySelectorAll('[data-action="clear"]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.clear();
        });
    });

    // Equals button
    const equalsBtn = document.querySelector('.btn-equals');
    if (equalsBtn) {
        equalsBtn.addEventListener('click', () => {
            calculator.equals();
        });
    }

    // Keyboard support
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        // Numbers 0-9
        if (/[0-9]/.test(key)) {
            event.preventDefault();
            calculator.inputNumber(key);
        }
        
        // Decimal point
        if (key === '.') {
            event.preventDefault();
            calculator.inputNumber('.');
        }
        
        // Operators
        if (key === '+') {
            event.preventDefault();
            calculator.inputOperator('+');
        }
        if (key === '-') {
            event.preventDefault();
            calculator.inputOperator('-');
        }
        if (key === '*') {
            event.preventDefault();
            calculator.inputOperator('*');
        }
        if (key === '/') {
            event.preventDefault();
            calculator.inputOperator('/');
        }
        
        // Equals (Enter or =)
        if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calculator.equals();
        }
        
        // Clear (Escape or c)
        if (key === 'Escape' || key === 'c' || key === 'C') {
            event.preventDefault();
            calculator.clear();
        }
        
        // Backspace (delete)
        if (key === 'Backspace') {
            event.preventDefault();
            calculator.delete();
        }
    });
});