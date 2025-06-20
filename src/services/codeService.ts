import { js_beautify, html_beautify } from 'js-beautify';

/**
 * Format PHP code using js-beautify
 * 
 * @param code The PHP code to format
 * @returns Formatted PHP code
 */
export const formatPhpCode = (code: string): string => {
  // Check if code is empty
  if (!code.trim()) {
    return code;
  }

  try {
    // PHP-specific formatting options
    const options = {
      indent_size: 4,
      indent_with_tabs: false,
      max_preserve_newlines: 2,
      preserve_newlines: true,
      keep_array_indentation: false,
      break_chained_methods: false,
      indent_scripts: "normal",
      brace_style: "collapse",
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: false,
      end_with_newline: true,
      wrap_line_length: 0,
      indent_inner_html: false,
      comma_first: false,
      e4x: false,
      indent_empty_lines: false
    };

    // For PHP, we use html_beautify since it handles PHP tags better
    // But we need to handle PHP-specific formatting
    let formattedCode = html_beautify(code, options);

    // Additional PHP-specific formatting
    // Fix spacing around PHP operators
    formattedCode = formattedCode
      // Fix spacing around operators
      .replace(/\s*\+=\s*/g, ' += ')
      .replace(/\s*-=\s*/g, ' -= ')
      .replace(/\s*\*=\s*/g, ' *= ')
      .replace(/\s*\/=\s*/g, ' /= ')
      .replace(/\s*%=\s*/g, ' %= ')
      .replace(/\s*=\s*/g, ' = ')
      .replace(/\s*==\s*/g, ' == ')
      .replace(/\s*!=\s*/g, ' != ')
      .replace(/\s*===\s*/g, ' === ')
      .replace(/\s*!==\s*/g, ' !== ')
      .replace(/\s*<\s*/g, ' < ')
      .replace(/\s*>\s*/g, ' > ')
      .replace(/\s*<=\s*/g, ' <= ')
      .replace(/\s*>=\s*/g, ' >= ')
      .replace(/\s*\+\s*/g, ' + ')
      .replace(/\s*-\s*/g, ' - ')
      .replace(/\s*\*\s*/g, ' * ')
      .replace(/\s*\/\s*/g, ' / ')
      .replace(/\s*%\s*/g, ' % ')
      // Fix spacing around PHP arrows
      .replace(/\s*->\s*/g, '->');

    return formattedCode;
  } catch (error) {
    console.error('Error formatting PHP code:', error);
    return code; // Return original code if formatting fails
  }
};

/**
 * Format JavaScript code using js-beautify
 * 
 * @param code The JavaScript code to format
 * @returns Formatted JavaScript code
 */
export const formatJsCode = (code: string): string => {
  if (!code.trim()) {
    return code;
  }

  try {
    return js_beautify(code, {
      indent_size: 2,
      indent_with_tabs: false,
      max_preserve_newlines: 2,
      preserve_newlines: true,
      keep_array_indentation: false,
      break_chained_methods: false,
      indent_scripts: "normal",
      brace_style: "collapse",
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: false,
      end_with_newline: true,
      wrap_line_length: 0,
      indent_inner_html: false,
      comma_first: false,
      e4x: false,
      indent_empty_lines: false
    });
  } catch (error) {
    console.error('Error formatting JavaScript code:', error);
    return code;
  }
};

/**
 * Format code based on detected language
 * 
 * @param code The code to format
 * @returns Formatted code
 */
export const formatCode = (code: string): string => {
  if (!code.trim()) {
    return code;
  }

  // Detect if code is PHP
  if (code.includes('<?php') || code.includes('?>')) {
    return formatPhpCode(code);
  }
  
  // Default to JavaScript formatting
  return formatJsCode(code);
};
