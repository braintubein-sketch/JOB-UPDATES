import feedparser
import re
import json
import os
from datetime import datetime
import requests
from bs4 import BeautifulSoup

# Files
CONFIG_FILE = "config.json"
LOG_FILE = "logs.json"
DATA_FILE = "js/data.js"

def load_config():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, "r") as f:
            return json.load(f)
    return {"auto_browsing_enabled": True, "sources": []}

def save_log(action, message, counts=None):
    logs = []
    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE, "r") as f:
                logs = json.load(f)
        except:
            logs = []
            
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "action": action,
        "message": message,
        "counts": counts
    }
    logs.insert(0, log_entry)
    with open(LOG_FILE, "w") as f:
        json.dump(logs[:50], f, indent=4)

def load_current_data():
    if not os.path.exists(DATA_FILE):
        return [], [], [], []
    
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        content = f.read()
        
    def js_to_json(match_pattern):
        match = re.search(match_pattern, content, re.DOTALL)
        if not match: return []
        js_str = match.group(1)
        # Attempt to clean JS object to JSON
        json_str = js_str.replace("'", '"')
        json_str = re.sub(r"(\w+):", r'"\1":', json_str)
        json_str = re.sub(r",\s*\]", "]", json_str)
        json_str = re.sub(r",\s*}", "}", json_str)
        try:
            return json.loads(json_str)
        except Exception as e:
            print(f"JSON Parse Error: {e}")
            return []

    return (
        js_to_json(r"const jobsData = (\[.*?\]);"),
        js_to_json(r"const examsData = (\[.*?\]);"),
        js_to_json(r"const resultsData = (\[.*?\]);"),
        js_to_json(r"const admitCardsData = (\[.*?\]);")
    )

def extract_organization(title):
    # Common org name extraction patterns
    orgs = ["SSC", "UPSC", "RRB", "IBPS", "SBI", "RBI", "Railway", "Police", "Indian Army", "Indian Navy", "DRDO", "ISRO", "NIT", "IIT", "Zoho", "Google", "Amazon", "Microsoft", "TCS", "Wipro", "Infosys"]
    for org in orgs:
        if org.lower() in title.lower():
            return org
    return "Various"

def fetch_updates(sources):
    new_jobs, new_results, new_admits, new_exams = [], [], [], []
    
    for url in sources:
        print(f"Connecting to source: {url}")
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries:
                title = entry.title
                link = entry.get("link", "#")
                date = entry.get("published", datetime.now().strftime("%d %b %Y"))
                title_lower = title.lower()
                
                # Base update object
                update_obj = {
                    "title": title,
                    "date": date,
                    "link": link,
                    "organization": extract_organization(title)
                }

                if any(kw in title_lower for kw in ["admit card", "call letter", "hall ticket"]):
                    update_obj["icon"] = "fas fa-id-card"
                    new_admits.append(update_obj)
                elif any(kw in title_lower for kw in ["result", "score", "merit list", "cut off"]):
                    update_obj["icon"] = "fas fa-trophy"
                    new_results.append(update_obj)
                elif any(kw in title_lower for kw in ["exam date", "schedule", "calendar", "time table"]):
                    update_obj["icon"] = "fas fa-calendar-alt"
                    new_exams.append(update_obj)
                else:
                    # Enrich Job Data
                    new_jobs.append({
                        "title": title,
                        "organization": update_obj["organization"],
                        "type": "govt" if "govt" in url or "sarkari" in title_lower or "upsc" in title_lower or "ssc" in title_lower else "private",
                        "location": "All India",
                        "qualification": "Graduate/Diploma/12th" if "graduate" in title_lower or "diploma" in title_lower else "See Notification",
                        "experience": "Fresher" if "fresher" in title_lower else "Check Link",
                        "lastDate": "Check Notification",
                        "urgent": True if "urgent" in title_lower else False,
                        "vacancies": "Check Link",
                        "applyLink": link,
                        "notificationPdf": link # Default to link if real PDF scraping isn't implemented
                    })
        except Exception as e:
            save_log("error", f"Failed to fetch from {url}: {str(e)}")
            
    return new_jobs, new_results, new_admits, new_exams

def main():
    config = load_config()
    if not config.get("auto_browsing_enabled"):
        save_log("skip", "Auto-browsing is disabled in config.")
        return

    jobs, exams, results, admits = load_current_data()
    
    # Fingerprinting for deduplication (using title and link)
    def get_fingerprint(item):
        return f"{item.get('title', '')}-{item.get('link', item.get('applyLink', ''))}".lower()

    existing_fingerprints = set()
    for item in jobs + exams + results + admits:
        existing_fingerprints.add(get_fingerprint(item))
    
    fetched_jobs, fetched_results, fetched_admits, fetched_exams = fetch_updates(config.get("sources", []))
    
    counts = {"jobs": 0, "results": 0, "admits": 0, "exams": 0}
    
    # Helper to add unique items
    def add_if_unique(fetched_list, data_list, count_key, is_job=False):
        for item in fetched_list:
            fp = get_fingerprint(item)
            if fp not in existing_fingerprints:
                if is_job:
                    item["id"] = len(jobs) + counts["jobs"] + 1
                data_list.insert(0, item)
                existing_fingerprints.add(fp)
                counts[count_key] += 1

    add_if_unique(fetched_jobs, jobs, "jobs", True)
    add_if_unique(fetched_results, results, "results")
    add_if_unique(fetched_admits, admits, "admits")
    add_if_unique(fetched_exams, exams, "exams")
    
    # Trim lists
    jobs, results, admits, exams = jobs[:100], results[:30], admits[:30], exams[:30]
    
    # Write updated data.js
    output = f"""// Auto-Generated Data Hub - {datetime.now().strftime("%Y-%m-%d %H:%M")}
const jobsData = {json.dumps(jobs, indent=4)};
const examsData = {json.dumps(exams, indent=4)};
const resultsData = {json.dumps(results, indent=4)};
const admitCardsData = {json.dumps(admits, indent=4)};
const allJobsData = [...jobsData];"""
    
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        f.write(output)
        
    # Finalize log
    save_log("update", "Daily automation completed successfully.", counts)
    print(f"Update complete: {counts}")

if __name__ == "__main__":
    main()
