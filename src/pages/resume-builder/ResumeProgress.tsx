import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import { motion } from 'framer-motion';
import { User, Briefcase, BrainCircuit, Check } from 'lucide-react';

interface ResumeProgressProps {
    currentStep: number;
    steps: { name: string; icon: React.ElementType }[];
}

const ResumeProgress: React.FC<ResumeProgressProps> = ({ currentStep, steps }) => {
    const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <div className="w-full mb-12">
            <Progress.Root className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2" value={progressPercentage}>
                <Progress.Indicator
                    className="bg-blue-600 w-full h-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${100 - progressPercentage}%)` }}
                />
            </Progress.Root>
            <div className="flex justify-between mt-2">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber <= currentStep;
                    const isCompleted = stepNumber < currentStep;
                    const Icon = step.icon;

                    return (
                        <div key={step.name} className="flex flex-col items-center w-1/3 text-center">
                            <motion.div
                                animate={isActive ? "active" : "inactive"}
                                variants={{
                                    active: { scale: 1.1, y: -5 },
                                    inactive: { scale: 1, y: 0 },
                                }}
                                className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}
                            >
                                {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                            </motion.div>
                            <p className={`mt-2 text-xs md:text-sm font-medium transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                                {step.name}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResumeProgress;
