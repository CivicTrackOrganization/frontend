import axios from 'axios';
import type { Report } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getReport = async (reportID: string): Promise<Report> => {
    const res = await axios.get<Report>(`${API_URL}/reports/${reportID}`);
    return res.data;

};

export const createReport = async (report: Partial<Report>): Promise<Report> => {
    const res = await axios.post<Report>(`${API_URL}/reports`, report, {
        headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
};
// TODO move to newreport
import type { CreateReportRequest } from '../types';

export const submitReport = async (payload: CreateReportRequest, file?: File): Promise<Report> => {
    try {
        if (file) {
            const fd = new FormData();
            fd.append('title', payload.title);
            fd.append('description', payload.description);
            fd.append('location', payload.location);
            fd.append('priority', payload.priority);
            fd.append('reportType', payload.reportType);
            fd.append('assignedUnit', payload.assignedUnit);
            fd.append('file', file, file.name);

            const res = await axios.post<Report>(`${API_URL}/reports`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data;
        }

        // no file -> send JSON
        return await createReport(payload as Partial<Report>);
    } catch (err) {
        const message = axios.isAxiosError(err) && err.response?.data ? JSON.stringify(err.response.data) : String(err);
        throw new Error(`Failed to submit report: ${message}`);
    }
};

