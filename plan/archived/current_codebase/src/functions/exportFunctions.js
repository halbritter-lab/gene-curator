// functions/exportFunctions.js

import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToCsv = (data, filename = 'data') => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

export const exportToExcel = (data, filename = 'data') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPdf = (data, filename = 'data') => {
  const doc = new jsPDF();
  doc.autoTable({
    head: [Object.keys(data[0])],
    body: data.map(Object.values),
  });
  doc.save(`${filename}.pdf`);
};
