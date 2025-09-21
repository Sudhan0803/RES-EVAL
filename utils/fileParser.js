import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs';

// Set worker URL for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@^4.5.136/build/pdf.worker.min.mjs`;

export const parseFileAsText = async (file: File): Promise<string> => {
  if (file.type !== 'application/pdf') {
    throw new Error('Invalid file type. Only PDF files are supported.');
  }

  const arrayBuffer = await file.arrayBuffer();
  
  try {
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
      fullText += pageText + '\n\n';
    }
    return fullText;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse the PDF file. It might be corrupted or password-protected.');
  }
};