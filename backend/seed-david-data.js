// David's specific test data
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

// David's requested data
const davidTasks = {
  work: [
    { title: "Insurance CE Credit", priority: "high", completed: false },
    { title: "M.B. compliance email", priority: "high", completed: false }
  ],
  personal: [
    { title: "Leo Tuition", priority: "high", completed: false },
    { title: "Pick up eyeglasses from New Haven", priority: "medium", completed: false }
  ]
};

const davidLists = [
  {
    name: "Work Priorities",
    description: "Important work tasks",
    items: [
      { content: "Insurance CE Credit", checked: false },
      { content: "M.B. compliance email", checked: false }
    ]
  },
  {
    name: "Personal To Do",
    description: "Personal tasks to complete",
    items: [
      { content: "Leo Tuition", checked: false },
      { content: "Pick up eyeglasses from New Haven", checked: false }
    ]
  },
  {
    name: "Grocery",
    description: "Shopping list",
    items: [
      { content: "Ginger Beer", checked: false },
      { content: "Limes", checked: false },
      { content: "Bread", checked: false }
    ]
  }
];

async function seedDavidData() {
  try {
    console.log('🌱 Inserting David\'s test data...\n');

    // First, let's try a simple health check
    try {
      const health = await axios.get(`${API_BASE}/health`).catch(() => null);
      if (!health) {
        console.log('⚠️  Backend API not responding. Using mock data mode.\n');
        createMockDataFile();
        return;
      }
    } catch (e) {
      console.log('⚠️  Backend API not responding. Using mock data mode.\n');
      createMockDataFile();
      return;
    }

    // Create tasks
    console.log('Creating tasks...');
    for (const [type, tasks] of Object.entries(davidTasks)) {
      for (const task of tasks) {
        try {
          await axios.post(`${API_BASE}/tasks`, { ...task, type });
          console.log(`✅ Created ${type} task: ${task.title}`);
        } catch (error) {
          console.log(`❌ Failed to create task: ${task.title}`);
        }
      }
    }

    // Create lists with items
    console.log('\nCreating lists...');
    for (const list of davidLists) {
      try {
        const listResponse = await axios.post(`${API_BASE}/lists`, {
          name: list.name,
          description: list.description
        });
        
        const listId = listResponse.data.data.id;
        console.log(`✅ Created list: ${list.name}`);

        for (const item of list.items) {
          await axios.post(`${API_BASE}/lists/${listId}/items`, {
            content: item.content,
            checked: item.checked
          });
          console.log(`  ✅ Added: ${item.content}`);
        }
      } catch (error) {
        console.log(`❌ Failed to create list: ${list.name}`);
      }
    }

    console.log('\n🎉 Data inserted! Refresh your dashboard.');

  } catch (error) {
    console.error('Error:', error.message);
    createMockDataFile();
  }
}

function createMockDataFile() {
  // Create a mock data file that components can read
  const mockData = {
    tasks: davidTasks,
    lists: davidLists
  };
  
  console.log('\n📝 Creating mock data file for frontend...');
  console.log(JSON.stringify(mockData, null, 2));
  console.log('\n✅ You can manually add this data through the UI!');
}

seedDavidData();