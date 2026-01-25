// Official Data Hub - Updated 2026-01-25
const jobsData = [
    {
        "id": 1,
        "title": "SSC CGL Recruitment 2026 (15,000+ Posts) - Notification Out",
        "organization": "SSC",
        "type": "govt",
        "location": "All India",
        "qualification": "Graduate",
        "experience": "Fresher",
        "lastDate": "15 Feb 2026",
        "vacancies": "15640",
        "salary": "\u20b925,500 - 1,51,100",
        "applyLink": "https://ssc.gov.in",
        "urgent": true
    },
    {
        "id": 2,
        "title": "Google India Software Engineer Hiring 2026 - STEP & SWE Roles",
        "organization": "Google",
        "type": "private",
        "location": "Bangalore/Hyderabad/Pune",
        "qualification": "B.E/B.Tech/MCA/MS",
        "experience": "Fresher/SDE1",
        "lastDate": "Rolling Basis",
        "vacancies": "Various",
        "salary": "\u20b915 - 45 LPA",
        "applyLink": "https://www.google.com/about/careers",
        "urgent": true
    },
    {
        "id": 3,
        "title": "RRB Group D Mega Recruitment 2026 (1.2 Lakh Vacancies)",
        "organization": "Railway",
        "type": "govt",
        "location": "All India Regions",
        "qualification": "10th Pass / ITI",
        "experience": "Fresher",
        "lastDate": "10 Mar 2026",
        "vacancies": "127390",
        "salary": "Level 1 Pay Matrix",
        "applyLink": "https://rrbapply.gov.in",
        "urgent": true
    },
    {
        "id": 4,
        "title": "SBI Clerk (Junior Associates) 2026 - 9,500 Vacancies",
        "organization": "SBI",
        "type": "govt",
        "location": "Across India",
        "qualification": "Any Graduate",
        "experience": "Not Required",
        "lastDate": "31 Jan 2026",
        "vacancies": "9500",
        "salary": "\u20b937,000+",
        "applyLink": "https://bank.sbi/careers",
        "urgent": true
    },
    {
        "id": 5,
        "title": "Indian Army Agniveer Rally 2026 - All Categories (GD, Clerk, Tech)",
        "organization": "Defence",
        "type": "govt",
        "location": "State/Zone Wise",
        "qualification": "8th/10th/12th Pass",
        "experience": "Fresher",
        "lastDate": "Varies by ARO",
        "vacancies": "45,000",
        "salary": "\u20b930,000 - 40,000",
        "applyLink": "https://joinindianarmy.nic.in",
        "urgent": true
    },
    {
        "id": 6,
        "title": "Microsoft Azure SDE Hiring 2026 - Digital Native & Cloud",
        "organization": "Microsoft",
        "type": "private",
        "location": "Remote/Hyderabad",
        "qualification": "B.E/B.Tech",
        "experience": "0-2 Years",
        "lastDate": "Check Link",
        "vacancies": "500+",
        "salary": "Competitive",
        "applyLink": "https://careers.microsoft.com",
        "urgent": false
    },
    {
        "id": 7,
        "title": "UP Police Constable Recruitment 2026 (60,000+ Posts)",
        "organization": "Police",
        "type": "govt",
        "location": "Uttar Pradesh",
        "qualification": "12th Pass",
        "experience": "Fresher",
        "lastDate": "20 Feb 2026",
        "vacancies": "60244",
        "salary": "\u20b921,700 - 69,100",
        "applyLink": "https://uppbpb.gov.in",
        "urgent": true
    },
    {
        "id": 8,
        "title": "ISRO Scientist/Engineer 'SC' 2026 Early Notification",
        "organization": "Space",
        "type": "govt",
        "location": "Multiple Centers",
        "qualification": "First Class B.E/B.Tech",
        "experience": "Fresher",
        "lastDate": "05 Mar 2026",
        "vacancies": "415",
        "salary": "\u20b982,000+",
        "applyLink": "https://isro.gov.in",
        "urgent": false
    },
    {
        "id": 9,
        "title": "Amazon Ops / Tech Support Associate Hiring 2026",
        "organization": "Amazon",
        "type": "private",
        "location": "Chennai/Bangalore",
        "qualification": "Any Graduate",
        "experience": "0-1 Years",
        "lastDate": "Rolling",
        "vacancies": "Various",
        "salary": "\u20b925,000 - 35,000",
        "applyLink": "https://amazon.jobs",
        "urgent": false
    },
    {
        "id": 10,
        "title": "Medical Officer Recruitment 2026 (UPSC CMS)",
        "organization": "UPSC",
        "type": "govt",
        "location": "All India",
        "qualification": "MBBS",
        "experience": "Not Required",
        "lastDate": "18 Apr 2026",
        "vacancies": "1,200+",
        "salary": "Level 10 Pay Scale",
        "applyLink": "https://upsc.gov.in",
        "urgent": false
    },
    {
        "id": 11,
        "title": "DRDO Scientist B Recruitment 2026 through GATE",
        "organization": "DRDO",
        "type": "govt",
        "location": "Multiple Labs",
        "qualification": "B.E/B.Tech (GATE Qualified)",
        "experience": "Not Required",
        "lastDate": "Check Portal",
        "vacancies": "650",
        "salary": "\u20b990,000 (Gross)",
        "applyLink": "https://rac.gov.in",
        "urgent": false
    },
    {
        "id": 12,
        "title": "TCS Ninja Hiring 2026 Batch - Smart Hiring Drive",
        "organization": "TCS",
        "type": "private",
        "location": "PAN India",
        "qualification": "B.Sc/BCA/B.Com",
        "experience": "2026 Freshers",
        "lastDate": "10 Feb 2026",
        "vacancies": "35,000",
        "salary": "\u20b91.9 - 3.5 LPA",
        "applyLink": "https://nextstep.tcs.com",
        "urgent": true
    }
];
const examsData = [
    {
        "title": "SSC CHSL Tier 1 Exam Date 2026",
        "date": "12 Mar 2026",
        "icon": "fas fa-calendar-alt",
        "link": "https://ssc.gov.in"
    },
    {
        "title": "UPSC CSE Prelims 2026 Date Out",
        "date": "24 May 2026",
        "icon": "fas fa-calendar-alt",
        "link": "https://upsc.gov.in"
    },
    {
        "title": "IBPS PO CRP XIV Main Exam Schedule",
        "date": "05 Feb 2026",
        "icon": "fas fa-calendar-alt",
        "link": "https://ibps.in"
    },
    {
        "title": "JEE Main Session 2 Schedule 2026",
        "date": "01 Apr 2026",
        "icon": "fas fa-calendar-alt",
        "link": "https://jeemain.nta.nic.in"
    }
];
const resultsData = [
    {
        "title": "SSC MTS Result 2025 Tier 1 Declared",
        "date": "22 Jan 2026",
        "icon": "fas fa-trophy",
        "link": "https://ssc.gov.in"
    },
    {
        "title": "IBPS RRB Officer Scale I Final Result",
        "date": "20 Jan 2026",
        "icon": "fas fa-trophy",
        "link": "https://ibps.in"
    },
    {
        "title": "MP Police Result Merit List 2025",
        "date": "24 Jan 2026",
        "icon": "fas fa-trophy",
        "link": "https://esb.mp.gov.in"
    }
];
const admitCardsData = [
    {
        "title": "SSC CPO 2025 Paper 2 Admit Card",
        "date": "25 Jan 2026",
        "icon": "fas fa-id-card",
        "link": "https://ssc.gov.in"
    },
    {
        "title": "GATE 2026 Hall Ticket Download Link",
        "date": "03 Jan 2026",
        "icon": "fas fa-id-card",
        "link": "https://gate2026.iitr.ac.in"
    },
    {
        "title": "UP Police Constable Exam City Intimation",
        "date": "15 Jan 2026",
        "icon": "fas fa-id-card",
        "link": "https://uppbpb.gov.in"
    }
];
const allJobsData = [...jobsData];