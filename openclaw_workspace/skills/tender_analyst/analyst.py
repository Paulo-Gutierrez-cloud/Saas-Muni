import argparse
import json
import os
import sys
import psycopg2
import math

# Configuration
DB_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@db:5432/licitaciones_ti")
PROFILE_PATH = "/home/node/.openclaw/config/company_profile.json"

def get_db_connection():
    try:
        conn = psycopg2.connect(DB_URL)
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        sys.exit(1)

def load_profile():
    try:
        with open(PROFILE_PATH, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Company profile not found. Please configure config/company_profile.json")
        sys.exit(1)

def analyze_tender(code):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT codigo_externo, nombre, descripcion, comprador_region_unidad, categoria_ia FROM licitaciones WHERE codigo_externo = %s", (code,))
    tender = cur.fetchone()
    conn.close()

    if not tender:
        print(f"Tender {code} not found.")
        return

    profile = load_profile()
    
    # Simple Heuristic Analysis
    score = 0
    max_score = 100
    details = []

    # 1. Tech Stack Match (Mock logic - creating simple keyword matching)
    profile_stack = set(
        profile['tech_stack']['languages'] + 
        profile['tech_stack']['frameworks'] + 
        profile['tech_stack']['cloud']
    )
    
    tender_name = tender[1] or ""
    tender_desc = tender[2] or ""
    tender_text = (tender_name + " " + tender_desc).lower()
    matched_tech = []
    
    for tech in profile_stack:
        if tech.lower() in tender_text:
            matched_tech.append(tech)
            score += 10
    
    if matched_tech:
        details.append(f"✅ Tech Stack Match: {', '.join(matched_tech)}")
    else:
        details.append("⚠️ Low Tech Stack Match")
        
    # 2. Region Match
    if tender[3] in profile['preferred_regions']:
        score += 20
        details.append(f"✅ Region Match: {tender[3]}")
    else:
        details.append(f"📍 Region: {tender[3]} (Outside preferred)")

    # 3. Category
    details.append(f"📂 Category: {tender[4]}")

    # Normalize Score
    final_prob = min(max(score + 30, 0), 100) # Base score 30

    print(f"--- Analysis for {tender[0]} ---")
    print(f"Name: {tender[1]}")
    print(f"Win Probability: {final_prob}%")
    print("\nDetails:")
    for d in details:
        print(f"- {d}")
    
    print("\nRequired Documents (Estimated):")
    print("- Certificado de Vigencia")
    print("- Declaración Jurada Simple")
    print("- Garantía de Seriedad de la Oferta")

def strategy_tender(code):
    print(f"Generating strategy for {code}...")
    # Mock strategy generation
    profile = load_profile()
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT nombre FROM licitaciones WHERE codigo_externo = %s", (code,))
    res = cur.fetchone()
    conn.close()
    
    if not res:
        print("Tender not found.")
        return

    print(f"# Strategy Proposal: {res[0]}")
    print("\n## 1. Executive Summary")
    print(f"We propose a solution leveraging {profile['company_name']}'s expertise in {', '.join(profile['capabilities'][:3])}.")
    print("\n## 2. Technical Approach")
    print("Our approach focuses on scalability and security, utilizing:")
    print(f"- Backend: {profile['tech_stack']['frameworks'][2]} ({profile['tech_stack']['languages'][0]})")
    print(f"- Cloud Infrastructure: {profile['tech_stack']['cloud'][0]}")
    print("\n## 3. Team Composition")
    print(f"- Project Manager (1)")
    print(f"- Senior Developers ({int(profile['team_size']/5)})")
    print(f"- QA Engineers (1)")

def list_opportunities(limit):
    conn = get_db_connection()
    cur = conn.cursor()
    # Mock ranking: just get latest for now, real implementation would run scoring against all
    cur.execute("SELECT codigo_externo, nombre, score_probabilidad FROM licitaciones ORDER BY created_at DESC LIMIT %s", (limit,))
    rows = cur.fetchall()
    conn.close()

    print(f"Top {limit} Opportunities:")
    for row in rows:
        print(f"[{row[0]}] {row[1]} (Base Score: {row[2]})")

def main():
    parser = argparse.ArgumentParser(description='Tender Analyst Skill')
    subparsers = parser.add_subparsers(dest='command')

    analyze_parser = subparsers.add_parser('analyze')
    analyze_parser.add_argument('--code', required=True, help='Tender Code')

    strategy_parser = subparsers.add_parser('strategy')
    strategy_parser.add_argument('--code', required=True, help='Tender Code')

    opps_parser = subparsers.add_parser('opportunities')
    opps_parser.add_argument('--limit', type=int, default=5, help='Limit results')

    args = parser.parse_args()

    if args.command == 'analyze':
        analyze_tender(args.code)
    elif args.command == 'strategy':
        strategy_tender(args.code)
    elif args.command == 'opportunities':
        list_opportunities(args.limit)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
