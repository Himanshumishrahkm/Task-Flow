import API from "./api";

export const getProjectTasks = async (projectId, params = {}) => {
  const response = await API.get(`/projects/${projectId}/tasks`, { params });
  return response.data;
};

export const createTask = async (projectId, payload) => {
  const response = await API.post(`/projects/${projectId}/tasks`, payload);
  return response.data;
};

export const updateTask = async (taskId, payload) => {
  const response = await API.put(`/tasks/${taskId}`, payload);
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await API.patch(`/tasks/${taskId}/status`, { status });
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await API.delete(`/tasks/${taskId}`);
  return response.data;
};