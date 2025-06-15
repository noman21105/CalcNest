// Shared utility functions for calculator pages
// This file provides common functionality across all calculator pages

// Number formatting and validation utilities
function formatLargeNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2) + 'B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    return formatNumber(num);
}

function roundToPrecision(num, precision = 6) {
    return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
}

function isValidNumber(value) {
    return !isNaN(value) && isFinite(value);
}

// Enhanced validation with more specific error messages
function validatePositiveNumber(value, fieldName = 'Value') {
    const num = parseFloat(value);
    if (isNaN(num)) {
        throw new Error(`${fieldName} must be a valid number`);
    }
    if (num <= 0) {
        throw new Error(`${fieldName} must be greater than zero`);
    }
    if (!isFinite(num)) {
        throw new Error(`${fieldName} must be a finite number`);
    }
    return num;
}

function validateRange(value, min, max, fieldName = 'Value') {
    const num = validateInput(value, min);
    if (num > max) {
        throw new Error(`${fieldName} must be between ${min} and ${max}`);
    }
    return num;
}

// Statistical functions
function calculateStatistics(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0) {
        throw new Error('No valid numbers provided');
    }
    
    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const mean = sum / numbers.length;
    
    // Median
    const median = numbers.length % 2 === 0
        ? (sorted[numbers.length / 2 - 1] + sorted[numbers.length / 2]) / 2
        : sorted[Math.floor(numbers.length / 2)];
    
    // Mode
    const frequency = {};
    numbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
    });
    
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency)
        .filter(key => frequency[key] === maxFreq)
        .map(key => parseFloat(key));
    
    // Standard deviation
    const variance = numbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / numbers.length;
    const standardDeviation = Math.sqrt(variance);
    
    return {
        count: numbers.length,
        sum: sum,
        mean: mean,
        median: median,
        modes: modes,
        modeFrequency: maxFreq,
        min: Math.min(...numbers),
        max: Math.max(...numbers),
        range: Math.max(...numbers) - Math.min(...numbers),
        variance: variance,
        standardDeviation: standardDeviation
    };
}

// Financial calculation utilities
function calculateCompoundInterest(principal, rate, time, compoundFrequency = 1) {
    const rateDecimal = rate / 100;
    const amount = principal * Math.pow(1 + rateDecimal / compoundFrequency, compoundFrequency * time);
    return {
        amount: amount,
        interest: amount - principal,
        effectiveRate: Math.pow(1 + rateDecimal / compoundFrequency, compoundFrequency) - 1
    };
}

function calculateSimpleInterest(principal, rate, time) {
    const interest = principal * (rate / 100) * time;
    return {
        amount: principal + interest,
        interest: interest
    };
}

function calculateLoanPayment(principal, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;
    
    if (monthlyRate === 0) {
        return principal / numberOfPayments;
    }
    
    const monthlyPayment = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return monthlyPayment;
}

// Engineering calculation utilities
function calculateElectricalPower(voltage, current, resistance) {
    const results = {};
    
    if (voltage !== null && current !== null) {
        results.power = voltage * current;
        results.resistance = voltage / current;
    } else if (voltage !== null && resistance !== null) {
        results.current = voltage / resistance;
        results.power = (voltage * voltage) / resistance;
    } else if (current !== null && resistance !== null) {
        results.voltage = current * resistance;
        results.power = current * current * resistance;
    }
    
    return results;
}

function convertUnits(value, fromUnit, toUnit, unitCategory) {
    // This would contain unit conversion logic
    // Implementation depends on the specific unit categories
    const conversions = {
        length: {
            m: 1,
            km: 1000,
            cm: 0.01,
            mm: 0.001,
            in: 0.0254,
            ft: 0.3048,
            yd: 0.9144,
            mi: 1609.344
        },
        mass: {
            kg: 1,
            g: 0.001,
            lb: 0.453592,
            oz: 0.0283495
        },
        temperature: {
            // Special handling needed for temperature
        }
    };
    
    if (unitCategory === 'temperature') {
        return convertTemperature(value, fromUnit, toUnit);
    }
    
    if (!conversions[unitCategory]) {
        throw new Error(`Unsupported unit category: ${unitCategory}`);
    }
    
    const fromFactor = conversions[unitCategory][fromUnit];
    const toFactor = conversions[unitCategory][toUnit];
    
    if (!fromFactor || !toFactor) {
        throw new Error(`Unsupported unit conversion: ${fromUnit} to ${toUnit}`);
    }
    
    return value * fromFactor / toFactor;
}

function convertTemperature(value, fromUnit, toUnit) {
    // Convert to Celsius first
    let celsius;
    switch (fromUnit.toLowerCase()) {
        case 'c':
        case 'celsius':
            celsius = value;
            break;
        case 'f':
        case 'fahrenheit':
            celsius = (value - 32) * 5/9;
            break;
        case 'k':
        case 'kelvin':
            celsius = value - 273.15;
            break;
        default:
            throw new Error(`Unsupported temperature unit: ${fromUnit}`);
    }
    
    // Convert from Celsius to target
    switch (toUnit.toLowerCase()) {
        case 'c':
        case 'celsius':
            return celsius;
        case 'f':
        case 'fahrenheit':
            return celsius * 9/5 + 32;
        case 'k':
        case 'kelvin':
            return celsius + 273.15;
        default:
            throw new Error(`Unsupported temperature unit: ${toUnit}`);
    }
}

// Mathematical utilities
function isPrimeNumber(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

function getFactors(n) {
    const factors = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            factors.push(i);
            if (i !== n / i) {
                factors.push(n / i);
            }
        }
    }
    return factors.sort((a, b) => a - b);
}

function calculateGCD(a, b) {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return Math.abs(a);
}

function calculateLCM(a, b) {
    return Math.abs(a * b) / calculateGCD(a, b);
}

// Array processing utilities
function parseNumberArray(input, delimiter = ',') {
    if (typeof input !== 'string') {
        throw new Error('Input must be a string');
    }
    
    return input.split(delimiter)
        .map(item => item.trim())
        .filter(item => item !== '')
        .map(item => {
            const num = parseFloat(item);
            if (isNaN(num)) {
                throw new Error(`"${item}" is not a valid number`);
            }
            return num;
        });
}

// Display utilities
function createResultTable(data, headers) {
    let html = '<table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">';
    
    // Headers
    if (headers && headers.length > 0) {
        html += '<thead><tr>';
        headers.forEach(header => {
            html += `<th style="border: 1px solid var(--border-color); padding: 0.5rem; background: var(--bg-secondary);">${header}</th>`;
        });
        html += '</tr></thead>';
    }
    
    // Data rows
    html += '<tbody>';
    data.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
            html += `<td style="border: 1px solid var(--border-color); padding: 0.5rem;">${cell}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    
    return html;
}

function createProgressBar(value, max, label = '') {
    const percentage = (value / max) * 100;
    return `
        <div style="margin: 0.5rem 0;">
            ${label && `<div style="font-size: 0.875rem; margin-bottom: 0.25rem;">${label}</div>`}
            <div style="background: var(--bg-secondary); border-radius: 0.25rem; overflow: hidden; height: 1.5rem;">
                <div style="background: var(--accent-primary); height: 100%; width: ${percentage}%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.75rem; font-weight: 600;">
                    ${percentage.toFixed(1)}%
                </div>
            </div>
        </div>
    `;
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatLargeNumber,
        roundToPrecision,
        isValidNumber,
        validatePositiveNumber,
        validateRange,
        calculateStatistics,
        calculateCompoundInterest,
        calculateSimpleInterest,
        calculateLoanPayment,
        calculateElectricalPower,
        convertUnits,
        convertTemperature,
        isPrimeNumber,
        getFactors,
        calculateGCD,
        calculateLCM,
        parseNumberArray,
        createResultTable,
        createProgressBar
    };
}
