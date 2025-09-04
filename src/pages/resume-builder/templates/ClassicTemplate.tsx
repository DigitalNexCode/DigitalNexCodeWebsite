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

const Section: React.FC<{ title: string; icon: React.ElementType; color: string; children: React.ReactNode }> = ({ title, icon: Icon, color, children }) => (
    <section className="mb-6">
        <h2 className="text-lg font-bold uppercase flex items-center pb-1 mb-2" style={{ borderBottom: `2px solid ${color}`, color }}>
            <Icon size={16} className="mr-2" />
            {title}
        </h2>
        {children}
    </section>
);

const ClassicTemplate = forwardRef<HTMLDivElement, TemplateProps>(({ data, customization }, ref) => {
    const { personalInfo, summary, experience, education, skills, references, portfolio } = data;
    const { accentColor, font } = customization;
    const fontFamily = fontFamilies[font];

    return (
        <div ref={ref} className="bg-white p-8 shadow-lg" id="resume-preview" style={{ fontFamily }}>
            <header className="text-center mb-6 border-b-2 pb-4" style={{ borderColor: accentColor }}>
                <h1 className="text-4xl font-bold" style={{ color: accentColor }}>{personalInfo.fullName || 'Your Name'}</h1>
                <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
                    {personalInfo.email && <div className="flex items-center"><Mail size={12} className="mr-1.5" />{personalInfo.email}</div>}
                    {personalInfo.phone && <div className="flex items-center"><Phone size={12} className="mr-1.5" />{personalInfo.phone}</div>}
                    {personalInfo.address && <div className="flex items-center"><MapPin size={12} className="mr-1.5" />{personalInfo.address}</div>}
                    {personalInfo.link && <div className="flex items-center"><Globe size={12} className="mr-1.5" />{personalInfo.link}</div>}
                </div>
            </header>

            <main className="text-sm">
                {summary && (
                    <Section title="Summary" icon={User} color={accentColor}>
                        <p className="text-gray-700">{summary}</p>
                    </Section>
                )}

                {experience.length > 0 && (
                    <Section title="Work Experience" icon={Briefcase} color={accentColor}>
                        {experience.map(exp => (
                            <div key={exp.id} className="mb-4 break-inside-avoid">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-base">{exp.jobTitle || 'Job Title'}</h3>
                                    <p className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</p>
                                </div>
                                <p className="text-sm italic text-gray-700">{exp.company || 'Company'}, {exp.location || 'Location'}</p>
                                <p className="mt-1 text-gray-700 whitespace-pre-line">{exp.description}</p>
                            </div>
                        ))}
                    </Section>
                )}

                {education.length > 0 && (
                     <Section title="Education" icon={BookOpen} color={accentColor}>
                        {education.map(edu => (
                            <div key={edu.id} className="mb-3 break-inside-avoid">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-base">{edu.degree || 'Degree'}</h3>
                                    <p className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</p>
                                </div>
                                <p className="text-sm italic text-gray-700">{edu.school || 'School'}, {edu.location || 'Location'}</p>
                            </div>
                        ))}
                    </Section>
                )}

                {portfolio.length > 0 && (
                    <Section title="Portfolio" icon={LinkIcon} color={accentColor}>
                        {portfolio.map(item => (
                            <div key={item.id} className="mb-4 break-inside-avoid">
                                <h3 className="font-semibold text-base">{item.title}</h3>
                                {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs italic" style={{color: accentColor}}>{item.link}</a>}
                                <p className="mt-1 text-gray-700 whitespace-pre-line">{item.description}</p>
                            </div>
                        ))}
                    </Section>
                )}

                {skills.length > 0 && (
                    <Section title="Skills" icon={Star} color={accentColor}>
                        <p className="text-gray-700">{skills.map(skill => skill.name).join(' • ')}</p>
                    </Section>
                )}
                
                {references.length > 0 && (
                    <Section title="References" icon={Award} color={accentColor}>
                        {references.map(ref => (
                             <div key={ref.id} className="mb-2 break-inside-avoid">
                                <p className="text-gray-700"><strong>{ref.name}</strong> ({ref.relation}) - {ref.contact}</p>
                            </div>
                        ))}
                    </Section>
                )}
            </main>
        </div>
    );
});

export default ClassicTemplate;
