import type {Report} from "../types";
import {useState} from "react";

interface NewReportProps {
  onAddReport: (report: Report) => void;
}

function NewReport({ onAddReport }: NewReportProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("Normal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: Report = {
      title,
      description,
      location,
      priority,
      status: "New",
    };
    onAddReport(newReport);

    setTitle("");
    setDescription("");
    setLocation("");
    setPriority("Normal");
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="mb-4 font-semibold">Add new report</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="High">High</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 cursor-pointer"
        >
          Add report
        </button>
      </form>
    </div>
  );
}

export default NewReport;