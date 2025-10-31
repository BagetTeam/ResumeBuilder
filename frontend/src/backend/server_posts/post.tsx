import { API_URL } from "@/consts";
import { ResumeData } from "@/lib/types";

export async function postTextContent(str: string) {
  try {
    const response = await fetch(`${API_URL}/resume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        ResumeData.parse({ resume: str, datetime: Date.now() })
      ),
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

export async function getPDFDownload(str: string) {
  try {
    const response = await fetch(`${API_URL}/pdf-download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        ResumeData.parse({ resume: str, datetime: Date.now() })
      ),
    });
    if (!response.ok) {
      throw new Error("Failed to save resume");
    }
    const data = await response.blob();
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function getPDFDisplay(str: string) {
  try {
    const response = await fetch(`${API_URL}/pdf-display`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        ResumeData.parse({ resume: str, datetime: Date.now() })
      ),
    });
    if (!response.ok) {
      console.error("Failed to get resume");
      return null;
    }
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}
