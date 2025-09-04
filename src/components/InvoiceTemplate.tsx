import React, { forwardRef } from 'react';

interface InvoiceData {
    fromName: string;
    fromAddress: string;
    toName: string;
    toAddress: string;
    invoiceNumber: string;
    date: string;
    dueDate: string;
    items: { description: string; quantity: number; price: number }[];
    notes: string;
    taxRate: number;
    discountRate: number;
    logo: string;
    bankDetails: string;
    accentColor: string;
    isMonthly: boolean;
}

interface Props {
    data: InvoiceData;
}

const InvoiceTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
    const subtotal = data.items.reduce((acc, item) => acc + Number(item.quantity) * Number(item.price), 0);
    const discount = (subtotal * data.discountRate) / 100;
    const tax = ((subtotal - discount) * data.taxRate) / 100;
    const total = subtotal - discount + tax;

    return (
        <div ref={ref} className="p-10 bg-white text-gray-800 font-sans text-sm">
            {/* Header */}
            <div className="flex justify-between items-start mb-10">
                <div>
                    {data.logo ? (
                        <img src={data.logo} alt="Company Logo" className="h-16 max-w-xs mb-4" />
                    ) : (
                        <h1 className="text-3xl font-bold" style={{ color: data.accentColor }}>{data.fromName}</h1>
                    )}
                    <p className="text-xs text-gray-500 whitespace-pre-line">{data.fromAddress}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-light uppercase" style={{ color: data.accentColor }}>Invoice</h2>
                    <p className="text-xs mt-2"># {data.invoiceNumber}</p>
                </div>
            </div>

            {/* Bill To and Dates */}
            <div className="flex justify-between mb-10">
                <div>
                    <h3 className="font-semibold text-gray-500 mb-1">BILL TO</h3>
                    <p className="font-bold">{data.toName || 'Client Name'}</p>
                    <p className="text-xs whitespace-pre-line">{data.toAddress || 'Client Address'}</p>
                </div>
                <div className="text-right">
                    <div className="mb-2">
                        <span className="font-semibold text-gray-500">Date: </span>
                        <span>{new Date(data.date).toLocaleDateString()}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-500">Due Date: </span>
                        <span>{new Date(data.dueDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-10">
                <thead>
                    <tr style={{ backgroundColor: data.accentColor, color: 'white' }}>
                        <th className="text-left font-semibold uppercase p-2">Description</th>
                        <th className="text-right font-semibold uppercase p-2">Qty</th>
                        <th className="text-right font-semibold uppercase p-2">Unit Price</th>
                        <th className="text-right font-semibold uppercase p-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 px-2">{item.description}</td>
                            <td className="text-right py-3 px-2">{item.quantity}</td>
                            <td className="text-right py-3 px-2">R{Number(item.price).toFixed(2)}</td>
                            <td className="text-right py-3 px-2">R{(Number(item.quantity) * Number(item.price)).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-between items-start">
                <div className="w-1/2">
                    {data.bankDetails && (
                        <>
                            <h4 className="font-semibold text-gray-500 mb-1">Bank Details</h4>
                            <p className="text-xs text-gray-600 whitespace-pre-line">{data.bankDetails}</p>
                        </>
                    )}
                </div>
                <div className="w-full max-w-xs">
                    <div className="flex justify-between text-gray-600 mb-2">
                        <span>Subtotal</span>
                        <span>R{subtotal.toFixed(2)}</span>
                    </div>
                    {data.discountRate > 0 && (
                        <div className="flex justify-between text-gray-600 mb-2">
                            <span>Discount ({data.discountRate}%)</span>
                            <span>-R{discount.toFixed(2)}</span>
                        </div>
                    )}
                    {data.taxRate > 0 && (
                         <div className="flex justify-between text-gray-600 mb-2">
                            <span>Tax ({data.taxRate}%)</span>
                            <span>R{tax.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-xl pt-2 mt-2" style={{ borderTop: `2px solid ${data.accentColor}`, color: data.accentColor }}>
                        <span>Total</span>
                        <span>R{total.toFixed(2)}</span>
                    </div>
                    {data.isMonthly && (
                        <div className="flex justify-between text-gray-700 mt-2">
                            <span>Monthly Installment (12 months)</span>
                            <span className="font-semibold">R{(total / 12).toFixed(2)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-10 border-t pt-5">
                {data.notes && (
                    <div className="mb-5">
                        <h4 className="font-semibold text-gray-500 mb-1">Notes</h4>
                        <p className="text-xs text-gray-600">{data.notes}</p>
                    </div>
                )}
                <p className="text-center text-xs text-gray-400">Powered by DigitalNexCode</p>
            </div>
        </div>
    );
});

export default InvoiceTemplate;
