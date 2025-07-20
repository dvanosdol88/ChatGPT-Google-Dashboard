// Accessibility utility functions for dashboard components

export const ariaLabels = {
  // Widget containers
  tasksWidget: 'Tasks management widget',
  calendarWidget: 'Calendar and events widget',
  notesWidget: 'Notes and reminders widget',
  billsWidget: 'Bills tracking widget',
  listsWidget: 'Lists management widget',
  
  // Interactive elements
  addButton: 'Add new item',
  deleteButton: 'Delete item',
  editButton: 'Edit item',
  saveButton: 'Save changes',
  cancelButton: 'Cancel changes',
  closeButton: 'Close dialog',
  
  // Form elements
  searchInput: 'Search items',
  dateInput: 'Select date',
  textInput: 'Enter text',
  
  // Status indicators
  loadingSpinner: 'Loading content',
  errorMessage: 'Error message',
  successMessage: 'Success message'
};

export const announceToScreenReader = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};

export const trapFocus = (element) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  });
  
  firstFocusable.focus();
};

export const getContrastRatio = (color1, color2) => {
  // Simple contrast ratio calculator for WCAG compliance
  // Returns true if contrast ratio is >= 4.5:1 for normal text
  // This is a simplified version - use a library for production
  return true; // Placeholder
};

export default {
  ariaLabels,
  announceToScreenReader,
  trapFocus,
  getContrastRatio
};
