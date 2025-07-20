#!/bin/bash

OUTPUT_FILE="/mnt/c/Users/david/projects-master/files-from-ai-agents/COMPLETE_UI_CODE_REVIEW.md"

# Add Tailwind config
echo -e "\n### tailwind.config.js" >> "$OUTPUT_FILE"
echo '```javascript' >> "$OUTPUT_FILE"
cat tailwind.config.js >> "$OUTPUT_FILE" 2>/dev/null || echo "// File not found" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"

# Add PostCSS config
echo -e "\n### postcss.config.js" >> "$OUTPUT_FILE"
echo '```javascript' >> "$OUTPUT_FILE"
cat postcss.config.js >> "$OUTPUT_FILE" 2>/dev/null || echo "// File not found" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"

# Add main App files
echo -e "\n## Main Application Files\n" >> "$OUTPUT_FILE"

echo "### src/App.js" >> "$OUTPUT_FILE"
echo '```javascript' >> "$OUTPUT_FILE"
cat src/App.js >> "$OUTPUT_FILE" 2>/dev/null || echo "// File not found" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"

echo -e "\n### src/index.js" >> "$OUTPUT_FILE"
echo '```javascript' >> "$OUTPUT_FILE"
cat src/index.js >> "$OUTPUT_FILE" 2>/dev/null || echo "// File not found" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"

echo -e "\n### src/index.css" >> "$OUTPUT_FILE"
echo '```css' >> "$OUTPUT_FILE"
cat src/index.css >> "$OUTPUT_FILE" 2>/dev/null || echo "// File not found" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"

# Add all components
echo -e "\n## React Components (11 Converted + Supporting)\n" >> "$OUTPUT_FILE"

# List of all components in order
COMPONENTS=(
    "Dashboard.js"
    "TasksWidget.js"
    "CalendarWidget.js"
    "GmailWidget.js"
    "MyListsWidget.js"
    "AIAssistantWidget.js"
    "DocumentsWidget.js"
    "GoogleDriveWidget.js"
    "CameraWidget.js"
    "Lists.js"
    "AddTaskForm.js"
)

# Add each component
for component in "${COMPONENTS[@]}"; do
    echo -e "\n### src/components/$component" >> "$OUTPUT_FILE"
    echo '```javascript' >> "$OUTPUT_FILE"
    cat "src/components/$component" >> "$OUTPUT_FILE" 2>/dev/null || echo "// File not found" >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
done

# Add API integration
echo -e "\n## API Integration\n" >> "$OUTPUT_FILE"
echo "### src/api/api.js" >> "$OUTPUT_FILE"
echo '```javascript' >> "$OUTPUT_FILE"
cat src/api/api.js >> "$OUTPUT_FILE" 2>/dev/null || echo "// File not found" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"

# Add utilities
echo -e "\n## Utilities\n" >> "$OUTPUT_FILE"
echo "### src/utils/accessibility.js" >> "$OUTPUT_FILE"
echo '```javascript' >> "$OUTPUT_FILE"
cat src/utils/accessibility.js >> "$OUTPUT_FILE" 2>/dev/null || echo "// File not found" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"

# Add file size summary
echo -e "\n## File Statistics\n" >> "$OUTPUT_FILE"
echo "Total size of src directory: $(du -sh src/ | cut -f1)" >> "$OUTPUT_FILE"
echo "Number of components: ${#COMPONENTS[@]}" >> "$OUTPUT_FILE"
echo "Generated on: $(date)" >> "$OUTPUT_FILE"

echo "Consolidation complete! File created at: $OUTPUT_FILE"