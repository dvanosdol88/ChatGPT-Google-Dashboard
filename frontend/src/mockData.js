// Mock data for testing when backend is unavailable
export const mockTasks = {
  work: [
    { id: 1, title: "Insurance CE Credit", priority: "high", completed: false, type: "work" },
    { id: 2, title: "M.B. compliance email", priority: "high", completed: false, type: "work" }
  ],
  personal: [
    { id: 3, title: "Leo Tuition", priority: "high", completed: false, type: "personal" },
    { id: 4, title: "Pick up eyeglasses from New Haven", priority: "medium", completed: false, type: "personal" }
  ]
};

export const mockLists = [
  {
    id: 1,
    name: "Work Priorities",
    description: "Important work tasks",
    items: [
      { id: 101, content: "Insurance CE Credit", checked: false },
      { id: 102, content: "M.B. compliance email", checked: false }
    ]
  },
  {
    id: 2,
    name: "Personal To Do",
    description: "Personal tasks to complete",
    items: [
      { id: 201, content: "Leo Tuition", checked: false },
      { id: 202, content: "Pick up eyeglasses from New Haven", checked: false }
    ]
  },
  {
    id: 3,
    name: "Grocery",
    description: "Shopping list",
    items: [
      { id: 301, content: "Ginger Beer", checked: false },
      { id: 302, content: "Limes", checked: false },
      { id: 303, content: "Bread", checked: false }
    ]
  }
];