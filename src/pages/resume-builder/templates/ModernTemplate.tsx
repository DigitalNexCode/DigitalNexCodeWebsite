import React, { forwardRef } from 'react';
import { CVData, Customization } from '../types';
import { Mail, Phone, MapPin, Globe, Briefcase, BookOpen, Star, User, Award, Link as LinkIcon } from 'lucide-react';

interface TemplateProps {
    data: CVData;
    customization: Customization;
}

const fontFamilies = {
    Inter: "'Inter', sans-serif",
    Merriweather: "'Merriweather', serif",
    Lato: "'Lato', sans-serif",
};

const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest flex items-center mb-3">
            <Icon size={16} className="mr-3" />
            {title}
        </h2>
        {children}
    </section>
);

const ModernTemplate = forwardRef<HTMLDivElement, TemplateProps>(({ data, customization }, ref) => {
    const { personalInfo, summary, experience, education, skills, references, portfolio } = data;
    const { accentColor, font } = customization;
    const fontFamily = fontFamilies[font];

    return (
        <div ref={ref} className="bg-white shadow-lg" id="resume-preview" style={{ fontFamily }}>
            <div className="grid grid-cols-12">
                {/* Left Column */}
                <div className="col-span-4 text-white p-6" style={{ backgroundColor: accentColor }}>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold leading-tight">{personalInfo.fullName || 'Your Name'}</h1>
                        {experience[0]?.jobTitle && <p className="text-lg opacity-90">{experience[0].jobTitle}</p>}
                    </div>
                    
                    <div className="space-y-6 text-sm">
                        <Section title="Contact" icon={User}>
                            <div className="space-y-2 text-xs opacity-90">
                                {personalInfo.email && <div className="flex items-start"><Mail size={12} className="mr-2 mt-0.5 flex-shrink-0" /><span>{personalInfo.email}</span></div>}
                                {personalInfo.phone && <div className="flex items-start"><Phone size={12} className="mr-2 mt-0.5 flex-shrink-0" /><span>{personalInfo.phone}</span></div>}
                                {personalInfo.address && <div className="flex items-start"><MapPin size={12} className="mr-2 mt-0.5 flex-shrink-0" /><span>{personalInfo.address}</span></div>}
                                {personalInfo.link && <div className="flex items-start"><Globe size={12} className="mr-2 mt-0.5 flex-shrink-0" /><span>{personalInfo.link}</span></div>}
                            </div>
                        </Section>
                        
                        {skills.length > 0 && (
                            <Section title="Skills" icon={Star}>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(skill => (
                                        <span key={skill.id} className="bg-white bg-opacity-20 text-white text-xs font-medium px-2.5 py-1 rounded">
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {references.length > 0 && (
                            <Section title="References" icon={Award}>
                                {references.map(ref => (
                                    <div key={ref.id} className="mb-2 text-xs opacity-90">
                                        <p className="font-semibold">{ref.name}</p>
                                        <p>{ref.relation}</p>
                                        <p>{ref.contact}</p>
                                    </div>
                                ))}
                            </Section>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-8 p-6 text-gray-700">
                     {summary && (
                        <section className="mb-6">
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{color: accentColor}}>Summary</h2>
                            <p className="text-sm">{summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{color: accentColor}}>Work Experience</h2>
                            {experience.map(exp => (
                                <div key={exp.id} className="mb-4 break-inside-avoid">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold text-base text-gray-900">{exp.jobTitle || 'Job Title'}</h3>
                                        <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                                    </div>
                                    <p className="text-sm italic">{exp.company || 'Company'}, {exp.location || 'Location'}</p>
                                    <p className="mt-1 text-sm whitespace-pre-line">{exp.description}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {education.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{color: accentColor}}>Education</h2>
                            {education.map(edu => (
                                <div key={edu.id} className="mb-3 break-inside-avoid">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold text-base text-gray-900">{edu.degree || 'Degree'}</h3>
                                        <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                    <p className="text-sm italic">{edu.school || 'School'}, {edu.location || 'Location'}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {portfolio.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{color: accentColor}}>Portfolio</h2>
                            {portfolio.map(item => (
                                <div key={item.id} className="mb-4 break-inside-avoid">
                                    <h3 className="font-semibold text-base text-gray-900">{item.title}</h3>
                                    {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs italic" style={{color: accentColor}}>{item.link}</a>}
                                    <p className="mt-1 text-sm whitespace-pre-line">{item.description}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
});

export default ModernTemplate;
