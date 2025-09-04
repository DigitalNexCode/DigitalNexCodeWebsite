import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Download, FileText, Printer, Upload, Palette, Banknote, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import InvoiceTemplate from '../components/InvoiceTemplate';

const colorOptions = ['#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f97316', '#14b8a6'];

const InvoiceGenerator: React.FC = () => {
    const today = new Date().toISOString().split('T')[0];
    const [invoiceData, setInvoiceData] = useState({
        fromName: 'DigitalNexCode',
        fromAddress: 'Pretoria, South Africa',
        toName: '',
        toAddress: '',
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        date: today,
        dueDate: today,
        items: [{ description: 'Website Development', quantity: 1, price: 5000 }],
        notes: 'Thank you for your business!',
        taxRate: 0,
        discountRate: 0,
        logo: '',
        bankDetails: 'Bank: FNB\nAccount Number: 123456789\nBranch Code: 250655',
        accentColor: '#3b82f6',
        isMonthly: false,
    });

    const invoiceTemplateRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInvoiceData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const items = [...invoiceData.items];
        items[index] = { ...items[index], [name]: value };
        setInvoiceData(prev => ({ ...prev, items }));
    };
    
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setInvoiceData(prev => ({ ...prev, logo: event.target?.result as string }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const addItem = () => {
        setInvoiceData(prev => ({
            ...prev,
            items: [...prev.items, { description: '', quantity: 1, price: 0 }]
        }));
    };

    const removeItem = (index: number) => {
        const items = [...invoiceData.items];
        items.splice(index, 1);
        setInvoiceData(prev => ({ ...prev, items }));
    };

    const handleDownloadPdf = () => {
        const input = invoiceTemplateRef.current;
        if (input) {
            html2canvas(input, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const ratio = canvasWidth / canvasHeight;
                let width = pdfWidth;
                let height = width / ratio;
                if (height > pdfHeight) {
                    height = pdfHeight;
                    width = height * ratio;
                }

                pdf.addImage(imgData, 'PNG', 0, 0, width, height);
                pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
            });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 print:bg-white">
            <section className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-20 print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold mb-6">Free Invoice Generator</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">Create and download professional invoices in seconds. No sign-up required.</motion.p>
                </div>
            </section>

            <section className="py-16 print:py-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Invoice Form */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-lg shadow-lg print:hidden">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><FileText className="mr-3" /> Invoice Details</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="font-semibold mb-2">From</h3>
                                <input name="fromName" value={invoiceData.fromName} onChange={handleInputChange} placeholder="Your Name/Company" className="w-full p-2 border rounded mb-2" />
                                <textarea name="fromAddress" value={invoiceData.fromAddress} onChange={handleInputChange} placeholder="Your Address" className="w-full p-2 border rounded" rows={2}></textarea>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">To</h3>
                                <input name="toName" value={invoiceData.toName} onChange={handleInputChange} placeholder="Client's Name/Company" className="w-full p-2 border rounded mb-2" />
                                <textarea name="toAddress" value={invoiceData.toAddress} onChange={handleInputChange} placeholder="Client's Address" className="w-full p-2 border rounded" rows={2}></textarea>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                             <div>
                                <label className="block text-sm font-medium text-gray-600">Invoice #</label>
                                <input name="invoiceNumber" value={invoiceData.invoiceNumber} onChange={handleInputChange} className="w-full p-2 border rounded" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-600">Date</label>
                                <input type="date" name="date" value={invoiceData.date} onChange={handleInputChange} className="w-full p-2 border rounded" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-600">Due Date</label>
                                <input type="date" name="dueDate" value={invoiceData.dueDate} onChange={handleInputChange} className="w-full p-2 border rounded" />
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-2">Items</h3>
                            {invoiceData.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
                                    <input name="description" value={item.description} onChange={(e) => handleItemChange(index, e)} placeholder="Description" className="col-span-5 p-2 border rounded" />
                                    <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} placeholder="Qty" className="col-span-2 p-2 border rounded text-center" />
                                    <input type="number" name="price" value={item.price} onChange={(e) => handleItemChange(index, e)} placeholder="Price" className="col-span-3 p-2 border rounded text-right" />
                                    <div className="col-span-2 text-right">
                                        <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addItem} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center mt-2"><Plus size={18} className="mr-1" /> Add Item</button>
                        </div>
                        
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Notes</label>
                                <textarea name="notes" value={invoiceData.notes} onChange={handleInputChange} className="w-full p-2 border rounded" rows={3}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Tax Rate (%)</label>
                                <input type="number" name="taxRate" value={invoiceData.taxRate} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" />
                                <label className="block text-sm font-medium text-gray-600">Discount Rate (%)</label>
                                <input type="number" name="discountRate" value={invoiceData.discountRate} onChange={handleInputChange} className="w-full p-2 border rounded" />
                            </div>
                        </div>
                        
                        {/* Options */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Options & Style</h2>
                             <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Logo</label>
                                    <div className="flex items-center space-x-4">
                                        {invoiceData.logo && <img src={invoiceData.logo} alt="logo preview" className="h-10 w-10 object-contain rounded border" />}
                                        <label className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer flex items-center text-sm">
                                            <Upload size={16} className="mr-2" /> Upload Logo
                                            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Bank Details</label>
                                    <textarea name="bankDetails" value={invoiceData.bankDetails} onChange={handleInputChange} placeholder="Your Bank Details" className="w-full p-2 border rounded" rows={3}></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Accent Color</label>
                                    <div className="flex space-x-2">
                                        {colorOptions.map(color => (
                                            <button key={color} onClick={() => setInvoiceData(prev => ({ ...prev, accentColor: color }))} style={{ backgroundColor: color }} className={`w-8 h-8 rounded-full border-2 ${invoiceData.accentColor === color ? 'border-gray-800' : 'border-transparent'}`}></button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input type="checkbox" checked={invoiceData.isMonthly} onChange={(e) => setInvoiceData(prev => ({...prev, isMonthly: e.target.checked}))} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm font-medium text-gray-700">Show 12-Month Payment Plan</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                    </motion.div>

                    {/* Invoice Preview */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="print:w-full">
                        <div className="flex justify-between items-center mb-4 print:hidden">
                            <h2 className="text-2xl font-bold text-gray-800">Preview</h2>
                            <div className="flex space-x-2">
                                <button onClick={handlePrint} className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center">
                                    <Printer size={18} className="mr-2" /> Print
                                </button>
                                <button onClick={handleDownloadPdf} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center">
                                    <Download size={18} className="mr-2" /> Download PDF
                                </button>
                            </div>
                        </div>
                        <div id="invoice-preview-wrapper" className="bg-white p-8 rounded-lg shadow-lg">
                           <InvoiceTemplate ref={invoiceTemplateRef} data={invoiceData} />
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default InvoiceGenerator;
