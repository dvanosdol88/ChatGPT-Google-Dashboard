// Seed data script for testing the dashboard
// Run with: node seed-data.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatgpt-dashboard';

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  type: { type: String, enum: ['work', 'personal'], default: 'personal' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// List Schema
const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  items: [{
    content: String,
    checked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);
const List = mongoose.model('List', listSchema);

// Sample data - Replace with your provided data
const sampleTasks = {
  work: [
    { title: "Review Q4 budget proposal", priority: "high", dueDate: new Date('2024-01-25') },
    { title: "Prepare presentation for client meeting", priority: "high", dueDate: new Date('2024-01-23') },
    { title: "Update project timeline", priority: "medium" },
    { title: "Schedule team retrospective", priority: "medium" },
    { title: "Review code PRs", priority: "low", completed: true }
  ],
  personal: [
    { title: "Book dentist appointment", priority: "high" },
    { title: "Plan weekend trip", priority: "medium" },
    { title: "Buy groceries", priority: "high", dueDate: new Date('2024-01-21') },
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
  },
  {
    name: "Home Improvements",
    description: "Things to fix around the house",
    items: [
      { content: "Fix leaky faucet", checked: false },
      { content: "Paint bedroom walls", checked: false },
      { content: "Organize garage", checked: true },
      { content: "Replace light bulbs", checked: true }
    ]
  }
];

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Task.deleteMany({});
    await List.deleteMany({});
    console.log('Cleared existing data');

    // Insert tasks
    for (const [type, tasks] of Object.entries(sampleTasks)) {
      for (const task of tasks) {
        await Task.create({ ...task, type });
      }
    }
    console.log(`Created ${Object.values(sampleTasks).flat().length} tasks`);

    // Insert lists
    for (const list of sampleLists) {
      await List.create(list);
    }
    console.log(`Created ${sampleLists.length} lists`);

    console.log('✅ Seed data inserted successfully!');
    
    // Display summary
    const taskCount = await Task.countDocuments();
    const listCount = await List.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    
    console.log('\nDatabase Summary:');
    console.log(`- Total Tasks: ${taskCount} (${completedTasks} completed)`);
    console.log(`- Total Lists: ${listCount}`);
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedData();