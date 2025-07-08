import express from 'express';
import OpenAI from 'openai';
import { Task } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST /api/generate-task - Generate task using OpenAI
router.post('/generate-task', async (req, res) => {
  try {
    const { prompt = "Generate a productive task for today", category } = req.body;
    
    const systemPrompt = `You are a helpful task generation assistant. Generate a single, actionable task based on the user's request. 
    Return ONLY the task title, nothing else. Make it specific and achievable.
    ${category ? `The task should be related to: ${category}` : ''}`;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 100
    });
    
    const taskTitle = completion.choices[0].message.content.trim();
    
    // Create the task in database
    const task = await Task.create({
      title: taskTitle,
      status: 'pending'
    });
    
    res.json({
      success: true,
      data: task,
      generated: true
    });
  } catch (error) {
    console.error('Error generating task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate task',
      details: error.message
    });
  }
});

// POST /api/generate-tasks - Generate multiple tasks
router.post('/generate-tasks', async (req, res) => {
  try {
    const { 
      count = 3, 
      category = "daily productivity",
      timeframe = "today"
    } = req.body;
    
    const systemPrompt = `You are a helpful task generation assistant. Generate ${count} different actionable tasks.
    Each task should be:
    - Specific and achievable
    - Related to ${category}
    - Suitable for ${timeframe}
    
    Return the tasks as a JSON array of strings, like: ["Task 1", "Task 2", "Task 3"]`;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate ${count} tasks for ${category}` }
      ],
      temperature: 0.8,
      max_tokens: 200
    });
    
    let taskTitles;
    try {
      taskTitles = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      // Fallback: split by newlines if not valid JSON
      taskTitles = completion.choices[0].message.content
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^[-*\d.)\s]+/, '').trim());
    }
    
    // Create tasks in database
    const tasks = await Task.bulkCreate(
      taskTitles.map(title => ({
        title,
        status: 'pending'
      }))
    );
    
    res.json({
      success: true,
      data: tasks,
      count: tasks.length,
      generated: true
    });
  } catch (error) {
    console.error('Error generating tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate tasks',
      details: error.message
    });
  }
});

// POST /api/analyze-image - Analyze image and generate tasks
router.post('/analyze-image', async (req, res) => {
  try {
    const { imageUrl, prompt = "What tasks can be derived from this image?" } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Image URL is required'
      });
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 300
    });
    
    const analysis = response.choices[0].message.content;
    
    res.json({
      success: true,
      analysis,
      prompt,
      imageUrl
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze image',
      details: error.message
    });
  }
});

export default router;