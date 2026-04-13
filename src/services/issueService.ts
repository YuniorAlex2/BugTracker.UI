import { getToken } from "./authService";
import { API_BASE_URL } from "./api";

export type CreateIssueRequest = {
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: number;
};

export async function createIssue(issue: CreateIssueRequest) {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/issues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(issue),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create issue.");
  }

  return response.json();
}