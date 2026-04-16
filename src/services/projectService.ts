import { API_BASE_URL } from "./api";

export interface Project {
  id: number;
  name: string;
  description: string;
  owner: string;
  createdAt: string;
}

export interface CreateProjectDto {
  name: string;
  description: string;
  owner: string;
}

export interface UpdateProjectDto {
  name: string;
  description: string;
  owner: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_BASE_URL}/projects`);

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
};

export const getProjectById = async (id: number): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  return response.json();
};

export const getProjectIssues = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}/issues`);

  if (!response.ok) {
    throw new Error("Failed to fetch project issues");
  }

  return response.json();
};

export const createProject = async (projectData: CreateProjectDto) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
};

export const updateProject = async (
  id: number,
  projectData: UpdateProjectDto
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    throw new Error("Failed to update project");
  }

  return response.json();
};

export const deleteProject = async (id: number) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};