import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CVData } from './types';
import { Plus, Trash2, UploadCloud } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';
import * as pdfjs from 'pdfjs-dist/build/pdf';
import mammoth from 'mammoth';

// Setup worker for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Step1Props {
    cvData: CVData;
    setCvData: React.Dispatch<React.SetStateAction<CVData>>;
    nextStep: () => void;
}

const Step1_CreateCV: React.FC<Step1Props> = ({ cvData, setCvData, nextStep }) => {
    const [isParsing, setIsParsing] = useState(false);
    const [parsingStatus, setParsingStatus] = useState('');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsParsing(true);
        const toastId = toast.loading('Preparing to read your file...');

        try {
            setParsingStatus('Reading file content...');
            toast.loading('Reading file content...', { id: toastId });

            let text = '';
            if (file.type === 'application/pdf') {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const typedArray = new Uint8Array(event.target?.result as ArrayBuffer);
                    const pdf = await pdfjs.getDocument(typedArray).promise;
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        fullText += content.items.map(item => ('str' in item ? item.str : '')).join(' ');
                    }
                    text = fullText;
                    await structureCvWithAI(text, toastId);
                };
                reader.readAsArrayBuffer(file);
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const result = await mammoth.extractRawText({ arrayBuffer: event.target?.result as ArrayBuffer });
                    text = result.value;
                    await structureCvWithAI(text, toastId);
                };
                reader.readAsArrayBuffer(file);
            } else {
                throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
            }
        } catch (error: any) {
            toast.error(`Failed to read file: ${error.message}`, { id: toastId });
            setIsParsing(false);
            setParsingStatus('');
        }
    };

    const structureCvWithAI = async (text: string, toastId: string) => {
        setParsingStatus('AI is structuring your CV...');
        toast.loading('AI is structuring your CV...', { id: toastId });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout

        try {
            const { data, error } = await supabase.functions.invoke('structure-cv', {
                body: { cvText: text },
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
            if (error) throw error;
            
            const structuredData = data.cv as Partial<CVData>;
            setCvData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, ...structuredData.personalInfo },
                summary: structuredData.summary || prev.summary,
                experience: structuredData.experience || prev.experience,
                education: structuredData.education || prev.education,
                skills: structuredData.skills || prev.skills,
                references: structuredData.references || prev.references,
                portfolio: structuredData.portfolio || prev.portfolio,
            }));

            toast.success('Your CV has been auto-filled!', { id: toastId });
        } catch (error: any) {
            if (error.name === 'AbortError') {
                toast.error('The AI analysis timed out. Your CV might be too complex. Please try again or fill the fields manually.', { id: toastId });
            } else {
                toast.error(`AI structuring failed: ${error.message}`, { id: toastId });
            }
        } finally {
            setIsParsing(false);
            setParsingStatus('');
        }
    };


    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCvData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [e.target.name]: e.target.value } }));
    };
    
    const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCvData(prev => ({ ...prev, summary: e.target.value }));
    };

    const handleDynamicChange = (section: 'experience' | 'education' | 'skills' | 'references' | 'portfolio', index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const list = [...cvData[section]];
        // @ts-ignore
        list[index][name] = value;
        setCvData(prev => ({ ...prev, [section]: list }));
    };

    const addDynamicItem = (section: 'experience' | 'education' | 'skills' | 'references' | 'portfolio') => {
        let newItem;
        switch(section) {
            case 'experience': newItem = { id: Date.now().toString(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' }; break;
            case 'education': newItem = { id: Date.now().toString(), degree: '', school: '', location: '', startDate: '', endDate: '' }; break;
            case 'skills': newItem = { id: Date.now().toString(), name: '' }; break;
            case 'references': newItem = { id: Date.now().toString(), name: '', contact: '', relation: '' }; break;
            case 'portfolio': newItem = { id: Date.now().toString(), title: '', link: '', description: '' }; break;
        }
        // @ts-ignore
        setCvData(prev => ({ ...prev, [section]: [...prev[section], newItem] }));
    };

    const removeDynamicItem = (section: 'experience' | 'education' | 'skills' | 'references' | 'portfolio', index: number) => {
        const list = [...cvData[section]];
        list.splice(index, 1);
        setCvData(prev => ({ ...prev, [section]: list }));
    };

    return (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">
            
            <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Auto-fill from existing CV</h3>
                <label className={`w-full flex justify-center items-center px-4 py-6 bg-gray-50 text-blue-600 rounded-lg shadow-inner border-2 border-dashed border-gray-300 transition-colors ${isParsing ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-blue-50'}`}>
                    <UploadCloud size={24} className="mr-3" />
                    <span className="font-medium">{isParsing ? parsingStatus : 'Upload DOCX or PDF'}</span>
                    <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileUpload} disabled={isParsing} />
                </label>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="fullName" value={cvData.personalInfo.fullName} onChange={handlePersonalInfoChange} placeholder="Full Name" className="w-full p-2 border rounded" />
                    <input name="email" type="email" value={cvData.personalInfo.email} onChange={handlePersonalInfoChange} placeholder="Email" className="w-full p-2 border rounded" />
                    <input name="phone" value={cvData.personalInfo.phone} onChange={handlePersonalInfoChange} placeholder="Phone" className="w-full p-2 border rounded" />
                    <input name="address" value={cvData.personalInfo.address} onChange={handlePersonalInfoChange} placeholder="Address (e.g. City, Country)" className="w-full p-2 border rounded" />
                    <input name="link" value={cvData.personalInfo.link} onChange={handlePersonalInfoChange} placeholder="Portfolio/LinkedIn Link" className="md:col-span-2 w-full p-2 border rounded" />
                </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Professional Summary</h3>
                <textarea name="summary" value={cvData.summary} onChange={handleSummaryChange} placeholder="A brief summary of your career and skills..." className="w-full p-2 border rounded" rows={4}></textarea>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Work Experience</h3>
                {cvData.experience.map((exp, index) => (
                    <div key={exp.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
                        <input name="jobTitle" value={exp.jobTitle} onChange={(e) => handleDynamicChange('experience', index, e)} placeholder="Job Title" className="w-full p-2 border rounded" />
                        <input name="company" value={exp.company} onChange={(e) => handleDynamicChange('experience', index, e)} placeholder="Company" className="w-full p-2 border rounded" />
                        <input name="location" value={exp.location} onChange={(e) => handleDynamicChange('experience', index, e)} placeholder="Location" className="w-full p-2 border rounded" />
                        <div className="flex gap-2">
                           <input type="text" name="startDate" value={exp.startDate} onChange={(e) => handleDynamicChange('experience', index, e)} placeholder="Start Date" className="w-full p-2 border rounded" />
                           <input type="text" name="endDate" value={exp.endDate} onChange={(e) => handleDynamicChange('experience', index, e)} placeholder="End Date" className="w-full p-2 border rounded" />
                        </div>
                        <textarea name="description" value={exp.description} onChange={(e) => handleDynamicChange('experience', index, e)} placeholder="Job Description" className="md:col-span-2 w-full p-2 border rounded" rows={3}></textarea>
                        <button onClick={() => removeDynamicItem('experience', index)} className="text-red-500 justify-self-end md:col-span-2"><Trash2 size={18} /></button>
                    </div>
                ))}
                <button onClick={() => addDynamicItem('experience')} className="text-blue-600 font-semibold mt-4 flex items-center"><Plus size={18} className="mr-1" /> Add Experience</button>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Education</h3>
                {cvData.education.map((edu, index) => (
                     <div key={edu.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
                        <input name="degree" value={edu.degree} onChange={(e) => handleDynamicChange('education', index, e)} placeholder="Degree/Certificate" className="w-full p-2 border rounded" />
                        <input name="school" value={edu.school} onChange={(e) => handleDynamicChange('education', index, e)} placeholder="School/University" className="w-full p-2 border rounded" />
                        <input name="location" value={edu.location} onChange={(e) => handleDynamicChange('education', index, e)} placeholder="Location" className="w-full p-2 border rounded" />
                        <div className="flex gap-2">
                           <input type="text" name="startDate" value={edu.startDate} onChange={(e) => handleDynamicChange('education', index, e)} placeholder="Start Date" className="w-full p-2 border rounded" />
                           <input type="text" name="endDate" value={edu.endDate} onChange={(e) => handleDynamicChange('education', index, e)} placeholder="End Date" className="w-full p-2 border rounded" />
                        </div>
                        <button onClick={() => removeDynamicItem('education', index)} className="text-red-500 justify-self-end md:col-span-2"><Trash2 size={18} /></button>
                    </div>
                ))}
                 <button onClick={() => addDynamicItem('education')} className="text-blue-600 font-semibold mt-4 flex items-center"><Plus size={18} className="mr-1" /> Add Education</button>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Skills</h3>
                {cvData.skills.map((skill, index) => (
                     <div key={skill.id} className="flex items-center gap-4 mb-2">
                        <input name="name" value={skill.name} onChange={(e) => handleDynamicChange('skills', index, e)} placeholder="e.g. React" className="flex-grow p-2 border rounded" />
                        <button onClick={() => removeDynamicItem('skills', index)} className="text-red-500"><Trash2 size={18} /></button>
                    </div>
                ))}
                 <button onClick={() => addDynamicItem('skills')} className="text-blue-600 font-semibold mt-2 flex items-center"><Plus size={18} className="mr-1" /> Add Skill</button>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Portfolio / Projects</h3>
                {cvData.portfolio.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-1 gap-4 border-t pt-4 mt-4">
                        <input name="title" value={item.title} onChange={(e) => handleDynamicChange('portfolio', index, e)} placeholder="Project Title" className="w-full p-2 border rounded" />
                        <input name="link" value={item.link} onChange={(e) => handleDynamicChange('portfolio', index, e)} placeholder="Project Link" className="w-full p-2 border rounded" />
                        <textarea name="description" value={item.description} onChange={(e) => handleDynamicChange('portfolio', index, e)} placeholder="Project Description" className="w-full p-2 border rounded" rows={2}></textarea>
                        <button onClick={() => removeDynamicItem('portfolio', index)} className="text-red-500 justify-self-end"><Trash2 size={18} /></button>
                    </div>
                ))}
                <button onClick={() => addDynamicItem('portfolio')} className="text-blue-600 font-semibold mt-4 flex items-center"><Plus size={18} className="mr-1" /> Add Project</button>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">References</h3>
                {cvData.references.map((ref, index) => (
                     <div key={ref.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 mt-4">
                        <input name="name" value={ref.name} onChange={(e) => handleDynamicChange('references', index, e)} placeholder="Reference Name" className="w-full p-2 border rounded" />
                        <input name="contact" value={ref.contact} onChange={(e) => handleDynamicChange('references', index, e)} placeholder="Contact (Email/Phone)" className="w-full p-2 border rounded" />
                        <div className="flex items-center gap-2">
                            <input name="relation" value={ref.relation} onChange={(e) => handleDynamicChange('references', index, e)} placeholder="Relationship" className="w-full p-2 border rounded" />
                            <button onClick={() => removeDynamicItem('references', index)} className="text-red-500"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
                 <button onClick={() => addDynamicItem('references')} className="text-blue-600 font-semibold mt-4 flex items-center"><Plus size={18} className="mr-1" /> Add Reference</button>
            </div>

            <div className="flex justify-end mt-8">
                <button onClick={nextStep} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Next: Optimize CV
                </button>
            </div>
        </motion.div>
    );
};

export default Step1_CreateCV;
