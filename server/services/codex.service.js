const SandboxProject = require('../models/SandboxProject');

const getAllProjects = async (query) => SandboxProject.find();
const getProjectById = async (id) => SandboxProject.findById(id);
const createProject  = async (data) => {
  const { title } = data;
  if (!title) throw new Error('Project title is required');
  const existing = await SandboxProject.findOne({ title: title.trim() });
  if (existing) throw new Error('A project with this title already exists');
  return SandboxProject.create(data);
};
const updateProject  = async (id, data) => SandboxProject.findByIdAndUpdate(id, data, { new: true });
const deleteProject  = async (id) => SandboxProject.findByIdAndDelete(id);

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject };
