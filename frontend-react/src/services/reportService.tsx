import axios from 'axios';
import type { Report, CreateReportRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getReport = async (reportID: string): Promise<Report> => {
    const res = await axios.get<Report>(`${API_URL}/reports/${reportID}`);
    return res.data;

};

export const createReport = async (report: Partial<CreateReportRequest>): Promise<Report> => {
    const accessToken = localStorage.getItem('accessToken');
    const res = await axios.post<Report>(`${API_URL}/reports/`, report, {
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${accessToken}`
        },
    });
    return res.data;
};

export const submitReport = async (payload: CreateReportRequest, file?: File): Promise<Report> => {
    try {
        if (file) {
            const fd = new FormData();
            fd.append('title', payload.title);
            fd.append('description', payload.description);
            fd.append('location', payload.location);
            fd.append('priority', payload.priority);
            fd.append('type', payload.type);
            fd.append('file', file, file.name);

            const res = await axios.post<Report>(`${API_URL}/reports/`, fd, {
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

export const getReports = async (): Promise<Report[]> => {
    try {
        const res = await axios.get<Report[]>(`${API_URL}/reports/`);
        return res.data;
    } catch (err) {
        const message = axios.isAxiosError(err) && err.response?.data ? JSON.stringify(err.response.data) : String(err);
        throw new Error(`Failed to fetch reports: ${message}`);
    }
};

export const getMyReports = async (): Promise<Report[]> => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('Authentication required: No accessToken found.');
        }
        const res = await axios.get<Report[]>(`${API_URL}/reports/me/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return res.data;
    } catch (err) {
        const message = axios.isAxiosError(err) && err.response?.data ? JSON.stringify(err.response.data) : String(err);
        throw new Error(`Failed to fetch user reports: ${message}`);
    }
};

