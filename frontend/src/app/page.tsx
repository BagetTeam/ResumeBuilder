"use client";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [test, setTest] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8000/test");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTest(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);
  return (
    <div>
      <Navbar />
      {test["Hello"]}
    </div>
  );
}
