import { db } from "../server/db";
import { 
  departments, teams, resources, portfolios, programs, workItems, allocations, skills 
} from "../shared/schema";

async function seed() {
  console.log("Clearing existing data...");
  await db.delete(allocations);
  await db.delete(workItems);
  await db.delete(programs);
  await db.delete(portfolios);
  await db.delete(resources);
  await db.delete(teams);
  await db.delete(departments);
  await db.delete(skills);

  console.log("Seeding departments...");
  const [entServices, itOps] = await db.insert(departments).values([
    { name: "Enterprise Services", description: "Business applications, analytics, and enterprise architecture", headcount: 75, budget: "22000000.00" },
    { name: "IT Operations", description: "Infrastructure, security, network, and end user computing", headcount: 75, budget: "18000000.00" },
  ]).returning();

  console.log("Seeding teams...");
  const insertedTeams = await db.insert(teams).values([
    // Enterprise Services Teams
    { name: "Enterprise Applications", color: "bg-blue-500", departmentId: entServices.id },
    { name: "Business Intelligence", color: "bg-purple-500", departmentId: entServices.id },
    { name: "Enterprise Architecture", color: "bg-indigo-500", departmentId: entServices.id },
    { name: "Integration Services", color: "bg-cyan-500", departmentId: entServices.id },
    { name: "Development & DevOps", color: "bg-teal-500", departmentId: entServices.id },
    // IT Operations Teams
    { name: "Infrastructure & Cloud", color: "bg-orange-500", departmentId: itOps.id },
    { name: "Network Operations", color: "bg-red-500", departmentId: itOps.id },
    { name: "Security Operations", color: "bg-rose-500", departmentId: itOps.id },
    { name: "End User Computing", color: "bg-amber-500", departmentId: itOps.id },
    { name: "Service Desk", color: "bg-yellow-500", departmentId: itOps.id },
  ]).returning();

  const teamMap = Object.fromEntries(insertedTeams.map(t => [t.name, t.id]));

  console.log("Seeding skills...");
  const insertedSkills = await db.insert(skills).values([
    { name: "AWS", category: "Cloud" },
    { name: "Azure", category: "Cloud" },
    { name: "Kubernetes", category: "Cloud" },
    { name: "Terraform", category: "Infrastructure" },
    { name: "Python", category: "Development" },
    { name: "Java", category: "Development" },
    { name: "TypeScript", category: "Development" },
    { name: "React", category: "Development" },
    { name: "SQL", category: "Data" },
    { name: "Power BI", category: "Analytics" },
    { name: "Tableau", category: "Analytics" },
    { name: "ServiceNow", category: "ITSM" },
    { name: "Cisco Networking", category: "Network" },
    { name: "VMware", category: "Virtualization" },
    { name: "Active Directory", category: "Identity" },
    { name: "Okta", category: "Identity" },
    { name: "Splunk", category: "Security" },
    { name: "CrowdStrike", category: "Security" },
    { name: "SAP", category: "ERP" },
    { name: "Salesforce", category: "CRM" },
  ]).returning();

  console.log("Seeding resources...");
  const resourceData = [
    // Enterprise Applications (15 people)
    { name: "Sarah Chen", role: "Director, Enterprise Apps", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "SC", email: "sarah.chen@company.com", hourlyRate: "125.00" },
    { name: "Marcus Johnson", role: "SAP Technical Lead", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "MJ", email: "marcus.j@company.com", hourlyRate: "110.00" },
    { name: "Elena Rodriguez", role: "Salesforce Developer", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "ER", email: "elena.r@company.com", hourlyRate: "95.00" },
    { name: "David Kim", role: "SAP Functional Analyst", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "DK", email: "david.k@company.com", hourlyRate: "90.00" },
    { name: "Jennifer Walsh", role: "CRM Specialist", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "JW", email: "jennifer.w@company.com", hourlyRate: "85.00" },
    { name: "Robert Taylor", role: "ERP Analyst", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "RT", email: "robert.t@company.com", hourlyRate: "85.00" },
    { name: "Lisa Patel", role: "ServiceNow Developer", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "LP", email: "lisa.p@company.com", hourlyRate: "90.00" },
    { name: "Michael Brown", role: "Integration Developer", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "MB", email: "michael.b@company.com", hourlyRate: "95.00" },
    { name: "Amanda Foster", role: "Business Analyst", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "AF", email: "amanda.f@company.com", hourlyRate: "80.00" },
    { name: "Christopher Lee", role: "SAP Developer", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "CL", email: "chris.l@company.com", hourlyRate: "95.00" },
    { name: "Michelle Garcia", role: "QA Engineer", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "MG", email: "michelle.g@company.com", hourlyRate: "75.00" },
    { name: "Andrew Wilson", role: "Solutions Architect", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "AW", email: "andrew.w@company.com", hourlyRate: "115.00" },
    { name: "Samantha Davis", role: "Technical Writer", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "SD", email: "sam.d@company.com", hourlyRate: "65.00" },
    { name: "Daniel Martinez", role: "Release Manager", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "DM", email: "daniel.m@company.com", hourlyRate: "85.00" },
    { name: "Jessica Thompson", role: "Sr. Developer", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "JT", email: "jessica.t@company.com", hourlyRate: "100.00" },

    // Business Intelligence (12 people)
    { name: "Brian O'Connor", role: "Director, BI", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "BO", email: "brian.o@company.com", hourlyRate: "120.00" },
    { name: "Rachel Green", role: "Lead Data Analyst", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "RG", email: "rachel.g@company.com", hourlyRate: "100.00" },
    { name: "Kevin Park", role: "Power BI Developer", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "KP", email: "kevin.p@company.com", hourlyRate: "90.00" },
    { name: "Nancy White", role: "Tableau Developer", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "NW", email: "nancy.w@company.com", hourlyRate: "90.00" },
    { name: "Thomas Anderson", role: "Data Engineer", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "TA", email: "thomas.a@company.com", hourlyRate: "100.00" },
    { name: "Olivia Harris", role: "Data Analyst", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "OH", email: "olivia.h@company.com", hourlyRate: "75.00" },
    { name: "William Clark", role: "ETL Developer", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "WC", email: "william.c@company.com", hourlyRate: "95.00" },
    { name: "Emily Lewis", role: "Report Developer", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "EL", email: "emily.l@company.com", hourlyRate: "80.00" },
    { name: "James Robinson", role: "Data Scientist", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "JR", email: "james.r@company.com", hourlyRate: "110.00" },
    { name: "Megan Scott", role: "Analytics Specialist", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "MS", email: "megan.s@company.com", hourlyRate: "85.00" },
    { name: "Ryan Young", role: "Database Developer", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "RY", email: "ryan.y@company.com", hourlyRate: "90.00" },
    { name: "Stephanie King", role: "BI Analyst", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "SK", email: "steph.k@company.com", hourlyRate: "80.00" },

    // Enterprise Architecture (8 people)
    { name: "Patrick Hughes", role: "Chief Architect", teamId: teamMap["Enterprise Architecture"], capacity: 40, avatar: "PH", email: "patrick.h@company.com", hourlyRate: "150.00" },
    { name: "Victoria Adams", role: "Solutions Architect", teamId: teamMap["Enterprise Architecture"], capacity: 40, avatar: "VA", email: "victoria.a@company.com", hourlyRate: "130.00" },
    { name: "George Mitchell", role: "Cloud Architect", teamId: teamMap["Enterprise Architecture"], capacity: 40, avatar: "GM", email: "george.m@company.com", hourlyRate: "135.00" },
    { name: "Laura Nelson", role: "Data Architect", teamId: teamMap["Enterprise Architecture"], capacity: 40, avatar: "LN", email: "laura.n@company.com", hourlyRate: "125.00" },
    { name: "Steven Carter", role: "Integration Architect", teamId: teamMap["Enterprise Architecture"], capacity: 40, avatar: "SC", email: "steven.c@company.com", hourlyRate: "120.00" },
    { name: "Karen Phillips", role: "Security Architect", teamId: teamMap["Enterprise Architecture"], capacity: 40, avatar: "KP", email: "karen.p@company.com", hourlyRate: "130.00" },
    { name: "Frank Evans", role: "Technical Architect", teamId: teamMap["Enterprise Architecture"], capacity: 40, avatar: "FE", email: "frank.e@company.com", hourlyRate: "120.00" },
    { name: "Dorothy Turner", role: "Enterprise Analyst", teamId: teamMap["Enterprise Architecture"], capacity: 40, avatar: "DT", email: "dorothy.t@company.com", hourlyRate: "95.00" },

    // Integration Services (10 people)
    { name: "Henry Collins", role: "Manager, Integration", teamId: teamMap["Integration Services"], capacity: 40, avatar: "HC", email: "henry.c@company.com", hourlyRate: "105.00" },
    { name: "Susan Stewart", role: "MuleSoft Developer", teamId: teamMap["Integration Services"], capacity: 40, avatar: "SS", email: "susan.s@company.com", hourlyRate: "100.00" },
    { name: "Joseph Morris", role: "API Developer", teamId: teamMap["Integration Services"], capacity: 40, avatar: "JM", email: "joseph.m@company.com", hourlyRate: "95.00" },
    { name: "Betty Rogers", role: "Integration Analyst", teamId: teamMap["Integration Services"], capacity: 40, avatar: "BR", email: "betty.r@company.com", hourlyRate: "85.00" },
    { name: "Charles Reed", role: "Middleware Engineer", teamId: teamMap["Integration Services"], capacity: 40, avatar: "CR", email: "charles.r@company.com", hourlyRate: "90.00" },
    { name: "Linda Cook", role: "iPaaS Specialist", teamId: teamMap["Integration Services"], capacity: 40, avatar: "LC", email: "linda.c@company.com", hourlyRate: "90.00" },
    { name: "Paul Morgan", role: "EDI Specialist", teamId: teamMap["Integration Services"], capacity: 40, avatar: "PM", email: "paul.m@company.com", hourlyRate: "85.00" },
    { name: "Barbara Bell", role: "Integration Tester", teamId: teamMap["Integration Services"], capacity: 40, avatar: "BB", email: "barbara.b@company.com", hourlyRate: "75.00" },
    { name: "Mark Murphy", role: "Sr. Integration Dev", teamId: teamMap["Integration Services"], capacity: 40, avatar: "MM", email: "mark.m@company.com", hourlyRate: "100.00" },
    { name: "Carol Bailey", role: "Data Integration", teamId: teamMap["Integration Services"], capacity: 40, avatar: "CB", email: "carol.b@company.com", hourlyRate: "90.00" },

    // Development & DevOps (15 people)
    { name: "Richard Rivera", role: "Director, DevOps", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "RR", email: "richard.r@company.com", hourlyRate: "125.00" },
    { name: "Sandra Cooper", role: "Lead DevOps Engineer", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "SC", email: "sandra.c@company.com", hourlyRate: "115.00" },
    { name: "Kenneth Richardson", role: "Sr. Developer", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "KR", email: "kenneth.r@company.com", hourlyRate: "105.00" },
    { name: "Ashley Cox", role: "Full Stack Developer", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "AC", email: "ashley.c@company.com", hourlyRate: "95.00" },
    { name: "Timothy Howard", role: "DevOps Engineer", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "TH", email: "tim.h@company.com", hourlyRate: "100.00" },
    { name: "Donna Ward", role: "CI/CD Specialist", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "DW", email: "donna.w@company.com", hourlyRate: "95.00" },
    { name: "Edward Torres", role: "SRE Engineer", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "ET", email: "edward.t@company.com", hourlyRate: "105.00" },
    { name: "Ruth Peterson", role: "Backend Developer", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "RP", email: "ruth.p@company.com", hourlyRate: "90.00" },
    { name: "Larry Gray", role: "Frontend Developer", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "LG", email: "larry.g@company.com", hourlyRate: "90.00" },
    { name: "Sharon Ramirez", role: "QA Automation", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "SR", email: "sharon.r@company.com", hourlyRate: "85.00" },
    { name: "Jason James", role: "Release Engineer", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "JJ", email: "jason.j@company.com", hourlyRate: "90.00" },
    { name: "Cynthia Watson", role: "Platform Engineer", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "CW", email: "cynthia.w@company.com", hourlyRate: "100.00" },
    { name: "Jeffrey Brooks", role: "Cloud Developer", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "JB", email: "jeff.b@company.com", hourlyRate: "100.00" },
    { name: "Angela Kelly", role: "Mobile Developer", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "AK", email: "angela.k@company.com", hourlyRate: "95.00" },
    { name: "Gary Sanders", role: "Scrum Master", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "GS", email: "gary.s@company.com", hourlyRate: "85.00" },

    // Infrastructure & Cloud (18 people)
    { name: "Maria Price", role: "Director, Infrastructure", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "MP", email: "maria.p@company.com", hourlyRate: "125.00" },
    { name: "Ronald Bennett", role: "Cloud Platform Lead", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "RB", email: "ronald.b@company.com", hourlyRate: "115.00" },
    { name: "Helen Wood", role: "AWS Engineer", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "HW", email: "helen.w@company.com", hourlyRate: "105.00" },
    { name: "Scott Barnes", role: "Azure Engineer", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "SB", email: "scott.b@company.com", hourlyRate: "105.00" },
    { name: "Kimberly Ross", role: "Kubernetes Admin", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "KR", email: "kim.r@company.com", hourlyRate: "100.00" },
    { name: "Donald Henderson", role: "VMware Admin", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "DH", email: "donald.h@company.com", hourlyRate: "95.00" },
    { name: "Deborah Coleman", role: "Storage Admin", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "DC", email: "deborah.c@company.com", hourlyRate: "90.00" },
    { name: "Anthony Jenkins", role: "Linux Admin", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "AJ", email: "anthony.j@company.com", hourlyRate: "90.00" },
    { name: "Shirley Perry", role: "Windows Admin", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "SP", email: "shirley.p@company.com", hourlyRate: "85.00" },
    { name: "Stephen Powell", role: "Backup Admin", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "SP", email: "stephen.p@company.com", hourlyRate: "80.00" },
    { name: "Debra Long", role: "Terraform Developer", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "DL", email: "debra.l@company.com", hourlyRate: "95.00" },
    { name: "Raymond Patterson", role: "Infrastructure Analyst", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "RP", email: "ray.p@company.com", hourlyRate: "80.00" },
    { name: "Laura Hughes", role: "Cloud Ops Engineer", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "LH", email: "laura.h@company.com", hourlyRate: "95.00" },
    { name: "Jack Flores", role: "Systems Engineer", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "JF", email: "jack.f@company.com", hourlyRate: "90.00" },
    { name: "Marie Washington", role: "Database Admin", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "MW", email: "marie.w@company.com", hourlyRate: "95.00" },
    { name: "Arthur Butler", role: "Monitoring Engineer", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "AB", email: "arthur.b@company.com", hourlyRate: "85.00" },
    { name: "Ann Simmons", role: "Automation Engineer", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "AS", email: "ann.s@company.com", hourlyRate: "90.00" },
    { name: "Roy Foster", role: "Capacity Planner", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "RF", email: "roy.f@company.com", hourlyRate: "85.00" },

    // Network Operations (12 people)
    { name: "Catherine Gonzales", role: "Manager, Network Ops", teamId: teamMap["Network Operations"], capacity: 40, avatar: "CG", email: "catherine.g@company.com", hourlyRate: "110.00" },
    { name: "Joe Bryant", role: "Network Architect", teamId: teamMap["Network Operations"], capacity: 40, avatar: "JB", email: "joe.b@company.com", hourlyRate: "115.00" },
    { name: "Jean Alexander", role: "Sr. Network Engineer", teamId: teamMap["Network Operations"], capacity: 40, avatar: "JA", email: "jean.a@company.com", hourlyRate: "100.00" },
    { name: "Albert Russell", role: "Network Engineer", teamId: teamMap["Network Operations"], capacity: 40, avatar: "AR", email: "albert.r@company.com", hourlyRate: "90.00" },
    { name: "Teresa Griffin", role: "Network Engineer", teamId: teamMap["Network Operations"], capacity: 40, avatar: "TG", email: "teresa.g@company.com", hourlyRate: "90.00" },
    { name: "Eugene Diaz", role: "Firewall Admin", teamId: teamMap["Network Operations"], capacity: 40, avatar: "ED", email: "eugene.d@company.com", hourlyRate: "95.00" },
    { name: "Frances Hayes", role: "Load Balancer Specialist", teamId: teamMap["Network Operations"], capacity: 40, avatar: "FH", email: "frances.h@company.com", hourlyRate: "90.00" },
    { name: "Philip Myers", role: "VoIP Engineer", teamId: teamMap["Network Operations"], capacity: 40, avatar: "PM", email: "philip.m@company.com", hourlyRate: "85.00" },
    { name: "Annie Ford", role: "WiFi Engineer", teamId: teamMap["Network Operations"], capacity: 40, avatar: "AF", email: "annie.f@company.com", hourlyRate: "85.00" },
    { name: "Wayne Hamilton", role: "NOC Analyst", teamId: teamMap["Network Operations"], capacity: 40, avatar: "WH", email: "wayne.h@company.com", hourlyRate: "70.00" },
    { name: "Julia Graham", role: "NOC Analyst", teamId: teamMap["Network Operations"], capacity: 40, avatar: "JG", email: "julia.g@company.com", hourlyRate: "70.00" },
    { name: "Randy Sullivan", role: "NOC Lead", teamId: teamMap["Network Operations"], capacity: 40, avatar: "RS", email: "randy.s@company.com", hourlyRate: "80.00" },

    // Security Operations (15 people)
    { name: "Kathleen West", role: "CISO", teamId: teamMap["Security Operations"], capacity: 40, avatar: "KW", email: "kathleen.w@company.com", hourlyRate: "150.00" },
    { name: "Ralph Chavez", role: "Security Manager", teamId: teamMap["Security Operations"], capacity: 40, avatar: "RC", email: "ralph.c@company.com", hourlyRate: "120.00" },
    { name: "Theresa Owens", role: "Security Architect", teamId: teamMap["Security Operations"], capacity: 40, avatar: "TO", email: "theresa.o@company.com", hourlyRate: "125.00" },
    { name: "Eugene Knight", role: "SOC Lead", teamId: teamMap["Security Operations"], capacity: 40, avatar: "EK", email: "eugene.k@company.com", hourlyRate: "100.00" },
    { name: "Gloria Black", role: "SOC Analyst", teamId: teamMap["Security Operations"], capacity: 40, avatar: "GB", email: "gloria.b@company.com", hourlyRate: "80.00" },
    { name: "Billy Burns", role: "SOC Analyst", teamId: teamMap["Security Operations"], capacity: 40, avatar: "BB", email: "billy.b@company.com", hourlyRate: "80.00" },
    { name: "Pamela Warren", role: "Threat Analyst", teamId: teamMap["Security Operations"], capacity: 40, avatar: "PW", email: "pamela.w@company.com", hourlyRate: "95.00" },
    { name: "Harold Stone", role: "IAM Specialist", teamId: teamMap["Security Operations"], capacity: 40, avatar: "HS", email: "harold.s@company.com", hourlyRate: "95.00" },
    { name: "Irene Hansen", role: "Vulnerability Analyst", teamId: teamMap["Security Operations"], capacity: 40, avatar: "IH", email: "irene.h@company.com", hourlyRate: "90.00" },
    { name: "Louis Sims", role: "Compliance Analyst", teamId: teamMap["Security Operations"], capacity: 40, avatar: "LS", email: "louis.s@company.com", hourlyRate: "85.00" },
    { name: "Louise Gordon", role: "GRC Specialist", teamId: teamMap["Security Operations"], capacity: 40, avatar: "LG", email: "louise.g@company.com", hourlyRate: "90.00" },
    { name: "Todd Fields", role: "Penetration Tester", teamId: teamMap["Security Operations"], capacity: 40, avatar: "TF", email: "todd.f@company.com", hourlyRate: "105.00" },
    { name: "Anne Webb", role: "Incident Responder", teamId: teamMap["Security Operations"], capacity: 40, avatar: "AW", email: "anne.w@company.com", hourlyRate: "95.00" },
    { name: "Shawn Gardner", role: "Security Engineer", teamId: teamMap["Security Operations"], capacity: 40, avatar: "SG", email: "shawn.g@company.com", hourlyRate: "100.00" },
    { name: "Judy Walters", role: "Security Analyst", teamId: teamMap["Security Operations"], capacity: 40, avatar: "JW", email: "judy.w@company.com", hourlyRate: "85.00" },

    // End User Computing (15 people)
    { name: "Russell Ford", role: "Manager, EUC", teamId: teamMap["End User Computing"], capacity: 40, avatar: "RF", email: "russell.f@company.com", hourlyRate: "100.00" },
    { name: "Marilyn Mason", role: "Desktop Architect", teamId: teamMap["End User Computing"], capacity: 40, avatar: "MM", email: "marilyn.m@company.com", hourlyRate: "95.00" },
    { name: "Eugene Cruz", role: "VDI Admin", teamId: teamMap["End User Computing"], capacity: 40, avatar: "EC", email: "eugene.c@company.com", hourlyRate: "90.00" },
    { name: "Diane Ortiz", role: "Imaging Specialist", teamId: teamMap["End User Computing"], capacity: 40, avatar: "DO", email: "diane.o@company.com", hourlyRate: "75.00" },
    { name: "Sean Gomez", role: "SCCM Admin", teamId: teamMap["End User Computing"], capacity: 40, avatar: "SG", email: "sean.g@company.com", hourlyRate: "85.00" },
    { name: "Doris Murray", role: "Intune Admin", teamId: teamMap["End User Computing"], capacity: 40, avatar: "DM", email: "doris.m@company.com", hourlyRate: "85.00" },
    { name: "Jesse Hawkins", role: "Desktop Support Lead", teamId: teamMap["End User Computing"], capacity: 40, avatar: "JH", email: "jesse.h@company.com", hourlyRate: "75.00" },
    { name: "Evelyn Gibson", role: "Desktop Support Tech", teamId: teamMap["End User Computing"], capacity: 40, avatar: "EG", email: "evelyn.g@company.com", hourlyRate: "55.00" },
    { name: "Craig Freeman", role: "Desktop Support Tech", teamId: teamMap["End User Computing"], capacity: 40, avatar: "CF", email: "craig.f@company.com", hourlyRate: "55.00" },
    { name: "Janice Schmidt", role: "Mac Support Specialist", teamId: teamMap["End User Computing"], capacity: 40, avatar: "JS", email: "janice.s@company.com", hourlyRate: "65.00" },
    { name: "Willie Harvey", role: "Print Services", teamId: teamMap["End User Computing"], capacity: 40, avatar: "WH", email: "willie.h@company.com", hourlyRate: "55.00" },
    { name: "Lillian Wells", role: "Asset Manager", teamId: teamMap["End User Computing"], capacity: 40, avatar: "LW", email: "lillian.w@company.com", hourlyRate: "65.00" },
    { name: "Joshua Snyder", role: "Mobile Device Admin", teamId: teamMap["End User Computing"], capacity: 40, avatar: "JS", email: "joshua.s@company.com", hourlyRate: "75.00" },
    { name: "Kathryn Chambers", role: "Depot Coordinator", teamId: teamMap["End User Computing"], capacity: 40, avatar: "KC", email: "kathryn.c@company.com", hourlyRate: "50.00" },
    { name: "Alan Dixon", role: "A/V Specialist", teamId: teamMap["End User Computing"], capacity: 40, avatar: "AD", email: "alan.d@company.com", hourlyRate: "65.00" },

    // Service Desk (20 people)
    { name: "Norma Dunn", role: "Service Desk Manager", teamId: teamMap["Service Desk"], capacity: 40, avatar: "ND", email: "norma.d@company.com", hourlyRate: "85.00" },
    { name: "Martin Reyes", role: "Service Desk Lead", teamId: teamMap["Service Desk"], capacity: 40, avatar: "MR", email: "martin.r@company.com", hourlyRate: "65.00" },
    { name: "Carolyn Robertson", role: "Sr. Service Desk Analyst", teamId: teamMap["Service Desk"], capacity: 40, avatar: "CR", email: "carolyn.r@company.com", hourlyRate: "55.00" },
    { name: "Victor Harper", role: "Service Desk Analyst", teamId: teamMap["Service Desk"], capacity: 40, avatar: "VH", email: "victor.h@company.com", hourlyRate: "45.00" },
    { name: "Wanda Mills", role: "Service Desk Analyst", teamId: teamMap["Service Desk"], capacity: 40, avatar: "WM", email: "wanda.m@company.com", hourlyRate: "45.00" },
    { name: "Johnny Holmes", role: "Service Desk Analyst", teamId: teamMap["Service Desk"], capacity: 40, avatar: "JH", email: "johnny.h@company.com", hourlyRate: "45.00" },
    { name: "Rosa Lucas", role: "Service Desk Analyst", teamId: teamMap["Service Desk"], capacity: 40, avatar: "RL", email: "rosa.l@company.com", hourlyRate: "45.00" },
    { name: "Lawrence Weaver", role: "Service Desk Analyst", teamId: teamMap["Service Desk"], capacity: 40, avatar: "LW", email: "lawrence.w@company.com", hourlyRate: "45.00" },
    { name: "Bonnie Knight", role: "Service Desk Analyst", teamId: teamMap["Service Desk"], capacity: 40, avatar: "BK", email: "bonnie.k@company.com", hourlyRate: "45.00" },
    { name: "Gerald Nichols", role: "Service Desk Analyst", teamId: teamMap["Service Desk"], capacity: 40, avatar: "GN", email: "gerald.n@company.com", hourlyRate: "45.00" },
    { name: "Tina Perkins", role: "Service Desk Analyst", teamId: teamMap["Service Desk"], capacity: 40, avatar: "TP", email: "tina.p@company.com", hourlyRate: "45.00" },
    { name: "Fred Pena", role: "Service Desk Analyst", teamId: teamMap["Service Desk"], capacity: 40, avatar: "FP", email: "fred.p@company.com", hourlyRate: "45.00" },
    { name: "Cynthia Garrett", role: "Knowledge Manager", teamId: teamMap["Service Desk"], capacity: 40, avatar: "CG", email: "cynthia.g@company.com", hourlyRate: "60.00" },
    { name: "Clifford Webb", role: "Training Specialist", teamId: teamMap["Service Desk"], capacity: 40, avatar: "CW", email: "clifford.w@company.com", hourlyRate: "55.00" },
    { name: "Hazel Carroll", role: "Quality Analyst", teamId: teamMap["Service Desk"], capacity: 40, avatar: "HC", email: "hazel.c@company.com", hourlyRate: "55.00" },
    { name: "Mario Hansen", role: "Workforce Analyst", teamId: teamMap["Service Desk"], capacity: 40, avatar: "MH", email: "mario.h@company.com", hourlyRate: "55.00" },
    { name: "Elsie Mendez", role: "Service Desk Analyst", teamId: teamMap["Service Desk"], capacity: 40, avatar: "EM", email: "elsie.m@company.com", hourlyRate: "45.00" },
    { name: "Barry Williamson", role: "Service Desk Analyst", teamId: teamMap["Service Desk"], capacity: 40, avatar: "BW", email: "barry.w@company.com", hourlyRate: "45.00" },
    { name: "Grace Stevens", role: "Service Desk Analyst", teamId: teamMap["Service Desk"], capacity: 40, avatar: "GS", email: "grace.s@company.com", hourlyRate: "45.00" },
    { name: "Oscar Riley", role: "Service Desk Analyst", teamId: teamMap["Service Desk"], capacity: 40, avatar: "OR", email: "oscar.r@company.com", hourlyRate: "45.00" },
  ];

  const insertedResources = await db.insert(resources).values(resourceData).returning();
  const resourceMap = Object.fromEntries(insertedResources.map(r => [r.name, r.id]));

  console.log("Seeding portfolios...");
  const insertedPortfolios = await db.insert(portfolios).values([
    { name: "Infrastructure Portfolio", description: "Cloud migration, data center, and infrastructure modernization initiatives", owner: "Maria Price", budget: "12000000.00", status: "Active" },
    { name: "Applications Portfolio", description: "Enterprise application development, integration, and modernization", owner: "Sarah Chen", budget: "10000000.00", status: "Active" },
    { name: "Security Portfolio", description: "Security posture improvement, compliance, and risk reduction initiatives", owner: "Kathleen West", budget: "8000000.00", status: "Active" },
    { name: "Data & Analytics Portfolio", description: "Data platform, analytics capabilities, and AI/ML initiatives", owner: "Brian O'Connor", budget: "6000000.00", status: "Active" },
    { name: "Digital Workplace Portfolio", description: "End user experience, collaboration, and productivity improvements", owner: "Russell Ford", budget: "4000000.00", status: "Active" },
  ]).returning();

  const portfolioMap = Object.fromEntries(insertedPortfolios.map(p => [p.name, p.id]));

  console.log("Seeding programs...");
  const insertedPrograms = await db.insert(programs).values([
    // Infrastructure Portfolio Programs
    { name: "Path to Cloud", portfolioId: portfolioMap["Infrastructure Portfolio"], description: "Migration of on-premises workloads to AWS and Azure", status: "Active", startDate: "2024-01-01", endDate: "2025-12-31", budget: "5000000.00", programManager: "Ronald Bennett" },
    { name: "Data Center Consolidation", portfolioId: portfolioMap["Infrastructure Portfolio"], description: "Reduce footprint from 3 data centers to 1 primary + cloud", status: "Active", startDate: "2024-06-01", endDate: "2026-06-30", budget: "3500000.00", programManager: "Maria Price" },
    { name: "Network Modernization", portfolioId: portfolioMap["Infrastructure Portfolio"], description: "SD-WAN rollout and network refresh across all locations", status: "Active", startDate: "2025-01-01", endDate: "2025-12-31", budget: "2500000.00", programManager: "Joe Bryant" },
    
    // Applications Portfolio Programs
    { name: "ERP Transformation", portfolioId: portfolioMap["Applications Portfolio"], description: "SAP S/4HANA migration and business process optimization", status: "Active", startDate: "2024-03-01", endDate: "2026-03-31", budget: "4000000.00", programManager: "Marcus Johnson" },
    { name: "CRM Enhancement", portfolioId: portfolioMap["Applications Portfolio"], description: "Salesforce optimization and customer 360 implementation", status: "Active", startDate: "2025-01-01", endDate: "2025-09-30", budget: "1500000.00", programManager: "Elena Rodriguez" },
    { name: "Integration Platform", portfolioId: portfolioMap["Applications Portfolio"], description: "Enterprise iPaaS implementation and API management", status: "Active", startDate: "2024-09-01", endDate: "2025-06-30", budget: "1200000.00", programManager: "Henry Collins" },
    { name: "DevOps Acceleration", portfolioId: portfolioMap["Applications Portfolio"], description: "CI/CD pipeline standardization and developer experience", status: "Active", startDate: "2025-02-01", endDate: "2025-08-31", budget: "800000.00", programManager: "Richard Rivera" },

    // Security Portfolio Programs
    { name: "Zero Trust Initiative", portfolioId: portfolioMap["Security Portfolio"], description: "Implement zero trust architecture across the enterprise", status: "Active", startDate: "2024-04-01", endDate: "2025-12-31", budget: "3000000.00", programManager: "Ralph Chavez" },
    { name: "Compliance Modernization", portfolioId: portfolioMap["Security Portfolio"], description: "SOC 2 Type II certification and GRC platform implementation", status: "Active", startDate: "2025-01-01", endDate: "2025-12-31", budget: "1500000.00", programManager: "Louis Sims" },
    { name: "Security Operations Center", portfolioId: portfolioMap["Security Portfolio"], description: "24x7 SOC capability with SOAR automation", status: "Active", startDate: "2024-07-01", endDate: "2025-06-30", budget: "2000000.00", programManager: "Eugene Knight" },

    // Data & Analytics Portfolio Programs
    { name: "Data Platform Modernization", portfolioId: portfolioMap["Data & Analytics Portfolio"], description: "Cloud data lake and modern data stack implementation", status: "Active", startDate: "2024-08-01", endDate: "2025-07-31", budget: "2500000.00", programManager: "Thomas Anderson" },
    { name: "Self-Service Analytics", portfolioId: portfolioMap["Data & Analytics Portfolio"], description: "Enterprise BI platform and data democratization", status: "Active", startDate: "2025-01-01", endDate: "2025-09-30", budget: "1200000.00", programManager: "Rachel Green" },
    { name: "AI/ML Foundation", portfolioId: portfolioMap["Data & Analytics Portfolio"], description: "ML platform and AI use case pilots", status: "Planned", startDate: "2025-07-01", endDate: "2026-06-30", budget: "1500000.00", programManager: "James Robinson" },

    // Digital Workplace Portfolio Programs
    { name: "Modern Workplace", portfolioId: portfolioMap["Digital Workplace Portfolio"], description: "Microsoft 365 optimization and Teams adoption", status: "Active", startDate: "2024-10-01", endDate: "2025-06-30", budget: "1200000.00", programManager: "Russell Ford" },
    { name: "VDI Transformation", portfolioId: portfolioMap["Digital Workplace Portfolio"], description: "Virtual desktop infrastructure refresh and Windows 365", status: "Active", startDate: "2025-03-01", endDate: "2025-12-31", budget: "1500000.00", programManager: "Eugene Cruz" },
    { name: "Service Excellence", portfolioId: portfolioMap["Digital Workplace Portfolio"], description: "ServiceNow enhancement and self-service capabilities", status: "Active", startDate: "2025-01-01", endDate: "2025-09-30", budget: "800000.00", programManager: "Norma Dunn" },
  ]).returning();

  const programMap = Object.fromEntries(insertedPrograms.map(p => [p.name, p.id]));

  console.log("Seeding work items...");
  const workItemData = [
    // Path to Cloud Program Work Items
    { title: "AWS Landing Zone Setup", type: "Project", status: "Completed", priority: "High", startDate: "2024-01-15", endDate: "2024-04-30", description: "Establish AWS organization structure, accounts, and security baseline", progress: 100, programId: programMap["Path to Cloud"], estimatedBudget: "250000.00", actualBudget: "235000.00" },
    { title: "Azure Landing Zone Setup", type: "Project", status: "Completed", priority: "High", startDate: "2024-02-01", endDate: "2024-05-31", description: "Configure Azure subscriptions, policies, and networking", progress: 100, programId: programMap["Path to Cloud"], estimatedBudget: "200000.00", actualBudget: "195000.00" },
    { title: "Application Assessment Wave 1", type: "Project", status: "In Progress", priority: "High", startDate: "2024-06-01", endDate: "2025-01-31", description: "Assess and migrate first 50 applications to cloud", progress: 75, programId: programMap["Path to Cloud"], estimatedBudget: "800000.00", actualBudget: "620000.00" },
    { title: "Database Migration - SQL Server", type: "Project", status: "In Progress", priority: "High", startDate: "2024-09-01", endDate: "2025-03-31", description: "Migrate SQL Server databases to Azure SQL and RDS", progress: 45, programId: programMap["Path to Cloud"], estimatedBudget: "500000.00", actualBudget: "180000.00" },
    { title: "Cloud Cost Optimization", type: "KTLO", status: "In Progress", priority: "Medium", startDate: "2024-06-01", endDate: "2025-12-31", description: "Ongoing cloud cost management and rightsizing", progress: 50, programId: programMap["Path to Cloud"], estimatedBudget: "100000.00", actualBudget: "45000.00" },
    { title: "Kubernetes Platform Enhancement", type: "Project", status: "In Progress", priority: "Medium", startDate: "2025-01-01", endDate: "2025-06-30", description: "EKS/AKS platform hardening and observability", progress: 25, programId: programMap["Path to Cloud"], estimatedBudget: "300000.00", actualBudget: "75000.00" },

    // ERP Transformation Program Work Items
    { title: "SAP S/4HANA Assessment", type: "Project", status: "Completed", priority: "High", startDate: "2024-03-01", endDate: "2024-06-30", description: "Current state assessment and fit-gap analysis", progress: 100, programId: programMap["ERP Transformation"], estimatedBudget: "400000.00", actualBudget: "380000.00" },
    { title: "SAP S/4HANA Sandbox Build", type: "Project", status: "Completed", priority: "High", startDate: "2024-07-01", endDate: "2024-10-31", description: "Build sandbox environment and configure base system", progress: 100, programId: programMap["ERP Transformation"], estimatedBudget: "350000.00", actualBudget: "365000.00" },
    { title: "Finance Module Go-Live", type: "Project", status: "In Progress", priority: "Critical", startDate: "2024-11-01", endDate: "2025-06-30", description: "Finance and controlling module implementation", progress: 55, programId: programMap["ERP Transformation"], estimatedBudget: "1200000.00", actualBudget: "720000.00" },
    { title: "SAP Basis Support", type: "KTLO", status: "In Progress", priority: "High", startDate: "2024-03-01", endDate: "2026-03-31", description: "Ongoing SAP system administration and support", progress: 40, programId: programMap["ERP Transformation"], estimatedBudget: "600000.00", actualBudget: "280000.00" },
    { title: "Data Migration - Master Data", type: "Project", status: "In Progress", priority: "High", startDate: "2025-01-01", endDate: "2025-04-30", description: "Customer, vendor, and material master data cleansing and migration", progress: 30, programId: programMap["ERP Transformation"], estimatedBudget: "250000.00", actualBudget: "65000.00" },

    // Zero Trust Initiative Work Items
    { title: "Identity Platform Upgrade", type: "Project", status: "In Progress", priority: "Critical", startDate: "2024-04-01", endDate: "2025-02-28", description: "Migrate to Okta and implement advanced identity governance", progress: 70, programId: programMap["Zero Trust Initiative"], estimatedBudget: "800000.00", actualBudget: "520000.00" },
    { title: "Endpoint Detection & Response", type: "Project", status: "Completed", priority: "High", startDate: "2024-05-01", endDate: "2024-09-30", description: "Deploy CrowdStrike across all endpoints", progress: 100, programId: programMap["Zero Trust Initiative"], estimatedBudget: "500000.00", actualBudget: "485000.00" },
    { title: "Micro-Segmentation Pilot", type: "Project", status: "In Progress", priority: "Medium", startDate: "2025-01-01", endDate: "2025-06-30", description: "Implement network micro-segmentation in data center", progress: 20, programId: programMap["Zero Trust Initiative"], estimatedBudget: "400000.00", actualBudget: "60000.00" },
    { title: "SASE Implementation", type: "Project", status: "Approved", priority: "High", startDate: "2025-04-01", endDate: "2025-10-31", description: "Deploy Zscaler for secure access service edge", progress: 0, programId: programMap["Zero Trust Initiative"], estimatedBudget: "600000.00" },
    { title: "Security Patching", type: "KTLO", status: "In Progress", priority: "Critical", startDate: "2024-01-01", endDate: "2025-12-31", description: "Monthly vulnerability patching across all systems", progress: 50, programId: programMap["Zero Trust Initiative"], estimatedBudget: "200000.00", actualBudget: "95000.00" },

    // Data Center Consolidation Work Items
    { title: "DC2 Server Migration", type: "Project", status: "In Progress", priority: "High", startDate: "2024-06-01", endDate: "2025-03-31", description: "Migrate workloads from secondary data center", progress: 60, programId: programMap["Data Center Consolidation"], estimatedBudget: "1200000.00", actualBudget: "680000.00" },
    { title: "Storage Refresh", type: "Project", status: "In Progress", priority: "Medium", startDate: "2024-09-01", endDate: "2025-02-28", description: "Replace aging NetApp with Pure Storage all-flash", progress: 85, programId: programMap["Data Center Consolidation"], estimatedBudget: "800000.00", actualBudget: "720000.00" },
    { title: "Mainframe Decommission", type: "Demand", status: "Approved", priority: "Medium", startDate: "2025-07-01", endDate: "2026-06-30", description: "Retire legacy mainframe after workload migration", progress: 0, programId: programMap["Data Center Consolidation"], estimatedBudget: "500000.00" },

    // CRM Enhancement Work Items
    { title: "Salesforce CPQ Implementation", type: "Project", status: "In Progress", priority: "High", startDate: "2025-01-15", endDate: "2025-05-31", description: "Configure and deploy Salesforce CPQ for sales team", progress: 35, programId: programMap["CRM Enhancement"], estimatedBudget: "400000.00", actualBudget: "125000.00" },
    { title: "Marketing Cloud Integration", type: "Project", status: "Approved", priority: "Medium", startDate: "2025-04-01", endDate: "2025-07-31", description: "Integrate Salesforce with Marketing Cloud for campaigns", progress: 0, programId: programMap["CRM Enhancement"], estimatedBudget: "250000.00" },
    { title: "Customer 360 Dashboard", type: "Project", status: "In Progress", priority: "High", startDate: "2025-02-01", endDate: "2025-04-30", description: "Build unified customer view across all touchpoints", progress: 50, programId: programMap["CRM Enhancement"], estimatedBudget: "180000.00", actualBudget: "85000.00" },

    // Data Platform Modernization Work Items
    { title: "Snowflake Data Lake", type: "Project", status: "In Progress", priority: "High", startDate: "2024-08-01", endDate: "2025-02-28", description: "Establish Snowflake as central data platform", progress: 80, programId: programMap["Data Platform Modernization"], estimatedBudget: "600000.00", actualBudget: "510000.00" },
    { title: "Data Governance Framework", type: "Project", status: "In Progress", priority: "High", startDate: "2024-10-01", endDate: "2025-04-30", description: "Implement Collibra for data cataloging and governance", progress: 55, programId: programMap["Data Platform Modernization"], estimatedBudget: "400000.00", actualBudget: "195000.00" },
    { title: "ETL Pipeline Migration", type: "Project", status: "In Progress", priority: "Medium", startDate: "2025-01-01", endDate: "2025-06-30", description: "Migrate legacy ETL to dbt and Airflow", progress: 25, programId: programMap["Data Platform Modernization"], estimatedBudget: "350000.00", actualBudget: "75000.00" },
    { title: "Data Quality Monitoring", type: "KTLO", status: "In Progress", priority: "Medium", startDate: "2024-11-01", endDate: "2025-07-31", description: "Ongoing data quality checks and remediation", progress: 40, programId: programMap["Data Platform Modernization"], estimatedBudget: "150000.00", actualBudget: "55000.00" },

    // Modern Workplace Work Items
    { title: "Teams Phone System Rollout", type: "Project", status: "In Progress", priority: "High", startDate: "2024-10-01", endDate: "2025-03-31", description: "Migrate from legacy PBX to Microsoft Teams Phone", progress: 65, programId: programMap["Modern Workplace"], estimatedBudget: "400000.00", actualBudget: "245000.00" },
    { title: "SharePoint Migration", type: "Project", status: "Completed", priority: "High", startDate: "2024-10-15", endDate: "2025-01-31", description: "Migrate file shares to SharePoint Online", progress: 100, programId: programMap["Modern Workplace"], estimatedBudget: "200000.00", actualBudget: "185000.00" },
    { title: "Copilot Pilot Program", type: "Project", status: "In Progress", priority: "Medium", startDate: "2025-02-01", endDate: "2025-05-31", description: "Microsoft 365 Copilot pilot with 100 users", progress: 15, programId: programMap["Modern Workplace"], estimatedBudget: "150000.00", actualBudget: "20000.00" },

    // Service Excellence Work Items
    { title: "ServiceNow ITSM Upgrade", type: "Project", status: "In Progress", priority: "High", startDate: "2025-01-01", endDate: "2025-04-30", description: "Upgrade to latest ServiceNow version with new features", progress: 40, programId: programMap["Service Excellence"], estimatedBudget: "300000.00", actualBudget: "110000.00" },
    { title: "Self-Service Portal Enhancement", type: "Project", status: "Approved", priority: "Medium", startDate: "2025-05-01", endDate: "2025-08-31", description: "Improve user experience with enhanced self-service", progress: 0, programId: programMap["Service Excellence"], estimatedBudget: "200000.00" },
    { title: "Tier 0 Automation", type: "Project", status: "In Progress", priority: "Medium", startDate: "2025-02-01", endDate: "2025-06-30", description: "Implement chatbot and automated ticket resolution", progress: 20, programId: programMap["Service Excellence"], estimatedBudget: "180000.00", actualBudget: "35000.00" },

    // Network Modernization Work Items
    { title: "SD-WAN Deployment", type: "Project", status: "Approved", priority: "High", startDate: "2025-03-01", endDate: "2025-10-31", description: "Deploy Cisco SD-WAN across 50 locations", progress: 0, programId: programMap["Network Modernization"], estimatedBudget: "1200000.00" },
    { title: "Wireless Refresh", type: "Project", status: "In Progress", priority: "Medium", startDate: "2025-01-15", endDate: "2025-06-30", description: "Replace aging WiFi infrastructure with WiFi 6E", progress: 30, programId: programMap["Network Modernization"], estimatedBudget: "600000.00", actualBudget: "160000.00" },

    // SOC Program Work Items
    { title: "SIEM Migration to Splunk Cloud", type: "Project", status: "In Progress", priority: "High", startDate: "2024-07-01", endDate: "2025-01-31", description: "Migrate on-prem SIEM to Splunk Cloud", progress: 85, programId: programMap["Security Operations Center"], estimatedBudget: "500000.00", actualBudget: "420000.00" },
    { title: "SOAR Implementation", type: "Project", status: "In Progress", priority: "High", startDate: "2024-10-01", endDate: "2025-04-30", description: "Deploy Splunk SOAR for automated response", progress: 50, programId: programMap["Security Operations Center"], estimatedBudget: "350000.00", actualBudget: "165000.00" },
    { title: "24x7 SOC Staffing", type: "KTLO", status: "In Progress", priority: "Critical", startDate: "2024-07-01", endDate: "2025-06-30", description: "Staff 24x7 security operations center coverage", progress: 50, programId: programMap["Security Operations Center"], estimatedBudget: "800000.00", actualBudget: "420000.00" },
  ];

  const insertedWorkItems = await db.insert(workItems).values(workItemData).returning();
  const workItemMap = Object.fromEntries(insertedWorkItems.map(w => [w.title, w.id]));

  console.log("Seeding allocations...");
  const currentWeek = "2025-12-08";
  const nextWeek = "2025-12-15";
  const weekAfter = "2025-12-22";

  const allocationData = [
    // Cloud Migration allocations
    { resourceId: resourceMap["Ronald Bennett"], workItemId: workItemMap["Application Assessment Wave 1"], weekStartDate: currentWeek, hours: "20.00" },
    { resourceId: resourceMap["Helen Wood"], workItemId: workItemMap["Application Assessment Wave 1"], weekStartDate: currentWeek, hours: "40.00" },
    { resourceId: resourceMap["Scott Barnes"], workItemId: workItemMap["Database Migration - SQL Server"], weekStartDate: currentWeek, hours: "35.00" },
    { resourceId: resourceMap["Kimberly Ross"], workItemId: workItemMap["Kubernetes Platform Enhancement"], weekStartDate: currentWeek, hours: "40.00" },
    { resourceId: resourceMap["Debra Long"], workItemId: workItemMap["Application Assessment Wave 1"], weekStartDate: currentWeek, hours: "30.00" },
    { resourceId: resourceMap["George Mitchell"], workItemId: workItemMap["Application Assessment Wave 1"], weekStartDate: currentWeek, hours: "20.00" },
    { resourceId: resourceMap["Laura Hughes"], workItemId: workItemMap["Cloud Cost Optimization"], weekStartDate: currentWeek, hours: "15.00" },

    // SAP allocations
    { resourceId: resourceMap["Marcus Johnson"], workItemId: workItemMap["Finance Module Go-Live"], weekStartDate: currentWeek, hours: "40.00" },
    { resourceId: resourceMap["David Kim"], workItemId: workItemMap["Finance Module Go-Live"], weekStartDate: currentWeek, hours: "40.00" },
    { resourceId: resourceMap["Christopher Lee"], workItemId: workItemMap["Finance Module Go-Live"], weekStartDate: currentWeek, hours: "40.00" },
    { resourceId: resourceMap["Andrew Wilson"], workItemId: workItemMap["Data Migration - Master Data"], weekStartDate: currentWeek, hours: "30.00" },
    { resourceId: resourceMap["Robert Taylor"], workItemId: workItemMap["SAP Basis Support"], weekStartDate: currentWeek, hours: "40.00" },

    // Security allocations
    { resourceId: resourceMap["Harold Stone"], workItemId: workItemMap["Identity Platform Upgrade"], weekStartDate: currentWeek, hours: "40.00" },
    { resourceId: resourceMap["Theresa Owens"], workItemId: workItemMap["Micro-Segmentation Pilot"], weekStartDate: currentWeek, hours: "25.00" },
    { resourceId: resourceMap["Shawn Gardner"], workItemId: workItemMap["Security Patching"], weekStartDate: currentWeek, hours: "20.00" },
    { resourceId: resourceMap["Eugene Knight"], workItemId: workItemMap["24x7 SOC Staffing"], weekStartDate: currentWeek, hours: "40.00" },
    { resourceId: resourceMap["Gloria Black"], workItemId: workItemMap["24x7 SOC Staffing"], weekStartDate: currentWeek, hours: "40.00" },
    { resourceId: resourceMap["Anne Webb"], workItemId: workItemMap["SOAR Implementation"], weekStartDate: currentWeek, hours: "35.00" },

    // Data Platform allocations
    { resourceId: resourceMap["Thomas Anderson"], workItemId: workItemMap["Snowflake Data Lake"], weekStartDate: currentWeek, hours: "35.00" },
    { resourceId: resourceMap["William Clark"], workItemId: workItemMap["ETL Pipeline Migration"], weekStartDate: currentWeek, hours: "40.00" },
    { resourceId: resourceMap["Rachel Green"], workItemId: workItemMap["Data Governance Framework"], weekStartDate: currentWeek, hours: "30.00" },
    { resourceId: resourceMap["Kevin Park"], workItemId: workItemMap["Data Quality Monitoring"], weekStartDate: currentWeek, hours: "20.00" },

    // CRM allocations
    { resourceId: resourceMap["Elena Rodriguez"], workItemId: workItemMap["Salesforce CPQ Implementation"], weekStartDate: currentWeek, hours: "40.00" },
    { resourceId: resourceMap["Jennifer Walsh"], workItemId: workItemMap["Customer 360 Dashboard"], weekStartDate: currentWeek, hours: "35.00" },

    // Modern Workplace allocations
    { resourceId: resourceMap["Philip Myers"], workItemId: workItemMap["Teams Phone System Rollout"], weekStartDate: currentWeek, hours: "40.00" },
    { resourceId: resourceMap["Russell Ford"], workItemId: workItemMap["Copilot Pilot Program"], weekStartDate: currentWeek, hours: "15.00" },

    // Service Excellence allocations
    { resourceId: resourceMap["Lisa Patel"], workItemId: workItemMap["ServiceNow ITSM Upgrade"], weekStartDate: currentWeek, hours: "40.00" },
    { resourceId: resourceMap["Norma Dunn"], workItemId: workItemMap["Tier 0 Automation"], weekStartDate: currentWeek, hours: "20.00" },

    // Network allocations
    { resourceId: resourceMap["Jean Alexander"], workItemId: workItemMap["Wireless Refresh"], weekStartDate: currentWeek, hours: "35.00" },
    { resourceId: resourceMap["Teresa Griffin"], workItemId: workItemMap["Wireless Refresh"], weekStartDate: currentWeek, hours: "35.00" },

    // Data Center allocations
    { resourceId: resourceMap["Donald Henderson"], workItemId: workItemMap["DC2 Server Migration"], weekStartDate: currentWeek, hours: "40.00" },
    { resourceId: resourceMap["Deborah Coleman"], workItemId: workItemMap["Storage Refresh"], weekStartDate: currentWeek, hours: "35.00" },

    // Next week allocations
    { resourceId: resourceMap["Helen Wood"], workItemId: workItemMap["Application Assessment Wave 1"], weekStartDate: nextWeek, hours: "40.00" },
    { resourceId: resourceMap["Marcus Johnson"], workItemId: workItemMap["Finance Module Go-Live"], weekStartDate: nextWeek, hours: "40.00" },
    { resourceId: resourceMap["Harold Stone"], workItemId: workItemMap["Identity Platform Upgrade"], weekStartDate: nextWeek, hours: "40.00" },
    { resourceId: resourceMap["Thomas Anderson"], workItemId: workItemMap["Snowflake Data Lake"], weekStartDate: nextWeek, hours: "40.00" },
    { resourceId: resourceMap["Elena Rodriguez"], workItemId: workItemMap["Salesforce CPQ Implementation"], weekStartDate: nextWeek, hours: "40.00" },

    // Week after allocations
    { resourceId: resourceMap["Helen Wood"], workItemId: workItemMap["Application Assessment Wave 1"], weekStartDate: weekAfter, hours: "40.00" },
    { resourceId: resourceMap["Marcus Johnson"], workItemId: workItemMap["Finance Module Go-Live"], weekStartDate: weekAfter, hours: "40.00" },
    { resourceId: resourceMap["Scott Barnes"], workItemId: workItemMap["Database Migration - SQL Server"], weekStartDate: weekAfter, hours: "40.00" },
  ];

  await db.insert(allocations).values(allocationData);

  console.log("Seeding complete!");
  console.log(`Created:
  - 2 departments
  - 10 teams
  - ${resourceData.length} resources
  - 20 skills
  - 5 portfolios
  - ${insertedPrograms.length} programs
  - ${workItemData.length} work items
  - ${allocationData.length} allocations`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
