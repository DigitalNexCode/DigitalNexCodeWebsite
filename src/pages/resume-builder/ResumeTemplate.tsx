import React, { forwardRef } from 'react';
import { CVData } from './types';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface ResumeTemplateProps {
    data: CVData;
}

const ResumeTemplate = forwardRef<HTMLDivElement, ResumeTemplateProps>(({ data }, ref) => {
    return (
        <div ref={ref} className="bg-white p-8 font-sans text-sm text-gray-800 shadow-lg" id="resume-preview">
            {/* Header */}
            <header className="text-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900">{data.personalInfo.fullName || 'Your Name'}</h1>
                <div className="flex justify-center items-center space-x-4 mt-2 text-xs text-gray-600">
                    {data.personalInfo.email && <div className="flex items-center"><Mail size={12} className="mr-1.5" />{data.personalInfo.email}</div>}
                    {data.personalInfo.phone && <div className="flex items-center"><Phone size={12} className="mr-1.5" />{data.personalInfo.phone}</div>}
                    {data.personalInfo.address && <div className="flex items-center"><MapPin size={12} className="mr-1.5" />{data.personalInfo.address}</div>}
                    {data.personalInfo.link && <div className="flex items-center"><Globe size={12} className="mr-1.5" />{data.personalInfo.link}</div>}
                </div>
            </header>

            <main>
                {/* Summary */}
                {data.summary && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b-2 border-gray-200 pb-1 mb-2">Summary</h2>
                        <p className="text-gray-700">{data.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b-2 border-gray-200 pb-1 mb-2">Work Experience</h2>
                        {data.experience.map(exp => (
                            <div key={exp.id} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-base">{exp.jobTitle || 'Job Title'}</h3>
                                    <p className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</p>
                                </div>
                                <p className="text-sm italic text-gray-700">{exp.company || 'Company'}, {exp.location || 'Location'}</p>
                                <p className="mt-1 text-gray-700 whitespace-pre-line">{exp.description}</p>
                            </div>
                        ))}
                    </section>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                     <section className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b-2 border-gray-200 pb-1 mb-2">Education</h2>
                        {data.education.map(edu => (
                            <div key={edu.id} className="mb-3">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-base">{edu.degree || 'Degree'}</h3>
                                    <p className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</p>
                                </div>
                                <p className="text-sm italic text-gray-700">{edu.school || 'School'}, {edu.location || 'Location'}</p>
                            </div>
                        ))}
                    </section>
                )}

                {/* Skills */}
                {data.skills.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold uppercase border-b-2 border-gray-200 pb-1 mb-2">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map(skill => (
                                <span key={skill.id} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
});

export default ResumeTemplate;
