import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit3, Check, Eye, Code, 
  ArrowLeft, List, AlertCircle, FileText, 
  Settings, CheckCircle2, Archive
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  fetchMyProjectsAPI, 
  createProjectAPI, 
  updateProjectAPI, 
  deleteProjectAPI, 
  publishProjectAPI, 
  archiveProjectAPI,
  fetchProjectStepsAPI,
  createStepAPI,
  updateStepAPI,
  deleteStepAPI
} from '../services/instructorSandboxAPI.js';

export const InstructorSandbox = () => {
  // State
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // null means creating
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    category: 'fullstack',
    technologyStack: '',
    prerequisites: '',
    learningOutcomes: '',
    estimatedDuration: '',
    estimatedMinutes: 0
  });

  // Steps Modal State
  const [isStepsModalOpen, setIsStepsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [steps, setSteps] = useState([]);
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [editingStep, setEditingStep] = useState(null); // null means creating
  const [stepForm, setStepForm] = useState({
    title: '',
    content: '',
    instructions: '',
    stepNumber: 1
  });

  // Load projects
  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetchMyProjectsAPI();
      if (res.success) {
        setProjects(res.data.projects || []);
      } else {
        toast.error(res.message || 'Failed to load projects');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching sandbox projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Handle Project Form Submission
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim()) {
      return toast.error('Project title is required');
    }

    const payload = {
      ...projectForm,
      technologyStack: projectForm.technologyStack.split(',').map(t => t.trim()).filter(Boolean),
      prerequisites: projectForm.prerequisites.split(',').map(p => p.trim()).filter(Boolean),
      learningOutcomes: projectForm.learningOutcomes.split(',').map(l => l.trim()).filter(Boolean),
      estimatedMinutes: Number(projectForm.estimatedMinutes) || 0
    };

    try {
      if (editingProject) {
        const res = await updateProjectAPI(editingProject._id, payload);
        if (res.success) {
          toast.success('Sandbox project updated successfully!');
          loadProjects();
          setIsProjectModalOpen(false);
        } else {
          toast.error(res.message || 'Update failed');
        }
      } else {
        const res = await createProjectAPI(payload);
        if (res.success) {
          toast.success('Sandbox project created successfully!');
          loadProjects();
          setIsProjectModalOpen(false);
        } else {
          toast.error(res.message || 'Creation failed');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving project');
    }
  };

  // Open Project Modal for Edit
  const openEditProject = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title || '',
      description: proj.description || '',
      difficulty: proj.difficulty || 'beginner',
      category: proj.category || 'fullstack',
      technologyStack: (proj.technologyStack || []).join(', '),
      prerequisites: (proj.prerequisites || []).join(', '),
      learningOutcomes: (proj.learningOutcomes || []).join(', '),
      estimatedDuration: proj.estimatedDuration || '',
      estimatedMinutes: proj.estimatedMinutes || 0
    });
    setIsProjectModalOpen(true);
  };

  // Open Project Modal for Create
  const openCreateProject = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      description: '',
      difficulty: 'beginner',
      category: 'fullstack',
      technologyStack: '',
      prerequisites: '',
      learningOutcomes: '',
      estimatedDuration: '',
      estimatedMinutes: 0
    });
    setIsProjectModalOpen(true);
  };

  // Delete Project
  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? This will delete all its steps and progress.')) return;
    try {
      const res = await deleteProjectAPI(id);
      if (res.success) {
        toast.success('Sandbox project deleted.');
        loadProjects();
      } else {
        toast.error(res.message || 'Delete failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting project');
    }
  };

  // Publish Project
  const handlePublishProject = async (id) => {
    try {
      const res = await publishProjectAPI(id);
      if (res.success) {
        toast.success('Sandbox project published!');
        loadProjects();
      } else {
        toast.error(res.message || 'Publish failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error publishing project');
    }
  };

  // Archive Project
  const handleArchiveProject = async (id) => {
    try {
      const res = await archiveProjectAPI(id);
      if (res.success) {
        toast.success('Sandbox project archived.');
        loadProjects();
      } else {
        toast.error(res.message || 'Archive failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error archiving project');
    }
  };

  // Manage Steps Dialog Open
  const openManageSteps = async (proj) => {
    setSelectedProject(proj);
    setIsStepsModalOpen(true);
    loadProjectSteps(proj._id);
  };

  // Load Steps
  const loadProjectSteps = async (projId) => {
    setLoadingSteps(true);
    try {
      const res = await fetchProjectStepsAPI(projId);
      if (res.success) {
        setSteps(res.data || []);
      } else {
        toast.error(res.message || 'Failed to load steps');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching project steps');
    } finally {
      setLoadingSteps(false);
    }
  };

  // Submit Step Form
  const handleStepSubmit = async (e) => {
    e.preventDefault();
    if (!stepForm.title.trim()) {
      return toast.error('Step title is required');
    }

    const payload = {
      ...stepForm,
      projectId: selectedProject._id,
      stepNumber: Number(stepForm.stepNumber) || 1
    };

    try {
      if (editingStep) {
        const res = await updateStepAPI(editingStep._id, payload);
        if (res.success) {
          toast.success('Step updated!');
          loadProjectSteps(selectedProject._id);
          resetStepForm();
          loadProjects(); // to update step counts
        } else {
          toast.error(res.message || 'Failed to update step');
        }
      } else {
        const res = await createStepAPI(payload);
        if (res.success) {
          toast.success('Step added successfully!');
          loadProjectSteps(selectedProject._id);
          resetStepForm();
          loadProjects(); // to update step counts
        } else {
          toast.error(res.message || 'Failed to add step');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving step');
    }
  };

  // Edit Step Click
  const startEditStep = (step) => {
    setEditingStep(step);
    setStepForm({
      title: step.title || '',
      content: step.content || '',
      instructions: step.instructions || '',
      stepNumber: step.stepNumber || 1
    });
  };

  // Reset Step Form
  const resetStepForm = () => {
    setEditingStep(null);
    setStepForm({
      title: '',
      content: '',
      instructions: '',
      stepNumber: steps.length + 1
    });
  };

  // Delete Step
  const handleDeleteStep = async (stepId) => {
    if (!window.confirm('Delete this step?')) return;
    try {
      const res = await deleteStepAPI(stepId);
      if (res.success) {
        toast.success('Step deleted.');
        loadProjectSteps(selectedProject._id);
        loadProjects(); // to update step counts
      } else {
        toast.error(res.message || 'Failed to delete step');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting step');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-100 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center select-none bg-slate-900/40 p-5 rounded-xl border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code className="text-blue-500" size={24} />
            Sandbox Project Playpens
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build coding labs, design instructions, define compilers technology stack, and track user completions.
          </p>
        </div>
        <button 
          onClick={openCreateProject}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
        >
          <Plus size={16} />
          Create Playpen Project
        </button>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-slate-900/20 border border-dashed border-slate-800 rounded-xl">
          <AlertCircle className="text-slate-500 mb-3" size={36} />
          <p className="text-sm font-semibold text-slate-300">No sandbox projects created yet</p>
          <p className="text-xs text-slate-500 mt-1">Get started by creating your first compiler project playpen.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {projects.map((proj) => (
            <div 
              key={proj._id} 
              className="bg-[#151922] border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between shadow-sm relative group overflow-hidden"
            >
              {/* Glassy border glow */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600/40 group-hover:bg-blue-500 transition-colors" />

              <div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded">
                      {proj.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-2 leading-snug">{proj.title}</h3>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                    proj.status === 'published' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : proj.status === 'archived'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {proj.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {proj.description || 'No description provided.'}
                </p>

                {/* Tech stack & stats */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {(proj.technologyStack || []).slice(0, 4).map((tech, idx) => (
                    <span key={idx} className="text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                  {(proj.technologyStack || []).length > 4 && (
                    <span className="text-[10px] text-slate-500 bg-slate-800/40 px-2 py-0.5 rounded">
                      +{proj.technologyStack.length - 4} more
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/60 text-slate-400 text-[10px] font-medium">
                  <div>Difficulty: <span className="text-white capitalize">{proj.difficulty}</span></div>
                  <div>Steps: <span className="text-white">{proj.stepCount || 0}</span></div>
                  <div>Enrolled: <span className="text-white">{proj.enrolledCount || 0}</span></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 mt-5 pt-3 border-t border-slate-800/40">
                <button
                  onClick={() => openManageSteps(proj)}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg transition-colors font-medium"
                >
                  <List size={13} />
                  Manage Steps ({proj.stepCount || 0})
                </button>
                <button
                  onClick={() => openEditProject(proj)}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg transition-colors font-medium"
                >
                  <Edit3 size={13} />
                  Edit Info
                </button>
                
                {proj.status !== 'published' ? (
                  <button
                    onClick={() => handlePublishProject(proj._id)}
                    className="flex items-center gap-1.5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs px-3 py-2 rounded-lg transition-all font-medium ml-auto border border-emerald-500/20 hover:border-emerald-600"
                  >
                    <Check size={13} />
                    Publish
                  </button>
                ) : (
                  <button
                    onClick={() => handleArchiveProject(proj._id)}
                    className="flex items-center gap-1.5 bg-amber-600/10 hover:bg-amber-600 text-amber-400 hover:text-white text-xs px-3 py-2 rounded-lg transition-all font-medium ml-auto border border-amber-500/20 hover:border-amber-600"
                  >
                    <Archive size={13} />
                    Archive
                  </button>
                )}
                
                <button
                  onClick={() => handleDeleteProject(proj._id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors border border-red-500/20 hover:border-red-500"
                  title="Delete Project"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PROJECT EDIT/CREATE MODAL ── */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#151922] border border-slate-850 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up my-8">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-[#0f121a]">
              <h3 className="text-sm font-bold text-white">
                {editingProject ? 'Edit Playpen Project Details' : 'Create New Playpen Project'}
              </h3>
              <button 
                onClick={() => setIsProjectModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold hover:bg-slate-800 px-2.5 py-1 rounded-md"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[75vh]">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Project Title *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Master WebSockets in React"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Description</label>
                <textarea 
                  rows={4}
                  placeholder="Explain the playpen parameters, requirements, and outcomes..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Difficulty</label>
                  <select
                    value={projectForm.difficulty}
                    onChange={(e) => setProjectForm({ ...projectForm, difficulty: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="fullstack">Fullstack</option>
                    <option value="ai_ml">AI / ML</option>
                    <option value="devops">DevOps</option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="mobile">Mobile</option>
                    <option value="blockchain">Blockchain</option>
                    <option value="cloud">Cloud</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Technology Stack (Comma separated)</label>
                <input 
                  type="text"
                  placeholder="e.g. React, Node.js, WebSockets, Express"
                  value={projectForm.technologyStack}
                  onChange={(e) => setProjectForm({ ...projectForm, technologyStack: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Estimated Duration (Text)</label>
                  <input 
                    type="text"
                    placeholder="e.g. 10 Hours"
                    value={projectForm.estimatedDuration}
                    onChange={(e) => setProjectForm({ ...projectForm, estimatedDuration: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Duration in Minutes</label>
                  <input 
                    type="number"
                    min="0"
                    placeholder="e.g. 600"
                    value={projectForm.estimatedMinutes}
                    onChange={(e) => setProjectForm({ ...projectForm, estimatedMinutes: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Prerequisites (Comma separated)</label>
                <input 
                  type="text"
                  placeholder="e.g. Basic React, ES6 JS"
                  value={projectForm.prerequisites}
                  onChange={(e) => setProjectForm({ ...projectForm, prerequisites: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Learning Outcomes (Comma separated)</label>
                <input 
                  type="text"
                  placeholder="e.g. Deploy custom server, manage socket states"
                  value={projectForm.learningOutcomes}
                  onChange={(e) => setProjectForm({ ...projectForm, learningOutcomes: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-3 rounded-lg shadow-lg hover:shadow-blue-600/20 transition-all mt-4"
              >
                {editingProject ? 'Save Project Details' : 'Create Problem Statement'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── STEPS MANAGEMENT DIALOG ── */}
      {isStepsModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#151922] border border-slate-850 rounded-xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] animate-scale-up my-4">
            
            {/* Steps List (Left Side) */}
            <div className="flex-1 border-r border-slate-800 flex flex-col h-full bg-[#0f121a]/40">
              <div className="px-5 py-4 border-b border-slate-800 bg-[#0f121a] flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-400">STEPS MANAGEMENT</h4>
                  <h3 className="text-sm font-bold text-white line-clamp-1 mt-0.5">{selectedProject.title}</h3>
                </div>
                <button 
                  onClick={() => setIsStepsModalOpen(false)}
                  className="text-slate-400 hover:text-white text-xs font-semibold md:hidden hover:bg-slate-850 px-2.5 py-1 rounded-md"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {loadingSteps ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : steps.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                    <AlertCircle size={24} className="mb-2" />
                    <p className="text-xs">No steps defined for this project.</p>
                  </div>
                ) : (
                  steps.map((step) => (
                    <div 
                      key={step._id}
                      className={`p-3.5 rounded-lg border transition-all duration-150 flex justify-between items-start gap-4 ${
                        editingStep?._id === step._id 
                          ? 'bg-blue-600/10 border-blue-500/30' 
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600/15 text-blue-400">
                            Step {step.stepNumber}
                          </span>
                          <h4 className="text-xs font-bold text-white">{step.title}</h4>
                        </div>
                        {step.content && (
                          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{step.content}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditStep(step)}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
                          title="Edit Step"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteStep(step._id)}
                          className="p-1.5 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded transition-colors"
                          title="Delete Step"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Step Form (Right Side) */}
            <div className="w-full md:w-96 flex flex-col h-full bg-[#151922]">
              <div className="px-5 py-4 border-b border-slate-800 bg-[#0f121a] flex justify-between items-center">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {editingStep ? 'Edit Step Info' : 'Add New Step'}
                </h3>
                {editingStep && (
                  <button 
                    onClick={resetStepForm}
                    className="text-[10px] font-bold text-blue-500 hover:underline"
                  >
                    Cancel Edit
                  </button>
                )}
                <button 
                  onClick={() => setIsStepsModalOpen(false)}
                  className="text-slate-400 hover:text-white text-xs font-semibold hidden md:block hover:bg-slate-850 px-2.5 py-1 rounded-md"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleStepSubmit} className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Step Number</label>
                  <input 
                    type="number"
                    min="1"
                    required
                    value={stepForm.stepNumber}
                    onChange={(e) => setStepForm({ ...stepForm, stepNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Step Title *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Initialize state hook"
                    value={stepForm.title}
                    onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Core Lesson Content (Markdown)</label>
                  <textarea 
                    rows={6}
                    placeholder="Provide the conceptual explanation or tutorial for this step..."
                    value={stepForm.content}
                    onChange={(e) => setStepForm({ ...stepForm, content: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Step Action Instructions</label>
                  <textarea 
                    rows={4}
                    placeholder="e.g. 1. Create Counter.js&#10;2. Add state variable 'count'&#10;3. Export default..."
                    value={stepForm.instructions}
                    onChange={(e) => setStepForm({ ...stepForm, instructions: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none font-mono"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 rounded-lg shadow-lg hover:shadow-blue-600/20 transition-all mt-2"
                >
                  {editingStep ? 'Update Step details' : 'Add Step to Project'}
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default InstructorSandbox;
