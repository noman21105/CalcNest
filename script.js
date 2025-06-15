// Calculator state management
let currentExpression = '';
let currentOperand = '';
let operator = '';
let previousOperand = '';
let shouldResetDisplay = false;

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('calcnest-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('calcnest-theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Calculator functions
function updateDisplay() {
    const expressionElement = document.getElementById('expression');
    const resultElement = document.getElementById('result');
    
    if (expressionElement) {
        expressionElement.textContent = currentExpression || '0';
    }
    
    if (resultElement) {
        resultElement.textContent = currentOperand || '';
    }
}

function inputNumber(num) {
    if (shouldResetDisplay) {
        currentOperand = '';
        shouldResetDisplay = false;
    }
    
    if (currentOperand === '0') {
        currentOperand = num;
    } else {
        currentOperand += num;
    }
    
    updateDisplay();
}

function inputDecimal() {
    if (shouldResetDisplay) {
        currentOperand = '0';
        shouldResetDisplay = false;
    }
    
    if (currentOperand === '') {
        currentOperand = '0';
    }
    
    if (!currentOperand.includes('.')) {
        currentOperand += '.';
    }
    
    updateDisplay();
}

function inputOperator(op) {
    if (currentOperand === '' && previousOperand === '') return;
    
    if (previousOperand !== '' && currentOperand !== '' && operator !== '') {
        calculate();
    }
    
    operator = op;
    previousOperand = currentOperand || previousOperand;
    currentExpression = `${previousOperand} ${operator}`;
    currentOperand = '';
    shouldResetDisplay = false;
    
    updateDisplay();
}

function calculate() {
    if (previousOperand === '' || currentOperand === '' || operator === '') {
        return;
    }
    
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    let result;
    
    try {
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    throw new Error('Cannot divide by zero');
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        // Format result to avoid floating point precision issues
        result = Math.round(result * 100000000000) / 100000000000;
        
        currentExpression = `${previousOperand} ${operator} ${currentOperand} =`;
        currentOperand = result.toString();
        operator = '';
        previousOperand = '';
        shouldResetDisplay = true;
        
    } catch (error) {
        currentExpression = 'Error';
        currentOperand = error.message;
        shouldResetDisplay = true;
    }
    
    updateDisplay();
}

function clearAll() {
    currentExpression = '';
    currentOperand = '';
    operator = '';
    previousOperand = '';
    shouldResetDisplay = false;
    updateDisplay();
}

function clearEntry() {
    currentOperand = '';
    updateDisplay();
}

function backspace() {
    if (currentOperand.length > 0) {
        currentOperand = currentOperand.slice(0, -1);
        if (currentOperand === '') {
            currentOperand = '0';
        }
        updateDisplay();
    }
}

// Category management
function toggleCategory(categoryId) {
    const content = document.getElementById(`${categoryId}-content`);
    const icon = document.getElementById(`${categoryId}-icon`);
    
    if (content && icon) {
        const isExpanded = content.classList.contains('expanded');
        
        if (isExpanded) {
            content.classList.remove('expanded');
            icon.classList.remove('rotated');
        } else {
            // Close other categories
            document.querySelectorAll('.category-content').forEach(element => {
                element.classList.remove('expanded');
            });
            document.querySelectorAll('.toggle-icon').forEach(element => {
                element.classList.remove('rotated');
            });
            
            // Open current category
            content.classList.add('expanded');
            icon.classList.add('rotated');
        }
    }
}

// Keyboard support
function handleKeyboard(event) {
    const key = event.key;
    
    // Numbers
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    }
    // Decimal point
    else if (key === '.' || key === ',') {
        inputDecimal();
    }
    // Operators
    else if (key === '+') {
        inputOperator('+');
    }
    else if (key === '-') {
        inputOperator('-');
    }
    else if (key === '*') {
        inputOperator('×');
    }
    else if (key === '/') {
        event.preventDefault();
        inputOperator('÷');
    }
    // Calculate
    else if (key === 'Enter' || key === '=') {
        calculate();
    }
    // Clear
    else if (key === 'Escape') {
        clearAll();
    }
    // Backspace
    else if (key === 'Backspace') {
        backspace();
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    updateDisplay();
    
    // Add event listeners
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Keyboard support
    document.addEventListener('keydown', handleKeyboard);
    
    // Initialize categories as collapsed
    document.querySelectorAll('.category-content').forEach(content => {
        content.classList.remove('expanded');
    });
    
    document.querySelectorAll('.toggle-icon').forEach(icon => {
        icon.classList.remove('rotated');
    });
});

// Utility functions for calculator pages
function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

function validateInput(value, min = null, max = null) {
    const num = parseFloat(value);
    if (isNaN(num)) {
        throw new Error('Please enter a valid number');
    }
    if (min !== null && num < min) {
        throw new Error(`Value must be at least ${min}`);
    }
    if (max !== null && num > max) {
        throw new Error(`Value must be at most ${max}`);
    }
    return num;
}

function showResult(elementId, value, details = '') {
    const resultElement = document.getElementById(elementId);
    if (resultElement) {
        resultElement.innerHTML = `
            <div class="result-value">${value}</div>
            ${details ? `<div class="result-details">${details}</div>` : ''}
        `;
        resultElement.classList.add('fade-in');
    }
}

function showError(elementId, message) {
    const resultElement = document.getElementById(elementId);
    if (resultElement) {
        resultElement.innerHTML = `
            <div class="result-value error">Error</div>
            <div class="result-details">${message}</div>
        `;
        resultElement.classList.add('fade-in');
    }
}
