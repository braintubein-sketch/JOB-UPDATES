// Sample Job Data
const jobsData = [
    {
        id: 1,
        title: "SSC CGL 2024 - Combined Graduate Level Examination",
        type: "govt",
        location: "All India",
        qualification: "Graduate",
        lastDate: "15 Feb 2024",
        urgent: true,
        vacancies: "17727"
    },
    {
        id: 2,
        title: "IBPS Clerk XIV Recruitment 2024",
        type: "govt",
        location: "All India",
        qualification: "Graduate",
        lastDate: "20 Feb 2024",
        urgent: false,
        vacancies: "6128"
    },
    {
        id: 3,
        title: "TCS Digital Hiring - Freshers 2024",
        type: "private",
        location: "Pan India",
        qualification: "B.Tech/MCA",
        lastDate: "28 Feb 2024",
        urgent: false,
        vacancies: "5000+"
    },
    {
        id: 4,
        title: "Railway RRB NTPC Graduate Level Posts",
        type: "govt",
        location: "All India",
        qualification: "Graduate",
        lastDate: "10 Mar 2024",
        urgent: true,
        vacancies: "11558"
    },
    {
        id: 5,
        title: "Infosys Off Campus Drive 2024",
        type: "private",
        location: "Bangalore, Pune, Hyderabad",
        qualification: "B.E/B.Tech",
        lastDate: "15 Mar 2024",
        urgent: false,
        vacancies: "3000+"
    },
    {
        id: 6,
        title: "UPSC Civil Services Examination 2024",
        type: "govt",
        location: "All India",
        qualification: "Graduate",
        lastDate: "25 Feb 2024",
        urgent: true,
        vacancies: "1056"
    },
    {
        id: 7,
        title: "Wipro Elite NLTH 2024 Hiring",
        type: "private",
        location: "Multiple Locations",
        qualification: "B.Tech/MCA/M.Sc",
        lastDate: "20 Mar 2024",
        urgent: false,
        vacancies: "2500+"
    },
    {
        id: 8,
        title: "SBI Probationary Officer 2024",
        type: "govt",
        location: "All India",
        qualification: "Graduate",
        lastDate: "05 Mar 2024",
        urgent: true,
        vacancies: "2000"
    }
];

// Exams Data
const examsData = [
    { title: "SSC CGL Tier 1 2024", date: "Mar 2024", icon: "fas fa-file-alt" },
    { title: "IBPS Clerk Mains", date: "Feb 2024", icon: "fas fa-file-alt" },
    { title: "RRB NTPC CBT 2", date: "Apr 2024", icon: "fas fa-file-alt" },
    { title: "UPSC CSE Prelims", date: "May 2024", icon: "fas fa-file-alt" },
    { title: "SBI PO Prelims", date: "Mar 2024", icon: "fas fa-file-alt" }
];

// Results Data
const resultsData = [
    { title: "IBPS Clerk Prelims Result", date: "Jan 2024", icon: "fas fa-trophy" },
    { title: "SSC CHSL Final Result", date: "Jan 2024", icon: "fas fa-trophy" },
    { title: "RRB Group D Result", date: "Dec 2023", icon: "fas fa-trophy" },
    { title: "UPSC NDA Result", date: "Jan 2024", icon: "fas fa-trophy" },
    { title: "SBI Clerk Final Result", date: "Jan 2024", icon: "fas fa-trophy" }
];

// Admit Cards Data
const admitCardsData = [
    { title: "RRB NTPC Admit Card", date: "Feb 2024", icon: "fas fa-id-card" },
    { title: "SSC CGL Tier 1 Admit Card", date: "Feb 2024", icon: "fas fa-id-card" },
    { title: "IBPS Clerk Mains Admit", date: "Feb 2024", icon: "fas fa-id-card" },
    { title: "UPSC EPFO Admit Card", date: "Feb 2024", icon: "fas fa-id-card" },
    { title: "SBI PO Prelims Admit", date: "Mar 2024", icon: "fas fa-id-card" }
];

// Extended Jobs Data for listing pages
const allJobsData = [
    ...jobsData,
    {
        id: 9,
        title: "Indian Army Technical Entry Scheme TES 52",
        type: "govt",
        location: "All India",
        qualification: "12th (PCM)",
        lastDate: "28 Feb 2024",
        urgent: false,
        vacancies: "90"
    },
    {
        id: 10,
        title: "DRDO Scientist B Recruitment 2024",
        type: "govt",
        location: "Multiple Locations",
        qualification: "B.E/B.Tech",
        lastDate: "15 Mar 2024",
        urgent: true,
        vacancies: "290"
    },
    {
        id: 11,
        title: "Amazon SDE Hiring 2024",
        type: "private",
        location: "Bangalore, Hyderabad",
        qualification: "B.Tech/M.Tech",
        lastDate: "Open",
        urgent: false,
        vacancies: "1000+"
    },
    {
        id: 12,
        title: "ISRO Scientist/Engineer SC 2024",
        type: "govt",
        location: "Multiple Locations",
        qualification: "B.E/B.Tech",
        lastDate: "20 Mar 2024",
        urgent: true,
        vacancies: "303"
    },
    {
        id: 13,
        title: "Google Software Engineer Hiring",
        type: "private",
        location: "Bangalore, Hyderabad",
        qualification: "B.Tech/M.Tech/PhD",
        lastDate: "Open",
        urgent: false,
        vacancies: "500+"
    },
    {
        id: 14,
        title: "ONGC Graduate Trainee 2024",
        type: "govt",
        location: "All India",
        qualification: "Graduate",
        lastDate: "25 Feb 2024",
        urgent: false,
        vacancies: "2500"
    },
    {
        id: 15,
        title: "Microsoft Fresher Hiring 2024",
        type: "private",
        location: "Bangalore, Noida, Hyderabad",
        qualification: "B.E/B.Tech/MCA",
        lastDate: "Open",
        urgent: false,
        vacancies: "800+"
    },
    {
        id: 16,
        title: "Indian Navy SSR/MR Recruitment",
        type: "govt",
        location: "All India",
        qualification: "10th/12th Pass",
        lastDate: "10 Mar 2024",
        urgent: true,
        vacancies: "1500"
    }
];
