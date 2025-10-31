import { ResumeData } from "@/lib/types";
import Home from "./Home";

export default async function HomePage() {
  let resumeContent = "";
  try {
    // fetch from server
    const response = await fetch("http://localhost:8000/resume");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ResumeData = await response.json();
    resumeContent = data.resume;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return <Home initialPdfResumeContent={resumeContent} />;
}
