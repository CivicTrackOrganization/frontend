import { CreateReportRequest } from "../types";
import type { Report, User, PriorityType, ReportType, AssignedUnit } from "../types";
import { useState } from "react";

interface NewReportProps {
  onAddReport: (report: Report) => void;
  user: User;
}

function NewReport({ onAddReport, user }: NewReportProps) {
  type FormState = {
    title: string;
    description: string;
    location: string;
    priority: PriorityType;
    reportType: ReportType;
    assignedUnit: AssignedUnit;
  };

  const initialForm: FormState = {
    title: "",
    description: "",
    location: "",
    priority: "Normal",
    reportType: "other",
    assignedUnit: "general",
  };

  const [form, setForm] = useState<FormState>(initialForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const req = new CreateReportRequest(user);
    req.report.title = form.title;
    req.report.description = form.description;
    req.report.location = form.location;
    req.report.priority = form.priority;
    req.report.reportType = form.reportType;
    req.report.assignedUnit = form.assignedUnit;
    onAddReport(req.report);

    setForm(initialForm);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="mb-4 font-semibold">Add new report</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={form.priority}
          onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value as PriorityType }))}
          className="w-full p-2 border rounded"
        >
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="High">High</option>
        </select>
        <select
          value={form.reportType}
          onChange={(e) => setForm((s) => ({ ...s, reportType: e.target.value as ReportType }))}
          className="w-full p-2 border rounded"
        >
          <option value="infrastructure">Infrastructure</option>
          <option value="safety">Safety</option>
          <option value="environment">Environment</option>
          <option value="other">Other</option>
        </select>
        <select
          value={form.assignedUnit}
          onChange={(e) => setForm((s) => ({ ...s, assignedUnit: e.target.value as AssignedUnit }))}
          className="w-full p-2 border rounded"
        >
          <option value="maintenance">Maintenance</option>
          <option value="police">Police</option>
          <option value="environmental">Environmental</option>
          <option value="general">General</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600"
        >
          Add report
        </button>
      </form>
    </div>
  );
}

export default NewReport;