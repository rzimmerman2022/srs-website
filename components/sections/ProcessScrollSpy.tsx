'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ProcessStep } from './ProcessTimeline';

interface ProcessScrollSpyProps {
    steps: ProcessStep[];
}

export default function ProcessScrollSpy({ steps }: ProcessScrollSpyProps) {
    const [activeStep, setActiveStep] = useState<number>(1);
    const totalSteps = steps.length;

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
            <div
                className="lg:hidden sticky top-20 z-30 glass p-4 rounded-xl shadow-lg border border-sand-100 mb-8 flex items-center justify-between"
                role="status"
                aria-live="polite"
                aria-label={`Currently viewing step ${activeStep} of ${totalSteps}`}
            >
                <span className="text-sm font-bold text-charcoal/80 uppercase tracking-wider">Current Step</span>
                <div className="flex items-center">
                    <span className="text-2xl font-bold text-navy">{activeStep}</span>
                    <span className="text-charcoal/70 mx-1" aria-hidden="true">/</span>
                    <span className="text-charcoal/70">{totalSteps}</span>
                </div>
            </div>

            {/* Sticky Sidebar Navigation - Glass Effect */}
            <nav
                className="hidden lg:block lg:col-span-4 relative"
                aria-label="Process steps navigation"
            >
                <div className="sticky top-32 glass rounded-2xl p-4 shadow-premium">
                    <ul className="space-y-2" role="list">
                        {steps.map((step) => (
                            <li key={`nav-step-${step.number}`}>
                                <button
                                    onClick={() => scrollToStep(step.number)}
                                    className={cn(
                                        'w-full text-left px-6 py-4 rounded-lg transition-all duration-300 flex items-center group focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2',
                                        activeStep === step.number
                                            ? 'bg-navy text-white shadow-lg transform scale-105'
                                            : 'hover:bg-sand-50 text-charcoal/80 hover:text-navy'
                                    )}
                                    aria-current={activeStep === step.number ? 'step' : undefined}
                                    aria-label={`Go to step ${step.number} of ${totalSteps}: ${step.title}`}
                                >
                                    <span
                                        className={cn(
                                            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 transition-colors',
                                            activeStep === step.number
                                                ? 'bg-gold text-navy'
                                                : 'bg-gray-200 text-charcoal/80 group-hover:bg-gold/20 group-hover:text-navy'
                                        )}
                                        aria-hidden="true"
                                    >
                                        {step.number}
                                    </span>
                                    <span className="font-medium truncate">{step.title}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-24">
                {steps.map((step, index) => (
                    <article
                        key={`content-step-${step.number}`}
                        id={`step-${step.number}`}
                        className="scroll-mt-32 relative group"
                        aria-labelledby={`step-${step.number}-heading`}
                    >
                        {/* Connector Line */}
                        {index !== steps.length - 1 && (
                            <div className="absolute left-8 top-20 bottom-[-6rem] w-0.5 bg-gradient-to-b from-gold to-gold/20 lg:hidden" aria-hidden="true" />
                        )}

                        {/* Glass Card */}
                        <div className="glass rounded-2xl p-8 md:p-12 shadow-premium border border-sand-100 relative overflow-hidden transition-all duration-500 hover:shadow-premium-hover">
                            {/* Decorative Background Number */}
                            <div className="absolute -right-4 -top-4 text-[12rem] font-serif font-bold text-sand-100/50 pointer-events-none select-none leading-none" aria-hidden="true">
                                {step.number}
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center mb-6">
                                    <span className="w-16 h-16 rounded-2xl bg-navy text-gold flex items-center justify-center text-2xl font-bold shadow-lg mr-6 flex-shrink-0" aria-hidden="true">
                                        {step.number}
                                    </span>
                                    <h3 id={`step-${step.number}-heading`} className="text-3xl font-serif font-bold text-navy">
                                        <span className="sr-only">Step {step.number} of {totalSteps}: </span>
                                        {step.title}
                                    </h3>
                                </div>

                                <p className="text-xl text-charcoal/80 mb-8 leading-relaxed">
                                    {step.description}
                                </p>

                                <div className="glass-dark rounded-xl p-6">
                                    <h4 className="font-semibold text-gold mb-4 flex items-center">
                                        <span className="w-1.5 h-1.5 bg-gold rounded-full mr-2" aria-hidden="true"></span>
                                        Key Actions & Deliverables
                                    </h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {step.details?.map((detail) => {
                                            // Generate stable key from detail text
                                            const detailKey = detail.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 40);
                                            return (
                                                <li key={`step-${step.number}-${detailKey}`} className="flex items-start text-sm text-sand-100">
                                                    <span className="text-gold mr-2 mt-1" aria-hidden="true">✓</span>
                                                    {detail}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
