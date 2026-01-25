import feedparser
import re
import json
import os
import requests
from datetime import datetime

# ==========================================
# OFFICIAL API & RSS BACKEND SYSTEM
# ==========================================
# This system uses structured data endpoints Only.
# No scraping or crawling is performed.

CONFIG_FILE = "config.json"
LOG_FILE = "logs.json"
DATA_FILE = "js/data.js"

def load_json(path, default):
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            return default
    return default

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

def log_event(action, message, counts=None):
    logs = load_json(LOG_FILE, [])
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "action": action,
        "message": message,
        "counts": counts
    }
    logs.insert(0, log_entry)
    save_json(LOG_FILE, logs[:50])

def get_current_db():
    if not os.path.exists(DATA_FILE):
        return [], [], [], []
    
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {DATA_FILE}: {e}")
        return None, None, None, None

    def extract_list(var_name):
        # Precise non-greedy regex
        pattern = rf"const {var_name}\s*=\s*(\[.*?\]);"
        match = re.search(pattern, content, re.DOTALL)
        if not match:
            return []
        
        json_str = match.group(1)
        
        # Cleanup (Comment out for now to ensure URL safety or use advanced regex)
        # We only remove comments that start at the beginning of a line or space
        # to avoid breaking URLs like https://
        cleaned = re.sub(r'^\s*//.*$', '', json_str, flags=re.MULTILINE)
        
        try:
            return json.loads(cleaned, strict=False)
        except Exception as e:
            # If that fails, it might be due to trailing commas or single quotes
            try:
                # 1. Strip trailing commas
                cleaned = re.sub(r",\s*([\]}])", r"\1", cleaned)
                # 2. Convert single quotes to double quotes
                cleaned = cleaned.replace("'", '"')
                return json.loads(cleaned, strict=False)
            except Exception as e2:
                print(f"CRITICAL: Failed to parse {var_name}.")
                print(f"Original Error: {e}")
                print(f"Repair Error: {e2}")
                return None

    jobs = extract_list("jobsData")
    exams = extract_list("examsData")
    results = extract_list("resultsData")
    admits = extract_list("admitCardsData")

    return jobs, exams, results, admits

def fetch_structured_data(endpoints):
    new_jobs, new_results, new_admits, new_exams = [], [], [], []
    
    for source in endpoints:
        url = source.get("url")
        print(f"Fetching from Official Endpoint: {source.get('name')}...")
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries:
                link = entry.get("link", "#")
                
                # Security Filter
                official_domains = [".gov.in", ".nic.in", ".ac.in", "upsc.gov.in", "ssc.gov.in", "ibps.in", ".org.in", "india.gov.in", "navy.mil", "army.mil"]
                if not any(domain in link.lower() for domain in official_domains):
                    continue

                title = entry.title
                title_lower = title.lower()
                date = entry.get("published", datetime.now().strftime("%d %b %Y"))
                
                # Organization Mapping
                org = "Various"
                for o in ["UPSC", "SSC", "IBPS", "SBI", "Army", "Navy", "Railway"]:
                    if o.lower() in title_lower:
                        org = o
                        break
                
                job_data = {
                    "title": title,
                    "organization": org,
                    "type": "govt" if any(kw in (title_lower + link.lower()) for kw in ["govt", "sarkari", "gov.in"]) else "private",
                    "location": "All India",
                    "qualification": "See Notification",
                    "lastDate": "Check Official Portal",
                    "applyLink": link,
                    "urgent": any(kw in title_lower for kw in ["urgent", "last date", "deadline"])
                }

                if any(kw in title_lower for kw in ["admit card", "call letter", "hall ticket"]):
                    new_admits.append({"title": title, "date": date, "link": link, "icon": "fas fa-id-card"})
                elif any(kw in title_lower for kw in ["result", "score", "merit list"]):
                    new_results.append({"title": title, "date": date, "link": link, "icon": "fas fa-trophy"})
                elif any(kw in title_lower for kw in ["exam date", "schedule"]):
                    new_exams.append({"title": title, "date": date, "link": link, "icon": "fas fa-calendar-alt"})
                else:
                    new_jobs.append(job_data)
        except Exception as e:
            print(f"Error fetching from {url}: {e}")

    return new_jobs, new_results, new_admits, new_exams

def generate_sitemap(jobs):
    base_url = "https://jobupdate.site"
    today = datetime.now().strftime("%Y-%m-%d")
    
    static_pages = [
        "", "/govt-jobs.html", "/private-jobs.html", "/freshers-jobs.html", 
        "/results.html", "/admit-cards.html", "/exams.html", "/about.html", 
        "/contact.html", "/disclaimer.html", "/privacy.html", "/terms.html"
    ]
    
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for page in static_pages:
        sitemap += f'    <url>\n        <loc>{base_url}{page}</loc>\n        <lastmod>{today}</lastmod>\n        <priority>{"1.0" if page == "" else "0.8"}</priority>\n    </url>\n'
    
    for job in jobs[:60]: 
        job_id = job.get("id")
        if job_id:
            sitemap += f'    <url>\n        <loc>{base_url}/job-details.html?id={job_id}</loc>\n        <lastmod>{today}</lastmod>\n        <priority>0.7</priority>\n    </url>\n'
        
    sitemap += "</urlset>"
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap)

def main():
    config = load_json(CONFIG_FILE, {"auto_fetch_enabled": True, "official_endpoints": []})
    if not config.get("auto_fetch_enabled", True):
        return

    jobs, exams, results, admits = get_current_db()
    
    if any(x is None for x in [jobs, exams, results, admits]):
        print("ABORT: One or more data categories were corrupt. Stopping to prevent data loss.")
        return

    # Fingerprints for uniqueness
    def get_fp(item):
        return f"{item.get('title')}-{item.get('applyLink', item.get('link', ''))}".lower().strip()

    existing_fps = set(get_fp(i) for i in (jobs + exams + results + admits))
    
    f_jobs, f_results, f_admits, f_exams = fetch_structured_data(config.get("official_endpoints", []))
    
    counts = {"jobs": 0, "results": 0, "admits": 0, "exams": 0}

    def sync(fetched, db, key, has_id=False):
        for item in fetched:
            if get_fp(item) not in existing_fps:
                if has_id:
                    item["id"] = max([j.get('id', 0) for j in jobs] + [99]) + 1
                db.insert(0, item)
                existing_fps.add(get_fp(item))
                counts[key] += 1

    sync(f_jobs, jobs, "jobs", True)
    sync(f_results, results, "results")
    sync(f_admits, admits, "admits")
    sync(f_exams, exams, "exams")

    # Limit history
    jobs, results, admits, exams = jobs[:100], results[:40], admits[:40], exams[:40]
    
    # Save database
    db_content = f"""// Official Data Hub - Updated {datetime.now().strftime("%Y-%m-%d")}
const jobsData = {json.dumps(jobs, indent=4)};
const examsData = {json.dumps(exams, indent=4)};
const resultsData = {json.dumps(results, indent=4)};
const admitCardsData = {json.dumps(admits, indent=4)};
const allJobsData = [...jobsData];"""

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        f.write(db_content)
        
    generate_sitemap(jobs)
    log_event("sync", "Success", counts)
    print(f"Sync complete. Added {sum(counts.values())} new items.")

if __name__ == "__main__":
    main()
