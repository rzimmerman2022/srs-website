'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ProcessStep } from './ProcessTimeline';

interface ProcessScrollSpyProps {
    steps: ProcessStep[];
}

export default function ProcessScrollSpy({ steps }: ProcessScrollSpyProps) {
    const [activeStep, setActiveStep] = useState<number>(1);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        steps.forEach((step) => {
            const element = document.getElementById(`step-${step.number}`);
            if (element) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        if (entries[0].isIntersecting) {
                            setActiveStep(step.number);
                        }
                    },
                    { threshold: 0.5, rootMargin: '-40% 0px -40% 0px' }
                );
                observer.observe(element);
                observers.push(observer);
            }
        });

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, [steps]);

    const scrollToStep = (stepNumber: number) => {
        const element = document.getElementById(`step-${stepNumber}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveStep(stepNumber);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
            {/* Mobile Sticky Step Counter - Glass Effect */}
            <div className="lg:hidden sticky top-20 z-30 glass p-4 rounded-xl shadow-lg border border-sand-100 mb-8 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Current Step</span>
                <div className="flex items-center">
                    <span className="text-2xl font-bold text-navy">{activeStep}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-gray-400">{steps.length}</span>
                </div>
            </div>

            {/* Sticky Sidebar Navigation - Glass Effect */}
            <div className="hidden lg:block lg:col-span-4 relative">
                <div className="sticky top-32 glass rounded-2xl p-4 shadow-premium">
                    <div className="space-y-2">
                        {steps.map((step) => (
                            <button
                                key={step.number}
                                onClick={() => scrollToStep(step.number)}
                                className={cn(
                                    'w-full text-left px-6 py-4 rounded-lg transition-all duration-300 flex items-center group',
                                    activeStep === step.number
                                        ? 'bg-navy text-white shadow-lg transform scale-105'
                                        : 'hover:bg-sand-50 text-gray-600 hover:text-navy'
                                )}
                            >
                                <span
                                    className={cn(
                                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 transition-colors',
                                        activeStep === step.number
                                            ? 'bg-gold text-navy'
                                            : 'bg-gray-200 text-gray-500 group-hover:bg-gold/20 group-hover:text-navy'
                                    )}
                                >
                                    {step.number}
                                </span>
                                <span className="font-medium truncate">{step.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-24">
                {steps.map((step, index) => (
                    <div
                        key={step.number}
                        id={`step-${step.number}`}
                        className="scroll-mt-32 relative group"
                    >
                        {/* Connector Line */}
                        {index !== steps.length - 1 && (
                            <div className="absolute left-8 top-20 bottom-[-6rem] w-0.5 bg-gradient-to-b from-gold to-gold/20 lg:hidden" />
                        )}

                        {/* Glass Card */}
                        <div className="glass rounded-2xl p-8 md:p-12 shadow-premium border border-sand-100 relative overflow-hidden transition-all duration-500 hover:shadow-premium-hover">
                            {/* Decorative Background Number */}
                            <div className="absolute -right-4 -top-4 text-[12rem] font-serif font-bold text-sand-100/50 pointer-events-none select-none leading-none">
                                {step.number}
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center mb-6">
                                    <span className="w-16 h-16 rounded-2xl bg-navy text-gold flex items-center justify-center text-2xl font-bold shadow-lg mr-6 flex-shrink-0">
                                        {step.number}
                                    </span>
                                    <h3 className="text-3xl font-serif font-bold text-navy">
                                        {step.title}
                                    </h3>
                                </div>

                                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                    {step.description}
                                </p>

                                <div className="glass-dark rounded-xl p-6">
                                    <h4 className="font-semibold text-gold mb-4 flex items-center">
                                        <span className="w-1.5 h-1.5 bg-gold rounded-full mr-2"></span>
                                        Key Actions & Deliverables
                                    </h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {step.details?.map((detail, i) => (
                                            <li key={i} className="flex items-start text-sm text-sand-100">
                                                <span className="text-gold mr-2 mt-1">✓</span>
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
