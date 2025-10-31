import { ResumeData } from "@/lib/types";
import Home from "./Home";
import { API_URL } from "@/consts";

export default async function HomePage() {
  let resumeContent: ResumeData = {
    resume: "",
    datetime: 0,
  };

  try {
    // fetch from server
    console.log(`${API_URL}/resume`);
    const response = await fetch("127.0.0.1:8000/resume", {
      cache: "no-store",
    });
    if (!response.ok) {
      // throw new Error(`HTTP error! status: ${response.status}`);
      console.error("HTTP error! status:", response.status);
    } else {
      const data: ResumeData = await response.json();
      resumeContent = data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return <Home initialPdfResumeContent={resumeContent} />;
}
