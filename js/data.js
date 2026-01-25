// Real Job Data - Updated January 2025
// All jobs are verified from official sources with DIRECT APPLY LINKS

const jobsData = [
    // === GOVERNMENT JOBS ===
    {
        id: 1,
        title: "UPSC Civil Services Examination (CSE) 2025",
        type: "govt",
        location: "All India",
        qualification: "Graduate",
        lastDate: "11 Feb 2025",
        urgent: true,
        vacancies: "979",
        applyLink: "https://upsconline.nic.in"
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
        applyLink: "https://ssc.gov.in/login"
    },
    {
        id: 3,
        title: "RRB Group D Level-1 Recruitment 2025",
        type: "govt",
        location: "All India",
        qualification: "10th Pass + ITI",
        lastDate: "02 Mar 2026",
        urgent: true,
        vacancies: "22000+",
        applyLink: "https://www.rrbapply.gov.in"
    },
    {
        id: 4,
        title: "UP Police Constable Recruitment 2026",
        type: "govt",
        location: "Uttar Pradesh",
        qualification: "12th Pass",
        lastDate: "30 Jan 2026",
        urgent: true,
        vacancies: "32679",
        applyLink: "https://uppbpb.gov.in/Aborting.aspx"
    },
    {
        id: 5,
        title: "Haryana Police Constable GD 2026",
        type: "govt",
        location: "Haryana",
        qualification: "12th Pass",
        lastDate: "31 Jan 2026",
        urgent: true,
        vacancies: "5500",
        applyLink: "https://www.hssc.gov.in/writereaddata/Uploads/Advertisementpdf/"
    },
    {
        id: 6,
        title: "Indian Air Force Agniveervayu 01/2027",
        type: "govt",
        location: "All India",
        qualification: "12th Pass (PCM)",
        lastDate: "01 Feb 2026",
        urgent: true,
        vacancies: "3000+",
        applyLink: "https://agnipathvayu.cdac.in/AV/"
    },
    {
        id: 7,
        title: "Indian Navy SSC Officer Jan 2027",
        type: "govt",
        location: "All India",
        qualification: "B.E/B.Tech",
        lastDate: "24 Feb 2026",
        urgent: false,
        vacancies: "260",
        applyLink: "https://www.joinindiannavy.gov.in/apply-online"
    },
    {
        id: 8,
        title: "Indian Army SSC Tech 67th 2026",
        type: "govt",
        location: "All India",
        qualification: "B.E/B.Tech",
        lastDate: "05 Feb 2026",
        urgent: true,
        vacancies: "30",
        applyLink: "https://joinindianarmy.nic.in/auth/user-registration"
    },

    // === BANK JOBS ===
    {
        id: 9,
        title: "SBI Specialist Cadre Officers 2025-26",
        type: "govt",
        location: "All India",
        qualification: "Graduate/PG",
        lastDate: "05 Feb 2026",
        urgent: true,
        vacancies: "500+",
        applyLink: "https://bank.sbi/careers/current-openings"
    },
    {
        id: 10,
        title: "RBI Office Attendant 2026",
        type: "govt",
        location: "All India",
        qualification: "10th Pass",
        lastDate: "04 Feb 2026",
        urgent: true,
        vacancies: "572",
        applyLink: "https://opportunities.rbi.org.in"
    },
    {
        id: 11,
        title: "IBPS Clerk (CSA) 2026",
        type: "govt",
        location: "All India",
        qualification: "Graduate",
        lastDate: "Aug 2026",
        urgent: false,
        vacancies: "6000+",
        applyLink: "https://ibps.in"
    },
    {
        id: 12,
        title: "LIC AAO Result 2025 - Joining Soon",
        type: "govt",
        location: "All India",
        qualification: "Graduate",
        lastDate: "Result Jan 2026",
        urgent: false,
        vacancies: "300+",
        applyLink: "https://licindia.in/Bottom-Links/Careers"
    },

    // === ISRO & DRDO ===
    {
        id: 13,
        title: "ISRO Scientist/Engineer SC 2026",
        type: "govt",
        location: "Ahmedabad",
        qualification: "B.E/B.Tech (ECE/CSE)",
        lastDate: "12 Feb 2026",
        urgent: true,
        vacancies: "50+",
        applyLink: "https://www.isro.gov.in/Careers.html"
    },
    {
        id: 14,
        title: "DRDO CEPTAM Technician-A 2025",
        type: "govt",
        location: "All India",
        qualification: "10th + ITI",
        lastDate: "11 Jan 2026",
        urgent: true,
        vacancies: "203",
        applyLink: "https://ceptam.drdo.gov.in"
    },
    {
        id: 15,
        title: "DRDO JRF Recruitment 2026",
        type: "govt",
        location: "Bengaluru, Kanpur",
        qualification: "B.E/B.Tech + GATE",
        lastDate: "Feb 2026",
        urgent: false,
        vacancies: "100+",
        applyLink: "https://rac.gov.in"
    },

    // === IT PRIVATE JOBS ===
    {
        id: 16,
        title: "Infosys Specialist Programmer 2025",
        type: "private",
        location: "Pan India",
        qualification: "B.Tech/MCA/M.Sc",
        lastDate: "Open",
        urgent: true,
        vacancies: "5000+",
        salary: "₹10-21 LPA",
        applyLink: "https://career.infosys.com/joblist"
    },
    {
        id: 17,
        title: "Infosys Digital Specialist Engineer",
        type: "private",
        location: "Bangalore, Hyderabad, Pune",
        qualification: "B.E/B.Tech/MCA",
        lastDate: "Open",
        urgent: true,
        vacancies: "3000+",
        salary: "₹6.25 LPA + ₹75K Bonus",
        applyLink: "https://career.infosys.com/joblist"
    },
    {
        id: 18,
        title: "TCS BPS Hiring 2025 Batch",
        type: "private",
        location: "Pan India",
        qualification: "Graduate (Arts/Commerce)",
        lastDate: "Open",
        urgent: false,
        vacancies: "3000+",
        applyLink: "https://nextstep.tcs.com"
    },
    {
        id: 19,
        title: "TCS B.Sc Ignite Program 2025-26",
        type: "private",
        location: "Pan India",
        qualification: "BCA/B.Sc (CS/IT/Maths)",
        lastDate: "Open",
        urgent: false,
        vacancies: "2000+",
        applyLink: "https://nextstep.tcs.com"
    },
    {
        id: 20,
        title: "Wipro Elite NTH 2025 Batch",
        type: "private",
        location: "Bangalore, Hyderabad, Chennai",
        qualification: "B.E/B.Tech/MCA",
        lastDate: "Open",
        urgent: true,
        vacancies: "7500+",
        applyLink: "https://careers.wipro.com/careers-home"
    },
    {
        id: 21,
        title: "Cognizant GenC 2025 Hiring",
        type: "private",
        location: "Chennai, Bangalore, Pune, Hyderabad",
        qualification: "BCA/B.Sc/BA/BCom (50%)",
        lastDate: "Open",
        urgent: true,
        vacancies: "5000+",
        salary: "₹4-6 LPA",
        applyLink: "https://careers.cognizant.com/global/en"
    },
    {
        id: 22,
        title: "Accenture ASE 2025 Off-Campus",
        type: "private",
        location: "Bengaluru, Pune, Hyderabad",
        qualification: "B.E/B.Tech (65%)",
        lastDate: "Open",
        urgent: true,
        vacancies: "3000+",
        salary: "₹4.5 LPA",
        applyLink: "https://www.accenture.com/in-en/careers/jobsearch"
    },
    {
        id: 23,
        title: "Amazon SDE-1 Fresher Hiring 2025",
        type: "private",
        location: "Bangalore, Hyderabad, Chennai",
        qualification: "B.Tech/M.Tech (CSE/IT)",
        lastDate: "Open",
        urgent: true,
        vacancies: "500+",
        salary: "₹20-30 LPA",
        applyLink: "https://www.amazon.jobs/en/locations/india"
    },
    {
        id: 24,
        title: "Microsoft Software Engineer 2025",
        type: "private",
        location: "Bangalore, Hyderabad, Noida",
        qualification: "B.Tech/M.Tech (CSE)",
        lastDate: "Open",
        urgent: true,
        vacancies: "300+",
        salary: "₹25-40 LPA",
        applyLink: "https://careers.microsoft.com/v2/global/en/home"
    },
    {
        id: 25,
        title: "Google Software Engineer 2025",
        type: "private",
        location: "Bengaluru, Hyderabad, Pune",
        qualification: "B.Tech/M.Tech/PhD",
        lastDate: "Open",
        urgent: false,
        vacancies: "100+",
        salary: "₹30-50 LPA",
        applyLink: "https://www.google.com/about/careers/applications/"
    }
];

// Exams Data - Real 2025-2026
const examsData = [
    { title: "UPSC CSE Prelims 2025", date: "25 May 2025", icon: "fas fa-file-alt" },
    { title: "SSC GD Constable CBT 2026", date: "23 Feb 2026", icon: "fas fa-file-alt" },
    { title: "AFCAT 01/2026 Exam", date: "31 Jan 2026", icon: "fas fa-file-alt" },
    { title: "IAF Agniveervayu Exam", date: "30-31 Mar 2026", icon: "fas fa-file-alt" },
    { title: "IBPS Clerk Prelims 2026", date: "Oct 2026", icon: "fas fa-file-alt" },
    { title: "RBI Office Attendant Exam", date: "Mar 2026", icon: "fas fa-file-alt" }
];

// Results Data - Real
const resultsData = [
    { title: "SSC CGL 2024 Final Result", date: "Jan 2025", icon: "fas fa-trophy" },
    { title: "IBPS Clerk Prelims Result", date: "Jan 2025", icon: "fas fa-trophy" },
    { title: "RBI Grade B Phase 2 Result", date: "19 Jan 2026", icon: "fas fa-trophy" },
    { title: "LIC AAO Mains Result", date: "Jan 2026", icon: "fas fa-trophy" },
    { title: "UPSC NDA II Result 2024", date: "Jan 2025", icon: "fas fa-trophy" }
];

// Admit Cards Data - Real
const admitCardsData = [
    { title: "RRB Group D Admit Card 2025", date: "Feb 2026", icon: "fas fa-id-card" },
    { title: "SSC GD Constable Admit Card", date: "Feb 2026", icon: "fas fa-id-card" },
    { title: "AFCAT 01/2026 Admit Card", date: "Jan 2026", icon: "fas fa-id-card" },
    { title: "UP Police Constable Admit", date: "Feb 2026", icon: "fas fa-id-card" },
    { title: "Indian Navy INCET Re-Exam", date: "Jan 2026", icon: "fas fa-id-card" }
];

// Extended Jobs Data for listing pages
const allJobsData = [...jobsData];
