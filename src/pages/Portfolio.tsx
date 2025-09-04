import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Filter } from 'lucide-react';

const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [projects, setProjects] = useState<any[]>([]);

  const categories = ['All', 'Web Development', 'Business Tools', 'Cybersecurity'];

  // Mock data - In a real app, you'd fetch from GitHub API
  const mockProjects = [
    {
      id: 1,
      name: 'E-Commerce Platform',
      description: 'Full-featured online store with payment integration and inventory management.',
      category: 'Web Development',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
      github: 'https://github.com/digitalnexcode/ecommerce-platform',
      demo: 'https://demo.digitalnexcode.com/ecommerce'
    },
    {
      id: 2,
      name: 'Business Analytics Dashboard',
      description: 'Comprehensive dashboard for business intelligence and data visualization.',
      category: 'Business Tools',
      technologies: ['Vue.js', 'D3.js', 'Python', 'PostgreSQL'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
      github: 'https://github.com/digitalnexcode/analytics-dashboard',
      demo: 'https://demo.digitalnexcode.com/analytics'
    },
    {
      id: 3,
      name: 'Security Audit Tool',
      description: 'Automated security scanning and vulnerability assessment tool.',
      category: 'Cybersecurity',
      technologies: ['Python', 'Flask', 'SQLite', 'OpenVAS'],
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop',
      github: 'https://github.com/digitalnexcode/security-audit',
      demo: null
    },
    {
      id: 4,
      name: 'Project Management System',
      description: 'Collaborative project management platform with real-time updates.',
      category: 'Business Tools',
      technologies: ['React', 'TypeScript', 'Firebase', 'Material-UI'],
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop',
      github: 'https://github.com/digitalnexcode/project-manager',
      demo: 'https://demo.digitalnexcode.com/projects'
    },
    {
      id: 5,
      name: 'Restaurant Website',
      description: 'Modern restaurant website with online reservations and menu management.',
      category: 'Web Development',
      technologies: ['React', 'Tailwind CSS', 'Node.js', 'Express'],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop',
      github: 'https://github.com/digitalnexcode/restaurant-site',
      demo: 'https://demo.digitalnexcode.com/restaurant'
    },
    {
      id: 6,
      name: 'Network Monitor',
      description: 'Real-time network monitoring and intrusion detection system.',
      category: 'Cybersecurity',
      technologies: ['Python', 'Scapy', 'Redis', 'Docker'],
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop',
      github: 'https://github.com/digitalnexcode/network-monitor',
      demo: null
    }
  ];

  useEffect(() => {
    // Simulate API call
    setProjects(mockProjects);
  }, []);

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Portfolio</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Explore our latest projects and see how we've helped businesses transform their digital presence.
            </p>
            <a
              href="https://github.com/digitalnexcode"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Github className="h-5 w-5 mr-2" />
              Visit Our GitHub
            </a>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Filter className="h-6 w-6 text-gray-600 mr-2 hidden sm:block" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Github className="h-4 w-4 mr-1" />
                      Code
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-600 text-lg">No projects found in this category.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* GitHub CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Github className="h-16 w-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Our Open Source Work
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Check out our GitHub repository for more projects, code samples, and contributions to the developer community.
            </p>
            <a
              href="https://github.com/digitalnexcode"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Github className="h-5 w-5 mr-2" />
              Visit GitHub Profile
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
