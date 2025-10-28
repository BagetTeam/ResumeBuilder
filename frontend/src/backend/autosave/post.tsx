import { API_URL } from "@/consts";

async function postTextContent(str: string) {
  try {
    const response = await fetch(`${API_URL}/resume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(str),
    });
    if (!response.ok) {
      throw new Error("Failed to save resume");
    }
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}
