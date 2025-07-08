import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing ChatGPT-Google Dashboard API\n');

  try {
    // Test health endpoint
    console.log('1️⃣ Testing health endpoint...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health:', health.data);
    console.log();

    // Test creating a task
    console.log('2️⃣ Creating a test task...');
    const newTask = await axios.post(`${API_BASE}/tasks`, {
      title: 'Test task from API'
    });
    console.log('✅ Created task:', newTask.data.data);
    console.log();

    // Test getting all tasks
    console.log('3️⃣ Getting all tasks...');
    const tasks = await axios.get(`${API_BASE}/tasks`);
    console.log(`✅ Found ${tasks.data.count} tasks`);
    console.log();

    // Test creating a list
    console.log('4️⃣ Creating a grocery list...');
    const newList = await axios.post(`${API_BASE}/lists`, {
      name: 'Grocery List',
      description: 'Weekly grocery shopping'
    });
    console.log('✅ Created list:', newList.data.data);
    console.log();

    // Test adding items to list
    console.log('5️⃣ Adding items to grocery list...');
    const listId = newList.data.data.id;
    const items = ['Milk', 'Eggs', 'Bread', 'Apples'];
    
    for (const item of items) {
      await axios.post(`${API_BASE}/lists/${listId}/items`, {
        content: item
      });
      console.log(`  ✅ Added: ${item}`);
    }
    console.log();

    // Test AI task generation (if API key is configured)
    if (process.env.OPENAI_API_KEY) {
      console.log('6️⃣ Testing AI task generation...');
      try {
        const aiTask = await axios.post(`${API_BASE}/ai/generate-task`, {
          prompt: 'Create a task for improving productivity',
          category: 'work'
        });
        console.log('✅ AI generated task:', aiTask.data.data);
      } catch (aiError) {
        console.log('⚠️  AI task generation failed (check API key)');
      }
    } else {
      console.log('⚠️  Skipping AI tests (no OpenAI API key)');
    }

    console.log('\n✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests
testAPI();