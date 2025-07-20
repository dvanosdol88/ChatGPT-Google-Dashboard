// Seed test data for dashboard
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

// Sample data - you can replace with your provided data
const sampleTasks = {
  work: [
    { title: "Review Q4 budget proposal", priority: "high" },
    { title: "Prepare presentation for client meeting", priority: "high" },
    { title: "Update project timeline", priority: "medium" },
    { title: "Schedule team retrospective", priority: "medium" },
    { title: "Review code PRs", priority: "low", completed: true }
  ],
  personal: [
    { title: "Book dentist appointment", priority: "high" },
    { title: "Plan weekend trip", priority: "medium" },
    { title: "Buy groceries", priority: "high" },
    { title: "Call mom", priority: "medium", completed: true },
    { title: "Gym workout", priority: "low" }
  ]
};

const sampleLists = [
  {
    name: "Project Milestones",
    description: "Key deliverables for Q1 2024",
    items: [
      { content: "Complete user authentication module", checked: true },
      { content: "Implement payment gateway", checked: true },
      { content: "Design dashboard UI", checked: false },
      { content: "Set up CI/CD pipeline", checked: false },
      { content: "Write API documentation", checked: false }
    ]
  },
  {
    name: "Shopping List",
    description: "Weekly groceries",
    items: [
      { content: "Milk", checked: false },
      { content: "Bread", checked: false },
      { content: "Eggs", checked: true },
      { content: "Vegetables", checked: false },
      { content: "Coffee", checked: false }
    ]
  },
  {
    name: "Learning Goals",
    description: "Skills to develop in 2024",
    items: [
      { content: "Complete React Advanced course", checked: false },
      { content: "Learn TypeScript", checked: true },
      { content: "Study system design", checked: false },
      { content: "Practice LeetCode problems", checked: false }
    ]
  }
];

async function seedData() {
  try {
    console.log('🌱 Starting to seed test data...\n');

    // Create tasks
    console.log('Creating tasks...');
    for (const [type, tasks] of Object.entries(sampleTasks)) {
      for (const task of tasks) {
        try {
          const response = await axios.post(`${API_BASE}/tasks`, {
            ...task,
            type
          });
          console.log(`✅ Created ${type} task: ${task.title}`);
        } catch (error) {
          console.log(`❌ Failed to create task: ${task.title}`);
        }
      }
    }

    // Create lists with items
    console.log('\nCreating lists...');
    for (const list of sampleLists) {
      try {
        // Create the list
        const listResponse = await axios.post(`${API_BASE}/lists`, {
          name: list.name,
          description: list.description
        });
        
        const listId = listResponse.data.data.id;
        console.log(`✅ Created list: ${list.name}`);

        // Add items to the list
        for (const item of list.items) {
          try {
            await axios.post(`${API_BASE}/lists/${listId}/items`, {
              content: item.content,
              checked: item.checked
            });
            console.log(`  ✅ Added item: ${item.content}`);
          } catch (error) {
            console.log(`  ❌ Failed to add item: ${item.content}`);
          }
        }
      } catch (error) {
        console.log(`❌ Failed to create list: ${list.name}`);
      }
    }

    console.log('\n🎉 Seed data created successfully!');
    console.log('Refresh your dashboard to see the test data.');

  } catch (error) {
    console.error('Error seeding data:', error.message);
    console.log('\nMake sure the backend server is running on port 8000');
  }
}

// Run the seed function
seedData();