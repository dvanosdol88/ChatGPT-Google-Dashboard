import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #f5f7fa;
    color: #0A1828;
    line-height: 1.6;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Custom selection color */
  ::selection {
    background-color: rgba(0, 64, 128, 0.2);
    color: #0A1828;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(-10px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }

  /* Markdown styles */
  .markdown-content h1,
  .markdown-content h2,
  .markdown-content h3 {
    color: #004080;
    margin-bottom: 12px;
    margin-top: 16px;
  }

  .markdown-content h1 { font-size: 1.5em; }
  .markdown-content h2 { font-size: 1.3em; }
  .markdown-content h3 { font-size: 1.1em; }

  .markdown-content ul,
  .markdown-content ol {
    padding-left: 20px;
    margin-bottom: 12px;
  }

  .markdown-content li {
    margin-bottom: 6px;
    line-height: 1.6;
  }

  .markdown-content p {
    margin-bottom: 12px;
    line-height: 1.6;
  }

  .markdown-content a {
    color: #0066cc;
    text-decoration: none;
  }

  .markdown-content a:hover {
    text-decoration: underline;
  }

  .markdown-content code {
    background: #f8f9fa;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  .markdown-content pre {
    background: #f8f9fa;
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    margin-bottom: 12px;
  }

  .markdown-content blockquote {
    border-left: 3px solid #004080;
    padding-left: 12px;
    margin: 12px 0;
    color: #6c757d;
  }

  .markdown-content table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 12px;
  }

  .markdown-content th,
  .markdown-content td {
    border: 1px solid #e0e0e0;
    padding: 8px;
    text-align: left;
  }

  .markdown-content th {
    background: #f8f9fa;
    font-weight: 600;
  }

  /* Checkbox styling for task lists */
  .markdown-content input[type="checkbox"] {
    margin-right: 8px;
  }

  .markdown-content ul.contains-task-list {
    list-style: none;
    padding-left: 0;
  }

  .markdown-content li.task-list-item {
    padding-left: 24px;
    position: relative;
  }

  .markdown-content li.task-list-item input[type="checkbox"] {
    position: absolute;
    left: 0;
    top: 3px;
  }
`;