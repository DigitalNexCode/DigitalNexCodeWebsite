import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CVData, JobDetails, AISuggestions, Customization } from './types';
import Step1_CreateCV from './Step1_CreateCV';
import Step2_OptimizeCV from './Step2_OptimizeCV';
import Step3_DownloadCV from './Step3_DownloadCV';
import ResumeProgress from './ResumeProgress';
import { User, BrainCircuit, Download } from 'lucide-react';

const stepsConfig = [
    { name: 'Create CV', icon: User },
    { name: 'AI Optimize', icon: BrainCircuit },
    { name: 'Customize & Download', icon: Download },
];

const ResumeBuilderPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [cvData, setCvData] = useState<CVData>({
        personalInfo: { fullName: '', email: '', phone: '', address: '', link: '' },
        experience: [],
        education: [],
        skills: [],
        references: [],
        portfolio: [],
        summary: '',
    });
    const [jobDetails, setJobDetails] = useState<JobDetails>({ jobTitle: '', jobDescription: '' });
    const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(null);
    const [customization, setCustomization] = useState<Customization>({
        template: 'Modern',
        accentColor: '#2563eb',
        font: 'Inter',
    });

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, stepsConfig.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1_CreateCV cvData={cvData} setCvData={setCvData} nextStep={nextStep} />;
            case 2:
                return <Step2_OptimizeCV
                    cvData={cvData}
                    setCvData={setCvData}
                    jobDetails={jobDetails}
                    setJobDetails={setJobDetails}
                    aiSuggestions={aiSuggestions}
                    setAiSuggestions={setAiSuggestions}
                    prevStep={prevStep}
                    nextStep={nextStep}
                />;
            case 3:
                return <Step3_DownloadCV 
                    cvData={cvData} 
                    customization={customization}
                    setCustomization={setCustomization}
                    prevStep={prevStep} 
                />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <section className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-20 print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold mb-6">AI-Powered Resume Builder</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                        Craft the perfect CV, get AI-driven suggestions, and land your dream job.
                    </motion.p>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ResumeProgress currentStep={currentStep} steps={stepsConfig} />
                    <AnimatePresence mode="wait">
                        <div key={currentStep}>
                            {renderStep()}
                        </div>
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
};

export default ResumeBuilderPage;
