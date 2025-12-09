import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type {
  CreateReportRequest,
  PriorityType,
  Report,
  ReportType,
} from "../types";
import { submitReport } from "../services/reportService";

function NewReport() {
  type FormState = {
    title: string;
    description: string;
    location: string;
    priority: PriorityType;
    type: ReportType;
  };

  const initialForm: FormState = {
    title: "",
    description: "",
    location: "",
    priority: "normal",
    type: "other",
  };

  const [form, setForm] = useState<FormState>(initialForm);
  // const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();
  const MY_REPORTS_KEY = ["myReports"];
  const ALL_REPORTS_KEY = ["reports"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitReportMutation.isPending) return;

    const requestData: CreateReportRequest = {
      ...form,
    };

    // `FileList.item` may return `File | null` and indexing can be `File | undefined`.
    // Normalize to `File | undefined` so it matches the mutation's `file?: File` type.
    const maybeFile = fileRef.current?.files?.item(0);
    const file: File | undefined = maybeFile ?? undefined;

    submitReportMutation.mutate({ payload: requestData, file });
  };

  const submitReportMutation = useMutation<
    Report,
    Error,
    { payload: CreateReportRequest; file?: File }
  >({
    mutationFn: ({ payload, file }) => submitReport(payload, file),
    onSuccess: () => {
      setForm(initialForm);
      setPreview(null);
      queryClient.invalidateQueries({ queryKey: MY_REPORTS_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_REPORTS_KEY });
      toast.success("Report successfully submitted.");
      if (fileRef.current) fileRef.current.value = "";
    },
    onError: (error) => {
      console.error("Failed to submit report", error);
      toast.error("Failed to submit report. Please try again.");
    },
  });

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
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            value={form.type}
            onChange={(e) =>
              setForm((s) => ({
                ...s,
                type: e.target.value as ReportType,
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
              form.title &&
              form.description &&
              form.location &&
              !submitReportMutation.isPending
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={
              !form.title ||
              !form.description ||
              !form.location ||
              submitReportMutation.isPending
            }
          >
            Add report
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewReport;
