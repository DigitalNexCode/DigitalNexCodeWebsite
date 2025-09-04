export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    link: string;
}

export interface Experience {
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Education {
    id: string;
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
}

export interface Skill {
    id: string;
    name: string;
}

export interface Reference {
    id: string;
    name: string;
    contact: string;
    relation: string;
}

export interface PortfolioItem {
    id: string;
    title: string;
    link: string;
    description: string;
}

export interface CVData {
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    references: Reference[];
    portfolio: PortfolioItem[];
    summary: string;
}

export interface JobDetails {
    jobTitle: string;
    jobDescription: string;
}

export interface AISuggestions {
    keywords_to_add: string[];
    experience_phrasing: { original: string; suggested: string }[];
    skills_to_highlight: string[];
    overall_summary: string;
}

export interface Customization {
    template: 'Modern' | 'Classic';
    accentColor: string;
    font: 'Inter' | 'Merriweather' | 'Lato';
}
