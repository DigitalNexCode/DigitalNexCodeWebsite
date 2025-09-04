import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { CVData, Customization } from './types';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import { Download, Printer, Palette, Type } from 'lucide-react';

interface Step3Props {
    cvData: CVData;
    customization: Customization;
    setCustomization: React.Dispatch<React.SetStateAction<Customization>>;
    prevStep: () => void;
}

const colorOptions = ['#2563eb', '#db2777', '#16a34a', '#7c3aed', '#ea580c', '#0d9488'];
const fontOptions: Customization['font'][] = ['Inter', 'Merriweather', 'Lato'];
const templateOptions: Customization['template'][] = ['Modern', 'Classic'];

const Step3_DownloadCV: React.FC<Step3Props> = ({ cvData, customization, setCustomization, prevStep }) => {
    const resumeRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = () => {
        const input = resumeRef.current;
        if (!input) {
            toast.error('Could not find resume to download.');
            return;
        }
        toast.loading('Generating PDF...');
        html2canvas(input, { scale: 2, backgroundColor: '#ffffff' })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const ratio = canvasWidth / canvasHeight;
                let width = pdfWidth;
                let height = width / ratio;
                if (height > pdfHeight) {
                    height = pdfHeight;
                    width = height * ratio;
                }
                pdf.addImage(imgData, 'PNG', 0, 0, width, height);
                pdf.save(`${cvData.personalInfo.fullName}_CV.pdf`);
                toast.dismiss();
                toast.success('PDF downloaded successfully!');
            })
            .catch(err => {
                toast.dismiss();
                toast.error(`Failed to generate PDF: ${err.message}`);
            });
    };

    const handleDownloadDocx = () => {
        toast.loading('Generating DOCX...');
        try {
            const doc = new Document({
                sections: [{
                    children: [
                        new Paragraph({ text: cvData.personalInfo.fullName, heading: HeadingLevel.TITLE }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: cvData.personalInfo.email, break: 1 }),
                                new TextRun({ text: ` | ${cvData.personalInfo.phone}`, break: 0 }),
                            ]
                        }),
                         new Paragraph({ text: "Summary", heading: HeadingLevel.HEADING_1, border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } }, spacing: { before: 400 } }),
                         new Paragraph({ text: cvData.summary }),
                        
                        new Paragraph({ text: "Work Experience", heading: HeadingLevel.HEADING_1, border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } }, spacing: { before: 400 } }),
                        ...cvData.experience.flatMap(exp => [
                            new Paragraph({ text: exp.jobTitle, style: "strong", spacing: { before: 200 } }),
                            new Paragraph({ text: `${exp.company}, ${exp.location} | ${exp.startDate} - ${exp.endDate}`, style: "emphasis" }),
                            new Paragraph({ text: exp.description, bullet: { level: 0 } })
                        ]),

                         new Paragraph({ text: "Education", heading: HeadingLevel.HEADING_1, border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } }, spacing: { before: 400 } }),
                        ...cvData.education.flatMap(edu => [
                            new Paragraph({ text: edu.degree, style: "strong", spacing: { before: 200 } }),
                            new Paragraph({ text: `${edu.school}, ${edu.location} | ${edu.startDate} - ${edu.endDate}`, style: "emphasis" }),
                        ]),

                        new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_1, border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } }, spacing: { before: 400 } }),
                        new Paragraph({ text: cvData.skills.map(s => s.name).join(', ') })
                    ],
                }],
            });

            Packer.toBlob(doc).then(blob => {
                saveAs(blob, `${cvData.personalInfo.fullName}_CV.docx`);
                toast.dismiss();
                toast.success('DOCX downloaded successfully!');
            });
        } catch (err: any) {
            toast.dismiss();
            toast.error(`Failed to generate DOCX: ${err.message}`);
        }
    };

    const handlePrint = () => {
        const printContent = resumeRef.current?.innerHTML;
        if (!printContent) return;

        const printWindow = window.open('', '', 'height=800,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print CV</title>');
            printWindow.document.write('<style>@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lato:wght@400;700&family=Merriweather:wght@400;700&display=swap"); body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }</style>');
            const styles = Array.from(document.styleSheets)
                .map(styleSheet => {
                    try {
                        return Array.from(styleSheet.cssRules)
                            .map(rule => rule.cssText)
                            .join('');
                    } catch (e) {
                        console.log('Access to stylesheet %s is denied. Ignoring.', styleSheet.href);
                    }
                })
                .filter(Boolean)
                .join('\n');
            printWindow.document.write(`<style>${styles}</style>`);
            printWindow.document.write('</head><body>');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        }
    };

    const ResumeComponent = customization.template === 'Modern' ? ModernTemplate : ClassicTemplate;

    return (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">
            <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Customize & Download</h3>
                <p className="text-gray-600">Your CV is ready! Personalize its look, then download it in your preferred format.</p>
            </div>

            {/* Customization Controls */}
            <div className="p-6 bg-white rounded-lg shadow space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                        <div className="flex gap-2">
                            {templateOptions.map(template => (
                                <button key={template} onClick={() => setCustomization(p => ({...p, template}))} className={`px-4 py-2 rounded-lg text-sm border-2 ${customization.template === template ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>{template}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                        <div className="flex items-center gap-2">
                            <Palette size={18} className="text-gray-500" />
                            {colorOptions.map(color => (
                                <button key={color} onClick={() => setCustomization(p => ({...p, accentColor: color}))} style={{backgroundColor: color}} className={`w-8 h-8 rounded-full border-2 transition-transform ${customization.accentColor === color ? 'border-gray-900 scale-110' : 'border-transparent'}`}></button>
                            ))}
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
                        <div className="flex items-center gap-2">
                             <Type size={18} className="text-gray-500" />
                            {fontOptions.map(font => (
                                <button key={font} onClick={() => setCustomization(p => ({...p, font}))} className={`px-4 py-2 rounded-lg text-sm border-2 ${customization.font === font ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>{font}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <button onClick={handleDownloadPdf} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center"><Download size={18} className="mr-2" /> Download PDF</button>
                <button onClick={handleDownloadDocx} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"><Download size={18} className="mr-2" /> Download DOCX</button>
                <button onClick={handlePrint} className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center"><Printer size={18} className="mr-2" /> Print CV</button>
            </div>

            <div className="max-w-4xl mx-auto">
                <ResumeComponent ref={resumeRef} data={cvData} customization={customization} />
            </div>

            <div className="flex justify-start mt-8">
                <button onClick={prevStep} className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">Back</button>
            </div>
        </motion.div>
    );
};

export default Step3_DownloadCV;
