/**
 * Converts a string to a URL-friendly slug
 * @param {string} text - The text to convert to slug
 * @param {Object} options - Optional configuration
 * @param {string} options.separator - Character to use as separator (default: '-')
 * @param {boolean} options.lowercase - Convert to lowercase (default: true)
 * @param {boolean} options.trim - Trim whitespace (default: true)
 * @returns {string} The slugified text
 */
export const slugify = (text, options = {}) => {
  const { separator = "-", lowercase = true, trim = true } = options;

  if (!text) return "";

  // Convert to string if not already
  let slug = String(text);

  // Trim whitespace
  if (trim) {
    slug = slug.trim();
  }

  // Convert to lowercase
  if (lowercase) {
    slug = slug.toLowerCase();
  }

  // Replace special characters with their ASCII equivalents
  slug = slug
    // Replace accented characters
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Replace special characters
    .replace(/[^a-z0-9\s-]/g, "")
    // Replace multiple spaces or separators with single separator
    .replace(/[\s-]+/g, separator)
    // Remove leading/trailing separators
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), "");

  // Handle edge cases
  if (!slug) {
    // If result is empty, use timestamp
    return `item-${Date.now()}`;
  }

  // Ensure slug is not too long (max 100 characters)
  if (slug.length > 100) {
    slug = slug.substring(0, 100);
    // Remove trailing separator if exists
    slug = slug.replace(new RegExp(`${separator}$`), "");
  }

  return slug;
};

/**
 * Converts a slug back to a readable text
 * @param {string} slug - The slug to convert
 * @param {Object} options - Optional configuration
 * @param {string} options.separator - Character used as separator (default: '-')
 * @param {boolean} options.capitalize - Capitalize first letter of each word (default: true)
 * @returns {string} The readable text
 */
export const deslugify = (slug, options = {}) => {
  const { separator = "-", capitalize = true } = options;

  if (!slug) return "";

  // Convert to string if not already
  let text = String(slug);

  // Replace separators with spaces
  text = text.replace(new RegExp(separator, "g"), " ");

  // Capitalize first letter of each word
  if (capitalize) {
    text = text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return text;
};

/**
 * Validates if a string is a valid slug
 * @param {string} slug - The slug to validate
 * @param {Object} options - Optional configuration
 * @param {string} options.separator - Character used as separator (default: '-')
 * @returns {boolean} Whether the slug is valid
 */
export const isValidSlug = (slug, options = {}) => {
  const { separator = "-" } = options;

  if (!slug) return false;

  // Convert to string if not already
  const text = String(slug);

  // Check if slug matches the pattern
  const pattern = new RegExp(`^[a-z0-9${separator}]+$`);
  return pattern.test(text);
};

// Example usage:
/*
const text = "Hello World! 123";
const slug = slugify(text); // "hello-world-123"

const slug2 = "hello-world-123";
const text2 = deslugify(slug2); // "Hello World 123"

const isValid = isValidSlug("hello-world-123"); // true
*/
