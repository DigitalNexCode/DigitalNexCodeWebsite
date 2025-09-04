import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Video, MessageCircle, Calendar, ArrowRight, ArrowLeft, Send } from 'lucide-react';

const steps = [
  { id: 1, name: 'Personal Details' },
  { id: 2, name: 'Consultation Details' },
  { id: 3, name: 'Project Overview' },
  { id: 4, name: 'Confirmation' },
];

const BookConsultation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    consultationType: 'Video Call',
    preferredDate: '',
    preferredTime: '',
    projectDescription: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, consultationType: e.target.value });
  };

  const nextStep = () => setCurrentStep(prev => (prev < steps.length ? prev + 1 : prev));
  const prevStep = () => setCurrentStep(prev => (prev > 1 ? prev - 1 : prev));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = 'osetshedi1900@gmail.com';
    const subject = `New Consultation Booking from ${formData.name}`;
    const body = `
      A new consultation has been booked with the following details:

      Personal Details:
      - Name: ${formData.name}
      - Email: ${formData.email}
      - Phone: ${formData.phone}

      Consultation Details:
      - Type: ${formData.consultationType}
      - Preferred Date: ${formData.preferredDate}
      - Preferred Time: ${formData.preferredTime}

      Project Overview:
      ${formData.projectDescription}
    `;
    
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setIsSubmitted(true);
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Step 1: Your Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                 <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                 <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Step 2: Consultation Details</h3>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type *</label>
                    <div className="flex space-x-4">
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer flex-1 ${formData.consultationType === 'Video Call' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                            <input type="radio" name="consultationType" value="Video Call" checked={formData.consultationType === 'Video Call'} onChange={handleRadioChange} className="hidden" />
                            <Video className="h-6 w-6 mr-3 text-blue-600" />
                            <span className="font-medium">Video Call</span>
                        </label>
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer flex-1 ${formData.consultationType === 'WhatsApp Call' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                            <input type="radio" name="consultationType" value="WhatsApp Call" checked={formData.consultationType === 'WhatsApp Call'} onChange={handleRadioChange} className="hidden" />
                            <MessageCircle className="h-6 w-6 mr-3 text-green-500" />
                            <span className="font-medium">WhatsApp Call</span>
                        </label>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                        <input type="time" name="preferredTime" value={formData.preferredTime} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Step 3: Project Overview</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tell us about your project *</label>
              <textarea name="projectDescription" value={formData.projectDescription} onChange={handleInputChange} required rows={8} className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Describe your project, goals, and any specific requirements..."></textarea>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Step 4: Review Your Details</h3>
            <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                <div><strong>Name:</strong> {formData.name}</div>
                <div><strong>Email:</strong> {formData.email}</div>
                <div><strong>Phone:</strong> {formData.phone || 'N/A'}</div>
                <hr/>
                <div><strong>Consultation Type:</strong> {formData.consultationType}</div>
                <div><strong>Preferred Date:</strong> {formData.preferredDate || 'N/A'}</div>
                <div><strong>Preferred Time:</strong> {formData.preferredTime || 'N/A'}</div>
                <hr/>
                <div><strong>Project Overview:</strong> <p className="mt-1 text-gray-600">{formData.projectDescription}</p></div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl md:text-5xl font-bold mb-4">Book a Free Consultation</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-xl text-blue-100 max-w-2xl mx-auto">Let's discuss your project and how we can help you achieve your goals.</motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                {isSubmitted ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                        <Send className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                        <p className="text-gray-600">Your consultation request has been prepared. Please check your email client to send it. We look forward to speaking with you!</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-8">
                            <div className="flex justify-between items-center">
                                {steps.map(step => (
                                    <div key={step.id} className={`flex-1 text-center ${step.id <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                                        <div className={`w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center font-bold ${step.id <= currentStep ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
                                            {step.id}
                                        </div>
                                        <p className="text-xs mt-2 hidden sm:block">{step.name}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="relative mt-2">
                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200"></div>
                                <motion.div 
                                    className="absolute top-1/2 left-0 h-0.5 bg-blue-600"
                                    animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                                    transition={{ type: 'spring', stiffness: 100 }}
                                ></motion.div>
                            </div>
                        </div>
                        
                        <AnimatePresence mode="wait">
                            <div key={currentStep}>
                                {renderStep()}
                            </div>
                        </AnimatePresence>

                        <div className="mt-8 flex justify-between">
                            {currentStep > 1 && (
                                <motion.button type="button" onClick={prevStep} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold flex items-center">
                                    <ArrowLeft className="h-5 w-5 mr-2" />
                                    Back
                                </motion.button>
                            )}
                            <div className="flex-grow"></div>
                            {currentStep < steps.length ? (
                                <motion.button type="button" onClick={nextStep} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center">
                                    Next
                                    <ArrowRight className="h-5 w-5 ml-2" />
                                </motion.button>
                            ) : (
                                <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center">
                                    Submit & Send Email
                                    <Send className="h-5 w-5 ml-2" />
                                </motion.button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
      </section>
    </div>
  );
};

export default BookConsultation;
