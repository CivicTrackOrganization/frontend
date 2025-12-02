import { useEffect, useRef, useState } from "react";
import type {
  AssignedUnit,
  CreateReportRequest,
  PriorityType,
  Report,
  ReportType
} from "../types";
import { createReportRequest } from "../types";

interface NewReportProps {
  onAddReport: (report: Report) => void;
}

function NewReport({ onAddReport }: NewReportProps) {
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
  // const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const requestData: CreateReportRequest = {
      ...form,
    };

    const response: Report = createReportRequest(requestData);
    onAddReport(response);

    setForm(initialForm);
    // setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="p-5 bg-white border border-gray-100 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Add report</h2>
          <p className="text-sm text-gray-500">
            Describe the issue and choose a category
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Title
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Short report title"
              value={form.title}
              onChange={(e) =>
                setForm((s) => ({ ...s, title: e.target.value }))
              }
              className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            placeholder="Details (what happened, when, additional info)"
            value={form.description}
            onChange={(e) =>
              setForm((s) => ({ ...s, description: e.target.value }))
            }
            className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-200 h-28"
            maxLength={1000}
            required
          />
          <div className="text-xs text-right text-gray-500">
            {form.description.length}/1000
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            placeholder="Address or description of location"
            value={form.location}
            onChange={(e) =>
              setForm((s) => ({ ...s, location: e.target.value }))
            }
            className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            value={form.priority}
            onChange={(e) =>
              setForm((s) => ({
                ...s,
                priority: e.target.value as PriorityType,
              }))
            }
            className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-200"
          >
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={form.reportType}
            onChange={(e) =>
              setForm((s) => ({
                ...s,
                reportType: e.target.value as ReportType,
              }))
            }
            className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-200"
          >
            <option value="infrastructure">Infrastructure</option>
            <option value="safety">Safety</option>
            <option value="environment">Environment</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Assigned Unit
          </label>
          <select
            value={form.assignedUnit}
            onChange={(e) =>
              setForm((s) => ({
                ...s,
                assignedUnit: e.target.value as AssignedUnit,
              }))
            }
            className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-200"
          >
            <option value="maintenance">Maintenance</option>
            <option value="police">Police</option>
            <option value="environmental">Environmental</option>
            <option value="general">General</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Attach photo (optional)
          </label>
          <div className="flex items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files && e.target.files[0];
                if (f) {
                  if (preview) URL.revokeObjectURL(preview);
                  // setImage(f);
                  setPreview(URL.createObjectURL(f));
                } else {
                  if (preview) URL.revokeObjectURL(preview);
                  // setImage(null);
                  setPreview(null);
                }
              }}
              className="p-1"
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="object-cover w-20 h-20 border rounded"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end mt-2 sm:col-span-2">
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded ${
              form.title && form.description && form.location
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!form.title || !form.description || !form.location}
          >
            Add report
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewReport;
