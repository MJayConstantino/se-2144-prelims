/**
 * Utility functions for calculator operations
 */

/**
 * Extracts the current number being entered in the calculator operation
 * @param currentOperation - The complete operation string
 * @returns The most recent number in the operation
 */
export function getCurrentNumber(currentOperation: string): string {
    // Define valid mathematical operators
    const operators = ['+', '−', '×', '÷'];
    let lastIndex = -1;
    
    // Find the last operator in the operation string
    for (let i = currentOperation.length - 1; i >= 0; i--) {
        if (operators.includes(currentOperation[i])) {
            lastIndex = i;
            break;
        }
    }

    // Return everything after the last operator, or the entire string if no operator found
    return currentOperation.slice(lastIndex + 1);
}

/**
 * Retrieves the last operand from the current operation
 * Similar to getCurrentNumber but uses a different approach
 * @param currentOperation - The complete operation string
 * @returns The last operand in the operation
 */
export function getLastOperand(currentOperation: string): string {
    const operators = ['+', '−', '×', '÷'];
    let lastOperatorIndex = -1;

    // Find the rightmost operator in the operation string
    operators.forEach((operator) => {
        const index = currentOperation.lastIndexOf(operator);
        if (index > lastOperatorIndex) {
            lastOperatorIndex = index;
        }
    });

    // Return the portion after the last operator, or the entire string if no operator found
    return lastOperatorIndex === -1
        ? currentOperation
        : currentOperation.slice(lastOperatorIndex + 1);
}