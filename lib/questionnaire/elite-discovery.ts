/**
 * Elite Protocol Discovery Questionnaire
 * Generic Template - Works for Any Industry
 *
 * This questionnaire captures the essential information needed to create
 * a compelling, ATS-optimized resume for any professional.
 */

import { Questionnaire } from './types';

export const eliteDiscoveryQuestionnaire: Questionnaire = {
  id: 'elite-discovery',
  clientName: '', // Populated dynamically
  clientId: '', // Populated dynamically
  title: 'Elite Protocol Discovery Questionnaire',
  subtitle: 'Strategic Career Positioning Diagnostic',
  packageType: 'Elite Protocol Package',
  createdAt: new Date().toISOString().split('T')[0],

  readFirstContent: `Welcome to your Elite Protocol Discovery Questionnaire.

This questionnaire is designed to extract the precise details we need to position you competitively in today's job market. We'll capture:

- Your non-negotiable requirements (salary, location, work mode)
- Your specific skills, tools, and industry expertise
- Quantifiable achievements and metrics
- Career timeline verification for background checks
- STAR-format achievement stories for compelling resume bullets

**Why this matters:** Generic resumes get generic results. This questionnaire ensures your resume speaks directly to what employers are searching for — in YOUR industry, at YOUR level.

Take your time. The more specific you are, the more powerful your positioning.`,

  introText: `Each module below focuses on a specific aspect of your career profile. Required modules must be completed; optional modules can dramatically strengthen your positioning if you have time.`,

  modules: [
    // MODULE 1: Guardrails & Target Role
    {
      id: 'guardrails',
      title: 'Guardrails & Target Role',
      subtitle: 'Defining Your Search Boundaries',
      description: 'These questions establish the non-negotiables for your job search. They determine which opportunities we pursue and which we skip.',
      icon: '🎯',
      estimatedMinutes: 5,
      required: true,
      questions: [
        {
          id: 'q1-target-role',
          type: 'textarea',
          question: 'What is your target job title or role?',
          subtitle: 'Be specific. If you have multiple target titles, list them in order of preference.',
          whyAsking: 'This determines the keyword strategy for your entire resume. We need to know exactly what you\'re targeting to optimize for ATS and recruiter searches.',
          placeholder: 'e.g., "Senior Product Manager" or "Marketing Director, preferably B2B SaaS" or "Staff Software Engineer (Backend)"',
          required: true,
          critical: true
        },
        {
          id: 'q2-industry',
          type: 'textarea',
          question: 'What industry or industries are you targeting?',
          subtitle: 'Include your current industry and any industries you\'re open to transitioning into.',
          whyAsking: 'Industry context affects keyword selection, achievement framing, and employer targeting.',
          placeholder: 'e.g., "Healthcare technology, open to fintech" or "SaaS B2B, enterprise software" or "Manufacturing, automotive preferred"',
          required: true,
          critical: true
        },
        {
          id: 'q3-salary-floor',
          type: 'currency',
          question: 'What is your absolute minimum base salary?',
          subtitle: 'This is your "walk away" number — below this, you would decline an offer.',
          whyAsking: 'This single number determines which employer tiers we target and how aggressive to be in positioning. We won\'t waste time on roles that don\'t meet your financial floor.',
          placeholder: '85000',
          required: true,
          critical: true,
          unit: '$'
        },
        {
          id: 'q4-salary-target',
          type: 'currency',
          question: 'What is your realistic target base salary?',
          subtitle: 'What you\'re actually aiming for, not a dream number.',
          whyAsking: 'Knowing both floor AND target gives us a calibration range for employer targeting and positioning strategy.',
          placeholder: '110000',
          required: true,
          critical: true,
          unit: '$'
        },
        {
          id: 'q5-remote-preference',
          type: 'radio',
          question: 'Which best describes your work mode requirement?',
          whyAsking: 'Your remote preference determines what percentage of the market is accessible to you. We\'ll quantify the impact and optimize accordingly.',
          required: true,
          critical: true,
          options: [
            {
              value: 'strict-remote',
              label: '100% remote, NO exceptions',
              description: 'No onsite ever, not even for annual meetings or training'
            },
            {
              value: 'remote-preferred',
              label: '100% remote preferred, occasional onsite acceptable',
              description: 'e.g., 1–4 days/year for training or team meetings'
            },
            {
              value: 'hybrid',
              label: 'Hybrid acceptable',
              description: '1–3 days/week onsite within commuting distance'
            },
            {
              value: 'onsite-ok',
              label: 'Onsite acceptable',
              description: 'I\'m open to full-time in-office roles'
            }
          ]
        },
        {
          id: 'q6-location',
          type: 'textarea',
          question: 'What is your geographic target?',
          subtitle: 'For remote roles, list any location restrictions. For hybrid/onsite, list acceptable metro areas.',
          whyAsking: 'Location determines employer pool size and may affect compensation expectations.',
          placeholder: 'e.g., "Remote anywhere in US" or "Phoenix metro, willing to commute up to 30 miles" or "NYC, open to SF or Austin for right role"',
          required: true
        }
      ]
    },

    // MODULE 2: Current Role & Experience
    {
      id: 'experience',
      title: 'Current Role & Experience',
      subtitle: 'Your Professional Foundation',
      description: 'These questions capture what you actually DO — the daily work that becomes resume content.',
      icon: '💼',
      estimatedMinutes: 10,
      required: true,
      questions: [
        {
          id: 'q7-current-title',
          type: 'text',
          question: 'What is your current (or most recent) job title?',
          placeholder: 'e.g., Senior Software Engineer',
          required: true,
          critical: true
        },
        {
          id: 'q8-current-company',
          type: 'text',
          question: 'Current (or most recent) employer name?',
          placeholder: 'e.g., Acme Corporation',
          required: true
        },
        {
          id: 'q9-years-experience',
          type: 'radio',
          question: 'How many years of professional experience do you have in your field?',
          whyAsking: 'Experience level affects positioning strategy — entry-level, mid-career, and senior candidates require different approaches.',
          required: true,
          options: [
            { value: '0-2', label: '0–2 years (Entry level)' },
            { value: '3-5', label: '3–5 years (Early career)' },
            { value: '6-10', label: '6–10 years (Mid-career)' },
            { value: '11-15', label: '11–15 years (Senior)' },
            { value: '15+', label: '15+ years (Executive/Expert)' }
          ]
        },
        {
          id: 'q10-daily-work',
          type: 'textarea',
          question: 'Describe what you actually do on a typical workday.',
          subtitle: 'Don\'t use job description language — tell us what you really do.',
          whyAsking: 'This raw description often reveals valuable keywords and achievements that formal job descriptions miss.',
          placeholder: 'e.g., "I start by checking Slack for urgent requests, then spend most of my morning in code reviews. Afternoons are usually meetings with product and writing technical specs. I mentor two junior engineers..."',
          required: true,
          critical: true
        },
        {
          id: 'q11-key-responsibilities',
          type: 'textarea',
          question: 'What are your 3–5 most important responsibilities?',
          subtitle: 'The things your boss would say are your core job functions.',
          whyAsking: 'These become the foundation of your resume bullet points.',
          placeholder: 'List them out:\n1. \n2. \n3. \n4. \n5.',
          required: true,
          critical: true
        }
      ]
    },

    // MODULE 3: Skills & Tools
    {
      id: 'skills',
      title: 'Skills & Tools',
      subtitle: 'ATS Keyword Capture',
      description: 'These questions capture the specific technologies, methodologies, and tools that recruiters search for.',
      icon: '🔧',
      estimatedMinutes: 8,
      required: true,
      questions: [
        {
          id: 'q12-technical-skills',
          type: 'textarea',
          question: 'List ALL technical skills, software, and tools you use professionally.',
          subtitle: 'Include everything — programming languages, software platforms, methodologies, frameworks, certifications.',
          whyAsking: 'ATS systems search for exact keyword matches. Missing a key skill from your resume can eliminate you before a human ever sees your application.',
          placeholder: 'e.g., Python, SQL, Tableau, Salesforce, Jira, Agile/Scrum, AWS, Google Analytics, HubSpot, Excel (advanced pivot tables), etc.',
          required: true,
          critical: true
        },
        {
          id: 'q13-proficiency',
          type: 'textarea',
          question: 'For your top 5 most important skills, rate your proficiency.',
          whyAsking: 'We won\'t claim expertise in something you\'re only familiar with. This prevents awkward interview situations.',
          placeholder: 'Skill 1: [Expert/Advanced/Intermediate/Basic]\nSkill 2: \nSkill 3: \nSkill 4: \nSkill 5:',
          required: true
        },
        {
          id: 'q14-certifications',
          type: 'textarea',
          question: 'List any professional certifications, licenses, or credentials you hold.',
          subtitle: 'Include expiration dates if applicable.',
          whyAsking: 'Certifications are high-value ATS keywords and credibility signals.',
          placeholder: 'e.g., PMP (active), AWS Solutions Architect Associate (expires 2026), CPA (State of Arizona)',
          required: false
        },
        {
          id: 'q15-methodologies',
          type: 'textarea',
          question: 'What methodologies, frameworks, or processes do you use?',
          whyAsking: 'Methodology keywords (Agile, Six Sigma, Design Thinking, etc.) are heavily searched by recruiters.',
          placeholder: 'e.g., Agile/Scrum, Kanban, Waterfall, Six Sigma, Lean, Design Thinking, OKRs, etc.',
          required: false
        }
      ]
    },

    // MODULE 4: Metrics & Achievements
    {
      id: 'metrics',
      title: 'Metrics & Achievements',
      subtitle: 'The Proof Layer',
      description: 'Numbers transform generic claims into compelling evidence. Even estimates help.',
      icon: '📊',
      estimatedMinutes: 10,
      required: true,
      questions: [
        {
          id: 'q16-team-size',
          type: 'textarea',
          question: 'What is the scope of your work?',
          subtitle: 'Include team size, budget responsibility, customer/client volume, geographic scope, etc.',
          whyAsking: 'Scope metrics immediately communicate your level of responsibility.',
          placeholder: 'e.g., "Manage team of 8, $2M annual budget, support 500+ internal users" or "Individual contributor on 12-person engineering team, responsible for 3 microservices handling 10M requests/day"',
          required: true,
          critical: true
        },
        {
          id: 'q17-quantified-achievements',
          type: 'textarea',
          question: 'List 3–5 achievements with NUMBERS.',
          subtitle: 'Revenue generated, costs saved, efficiency improved, time reduced, growth achieved, etc.',
          whyAsking: 'Quantified achievements are 3x more compelling than generic claims. "Improved efficiency" is weak; "Reduced processing time by 40%" is powerful.',
          placeholder: '1. Increased sales by X% ($Y revenue)\n2. Reduced costs by $X through...\n3. Improved process efficiency by X%\n4. Grew team/department from X to Y\n5. Delivered project X under budget by $Y',
          required: true,
          critical: true
        },
        {
          id: 'q18-performance-ratings',
          type: 'radio',
          question: 'What were your last 2–3 performance review ratings?',
          whyAsking: 'Consistent high performance is a credibility signal we can reference in cover letters.',
          required: false,
          options: [
            { value: 'exceeds', label: 'Consistently "Exceeds Expectations" or equivalent' },
            { value: 'meets-exceeds', label: 'Mix of "Meets" and "Exceeds"' },
            { value: 'meets', label: 'Consistently "Meets Expectations"' },
            { value: 'na', label: 'No formal performance reviews / Prefer not to say' }
          ]
        },
        {
          id: 'q19-awards',
          type: 'textarea',
          question: 'Have you received any awards, recognitions, or promotions?',
          whyAsking: 'Third-party validation (awards, promotions, recognition) strengthens your positioning.',
          placeholder: 'e.g., "Promoted twice in 3 years", "Employee of the Quarter Q2 2024", "President\'s Club 2023"',
          required: false
        }
      ]
    },

    // MODULE 5: Education & Credentials
    {
      id: 'education',
      title: 'Education & Credentials',
      subtitle: 'Qualification Gates',
      description: 'These questions determine your eligibility for different role types.',
      icon: '🎓',
      estimatedMinutes: 3,
      required: true,
      questions: [
        {
          id: 'q20-education',
          type: 'radio',
          question: 'What is your highest level of education completed?',
          whyAsking: 'Some roles have strict degree requirements. We need to know what qualifications you bring.',
          required: true,
          options: [
            { value: 'hs', label: 'High school diploma / GED' },
            { value: 'associate', label: 'Associate degree' },
            { value: 'bachelor', label: 'Bachelor\'s degree' },
            { value: 'master', label: 'Master\'s degree' },
            { value: 'doctorate', label: 'Doctorate (PhD, MD, JD, etc.)' },
            { value: 'some-college', label: 'Some college (no degree)' }
          ]
        },
        {
          id: 'q21-degree-field',
          type: 'text',
          question: 'What was your field of study?',
          placeholder: 'e.g., Computer Science, Business Administration, Marketing',
          required: false
        },
        {
          id: 'q22-school',
          type: 'text',
          question: 'What school(s) did you attend?',
          placeholder: 'e.g., Arizona State University',
          required: false
        }
      ]
    },

    // MODULE 6: Employment Timeline
    {
      id: 'timeline',
      title: 'Employment Timeline',
      subtitle: 'Background Check Preparation',
      description: 'Accurate timelines prevent background check complications and interview inconsistencies.',
      icon: '📅',
      estimatedMinutes: 8,
      required: true,
      questions: [
        {
          id: 'q23-work-history',
          type: 'textarea',
          question: 'List your last 3–5 positions with exact dates (month/year).',
          subtitle: 'Start with most recent. Include company name, title, and dates.',
          whyAsking: 'Background verification services flag date inconsistencies. We need accurate dates that match what employers will verify.',
          placeholder: 'Position 1: [Company] - [Title] - [MM/YYYY to MM/YYYY or Present]\nPosition 2: \nPosition 3: \nPosition 4: \nPosition 5:',
          required: true,
          critical: true
        },
        {
          id: 'q24-gaps',
          type: 'textarea',
          question: 'Do you have any employment gaps longer than 3 months?',
          subtitle: 'If yes, explain briefly. Common reasons: education, caregiving, health, travel, job search.',
          whyAsking: 'Gaps are fine — employers just want a brief explanation. We\'ll frame any gaps positively.',
          placeholder: 'e.g., "6-month gap in 2022 for parental leave" or "No gaps" or "3 months in 2023 during job search after layoff"',
          required: true
        },
        {
          id: 'q25-reason-leaving',
          type: 'textarea',
          question: 'Why are you looking for a new role?',
          subtitle: 'Be honest — this helps us craft your narrative.',
          whyAsking: 'Your "reason for leaving" will come up in every interview. We need to prepare a compelling, honest answer.',
          placeholder: 'e.g., "Seeking growth opportunities not available at current company" or "Company downsizing" or "Relocating to new city" or "Want to transition into [new field]"',
          required: true
        }
      ]
    },

    // OPTIONAL MODULE: STAR Achievement Stories
    {
      id: 'achievements',
      title: 'STAR Achievement Stories',
      subtitle: 'Interview Preparation',
      description: 'These stories become your most compelling resume bullets AND interview answers.',
      icon: '⭐',
      estimatedMinutes: 15,
      required: false,
      questions: [
        {
          id: 'q26-biggest-win',
          type: 'textarea',
          question: 'STORY 1: Your Biggest Professional Win',
          subtitle: 'Use STAR format: Situation, Task, Action, Result',
          whyAsking: 'This becomes your anchor achievement — the first bullet on your resume and your go-to interview story.',
          placeholder: 'SITUATION: What was the context/challenge?\nTASK: What were you responsible for?\nACTION: What specific steps did you take?\nRESULT: What was the measurable outcome?',
          required: false
        },
        {
          id: 'q27-problem-solved',
          type: 'textarea',
          question: 'STORY 2: A Difficult Problem You Solved',
          subtitle: 'Describe a time you identified and fixed a significant problem.',
          whyAsking: 'Problem-solving stories demonstrate critical thinking and initiative.',
          placeholder: 'SITUATION: What was broken/wrong?\nTASK: What needed to be fixed?\nACTION: How did you diagnose and solve it?\nRESULT: What improved as a result?',
          required: false
        },
        {
          id: 'q28-leadership',
          type: 'textarea',
          question: 'STORY 3: A Time You Led or Influenced Others',
          subtitle: 'Doesn\'t have to be formal management — could be leading a project, mentoring, or driving change.',
          whyAsking: 'Leadership stories show you can operate above your current level.',
          placeholder: 'SITUATION: What needed leadership?\nTASK: What was your role?\nACTION: How did you lead/influence?\nRESULT: What was the outcome?',
          required: false
        },
        {
          id: 'q29-under-pressure',
          type: 'textarea',
          question: 'STORY 4: Performing Under Pressure',
          subtitle: 'A tight deadline, high-stakes situation, or crisis you handled well.',
          whyAsking: 'Employers want to know you can handle stress without falling apart.',
          placeholder: 'SITUATION: What was the pressure/stakes?\nTASK: What did you need to deliver?\nACTION: How did you handle it?\nRESULT: What was the outcome?',
          required: false
        }
      ]
    },

    // OPTIONAL MODULE: Preferences
    {
      id: 'preferences',
      title: 'Work Preferences & Culture',
      subtitle: 'Employer Fit Optimization',
      description: 'These questions help us target employers that match your work style.',
      icon: '🏢',
      estimatedMinutes: 5,
      required: false,
      questions: [
        {
          id: 'q30-company-size',
          type: 'checkbox',
          question: 'What company sizes are you targeting?',
          whyAsking: 'Startups vs. enterprises have very different cultures, compensation structures, and job stability.',
          required: false,
          options: [
            { value: 'startup', label: 'Startup (1–50 employees)', description: 'High risk, high reward, wear many hats' },
            { value: 'growth', label: 'Growth stage (50–500 employees)', description: 'Scaling fast, building processes' },
            { value: 'midsize', label: 'Mid-size (500–5,000 employees)', description: 'Established but still agile' },
            { value: 'enterprise', label: 'Enterprise (5,000+ employees)', description: 'Stable, structured, specialized roles' },
            { value: 'no-preference', label: 'No preference' }
          ]
        },
        {
          id: 'q31-culture',
          type: 'textarea',
          question: 'What\'s important to you in company culture?',
          placeholder: 'e.g., "Work-life balance is critical", "Fast-paced environment", "Strong mentorship", "Mission-driven company"',
          required: false
        },
        {
          id: 'q32-dealbreakers',
          type: 'textarea',
          question: 'Any dealbreakers or companies to avoid?',
          placeholder: 'e.g., "No travel >10%", "No startups without funding", "Avoid [specific company]"',
          required: false
        }
      ]
    },

    // OPTIONAL MODULE: Additional Context
    {
      id: 'additional',
      title: 'Additional Context',
      subtitle: 'Anything Else We Should Know',
      description: 'Space for information that doesn\'t fit elsewhere.',
      icon: '📝',
      estimatedMinutes: 5,
      required: false,
      questions: [
        {
          id: 'q33-unique',
          type: 'textarea',
          question: 'What makes you uniquely qualified for your target role?',
          subtitle: 'Your "unfair advantage" — combination of skills, experiences, or perspectives that others don\'t have.',
          whyAsking: 'This becomes your positioning hook — the thing that makes you memorable.',
          placeholder: 'e.g., "I\'m one of few people with both deep technical skills AND client-facing experience" or "I built this exact system at my last company"',
          required: false
        },
        {
          id: 'q34-concerns',
          type: 'textarea',
          question: 'Do you have any concerns about your candidacy?',
          subtitle: 'Be honest — we can address gaps, career changes, or other concerns strategically.',
          placeholder: 'e.g., "I\'m concerned about my lack of formal degree" or "I\'m worried about the career change perception" or "None"',
          required: false
        },
        {
          id: 'q35-anything-else',
          type: 'textarea',
          question: 'Anything else we should know?',
          placeholder: 'Any other context, constraints, or information that would help us position you effectively.',
          required: false
        }
      ]
    }
  ]
};
