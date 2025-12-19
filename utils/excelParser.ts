
import * as XLSX from 'xlsx';
import { RawFeedbackRow } from '../types';

export const parseExcelFile = (file: File): Promise<RawFeedbackRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        // Mapping logic: Attempt to find columns that look like faculty name, section, etc.
        const mappedData: RawFeedbackRow[] = jsonData.map((row) => {
          const facultyName = row['Faculty Name'] || row['Name'] || row['Professor'] || row['Faculty'] || Object.values(row)[0];
          const section = row['Section'] || row['Class'] || row['Course ID'] || 'General';
          const rating = parseFloat(row['Rating'] || row['Score'] || row['Average'] || 0);
          const comments = row['Comments'] || row['Feedback'] || row['Review'] || '';

          return {
            facultyName: String(facultyName),
            section: String(section),
            rating: isNaN(rating) ? 0 : rating,
            comments: String(comments),
          };
        });

        resolve(mappedData);
      } catch (err) {
        reject(new Error("Failed to parse Excel file. Ensure it is a valid .xlsx or .xls file."));
      }
    };

    reader.onerror = () => reject(new Error("File reading error."));
    reader.readAsBinaryString(file);
  });
};
