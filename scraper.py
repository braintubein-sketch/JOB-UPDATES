import feedparser
import re
import json
import os
from datetime import datetime

# Configuration: RSS feeds for job updates
# You can add more reliable RSS feeds here
RSS_FEEDS = [
    "https://www.fresherslive.com/sarkari-result/rss",
    "https://www.indgovtjobs.in/feeds/posts/default?alt=rss"
]

DATA_FILE = "js/data.js"

def load_current_data():
    if not os.path.exists(DATA_FILE):
        return [], [], [], []
    
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Extract arrays using regex
    jobs_match = re.search(r"const jobsData = (\[.*?\]);", content, re.DOTALL)
    exams_match = re.search(r"const examsData = (\[.*?\]);", content, re.DOTALL)
    results_match = re.search(r"const resultsData = (\[.*?\]);", content, re.DOTALL)
    admit_match = re.search(r"const admitCardsData = (\[.*?\]);", content, re.DOTALL)
    
    # Helper to clean up JS object to JSON
    def js_to_json(match):
        if not match: return []
        js_str = match.group(1)
        # Very basic conversion: replace single quotes and handle trailing commas
        # A more robust parser would be better, but for this structure it works
        json_str = js_str.replace("'", '"')
        json_str = re.sub(r"(\w+):", r'"\1":', json_str) # quote keys
        json_str = re.sub(r",\s*\]", "]", json_str) # trailing comma in list
        json_str = re.sub(r",\s*}", "}", json_str) # trailing comma in object
        try:
            return json.loads(json_str)
        except:
            return []

    return js_to_json(jobs_match), js_to_json(exams_match), js_to_json(results_match), js_to_json(admit_match)

def fetch_rss_updates():
    new_jobs = []
    new_results = []
    new_admits = []
    new_exams = []
    
    for url in RSS_FEEDS:
        print(f"Fetching from {url}...")
        feed = feedparser.parse(url)
        for entry in feed.entries:
            title = entry.title
            link = entry.get("link", "#")
            date = entry.get("published", datetime.now().strftime("%d %b %Y"))
            
            # Category detection logic
            title_lower = title.lower()
            
            # Admit Cards
            if any(kw in title_lower for kw in ["admit card", "call letter", "hall ticket"]):
                new_admits.append({
                    "title": title,
                    "date": date,
                    "icon": "fas fa-id-card",
                    "link": link
                })
            # Results
            elif any(kw in title_lower for kw in ["result", "score", "merit list", "cut off"]):
                new_results.append({
                    "title": title,
                    "date": date,
                    "icon": "fas fa-trophy",
                    "link": link
                })
            # Exams
            elif any(kw in title_lower for kw in ["exam date", "schedule", "calendar", "time table"]):
                new_exams.append({
                    "title": title,
                    "date": date,
                    "icon": "fas fa-calendar-alt",
                    "link": link
                })
            # Otherwise, assume it's a Job Post
            else:
                new_jobs.append({
                    "title": title,
                    "type": "govt",
                    "location": "All India",
                    "qualification": "See Notification",
                    "lastDate": "Check Link",
                    "urgent": True if any(kw in title_lower for kw in ["urgent", "fast"]) else False,
                    "vacancies": "Check Link",
                    "applyLink": link
                })
    return new_jobs, new_results, new_admits, new_exams

def main():
    jobs, exams, results, admits = load_current_data()
    
    # Track titles for deduplication
    existing_job_titles = {j['title'] for j in jobs}
    existing_result_titles = {r.get('title') for r in results}
    existing_exam_titles = {e.get('title') for e in exams}
    existing_admit_titles = {a.get('title') for a in admits}
    
    fetched_jobs, fetched_results, fetched_admits, fetched_exams = fetch_rss_updates()
    
    # Add unique ones to the top
    counts = {"jobs": 0, "results": 0, "admits": 0, "exams": 0}
    
    for fj in fetched_jobs:
        if fj['title'] not in existing_job_titles:
            fj['id'] = len(jobs) + counts["jobs"] + 1
            jobs.insert(0, fj)
            existing_job_titles.add(fj['title'])
            counts["jobs"] += 1
            
    for fr in fetched_results:
        if fr['title'] not in existing_result_titles:
            results.insert(0, fr)
            existing_result_titles.add(fr['title'])
            counts["results"] += 1

    for fa in fetched_admits:
        if fa['title'] not in existing_admit_titles:
            admits.insert(0, fa)
            existing_admit_titles.add(fa['title'])
            counts["admits"] += 1

    for fe in fetched_exams:
        if fe['title'] not in existing_exam_titles:
            exams.insert(0, fe)
            existing_exam_titles.add(fe['title'])
            counts["exams"] += 1
            
    # Keep lists manageable
    jobs = jobs[:100]
    results = results[:30]
    admits = admits[:30]
    exams = exams[:30]
    
    # Generate the JS file content
    output = f"""// Real Job Data - Updated {datetime.now().strftime("%B %Y")}
// This file is auto-generated by scraper.py

const jobsData = {json.dumps(jobs, indent=4)};

const examsData = {json.dumps(exams, indent=4)};

const resultsData = {json.dumps(results, indent=4)};

const admitCardsData = {json.dumps(admits, indent=4)};

const allJobsData = [...jobsData];
"""
    
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        f.write(output)
        
    print(f"Update complete: {{counts['jobs']}} Jobs, {{counts['results']}} Results, {{counts['admits']}} Admits, {{counts['exams']}} Exams added.")

if __name__ == "__main__":
    main()
