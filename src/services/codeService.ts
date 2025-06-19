/**
 * Code formatting service
 */

/**
 * Format PHP code with proper indentation and spacing
 * 
 * @param code The PHP code to format
 * @returns Formatted PHP code
 */
export const formatCode = (code: string): string => {
  try {
    // Simple PHP code formatter
    // This is a basic implementation and doesn't handle all PHP syntax cases
    
    // Normalize line endings
    let formattedCode = code.replace(/\r\n/g, '\n');
    
    // Ensure consistent spacing around operators
    formattedCode = formattedCode
      .replace(/\s*([=+\-*/%&|<>!?:]+)\s*/g, ' $1 ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*;\s*/g, '; ')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .replace(/\{\s+/g, '{ ')
      .replace(/\s+\}/g, ' }');
    
    // Split into lines for indentation processing
    const lines = formattedCode.split('\n');
    let indentLevel = 0;
    const indentSize = 4; // 4 spaces per indent level
    
    // Process each line for proper indentation
    const processedLines = lines.map(line => {
      // Trim whitespace
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) {
        return '';
      }
      
      // Decrease indent for closing braces/tags
      if (trimmedLine.startsWith('}') || trimmedLine.startsWith(')') || trimmedLine === '?>') {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Calculate current line indent
      const indent = ' '.repeat(indentLevel * indentSize);
      
      // Add indent to the line
      const indentedLine = indent + trimmedLine;
      
      // Increase indent for opening braces/tags
      if (
        trimmedLine.endsWith('{') || 
        trimmedLine.endsWith('(') || 
        trimmedLine === '<?php' ||
        trimmedLine.includes('{') && !trimmedLine.includes('}') ||
        trimmedLine.endsWith(':') // For alternative syntax like if (...):
      ) {
        indentLevel++;
      }
      
      return indentedLine;
    });
    
    // Join lines back together
    return processedLines.join('\n');
  } catch (error) {
    console.error('Error formatting code:', error);
    // Return original code if formatting fails
    return code;
  }
}

/**
 * Format JavaScript/TypeScript code
 * 
 * @param code The JS/TS code to format
 * @returns Formatted JS/TS code
 */
export const formatJsCode = (code: string): string => {
  try {
    // Simple JS code formatter (similar approach to PHP formatter)
    
    // Normalize line endings
    let formattedCode = code.replace(/\r\n/g, '\n');
    
    // Ensure consistent spacing around operators
    formattedCode = formattedCode
      .replace(/\s*([=+\-*/%&|<>!?:]+)\s*/g, ' $1 ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*;\s*/g, '; ')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .replace(/\{\s+/g, '{ ')
      .replace(/\s+\}/g, ' }');
    
    // Split into lines for indentation processing
    const lines = formattedCode.split('\n');
    let indentLevel = 0;
    const indentSize = 2; // 2 spaces per indent level for JS
    
    // Process each line for proper indentation
    const processedLines = lines.map(line => {
      // Trim whitespace
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) {
        return '';
      }
      
      // Decrease indent for closing braces
      if (trimmedLine.startsWith('}') || trimmedLine.startsWith(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Calculate current line indent
      const indent = ' '.repeat(indentLevel * indentSize);
      
      // Add indent to the line
      const indentedLine = indent + trimmedLine;
      
      // Increase indent for opening braces
      if (
        trimmedLine.endsWith('{') || 
        trimmedLine.endsWith('(') ||
        trimmedLine.includes('{') && !trimmedLine.includes('}')
      ) {
        indentLevel++;
      }
      
      return indentedLine;
    });
    
    // Join lines back together
    return processedLines.join('\n');
  } catch (error) {
    console.error('Error formatting JS code:', error);
    // Return original code if formatting fails
    return code;
  }
}

/**
 * Format CSS code
 * 
 * @param code The CSS code to format
 * @returns Formatted CSS code
 */
export const formatCssCode = (code: string): string => {
  try {
    // Simple CSS code formatter
    
    // Normalize line endings
    let formattedCode = code.replace(/\r\n/g, '\n');
    
    // Format CSS rules
    formattedCode = formattedCode
      .replace(/\s*{\s*/g, ' {\n    ')
      .replace(/;\s*/g, ';\n    ')
      .replace(/\s*}\s*/g, '\n}\n\n')
      .replace(/\n    \n/g, '\n');
    
    // Clean up extra newlines
    formattedCode = formattedCode
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    return formattedCode;
  } catch (error) {
    console.error('Error formatting CSS code:', error);
    // Return original code if formatting fails
    return code;
  }
}

/**
 * Detect code language and format accordingly
 * 
 * @param code The code to format
 * @returns Formatted code
 */
export const detectAndFormatCode = (code: string): string => {
  // Check for PHP
  if (code.includes('<?php') || code.includes('?>')) {
    return formatCode(code);
  }
  
  // Check for CSS
  if (code.includes('{') && code.includes('}') && 
      (code.includes('margin:') || code.includes('padding:') || 
       code.includes('color:') || code.includes('background:'))) {
    return formatCssCode(code);
  }
  
  // Default to JS/TS
  return formatJsCode(code);
}
