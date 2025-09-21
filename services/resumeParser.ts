
// This is a simplified way to load pdf.js in a no-build environment.
// In a real-world scenario with a build tool (like Vite or Webpack),
// you'd typically host the worker file yourself.
const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfjsLib: any = null;

async function getPdfjs() {
  if (pdfjsLib) return pdfjsLib;

  // Dynamically import pdf.js
  const module = await import('//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
  pdfjsLib = (window as any).pdfjsLib;
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
  return pdfjsLib;
}

export const parseResume = async (file: File): Promise<string> => {
  const pdfjs = await getPdfjs();
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error('Failed to read file.'));
      }
      
      const typedArray = new Uint8Array(event.target.result as ArrayBuffer);
      
      try {
        const pdf = await pdfjs.getDocument(typedArray).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
        }
        
        resolve(fullText);
      } catch (error) {
        console.error('Error parsing PDF:', error);
        reject(new Error('Could not parse the PDF file. It might be corrupted or protected.'));
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};
