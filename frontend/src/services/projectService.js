import API from "./api";

export const getProjects = async () => {
  const response = await API.get("/projects");
  return response.data;
};

export const createProject = async (payload) => {
  const response = await API.post("/projects", payload);
  return response.data;
};

export const updateProject = async (projectId, payload) => {
  const response = await API.put(`/projects/${projectId}`, payload);
  return response.data;
};

export const deleteProject = async (projectId) => {
  const response = await API.delete(`/projects/${projectId}`);
  return response.data;
};