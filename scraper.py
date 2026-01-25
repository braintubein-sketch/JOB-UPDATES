import feedparser
import re
import json
import os
import requests
from datetime import datetime
from bs4 import BeautifulSoup

# Constants for File Paths
CONFIG_PATH = "config.json"
LOG_PATH = "logs.json"
DATABASE_PATH = "js/data.js"

def load_json(path, default):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except:
                return default
    return default

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

def log_event(action, message, counts=None):
    logs = load_json(LOG_PATH, [])
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "action": action,
        "message": message,
        "counts": counts
    }
    logs.insert(0, log_entry)
    save_json(LOG_PATH, logs[:100]) # Keep last 100 entries

def extract_database():
    if not os.path.exists(DATABASE_PATH):
        return [], [], [], []
    
    with open(DATABASE_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    def parse_array(pattern):
        match = re.search(pattern, content, re.DOTALL)
        if not match: return []
        js_str = match.group(1)
        # Convert JS to JSON (quotes keys, removes trailing commas)
        json_str = js_str.replace("'", '"')
        json_str = re.sub(r"(\w+):", r'"\1":', json_str)
        json_str = re.sub(r",\s*\]", "]", json_str)
        json_str = re.sub(r",\s*}", "}", json_str)
        try:
            return json.loads(json_str)
        except:
            return []

    return (
        parse_array(r"const jobsData = (\[.*?\]);"),
        parse_array(r"const examsData = (\[.*?\]);"),
        parse_array(r"const resultsData = (\[.*?\]);"),
        parse_array(r"const admitCardsData = (\[.*?\]);")
    )

def identify_organization(title):
    org_list = [
        "UPSC", "SSC", "IBPS", "RRB", "SBI", "RBI", "Railway", "Indian Army", 
        "Indian Navy", "Air Force", "DRDO", "ISRO", "NIT", "IIT", "Post Office", 
        "Bank of Baroda", "ICICI", "HDFC", "Amazon", "Google", "TCS", "Infosys"
    ]
    for org in org_list:
        if org.lower() in title.lower():
            return org
    return "Official Notification"

def parse_job_details(title, content, link):
    # Smart parsing for detailed fields from title and short description
    title_lower = title.lower()
    
    # Defaults
    details = {
        "title": title,
        "organization": identify_organization(title),
        "location": "All India",
        "qualification": "See Notification",
        "experience": "Fresher" if "fresher" in title_lower else "Check Link",
        "salary": "As per Norms",
        "lastDate": "Check Notification",
        "vacancies": "Check Link",
        "ageLimit": "Check Official PDF",
        "pdfLink": link,
        "applyLink": link,
        "urgent": any(kw in title_lower for kw in ["urgent", "last date", "fast"])
    }

    # Extract Vacancies count if present (e.g. 2000 posts)
    v_match = re.search(r"(\d+)\+?\s*(vacancies|posts|jobs)", title_lower)
    if v_match:
        details["vacancies"] = v_match.group(1)

    # Extract Salary if present (e.g. 40000/-)
    s_match = re.search(r"(rs\.|inr|₹)\s*(\d+[,.]?\d*)", title_lower)
    if s_match:
        details["salary"] = f"₹{s_match.group(2)}"

    # Determine Type
    details["type"] = "govt" if any(kw in title_lower or kw in link.lower() for kw in ["gov", "nic", "upsc", "ssc", "bank", "rrb"]) else "private"

    return details

def fetch_official_updates(sources):
    new_jobs, new_results, new_admits, new_exams = [], [], [], []
    
    for source in sources:
        url = source.get("url")
        print(f"Browsing Official Source: {source.get('name')}...")
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries:
                title = entry.title
                link = entry.get("link", "#")
                date = entry.get("published", datetime.now().strftime("%d %b %Y"))
                
                # Check Domain for Security - Require official extensions or trusted domains
                is_official = any(ext in link.lower() for ext in [".gov", ".nic", ".in", ".org", "upsc", "ssc", "ibps"])
                
                if not is_official:
                    continue # Skip unverified sources

                title_lower = title.lower()
                
                # Categorization
                if any(kw in title_lower for kw in ["admit card", "call letter", "hall ticket"]):
                    new_admits.append({"title": title, "date": date, "link": link, "icon": "fas fa-id-card"})
                elif any(kw in title_lower for kw in ["result", "score", "merit list", "cut off"]):
                    new_results.append({"title": title, "date": date, "link": link, "icon": "fas fa-trophy"})
                elif any(kw in title_lower for kw in ["exam date", "schedule", "calendar", "time table"]):
                    new_exams.append({"title": title, "date": date, "link": link, "icon": "fas fa-calendar-alt"})
                else:
                    new_jobs.append(parse_job_details(title, entry.get("summary", ""), link))
        except Exception as e:
            log_event("error", f"Source {source.get('name')} failed: {str(e)}")
            
    return new_jobs, new_results, new_admits, new_exams

def main():
    config = load_config() if 'load_config' in globals() else load_json(CONFIG_PATH, {})
    if not config.get("auto_browsing_enabled"):
        return

    jobs, exams, results, admits = extract_database()
    
    # Deduplication fingerprint
    def get_fp(item):
        return f"{item.get('title', '')}-{item.get('applyLink', item.get('link', ''))}".lower()

    existing_fps = set(get_fp(i) for i in (jobs + exams + results + admits))
    
    # Fetch
    f_jobs, f_results, f_admits, f_exams = fetch_official_updates(config.get("trusted_sources", []))
    
    counts = {"jobs": 0, "results": 0, "admits": 0, "exams": 0}

    # Add Logic
    for fj in f_jobs:
        if get_fp(fj) not in existing_fps:
            fj["id"] = len(jobs) + counts["jobs"] + 1
            jobs.insert(0, fj)
            existing_fps.add(get_fp(fj))
            counts["jobs"] += 1

    for fr in f_results:
        if get_fp(fr) not in existing_fps:
            results.insert(0, fr)
            existing_fps.add(get_fp(fr))
            counts["results"] += 1

    for fa in f_admits:
        if get_fp(fa) not in existing_fps:
            admits.insert(0, fa)
            existing_fps.add(get_fp(fa))
            counts["admits"] += 1

    for fe in f_exams:
        if get_fp(fe) not in existing_fps:
            exams.insert(0, fe)
            existing_fps.add(get_fp(fe))
            counts["exams"] += 1

    # Database Maintenance
    jobs, results, admits, exams = jobs[:100], results[:40], admits[:40], exams[:40]
    
    # Save
    data_output = f"""// Official Database Hub - Verified {datetime.now().strftime("%Y-%m-%d")}
const jobsData = {json.dumps(jobs, indent=4)};
const examsData = {json.dumps(exams, indent=4)};
const resultsData = {json.dumps(results, indent=4)};
const admitCardsData = {json.dumps(admits, indent=4)};
const allJobsData = [...jobsData];"""

    with open(DATABASE_PATH, "w", encoding="utf-8") as f:
        f.write(data_output)
        
    config["last_successful_run"] = datetime.now().isoformat()
    save_json(CONFIG_PATH, config)
    
    log_event("batch_update", "Official source browsing completed.", counts)
    print(f"Backend Sync Complete: {counts}")

if __name__ == "__main__":
    main()
