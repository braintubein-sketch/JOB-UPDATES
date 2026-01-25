// Real Job Data - Updated January 2025
const jobsData = [
    {
        id: 1,
        title: "UPSC Civil Services Examination (CSE) 2025",
        type: "govt",
        location: "All India",
        qualification: "Graduate",
        lastDate: "11 Feb 2025",
        urgent: true,
        vacancies: "979",
        applyLink: "https://upsc.gov.in"
    },
    {
        id: 2,
        title: "SSC GD Constable Recruitment 2026",
        type: "govt",
        location: "All India",
        qualification: "10th Pass",
        lastDate: "31 Dec 2025",
        urgent: true,
        vacancies: "25487",
        applyLink: "https://ssc.nic.in"
    },
    {
        id: 3,
        title: "RRB Group D Level-1 Recruitment 2025",
        type: "govt",
        location: "All India",
        qualification: "10th Pass + ITI",
        lastDate: "02 Mar 2025",
        urgent: true,
        vacancies: "22000+",
        applyLink: "https://indianrailways.gov.in"
    },
    {
        id: 4,
        title: "SSC CHSL 2025 - LDC, DEO Posts",
        type: "govt",
        location: "All India",
        qualification: "12th Pass",
        lastDate: "17 Jul 2025",
        urgent: false,
        vacancies: "3131",
        applyLink: "https://ssc.nic.in"
    },
    {
        id: 5,
        title: "Infosys Specialist Programmer 2025",
        type: "private",
        location: "Pan India",
        qualification: "B.Tech/MCA/M.Sc",
        lastDate: "Open",
        urgent: true,
        vacancies: "5000+",
        salary: "₹10-21 LPA",
        applyLink: "https://careers.infosys.com"
    },
    {
        id: 6,
        title: "TCS BPS Hiring 2025 Batch",
        type: "private",
        location: "Pan India",
        qualification: "Graduate (Arts/Commerce)",
        lastDate: "Open",
        urgent: false,
        vacancies: "3000+",
        applyLink: "https://www.tcs.com/careers"
    },
    {
        id: 7,
        title: "Wipro Elite NTH 2025 Batch",
        type: "private",
        location: "Bangalore, Hyderabad, Chennai",
        qualification: "B.E/B.Tech/MCA",
        lastDate: "Open",
        urgent: false,
        vacancies: "7500+",
        applyLink: "https://careers.wipro.com"
    },
    {
        id: 8,
        title: "PNB Specialist Officers 2025-26",
        type: "govt",
        location: "All India",
        qualification: "Graduate/PG",
        lastDate: "23 Nov 2025",
        urgent: false,
        vacancies: "350",
        applyLink: "https://pnbindia.in"
    }
];

// Real Exams Data - 2025
const examsData = [
    { title: "UPSC CSE Prelims 2025", date: "25 May 2025", icon: "fas fa-file-alt" },
    { title: "SSC GD Constable CBT", date: "Feb-Mar 2025", icon: "fas fa-file-alt" },
    { title: "NABARD Grade A Mains", date: "25 Jan 2026", icon: "fas fa-file-alt" },
    { title: "PNB LBO Exam 2025-26", date: "04 Jan 2026", icon: "fas fa-file-alt" },
    { title: "ECGC PO Exam 2025-26", date: "11 Jan 2026", icon: "fas fa-file-alt" }
];

// Real Results Data
const resultsData = [
    { title: "SSC CGL 2024 Final Result", date: "Jan 2025", icon: "fas fa-trophy" },
    { title: "IBPS Clerk Prelims Result", date: "Jan 2025", icon: "fas fa-trophy" },
    { title: "RRB NTPC Final Result", date: "Dec 2024", icon: "fas fa-trophy" },
    { title: "UPSC NDA II Result 2024", date: "Jan 2025", icon: "fas fa-trophy" },
    { title: "SBI PO Final Result 2024", date: "Dec 2024", icon: "fas fa-trophy" }
];

// Real Admit Cards Data
const admitCardsData = [
    { title: "RRB Group D Admit Card 2025", date: "Feb 2025", icon: "fas fa-id-card" },
    { title: "SSC GD Constable Admit Card", date: "Feb 2025", icon: "fas fa-id-card" },
    { title: "NABARD Grade A Mains Admit", date: "Jan 2026", icon: "fas fa-id-card" },
    { title: "UPSC CSE Prelims Admit Card", date: "May 2025", icon: "fas fa-id-card" },
    { title: "PNB LBO Admit Card 2025-26", date: "Dec 2025", icon: "fas fa-id-card" }
];

// Extended Jobs Data for listing pages
const allJobsData = [
    ...jobsData,
    {
        id: 9,
        title: "NABARD Grade A Officers 2025-26",
        type: "govt",
        location: "All India",
        qualification: "Graduate",
        lastDate: "30 Nov 2025",
        urgent: true,
        vacancies: "150+",
        applyLink: "https://nabard.org"
    },
    {
        id: 10,
        title: "ECGC Probationary Officers 2025-26",
        type: "govt",
        location: "All India",
        qualification: "Graduate",
        lastDate: "02 Dec 2025",
        urgent: false,
        vacancies: "75",
        applyLink: "https://ecgc.in"
    },
    {
        id: 11,
        title: "Infosys Digital Specialist Engineer",
        type: "private",
        location: "Bangalore, Hyderabad, Pune",
        qualification: "B.E/B.Tech/MCA",
        lastDate: "Open",
        urgent: true,
        vacancies: "3000+",
        salary: "₹6.25 LPA + ₹75K Bonus",
        applyLink: "https://careers.infosys.com"
    },
    {
        id: 12,
        title: "TCS B.Sc Ignite Program 2025-26",
        type: "private",
        location: "Pan India",
        qualification: "BCA/B.Sc (CS/IT/Maths)",
        lastDate: "Open",
        urgent: false,
        vacancies: "2000+",
        applyLink: "https://www.tcs.com/careers"
    },
    {
        id: 13,
        title: "Wipro Automotive & Embedded Software",
        type: "private",
        location: "Bangalore, Hyderabad",
        qualification: "B.E/B.Tech (2023/2024)",
        lastDate: "Open",
        urgent: true,
        vacancies: "1000+",
        applyLink: "https://careers.wipro.com"
    },
    {
        id: 14,
        title: "Union Bank Specialist Officers 2025-26",
        type: "govt",
        location: "All India",
        qualification: "Graduate/PG",
        lastDate: "Feb 2025",
        urgent: false,
        vacancies: "200+",
        applyLink: "https://unionbankofindia.co.in"
    },
    {
        id: 15,
        title: "Indian Bank Specialist Officers",
        type: "govt",
        location: "All India",
        qualification: "Graduate/PG",
        lastDate: "Feb 2025",
        urgent: false,
        vacancies: "150+",
        applyLink: "https://indianbank.in"
    },
    {
        id: 16,
        title: "Wipro WILP Program - BCA/B.Sc",
        type: "private",
        location: "Pan India",
        qualification: "BCA/B.Sc (2023/2024)",
        lastDate: "Open",
        urgent: false,
        vacancies: "500+",
        applyLink: "https://careers.wipro.com"
    }
];
