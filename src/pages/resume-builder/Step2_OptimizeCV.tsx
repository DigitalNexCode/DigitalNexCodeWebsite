import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CVData, JobDetails, AISuggestions } from './types';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';
import { BrainCircuit, Check, Lightbulb, Plus, Sparkles, Loader, ArrowRight } from 'lucide-react';

interface Step2Props {
    cvData: CVData;
    setCvData: React.Dispatch<React.SetStateAction<CVData>>;
    jobDetails: JobDetails;
    setJobDetails: React.Dispatch<React.SetStateAction<JobDetails>>;
    aiSuggestions: AISuggestions | null;
    setAiSuggestions: React.Dispatch<React.SetStateAction<AISuggestions | null>>;
    prevStep: () => void;
    nextStep: () => void;
}

const analysisSteps = [
    "Parsing job description...",
    "Analyzing keywords and skills...",
    "Reviewing your experience...",
    "Comparing skills gap...",
    "Generating phrasing suggestions...",
    "Finalizing recommendations..."
];

const Step2_OptimizeCV: React.FC<Step2Props> = ({ cvData, setCvData, jobDetails, setJobDetails, aiSuggestions, setAiSuggestions, prevStep, nextStep }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            interval = setInterval(() => {
                setCurrentAnalysisStep(prev => (prev + 1) % analysisSteps.length);
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleJobDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setJobDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAnalyze = async () => {
        if (!jobDetails.jobDescription) {
            toast.error('Please provide a job description.');
            return;
        }
        setIsLoading(true);
        setCurrentAnalysisStep(0);
        setAiSuggestions(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout
        
        try {
            const { data, error } = await supabase.functions.invoke('optimize-resume', {
                body: { cvData, jobDetails },
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
            if (error) throw error;
            
            setAiSuggestions(data.suggestions);
            toast.success('AI analysis complete!');
        } catch (error: any) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                toast.error('The AI analysis timed out. The request was complex. Please try again.');
            } else {
                toast.error(`Analysis failed: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const applyAllSuggestions = () => {
        if (!aiSuggestions) return;
        
        let updatedCvData = JSON.parse(JSON.stringify(cvData)); // Deep copy

        // Apply experience phrasing suggestions
        aiSuggestions.experience_phrasing.forEach(suggestion => {
            updatedCvData.experience.forEach((exp: any, index: number) => {
                if (exp.description.includes(suggestion.original)) {
                    updatedCvData.experience[index].description = exp.description.replace(suggestion.original, suggestion.suggested);
                }
            });
        });

        // Combine skills and keywords, then add them
        const skillsToAdd = new Set([
            ...aiSuggestions.keywords_to_add,
            ...aiSuggestions.skills_to_highlight
        ]);

        const existingSkills = new Set(updatedCvData.skills.map((s: any) => s.name.toLowerCase()));
        
        skillsToAdd.forEach(skillName => {
            if (!existingSkills.has(skillName.toLowerCase())) {
                updatedCvData.skills.push({ id: Date.now().toString() + skillName, name: skillName });
            }
        });

        setCvData(updatedCvData);
        setAiSuggestions(null); // Clear suggestions after applying
        toast.success('All suggestions have been applied!');
    };

    return (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">
            <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Job-Specific Optimization</h3>
                <p className="text-sm text-gray-600 mb-4">Paste the job title and description below to get AI-powered suggestions on how to tailor your CV.</p>
                <div className="space-y-4">
                    <input name="jobTitle" value={jobDetails.jobTitle} onChange={handleJobDetailsChange} placeholder="Job Title" className="w-full p-2 border rounded" />
                    <textarea name="jobDescription" value={jobDetails.jobDescription} onChange={handleJobDetailsChange} placeholder="Paste job description here..." className="w-full p-2 border rounded" rows={8}></textarea>
                </div>
                <button onClick={handleAnalyze} disabled={isLoading} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center disabled:opacity-50">
                    <BrainCircuit size={18} className="mr-2" />
                    {isLoading ? 'Analyzing...' : 'Analyze with AI'}
                </button>
            </div>

            {isLoading && (
                <div className="p-6 bg-white rounded-lg shadow text-center">
                    <h4 className="text-lg font-semibold mb-4 text-gray-800">AI is at work...</h4>
                    <div className="space-y-3">
                        {analysisSteps.map((step, index) => (
                            <div key={step} className={`flex items-center justify-center transition-all duration-300 ${index > currentAnalysisStep ? 'opacity-40' : 'opacity-100'}`}>
                                {index < currentAnalysisStep ? <Check className="h-5 w-5 text-green-500 mr-3" /> : <Loader className={`h-5 w-5 text-blue-500 mr-3 ${index === currentAnalysisStep ? 'animate-spin' : ''}`} />}
                                <span className={`${index === currentAnalysisStep ? 'font-semibold text-blue-600' : 'text-gray-600'}`}>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!isLoading && aiSuggestions && (
                <div className="p-6 bg-white rounded-lg shadow space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">AI Analysis Complete!</h3>
                            <p className="text-sm text-gray-500">Review the suggestions below and apply them to your CV.</p>
                        </div>
                        <button onClick={applyAllSuggestions} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 text-sm flex items-center">
                            <Sparkles size={16} className="mr-2" />
                            Apply All Suggestions
                        </button>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold flex items-center"><Lightbulb size={16} className="mr-2 text-blue-500" /> Overall Summary</h4>
                        <p className="text-sm text-gray-700 mt-1">{aiSuggestions.overall_summary}</p>
                    </div>

                    {aiSuggestions.skills_to_highlight.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Skills to Highlight</h4>
                            <div className="flex flex-wrap gap-2">
                                {aiSuggestions.skills_to_highlight.map(skill => (
                                    <span key={skill} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center"><Plus size={12} className="mr-1"/>{skill}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {aiSuggestions.keywords_to_add.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Missing Keywords to Add</h4>
                            <div className="flex flex-wrap gap-2">
                                {aiSuggestions.keywords_to_add.map(keyword => (
                                    <span key={keyword} className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center"><Plus size={12} className="mr-1"/>{keyword}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {aiSuggestions.experience_phrasing.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Experience Phrasing Suggestions</h4>
                            <div className="space-y-3">
                            {aiSuggestions.experience_phrasing.map((phrase, index) => (
                                <div key={index} className="text-sm border p-3 rounded-lg bg-gray-50">
                                    <p className="text-gray-500 "><strong className="text-red-500">Original:</strong> {phrase.original}</p>
                                    <p className="text-green-700 mt-1 flex items-start"><strong className="text-green-600 mr-1">Suggested:</strong> <span>{phrase.suggested}</span></p>
                                </div>
                            ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex justify-between mt-8">
                <button onClick={prevStep} className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">Back</button>
                <button onClick={nextStep} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center">
                    Next: Customize & Download <ArrowRight className="ml-2 h-5 w-5" />
                </button>
            </div>
        </motion.div>
    );
};

export default Step2_OptimizeCV;
