/**
 * Jackie DeLeon - Career Transition Discovery Questionnaire
 * Elite Protocol Package | December 2025
 */

import { Questionnaire } from './types';

export const jackieDeleonQuestionnaire: Questionnaire = {
  id: 'jackie-deleon-dec-2025',
  clientName: 'Jacqueline "Jackie" DeLeon',
  clientId: 'jdeleon',
  title: 'Career Transition Discovery Questionnaire',
  subtitle: 'Strategic Placement Diagnostic',
  packageType: 'Elite Protocol Package',
  createdAt: '2025-12-01',

  readFirstContent: `Jackie — we've completed an exploratory scan of the market and your current positioning, and the findings are encouraging: based on what you've described so far, your day-to-day work appears to align more with behavioral health utilization workflows than "billing" alone — especially around authorizations, medical-necessity support, and continued-stay coordination.

You've been titled as "Medical Billing" or "Authorization Specialist," which may undersell the utilization expertise you apply in practice.

If any of the terms or assumptions below don't match how you'd describe your work, just correct us — this questionnaire is how we lock the exact truth.`,

  introText: `To move from exploratory signals to a high-confidence, posting-validated strategy (deeper market research, ATS keyword calibration, employer targeting, and compensation benchmarking), we need a few details we can't reliably infer without your confirmation.`,

  modules: [
    // MODULE 1: Guardrails & Role Targeting
    {
      id: 'guardrails',
      title: 'Guardrails & Role Targeting',
      subtitle: 'Defining Your Search Boundaries',
      description: 'These questions establish the boundaries for your job search. They determine which roles we target and which we exclude.',
      icon: '🎯',
      estimatedMinutes: 5,
      required: true,
      questions: [
        {
          id: 'q1-salary-floor',
          type: 'currency',
          question: 'What is your absolute minimum base salary?',
          subtitle: 'This is your "walk away" number below which you would decline an offer.',
          whyAsking: 'This single number determines whether we target Utilization Review roles or Prior Authorization roles, which employer tiers to research, and how aggressive to be in positioning. We don\'t want to waste research hours on roles that don\'t meet your financial requirements.',
          placeholder: '55000',
          required: true,
          critical: true,
          unit: '$'
        },
        {
          id: 'q2-salary-target',
          type: 'currency',
          question: 'What is your realistic target base salary?',
          subtitle: 'What you\'re actually aiming for.',
          whyAsking: 'Knowing both your floor AND your target gives us a calibration range. If your floor is $55k but your target is $75k, we know exactly how aggressive to be.',
          placeholder: '70000',
          required: true,
          critical: true,
          unit: '$'
        },
        {
          id: 'q3-remote-tolerance',
          type: 'radio',
          question: 'Which best describes your work mode requirement?',
          whyAsking: 'Your remote preference determines what percentage of the market is accessible to you. Strict remote-only requirements can significantly reduce available roles — we\'ll quantify this precisely once we run the full analysis.',
          required: true,
          critical: true,
          options: [
            {
              value: 'strict-remote',
              label: '100% remote, NO exceptions',
              description: 'No onsite ever, not even 1–2 days/year for annual training or team meetings'
            },
            {
              value: 'remote-preferred',
              label: '100% remote preferred, occasional onsite acceptable',
              description: 'e.g., 1–4 days/year for training, quarterly meetings, or annual events'
            },
            {
              value: 'hybrid',
              label: 'Hybrid acceptable',
              description: '1–2 days/week onsite within driving distance of Mayer/Phoenix metro'
            }
          ]
        },
        {
          id: 'q4-primary-lane',
          type: 'radio',
          question: 'Do you agree that "Utilization Review / Utilization Management Specialist (Behavioral Health)" should be your primary target lane?',
          subtitle: 'Based on your intake, your work appears to involve utilization support functions: processing authorizations, reviewing clinical documentation for medical necessity, and coordinating continued-stay approvals.',
          whyAsking: 'UR and PA are different job families with different keyword profiles, salary bands, and employer types. We can pursue both lanes, but we\'ll prioritize one as the primary positioning so your resume doesn\'t read diluted.',
          required: true,
          options: [
            {
              value: 'ur-um',
              label: 'Yes — Position me as UR/UM Specialist',
              description: 'Emphasis on concurrent review, medical necessity, LOC keywords'
            },
            {
              value: 'pa',
              label: 'No — I prefer Prior Authorization Specialist',
              description: 'Broader market, emphasis on CPT/ICD-10/eligibility keywords'
            },
            {
              value: 'both',
              label: 'Both equally',
              description: 'I\'m open to either lane depending on salary, employer, and role specifics'
            }
          ]
        }
      ]
    },

    // MODULE 2: UR/PA Workflow
    {
      id: 'workflow',
      title: 'UR/PA Workflow',
      subtitle: 'ATS Keyword Capture',
      description: 'These questions capture the technical details that differentiate you from generalist billers and unlock high-value ATS keywords.',
      icon: '⚙️',
      estimatedMinutes: 8,
      required: true,
      questions: [
        {
          id: 'q5-criteria-tools',
          type: 'checkbox',
          question: 'Which specific medical necessity criteria tool(s) did you use at TriCity and Arizona Medical Billing?',
          whyAsking: 'InterQual, MCG, and ASAM are among the most-searched keywords for UR roles. If you used them, your resume MUST say so explicitly. If you didn\'t, we need to know so we don\'t falsely claim expertise.',
          helpText: 'When you reviewed an authorization request, did you log into a software system that asked structured questions about the patient\'s symptoms, functioning, or treatment history? Did the system generate a recommendation or score? If yes, that was likely InterQual or MCG.',
          required: true,
          critical: true,
          options: [
            { value: 'interqual', label: 'InterQual Behavioral Health Criteria', description: 'Optum-owned; commonly used in UM programs' },
            { value: 'mcg', label: 'MCG (Milliman Care Guidelines)', description: 'For behavioral health' },
            { value: 'asam', label: 'ASAM Criteria', description: 'American Society of Addiction Medicine — used for substance use disorder / addiction cases' },
            { value: 'locus', label: 'LOCUS / CALOCUS / CASII', description: 'Level of Care Utilization System — used for mental health cases' },
            { value: 'payer-specific', label: 'Payer-specific proprietary criteria', description: 'Not InterQual/MCG/ASAM', followUp: 'q5-payer-name' },
            { value: 'portal-prompts', label: 'Payer portal prompts only', description: 'I answered structured questions in payer portals but don\'t recall a specific criteria tool name' },
            { value: 'unsure', label: 'Unsure / None', description: 'I used clinical judgment based on general payer guidelines' },
            { value: 'other', label: 'Other', followUp: 'q5-other-tool' }
          ]
        },
        {
          id: 'q6-autonomy',
          type: 'radio',
          question: 'Which best describes your workflow when reviewing authorization requests for behavioral health services?',
          whyAsking: 'This determines whether we position you as a Senior Specialist, Mid-Level Specialist, or Coordinator. The difference can be significant in both title and compensation.',
          helpText: 'Ask yourself: Did I write the approval/denial letter, or did someone else write it after reviewing my notes?',
          required: true,
          critical: true,
          options: [
            {
              value: 'independent',
              label: '(A) Independent clinical judgment',
              description: 'I made approval or denial recommendations based on criteria and payer guidelines, without supervisor sign-off for routine cases. Medical Director review only for complex/gray-area cases.'
            },
            {
              value: 'supervised',
              label: '(B) Supervised recommendations',
              description: 'I made recommendations, but all cases required Medical Director, nurse reviewer, or supervisor approval before the final determination was issued.'
            },
            {
              value: 'gatherer',
              label: '(C) Documentation gatherer',
              description: 'I collected clinical documentation and forwarded it to a clinical reviewer who made the actual approval/denial determination. I did not make recommendations.'
            }
          ]
        },
        {
          id: 'q7-auth-types',
          type: 'percentage-split',
          question: 'What types of behavioral health authorizations did you process?',
          subtitle: 'Check all that apply and estimate the percentage of your caseload for each.',
          whyAsking: 'IOP, PHP, and Inpatient Psych are high-value ATS keywords. Understanding your caseload mix helps us position you as a specialist or generalist.',
          required: true,
          options: [
            { value: 'inpatient', label: 'Inpatient Psychiatric', description: 'Acute stabilization, 24-hour hospital care' },
            { value: 'iop', label: 'IOP — Intensive Outpatient Program', description: 'Typically 9+ hours/week' },
            { value: 'php', label: 'PHP — Partial Hospitalization Program', description: '5–6 hours/day, step-down from inpatient' },
            { value: 'rtc', label: 'RTC / BHRF — Residential Treatment', description: '24-hour non-hospital care' },
            { value: 'outpatient', label: 'Outpatient Therapy', description: 'Individual or group sessions' },
            { value: 'detox', label: 'Detox / Withdrawal Management', description: 'Medically supervised' },
            { value: 'other', label: 'Other' }
          ]
        },
        {
          id: 'q8-concurrent-cadence',
          type: 'radio',
          question: 'For inpatient behavioral health cases, how often did you conduct concurrent reviews?',
          subtitle: 'Ongoing reviews during the patient\'s stay to reassess whether continued stay is medically necessary.',
          whyAsking: 'If you conducted regular concurrent reviews, that\'s a strong UR credential worth highlighting.',
          required: true,
          options: [
            { value: 'daily', label: 'Daily (every 24 hours)' },
            { value: '2-3-days', label: 'Every 2–3 days' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'admission-discharge', label: 'Only at admission and/or discharge', description: 'But NOT during the stay' },
            { value: 'na', label: 'N/A', description: 'I didn\'t work with inpatient cases (primarily IOP, PHP, or outpatient)' }
          ]
        }
      ]
    },

    // MODULE 3: Volume, Metrics & Performance
    {
      id: 'metrics',
      title: 'Volume, Metrics & Performance',
      subtitle: 'The Proof Layer',
      description: 'Numbers transform generic claims into compelling evidence. Even estimates help.',
      icon: '📊',
      estimatedMinutes: 8,
      required: true,
      questions: [
        {
          id: 'q9-daily-volume',
          type: 'radio',
          question: 'On an average workday at Arizona Medical Billing, approximately how many authorization requests did you review/process?',
          whyAsking: 'Employers often ask about caseload volume in interviews. Knowing your number helps you answer confidently and helps us write compelling achievement bullets.',
          required: true,
          critical: true,
          options: [
            { value: '1-5', label: '1–5 per day' },
            { value: '6-10', label: '6–10 per day' },
            { value: '11-15', label: '11–15 per day' },
            { value: '16-25', label: '16–25 per day' },
            { value: '26+', label: '26+ per day' }
          ],
          subQuestions: [
            {
              id: 'q9-weekly',
              type: 'number',
              question: 'Or if you tracked weekly:',
              placeholder: 'cases/week',
              required: false
            },
            {
              id: 'q9-monthly',
              type: 'number',
              question: 'Or monthly:',
              placeholder: 'cases/month',
              required: false
            }
          ]
        },
        {
          id: 'q10-tat',
          type: 'radio',
          question: 'What was your average turnaround time from receiving an authorization request to issuing a determination?',
          whyAsking: 'Fast TAT with maintained quality is a strong performance metric. "Maintained 24-hour TAT for urgent behavioral health authorizations" is a compelling resume bullet.',
          required: true,
          critical: true,
          options: [
            { value: 'same-day', label: 'Same-day (within 8 hours)', description: 'For urgent requests' },
            { value: '24-48', label: '24–48 hours', description: 'Common target in many settings' },
            { value: '3-5', label: '3–5 business days' },
            { value: '5-7', label: '5–7 business days' },
            { value: 'varied', label: 'Varied widely depending on case complexity', followUp: 'q10-explain' }
          ]
        },
        {
          id: 'q11-approval-rate',
          type: 'percentage-split',
          question: 'Approximately what percentage of your authorization reviews resulted in each outcome?',
          whyAsking: 'We use this to frame your decision-making credibility — showing you\'re neither rubber-stamping nor over-denying.',
          helpText: 'Provide your gut sense. Were most cases approved (80–90%)? Did you deny roughly 10–15%? Did you frequently send requests back for more info (~20%)?',
          required: true,
          critical: true,
          options: [
            { value: 'approvals', label: 'Approvals', description: 'Met medical necessity criteria' },
            { value: 'denials', label: 'Denials', description: 'Did not meet criteria' },
            { value: 'pending', label: 'Pending / More Information Needed' }
          ]
        },
        {
          id: 'q12-appeals',
          type: 'radio',
          question: 'Did you handle denial appeals?',
          whyAsking: 'Appeal success is an advanced competency and a strong differentiator from generalist billers.',
          required: true,
          options: [
            { value: 'wrote-appeals', label: 'Yes — I wrote appeal letters and gathered documentation', followUp: 'q12-success-rate' },
            { value: 'assisted', label: 'Yes — I assisted providers with appeal documentation', description: 'But didn\'t write the appeals myself' },
            { value: 'no', label: 'No — Appeals were handled by a different department' },
            { value: 'unsure', label: 'Unsure — I may have assisted informally' }
          ]
        },
        {
          id: 'q13-p2p',
          type: 'radio',
          question: 'Did you participate in peer-to-peer calls?',
          subtitle: 'Phone discussions between clinical reviewers and treating providers.',
          whyAsking: 'P2P participation signals strong communication skills and the ability to discuss clinical documentation under pressure. This is a senior-level UR credential.',
          required: true,
          options: [
            { value: 'regularly', label: 'Yes — Regularly', description: 'I handled P2P calls myself', followUp: 'q13-frequency' },
            { value: 'occasionally', label: 'Yes — Occasionally', description: 'Only for complex or disputed cases' },
            { value: 'no', label: 'No — P2P calls were handled by Medical Directors, nurses, or supervisors' },
            { value: 'unsure', label: 'Unsure — I may have participated in some provider calls' }
          ]
        }
      ]
    },

    // MODULE 4: Tools & Systems
    {
      id: 'tools',
      title: 'Tools & Systems',
      subtitle: 'ATS Keyword Capture',
      description: 'These questions capture specific technology keywords that are actively searched by recruiters and ATS systems.',
      icon: '🔧',
      estimatedMinutes: 5,
      required: true,
      questions: [
        {
          id: 'q14-ehr',
          type: 'checkbox',
          question: 'Which electronic health record (EHR) systems did you use to access patient clinical documentation?',
          whyAsking: 'Naming specific EHR systems adds immediate ATS value. Employers search for candidates with experience in their system.',
          helpText: 'Think about the software you logged into daily to pull patient records. Was there a logo or name on the login screen?',
          required: true,
          critical: true,
          options: [
            { value: 'kipu', label: 'Kipu Health', description: 'Behavioral health-specific EHR — common in addiction treatment' },
            { value: 'advancedmd', label: 'AdvancedMD', description: 'Multi-specialty practice management + EHR' },
            { value: 'cerner', label: 'Cerner', description: 'Enterprise EHR used by hospital systems' },
            { value: 'bestnotes', label: 'BestNotes', description: 'Behavioral health-specific EHR' },
            { value: 'epic', label: 'Epic', description: 'Most common in large hospital systems' },
            { value: 'netsmart', label: 'Netsmart / myAvatar', description: 'Behavioral health-specific EHR' },
            { value: 'qualifacts', label: 'Qualifacts / CareLogic', description: 'Behavioral health-specific EHR' },
            { value: 'athena', label: 'Athenahealth', description: 'Cloud-based EHR' },
            { value: 'paper', label: 'Paper charts', description: 'I reviewed faxed or mailed paper records' },
            { value: 'unsure', label: 'Unsure', description: 'I accessed documentation through a system, but I don\'t know the name' },
            { value: 'other', label: 'Other', followUp: 'q14-other-ehr' }
          ]
        },
        {
          id: 'q15-payer-portals',
          type: 'checkbox',
          question: 'Which payer portals did you use to submit authorizations, check eligibility, or communicate with insurance companies?',
          whyAsking: 'Payer portal names are ATS keywords and validate your workflow experience.',
          required: true,
          critical: true,
          options: [
            { value: 'availity', label: 'Availity' },
            { value: 'optum', label: 'Optum Provider Express' },
            { value: 'tricare', label: 'Tricare Online (TOL) / Tricare West Portal' },
            { value: 'va', label: 'VA Community Care Portal' },
            { value: 'change', label: 'Change Healthcare' },
            { value: 'navinet', label: 'NaviNet' },
            { value: 'ahcccs', label: 'AHCCCS Online', description: 'Arizona Medicaid' },
            { value: 'payer-specific', label: 'Payer-specific portals', description: 'Aetna, Humana, Cigna, Blue Cross, etc.', followUp: 'q15-payers' },
            { value: 'other', label: 'Other', followUp: 'q15-other-portal' }
          ]
        }
      ]
    },

    // MODULE 5: Credentials & Eligibility
    {
      id: 'credentials',
      title: 'Credentials & Eligibility Gates',
      subtitle: 'Binary Filters',
      description: 'These questions determine your eligibility for different role types.',
      icon: '🎓',
      estimatedMinutes: 3,
      required: true,
      questions: [
        {
          id: 'q16-licensure',
          type: 'checkbox',
          question: 'Do you hold any active clinical license or certification?',
          whyAsking: 'Many payer-side clinical UR roles require an active clinical license. If you hold one, it expands your accessible market significantly. If not, we focus on non-clinical specialist roles.',
          required: true,
          critical: true,
          options: [
            { value: 'rn', label: 'RN (Registered Nurse)' },
            { value: 'lpn', label: 'LPN / LVN (Licensed Practical/Vocational Nurse)' },
            { value: 'lcsw', label: 'LCSW (Licensed Clinical Social Worker)' },
            { value: 'lpc', label: 'LPC / LMHC (Licensed Professional Counselor)' },
            { value: 'lmft', label: 'LMFT (Licensed Marriage and Family Therapist)' },
            { value: 'none', label: 'None — I do not hold any clinical license' },
            { value: 'other', label: 'Other clinical license', followUp: 'q16-other-license' }
          ]
        },
        {
          id: 'q17-education',
          type: 'radio',
          question: 'What is your highest level of education completed?',
          whyAsking: 'Some roles require a Bachelor\'s degree, though 15+ years of relevant experience often substitutes.',
          required: true,
          options: [
            { value: 'hs', label: 'High school diploma / GED' },
            { value: 'associate', label: 'Associate degree', followUp: 'q17-field' },
            { value: 'bachelor', label: 'Bachelor\'s degree', followUp: 'q17-field' },
            { value: 'master', label: 'Master\'s degree', followUp: 'q17-field' },
            { value: 'some-college', label: 'Some college (no degree)', followUp: 'q17-credits' }
          ]
        }
      ]
    },

    // MODULE 6: Chronology Integrity
    {
      id: 'chronology',
      title: 'Chronology Integrity',
      subtitle: 'Risk Prevention',
      description: 'These questions resolve discrepancies we identified in your intake documents. Accurate timelines prevent background check complications.',
      icon: '📅',
      estimatedMinutes: 5,
      required: true,
      questions: [
        {
          id: 'q18-timeline',
          type: 'timeline',
          question: 'Please provide exact start and end dates (month/year) for the following roles:',
          whyAsking: 'Your intake documents show potentially conflicting timelines. Background verification services can flag date inconsistencies. We need to clarify now to ensure your resume matches what employers will verify.',
          required: true,
          critical: true,
          subQuestions: [
            { id: 'q18-cdcn-start', type: 'date', question: 'Consumer Direct Care Network - Start date', required: true, placeholder: 'MM/YYYY' },
            { id: 'q18-cdcn-end', type: 'date', question: 'Consumer Direct Care Network - End date', required: true, placeholder: 'MM/YYYY' },
            { id: 'q18-connetics-start', type: 'date', question: 'Connetics / AMN Healthcare - Start date', required: true, placeholder: 'MM/YYYY' },
            { id: 'q18-connetics-end', type: 'date', question: 'Connetics / AMN Healthcare - End date', required: true, placeholder: 'MM/YYYY' },
            { id: 'q18-tricity-start', type: 'date', question: 'TriCity Medical Billing - Start date', required: true, placeholder: 'MM/YYYY' },
            { id: 'q18-tricity-end', type: 'date', question: 'TriCity Medical Billing - End date', required: true, placeholder: 'MM/YYYY' },
            { id: 'q18-arizona-start', type: 'date', question: 'Arizona Medical Billing - Start date', required: true, placeholder: 'MM/YYYY' }
          ]
        },
        {
          id: 'q18-overlap',
          type: 'textarea',
          question: 'Was there overlap between Consumer Direct and Connetics, or was there a gap?',
          placeholder: 'e.g., "I worked both simultaneously — CDCN was part-time while Connetics was full-time" or "There was a 2-month gap between roles"',
          required: true
        },
        {
          id: 'q19-supervision-scope',
          type: 'radio',
          question: 'Your resume mentions "trained and managed over 40 employees." Please clarify:',
          whyAsking: 'We need to reconcile this to ensure the claim is defensible if an employer asks for specifics.',
          required: true,
          critical: true,
          options: [
            { value: 'cumulative', label: 'The "40 employees" was cumulative across multiple roles', description: 'e.g., 13 at TriWest + 15 at ResCare + 12 elsewhere = 40 total' },
            { value: 'single-role', label: 'The "40 employees" was the headcount I supervised at one time in a single role' },
            { value: 'trained', label: 'The "40 employees" represents people I trained or coordinated', description: 'Not direct reports' }
          ]
        },
        {
          id: 'q19-context',
          type: 'textarea',
          question: 'Please provide context so we can frame this accurately:',
          placeholder: 'Explain the breakdown of the 40 employees figure...',
          required: true
        }
      ]
    },

    // OPTIONAL MODULES
    // MODULE 7: STAR Achievement Stories
    {
      id: 'achievements',
      title: 'STAR Achievement Stories',
      subtitle: 'Level 4 Enhancements',
      description: 'These stories become the foundation for your most compelling resume bullets and interview answers.',
      icon: '⭐',
      estimatedMinutes: 15,
      required: false,
      questions: [
        {
          id: 'q20-contract-rescue',
          type: 'textarea',
          question: 'The Contract Rescue Story: SITUATION',
          subtitle: 'When TriCity lost the behavioral health contract, Arizona Medical Billing retained you as a critical asset. This is your anchor story.',
          whyAsking: 'This is your #1 resume bullet and LinkedIn foundation.',
          placeholder: 'What was at risk when the contract changed hands? (e.g., patient care disruption, authorization backlog, payer relationship damage, facility revenue loss, compliance issues)',
          required: false
        },
        {
          id: 'q20-task',
          type: 'textarea',
          question: 'The Contract Rescue Story: TASK',
          placeholder: 'What were you responsible for during the transition?',
          required: false
        },
        {
          id: 'q20-action',
          type: 'textarea',
          question: 'The Contract Rescue Story: ACTION',
          placeholder: 'What specific actions did you take to ensure continuity?',
          required: false
        },
        {
          id: 'q20-result',
          type: 'textarea',
          question: 'The Contract Rescue Story: RESULT',
          placeholder: 'What was the measurable outcome? (e.g., zero authorization delays, 100% payer continuity)',
          required: false
        },
        {
          id: 'q21-process-improvement',
          type: 'textarea',
          question: 'Process Improvement or Efficiency Win',
          subtitle: 'Describe a time when you improved a process, reduced turnaround time, decreased denials, or enhanced compliance.',
          whyAsking: 'Shows initiative and impact beyond routine duties.',
          placeholder: 'Use STAR format: Situation, Task, Action, Result (quantified if possible)',
          required: false
        },
        {
          id: 'q22-appeal-success',
          type: 'textarea',
          question: 'Difficult Denial Overturn or Appeal Success',
          subtitle: 'Describe a time when you successfully overturned a denial or helped a patient/provider win an appeal.',
          whyAsking: 'Shows persistence, clinical knowledge, and patient advocacy.',
          placeholder: 'Use STAR format: Why was it denied? What did you do? What was the result?',
          required: false
        },
        {
          id: 'q23-high-pressure',
          type: 'textarea',
          question: 'High-Pressure or High-Volume Period',
          subtitle: 'Describe a time when you faced a high-volume workload or high-pressure situation.',
          whyAsking: 'Shows resilience and capacity under stress.',
          placeholder: 'e.g., end-of-month rush, staff shortage, system outage, urgent authorization needed',
          required: false
        }
      ]
    },

    // MODULE 8: Leadership & Preferences
    {
      id: 'preferences',
      title: 'Leadership & Preferences',
      subtitle: 'Employer Fit Optimization',
      description: 'These questions help us target employers that match your work style and values.',
      icon: '🎯',
      estimatedMinutes: 10,
      required: false,
      questions: [
        {
          id: 'q24-supervision',
          type: 'textarea',
          question: 'Supervision & Training History',
          subtitle: 'At TriWest, ResCare, or any other role, did you formally supervise or train staff?',
          whyAsking: 'Validates supervisor/manager positioning. If you had formal supervisory authority, we can position you for UM Coordinator or UM Manager roles.',
          placeholder: 'How many direct reports? What roles? What supervisory duties? For how long?',
          required: false
        },
        {
          id: 'q25-employer-type',
          type: 'checkbox',
          question: 'Do you have a preference for employer type?',
          whyAsking: 'Helps us target employers that match your work style and values.',
          required: false,
          options: [
            { value: 'payer', label: 'Payer (insurance company)', description: 'Optum, Carelon, Magellan, Centene, etc.' },
            { value: 'vendor', label: 'Vendor / TPA (third-party administrator)', description: 'Clearlink Partners, Toney Healthcare, etc.' },
            { value: 'provider', label: 'Facility / Provider', description: 'Behavioral health treatment center — Charlie Health, Aurora, etc.' },
            { value: 'no-preference', label: 'No preference — I\'m open to any employer type' }
          ]
        },
        {
          id: 'q25-avoid',
          type: 'textarea',
          question: 'Any "avoid" list?',
          placeholder: 'e.g., call-center environment, heavy weekend requirements, paper charts, specific companies',
          required: false
        },
        {
          id: 'q26-weekend',
          type: 'radio',
          question: 'Are you willing to work 1 weekend per month (remote) if the role is otherwise ideal?',
          whyAsking: 'Some UR roles include rotating weekend coverage. If weekend work is a dealbreaker, we can screen for Monday–Friday-only roles.',
          required: false,
          options: [
            { value: 'yes-comp', label: 'Yes — with comp time or schedule flexibility' },
            { value: 'yes-paid', label: 'Yes — as long as it\'s paid' },
            { value: 'no', label: 'No — Weekend work is a dealbreaker' },
            { value: 'depends', label: 'Maybe — Depends on total compensation' }
          ]
        },
        {
          id: 'q27-workflow-pref',
          type: 'radio',
          question: 'In your next UR/UM role, do you prefer:',
          whyAsking: 'Helps us target employers with workflows that match your strengths.',
          required: false,
          options: [
            { value: 'live', label: 'Live phone reviews', description: 'Scheduled review calls with providers; set breaks; higher accountability' },
            { value: 'async', label: 'Faxed/electronic reviews', description: 'Review documentation on your own schedule; more flexibility' },
            { value: 'hybrid', label: 'Hybrid (mix of both)' },
            { value: 'no-preference', label: 'No preference' }
          ]
        }
      ]
    },

    // MODULE 9: Proof Artifacts
    {
      id: 'artifacts',
      title: 'Proof Artifacts',
      subtitle: 'Powerful If Available',
      description: 'Tangible proof is more compelling than claims.',
      icon: '📎',
      estimatedMinutes: 5,
      required: false,
      questions: [
        {
          id: 'q28-samples',
          type: 'checkbox',
          question: 'Do you have any redacted examples (no PHI/patient info) of:',
          whyAsking: 'If you have any redacted work samples, they can dramatically strengthen your positioning — either as portfolio pieces or as evidence we can reference in your resume narrative.',
          required: false,
          options: [
            { value: 'tracker', label: 'Authorization tracker or log' },
            { value: 'denial-tracking', label: 'Denial tracking spreadsheet' },
            { value: 'appeal-template', label: 'Appeal letter template' },
            { value: 'sop', label: 'SOP, checklist, or process documentation you created' },
            { value: 'metrics', label: 'Metric report or performance summary' },
            { value: 'training', label: 'Training materials you developed' },
            { value: 'none', label: 'No — I don\'t have any work samples available' },
            { value: 'other', label: 'Other', followUp: 'q28-other-sample' }
          ]
        },
        {
          id: 'q28-describe',
          type: 'textarea',
          question: 'If you have samples, what types do you have?',
          placeholder: 'Describe the work samples you can provide...',
          required: false
        }
      ]
    }
  ]
};
