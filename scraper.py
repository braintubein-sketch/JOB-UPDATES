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
    
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    def extract_list(pattern):
        match = re.search(pattern, content, re.DOTALL)
        if not match: return []
        js_str = match.group(1)
        json_str = js_str.replace("'", '"')
        json_str = re.sub(r"(\w+):", r'"\1":', json_str)
        json_str = re.sub(r",\s*\]", "]", json_str)
        json_str = re.sub(r",\s*}", "}", json_str)
        try:
            return json.loads(json_str)
        except:
            return []

    return (
        extract_list(r"const jobsData = (\[.*?\]);"),
        extract_list(r"const examsData = (\[.*?\]);"),
        extract_list(r"const resultsData = (\[.*?\]);"),
        extract_list(r"const admitCardsData = (\[.*?\]);")
    )

def fetch_structured_data(endpoints):
    new_jobs, new_results, new_admits, new_exams = [], [], [], []
    
    for source in endpoints:
        url = source.get("url")
        print(f"Fetching from Official Endpoint: {source.get('name')}...")
        try:
            # RSS Parsing
            feed = feedparser.parse(url)
            for entry in feed.entries:
                link = entry.get("link", "#")
                
                # Security: Only Official Domains allowed
                # Validates link points only to trusted gov/official domains
                official_domains = [".gov.in", ".nic.in", ".ac.in", "upsc.gov.in", "ssc.gov.in", "ibps.in", ".org.in"]
                if not any(domain in link.lower() for domain in official_domains):
                    continue

                title = entry.title
                title_lower = title.lower()
                date = entry.get("published", datetime.now().strftime("%d %b %Y"))
                
                # Structured Job Fields
                job_data = {
                    "title": title,
                    "organization": source.get("name", "Official Dept"),
                    "type": source.get("type", "govt"),
                    "location": "All India",
                    "qualification": "See Notification",
                    "lastDate": "Check Portal",
                    "applyLink": link,
                    "pdfLink": link 
                }

                # Auto-Categorization based on Endpoint metadata/title
                if any(kw in title_lower for kw in ["admit card", "call letter", "hall ticket"]):
                    new_admits.append({"title": title, "date": date, "link": link, "icon": "fas fa-id-card"})
                elif any(kw in title_lower for kw in ["result", "score", "merit list"]):
                    new_results.append({"title": title, "date": date, "link": link, "icon": "fas fa-trophy"})
                elif any(kw in title_lower for kw in ["exam date", "schedule"]):
                    new_exams.append({"title": title, "date": date, "link": link, "icon": "fas fa-calendar-alt"})
                else:
                    new_jobs.append(job_data)
        except Exception as e:
            log_event("error", f"Fetch failed for {url}: {str(e)}")

    return new_jobs, new_results, new_admits, new_exams

def generate_sitemap(jobs):
    base_url = "https://jobupdate.site"
    today = datetime.now().strftime("%Y-%m-%d")
    
    static_pages = [
        "", "/govt-jobs.html", "/private-jobs.html", "/freshers-jobs.html", 
        "/results.html", "/admit-cards.html", "/exams.html", "/about.html", 
        "/contact.html", "/disclaimer.html", "/privacy.html"
    ]
    
    sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # Static Pages
    for page in static_pages:
        sitemap_content += f'    <url>\n        <loc>{base_url}{page}</loc>\n        <lastmod>{today}</lastmod>\n        <priority>{"1.0" if page == "" else "0.8"}</priority>\n    </url>\n'
    
    # Dynamic Job Pages
    for job in jobs[:50]: # SEO for latest 50 jobs
        sitemap_content += f'    <url>\n        <loc>{base_url}/job-details.html?id={job["id"]}</loc>\n        <lastmod>{today}</lastmod>\n        <priority>0.7</priority>\n    </url>\n'
        
    sitemap_content += "</urlset>"
    
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap_content)

def main():
    config = load_json(CONFIG_FILE, {"auto_fetch_enabled": True, "official_endpoints": []})
    if not config.get("auto_fetch_enabled", True):
        return

    jobs, exams, results, admits = get_current_db()
    
    # Deduplication Fingerprints
    def get_fp(item):
        return f"{item.get('title')}-{item.get('applyLink', item.get('link'))}".lower().strip()

    existing_fps = set(get_fp(i) for i in (jobs + exams + results + admits))
    
    f_jobs, f_results, f_admits, f_exams = fetch_structured_data(config.get("official_endpoints", []))
    
    counts = {"jobs": 0, "results": 0, "admits": 0, "exams": 0}

    # Atomically Add New Entries
    def sync_items(fetched_list, db_list, count_key, has_id=False):
        for item in fetched_list:
            if get_fp(item) not in existing_fps:
                if has_id:
                    # Maintain correct ID sequence
                    item["id"] = max([j.get('id', 0) for j in jobs] + [0]) + 1
                db_list.insert(0, item)
                existing_fps.add(get_fp(item))
                counts[count_key] += 1

    sync_items(f_jobs, jobs, "jobs", True)
    sync_items(f_results, results, "results")
    sync_items(f_admits, admits, "admits")
    sync_items(f_exams, exams, "exams")

    # Limit Data size for performance
    jobs, results, admits, exams = jobs[:100], results[:30], admits[:30], exams[:30]
    
    # Write to Data Store
    output = f"""// Official Data Hub - Updated {datetime.now().strftime("%Y-%m-%d")}
const jobsData = {json.dumps(jobs, indent=4)};
const examsData = {json.dumps(exams, indent=4)};
const resultsData = {json.dumps(results, indent=4)};
const admitCardsData = {json.dumps(admits, indent=4)};
const allJobsData = [...jobsData];"""

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        f.write(output)
        
    # Generate SEO Sitemap
    generate_sitemap(jobs)
        
    log_event("sync", "Official data and sitemap fetch completed.", counts)
    print(f"Task Finished. Fetched {counts['jobs']} new jobs and updated sitemap.")

if __name__ == "__main__":
    main()
