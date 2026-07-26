/**
 * Mock Database Seed Data
 * Populates the in-memory mock database with sample sandbox projects
 */

const mockDB = {
  sandboxProjects: [],
  users: [],
};

let projectIdCounter = 1;

/**
 * Add sample sandbox projects to mock database
 */
const seedMockData = () => {
  // Sample sandbox projects
  const projects = [
    {
      _id: String(projectIdCounter++),
      title: 'Build a Todo App with React',
      description: 'Learn React fundamentals by building a fully functional todo application with add, delete, and filter features.',
      category: 'Frontend',
      difficulty: 'Beginner',
      technologyStack: ['React', 'JavaScript', 'CSS'],
      instructor: 'admin',
      isPublished: true,
      enrolledCount: 1250,
      tags: ['react', 'frontend', 'beginner'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: String(projectIdCounter++),
      title: 'Node.js RESTful API',
      description: 'Create a complete RESTful API with Express.js, including authentication, error handling, and database integration.',
      category: 'Backend',
      difficulty: 'Intermediate',
      technologyStack: ['Node.js', 'Express', 'MongoDB'],
      instructor: 'admin',
      isPublished: true,
      enrolledCount: 890,
      tags: ['nodejs', 'backend', 'api'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: String(projectIdCounter++),
      title: 'Python Data Analysis with Pandas',
      description: 'Master data manipulation and analysis using Python Pandas. Includes real-world datasets and practical examples.',
      category: 'Data Science',
      difficulty: 'Intermediate',
      technologyStack: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
      instructor: 'admin',
      isPublished: true,
      enrolledCount: 650,
      tags: ['python', 'data-science', 'pandas'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: String(projectIdCounter++),
      title: 'Vue.js Dashboard Application',
      description: 'Build an interactive dashboard with Vue.js, featuring charts, real-time data updates, and responsive design.',
      category: 'Frontend',
      difficulty: 'Intermediate',
      technologyStack: ['Vue.js', 'JavaScript', 'Chart.js', 'Bootstrap'],
      instructor: 'admin',
      isPublished: true,
      enrolledCount: 520,
      tags: ['vuejs', 'frontend', 'dashboard'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: String(projectIdCounter++),
      title: 'Docker & Kubernetes Fundamentals',
      description: 'Learn containerization with Docker and orchestration with Kubernetes. Includes hands-on labs and real deployments.',
      category: 'DevOps',
      difficulty: 'Advanced',
      technologyStack: ['Docker', 'Kubernetes', 'Linux'],
      instructor: 'admin',
      isPublished: true,
      enrolledCount: 340,
      tags: ['docker', 'kubernetes', 'devops'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: String(projectIdCounter++),
      title: 'JavaScript Gaming with Phaser',
      description: 'Create interactive 2D games using the Phaser game engine. Learn sprites, animations, physics, and game design patterns.',
      category: 'Game Development',
      difficulty: 'Beginner',
      technologyStack: ['JavaScript', 'Phaser', 'HTML5'],
      instructor: 'admin',
      isPublished: true,
      enrolledCount: 420,
      tags: ['javascript', 'gaming', 'phaser'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: String(projectIdCounter++),
      title: 'React Native Mobile App',
      description: 'Build cross-platform mobile apps with React Native. Deploy to iOS and Android with a single codebase.',
      category: 'Mobile',
      difficulty: 'Intermediate',
      technologyStack: ['React Native', 'JavaScript', 'Expo'],
      instructor: 'admin',
      isPublished: true,
      enrolledCount: 670,
      tags: ['react-native', 'mobile', 'cross-platform'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: String(projectIdCounter++),
      title: 'Machine Learning with TensorFlow',
      description: 'Introduction to machine learning using TensorFlow and Keras. Build neural networks and train models on real datasets.',
      category: 'AI/ML',
      difficulty: 'Advanced',
      technologyStack: ['Python', 'TensorFlow', 'Keras', 'NumPy'],
      instructor: 'admin',
      isPublished: true,
      enrolledCount: 480,
      tags: ['machine-learning', 'tensorflow', 'ai'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  mockDB.sandboxProjects = projects;
  console.log(`✓ Seeded ${projects.length} sandbox projects to mock database`);
};

/**
 * Get all sandbox projects from mock database
 */
const getSandboxProjects = () => {
  return mockDB.sandboxProjects;
};

/**
 * Get paginated sandbox projects
 */
const getPaginatedProjects = (page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: mockDB.sandboxProjects.slice(start, end),
    total: mockDB.sandboxProjects.length,
    page,
    limit,
  };
};

module.exports = {
  seedMockData,
  getSandboxProjects,
  getPaginatedProjects,
  mockDB,
};
