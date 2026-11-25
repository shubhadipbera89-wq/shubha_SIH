import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding JanSamadhan Jharkhand database...');

  // Clean existing tables
  await prisma.report.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.collaboration.deleteMany();
  await prisma.savedChallenge.deleteMany();
  await prisma.support.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.solution.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.university.deleteMany();
  await prisma.industry.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Password123', 10);

  // 1. Create Core Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Dr. Rameshwar Oraon (Admin)',
      email: 'admin@jansamadhan.gov.in',
      password: hashedPassword,
      mobile: '9431100001',
      state: 'Jharkhand',
      district: 'Ranchi',
      userType: 'Government Representative',
      role: 'ADMIN',
      bio: 'Nodal Administrative Officer for Digital Innovation & Crowdsourced Governance, Govt of Jharkhand.',
      city: 'Ranchi',
      institution: 'Jharkhand Innovation Council',
      skills: JSON.stringify(['Civic Tech', 'Public Policy', 'Project Management']),
      interests: JSON.stringify(['Tribal Development', 'Urban Infrastructure', 'Healthcare']),
      impactScore: 450,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
  });

  const citizenUser1 = await prisma.user.create({
    data: {
      name: 'Birsa Munda (Farmer & Activist)',
      email: 'birsa.m@gmail.com',
      password: hashedPassword,
      mobile: '9835123456',
      district: 'Gumla',
      userType: 'Citizen',
      bio: 'Organic farmer and community representative advocating for rural irrigation and renewable energy solutions in Gumla block.',
      city: 'Gumla',
      skills: JSON.stringify(['Organic Farming', 'Community Mobilization', 'Water Management']),
      interests: JSON.stringify(['Agriculture', 'Solar Energy', 'Rural Development']),
      impactScore: 120,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya.bit@gmail.com',
      password: hashedPassword,
      mobile: '9771234567',
      district: 'Ranchi',
      userType: 'Student',
      bio: 'Final year B.Tech Computer Science student at BIT Mesra. Passionate about AI for social impact and IoT-based environmental monitoring.',
      city: 'Ranchi',
      institution: 'BIT Mesra, Ranchi',
      skills: JSON.stringify(['React', 'Node.js', 'Python', 'IoT', 'Machine Learning']),
      interests: JSON.stringify(['Digital Services', 'Environment', 'Healthcare']),
      impactScore: 85,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  });

  const facultyUser = await prisma.user.create({
    data: {
      name: 'Prof. Alok Kumar',
      email: 'alok.ism@iitism.ac.in',
      password: hashedPassword,
      mobile: '9431322110',
      district: 'Dhanbad',
      userType: 'University Faculty',
      bio: 'Head of Environmental Science & Mining Engineering Dept at IIT (ISM) Dhanbad. Specialist in mine water treatment & land reclamation.',
      city: 'Dhanbad',
      institution: 'IIT (ISM) Dhanbad',
      skills: JSON.stringify(['Water Treatment', 'Environmental Remediation', 'Research', 'Grant Management']),
      interests: JSON.stringify(['Water & Sanitation', 'Environment', 'Energy']),
      impactScore: 310,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
  });

  const industryUser = await prisma.user.create({
    data: {
      name: 'Rajesh Singhania',
      email: 'rajesh@tatasteel.com',
      password: hashedPassword,
      mobile: '9836098765',
      district: 'East Singhbhum',
      userType: 'Industry Professional',
      bio: 'General Manager CSR & Sustainable Innovation at Tata Steel Jamshedpur. Driving industry-academic partnerships for Jharkhand development.',
      city: 'Jamshedpur',
      company: 'Tata Steel Ltd.',
      skills: JSON.stringify(['Corporate CSR', 'Industrial Automation', 'Supply Chain', 'Venture Funding']),
      interests: JSON.stringify(['Employment', 'Urban Development', 'Education']),
      impactScore: 290,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    },
  });

  const ngoUser = await prisma.user.create({
    data: {
      name: 'Suman Mahato',
      email: 'suman@vikasbharti.org',
      password: hashedPassword,
      mobile: '9431188776',
      district: 'Dumka',
      userType: 'NGO',
      bio: 'Program Director at Vikas Bharti Sansthan. Working on Santhal tribal artisan empowerment, handicraft clusters, and women self-help groups.',
      city: 'Dumka',
      institution: 'Vikas Bharti Sansthan',
      skills: JSON.stringify(['Craft Cluster Development', 'Women Empowerment', 'Rural Marketing']),
      interests: JSON.stringify(['Tribal Development', 'Women & Child Development', 'Tourism']),
      impactScore: 195,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
  });

  console.log('Users created.');

  // 2. Create Jharkhand Universities
  await prisma.university.createMany({
    data: [
      {
        name: 'Birla Institute of Technology (BIT) Mesra',
        code: 'BIT-MESRA',
        district: 'Ranchi',
        location: 'Mesra, Ranchi',
        departments: JSON.stringify(['Computer Science', 'Civil & Env Engg', 'Remote Sensing', 'Biotechnology', 'Electrical Engg']),
        researchAreas: JSON.stringify(['AI & Smart Cities', 'Water Purification', 'GIS & Satellite Mapping', 'Bio-energy']),
        facultyCount: 280,
        studentProjectsCount: 145,
        website: 'https://bitmesra.ac.in',
        logo: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=300&q=80',
        description: 'Premier autonomous technical institute in Jharkhand established in 1955, fostering cutting-edge innovation and societal research.',
      },
      {
        name: 'IIT (ISM) Dhanbad',
        code: 'IIT-ISM',
        district: 'Dhanbad',
        location: 'Sardar Patel Nagar, Dhanbad',
        departments: JSON.stringify(['Mining Engineering', 'Environmental Science', 'Fuel Engineering', 'Applied Geology', 'Electronics']),
        researchAreas: JSON.stringify(['Clean Coal & Energy', 'Mine Reclamation', 'Heavy Metal Waste Water Treatment', 'Smart Sensing']),
        facultyCount: 350,
        studentProjectsCount: 210,
        website: 'https://iitism.ac.in',
        logo: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=300&q=80',
        description: 'Institute of National Importance specializing in Earth Sciences, Mining, Renewable Energy, and Industrial Environmental Engineering.',
      },
      {
        name: 'NIT Jamshedpur',
        code: 'NIT-JSR',
        district: 'East Singhbhum',
        location: 'Adityapur, Jamshedpur',
        departments: JSON.stringify(['Metallurgical Engineering', 'Mechanical Engg', 'Production & Industrial', 'Computer Applications']),
        researchAreas: JSON.stringify(['Sustainable Metallurgy', 'Slag Reuse & Building Materials', 'Automated Traffic Systems', 'Solar Thermal']),
        facultyCount: 190,
        studentProjectsCount: 98,
        website: 'https://nitjsr.ac.in',
        logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=300&q=80',
        description: 'Leading National Institute of Technology located in the industrial capital of Jharkhand, driving industry-ready technical solutions.',
      },
      {
        name: 'Ranchi University',
        code: 'RU-RANCHI',
        district: 'Ranchi',
        location: 'Morabadi Campus, Ranchi',
        departments: JSON.stringify(['Tribal & Regional Languages', 'Botany & Agro-forestry', 'Sociology', 'Chemistry', 'Economics']),
        researchAreas: JSON.stringify(['Medicinal Flora of Chota Nagpur', 'Tribal Ethno-medicine', 'Rural Livelihood Models', 'Micro-finance']),
        facultyCount: 420,
        studentProjectsCount: 320,
        website: 'https://ranchiuniversity.ac.in',
        logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=300&q=80',
        description: 'Historic state university catering to higher education and socio-economic research in central and southern Jharkhand.',
      },
      {
        name: 'Central University of Jharkhand (CUJ)',
        code: 'CUJ-RANCHI',
        district: 'Ranchi',
        location: 'Brambe & Cheri-Manatu, Ranchi',
        departments: JSON.stringify(['Water Engineering', 'Energy Engineering', 'Indigenous Culture Studies', 'Mass Communication']),
        researchAreas: JSON.stringify(['Rainwater Harvesting Systems', 'Biomass Gasification', 'Tribal Languages Digitalization']),
        facultyCount: 160,
        studentProjectsCount: 75,
        website: 'https://cuj.ac.in',
        logo: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=300&q=80',
        description: 'Central university dedicated to interdisciplinary research, green energy tech, and preservation of indigenous knowledge systems.',
      },
    ],
  });

  console.log('Universities created.');

  // 3. Create Jharkhand Industry Partners
  await prisma.industry.createMany({
    data: [
      {
        name: 'Tata Steel Ltd.',
        code: 'TATA-STEEL',
        district: 'East Singhbhum',
        sector: 'Steel & Heavy Manufacturing',
        sponsoredProjects: 24,
        resourcesOffered: JSON.stringify(['CSR Innovation Grants', 'R&D Testing Labs', 'Incubation Support', 'Industrial Mentorship']),
        mentorshipAreas: JSON.stringify(['Green Energy Transition', 'Waste Upcycling', 'Supply Chain Tech', 'Safety Robotics']),
        website: 'https://tatasteel.com',
        logo: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=300&q=80',
        description: 'Global steel leader committed to sustainable industrial practices, community development, and CSR innovation in Jharkhand.',
      },
      {
        name: 'SAIL Bokaro Steel Plant',
        code: 'SAIL-BOKARO',
        district: 'Bokaro',
        sector: 'Public Sector Mining & Steel',
        sponsoredProjects: 15,
        resourcesOffered: JSON.stringify(['Apprenticeship Programs', 'Equipment Access', 'Skill Development Workshops']),
        mentorshipAreas: JSON.stringify(['Heavy Machinery Maintenance', 'Air & Water Quality Control', 'Industrial Safety']),
        website: 'https://sail.co.in',
        logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80',
        description: 'Flagship unit of Steel Authority of India Ltd driving economic growth, infrastructure, and technical skill training in Bokaro region.',
      },
      {
        name: 'Heavy Engineering Corporation (HEC) Ranchi',
        code: 'HEC-RANCHI',
        district: 'Ranchi',
        sector: 'Heavy Machine Building & Capital Goods',
        sponsoredProjects: 8,
        resourcesOffered: JSON.stringify(['Heavy Fabrication Facilities', 'Design Validation', 'Prototype Testing']),
        mentorshipAreas: JSON.stringify(['Defense Equipment Design', 'Mining Equipment', 'Structural Engineering']),
        website: 'https://hecltd.com',
        logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
        description: 'Pioneer public sector enterprise supplying plant equipment to steel, mining, space, and defense sectors in India.',
      },
      {
        name: 'NTPC North Karanpura',
        code: 'NTPC-KARANPURA',
        district: 'Chatra',
        sector: 'Power Generation & Green Energy',
        sponsoredProjects: 12,
        resourcesOffered: JSON.stringify(['Solar Micro-grid Sponsorship', 'Rural School Electrification Grants', 'Technical Traineeships']),
        mentorshipAreas: JSON.stringify(['Renewable Energy Storage', 'Fly Ash Utilization', 'Rural Micro-grids']),
        website: 'https://ntpc.co.in',
        logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=300&q=80',
        description: 'Thermal and renewable power generator advancing eco-friendly super-critical power tech and village development in Chatra & Hazaribagh.',
      },
    ],
  });

  console.log('Industries created.');

  // 4. Create Real-world Jharkhand Challenges
  const c1 = await prisma.challenge.create({
    data: {
      title: 'Heavy Groundwater Depletion & Arsenic Contamination in Mining Belts',
      description: 'Over 45 villages surrounding the Jharia & Katras coalfields face severe groundwater table collapse and toxic heavy metal contamination. Local handpumps yield rusty water causing kidney and skin disorders among children and elders. We need affordable, zero-power community filtration and recharge pit designs.',
      category: 'Water & Sanitation',
      district: 'Dhanbad',
      block: 'Jharia',
      village: 'Katras & Bhagatdih',
      location: 'Jharia Coalfield Belt, Dhanbad',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80'
      ]),
      impact: 'Will provide safe drinking water to over 35,000 villagers and prevent chronic fluorosis and renal diseases.',
      peopleAffected: 35000,
      urgency: 'Critical',
      status: 'Open for Solutions',
      tags: JSON.stringify(['WaterFilter', 'MineReclamation', 'ArsenicRemoval', 'CleanWater']),
      userId: facultyUser.id,
    },
  });

  const c2 = await prisma.challenge.create({
    data: {
      title: 'Solar-Powered Cold Storage & Grid Micro-Chillers for Vegetable Farmers',
      description: 'Farmers in Gumla and Bishunpur harvest thousands of tons of high-grade organic tomatoes, green chillies, and ginger every season. However, due to lack of local cold storage facilities and frequent power outages, up to 40% of produce rots during transport to Ranchi markets. We urgently require low-cost modular solar cold hubs.',
      category: 'Agriculture',
      district: 'Gumla',
      block: 'Bishunpur',
      village: 'Banari & Chhotka Karkat',
      location: 'Bishunpur Farmer Hub, Gumla',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80'
      ]),
      impact: 'Increases local tribal farmers income by 60% by preventing crop post-harvest rot.',
      peopleAffected: 12500,
      urgency: 'High',
      status: 'Open for Solutions',
      tags: JSON.stringify(['AgriTech', 'SolarPower', 'ColdStorage', 'OrganicFarming']),
      userId: citizenUser1.id,
    },
  });

  const c3 = await prisma.challenge.create({
    data: {
      title: 'Digital Artisans Ecosystem & Global Direct-to-Consumer Platform for Santhal Dokra Craft',
      description: 'Santhal artisans in Dumka & Pakur manufacture exquisite bell-metal Dokra crafts and Sohrai tribal paintings. Currently, middle-men siphon off 80% of the export value while artisans live below poverty. We need a blockchain/mobile platform connecting local clusters directly with international buyers & design schools.',
      category: 'Tribal Development',
      district: 'Dumka',
      block: 'Jama',
      village: 'Asanlia Crafts Village',
      location: 'Santhal Pargana Artisan Cluster, Dumka',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=800&q=80'
      ]),
      impact: 'Sustainably boosts incomes of 2,400 tribal craft families and preserves 500-year-old indigenous arts.',
      peopleAffected: 9500,
      urgency: 'Medium',
      status: 'In Progress',
      tags: JSON.stringify(['TribalCraft', 'DirectMarketAccess', 'DokraArt', 'DigitalIndia']),
      userId: ngoUser.id,
    },
  });

  const c4 = await prisma.challenge.create({
    data: {
      title: 'Smart AI Traffic Congestion Management around Main Road & Kantatoli Flyover',
      description: 'Rapid urbanization in Ranchi has caused acute morning and evening bottlenecks at Kantatoli Junction, Ratu Road, and Lalpur Circus. Ambulances are often stranded for over 45 minutes. We need IoT-enabled adaptive signal timers, emergency vehicle green corridors, and AI camera traffic density optimization.',
      category: 'Urban Development',
      district: 'Ranchi',
      block: 'Kanke',
      village: 'Lalpur & Kantatoli',
      location: 'Kantatoli & Main Road Arterial Corridor, Ranchi',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'
      ]),
      impact: 'Reduces transit delays by 35% and cuts carbon emissions across central Ranchi routes.',
      peopleAffected: 250000,
      urgency: 'High',
      status: 'Submitted',
      tags: JSON.stringify(['SmartCity', 'TrafficAI', 'RanchiTransit', 'UrbanMobility']),
      userId: studentUser.id,
    },
  });

  const c5 = await prisma.challenge.create({
    data: {
      title: 'Solar Tele-Medicine Vans & Remote Diagnostic Kiosks for Forest Villages',
      description: 'Forest-fringe villages in Saranda Forest (West Singhbhum) lie up to 60 km away from the nearest Primary Health Centre. Pregnant women and snake-bite victims face tragic delays. We are seeking lightweight mobile solar diagnostic kits with offline AI symptom screeners and satellite tele-consultation.',
      category: 'Healthcare',
      district: 'West Singhbhum',
      block: 'Manoharpur',
      village: 'Chiria & Karampada',
      location: 'Saranda Forest Reserve Region, Chaibasa',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
      ]),
      impact: 'Provides immediate primary medical coverage and tele-consultation to 48 isolated forest hamlets.',
      peopleAffected: 42000,
      urgency: 'Critical',
      status: 'Open for Solutions',
      tags: JSON.stringify(['TeleMedicine', 'RuralHealth', 'SarandaForest', 'AIHealth']),
      userId: adminUser.id,
    },
  });

  const c6 = await prisma.challenge.create({
    data: {
      title: 'Blast Furnace Slag & Industrial Waste Recycling into Eco-Friendly Interlocking Paving Bricks',
      description: 'Jamshedpur industrial area generates millions of metric tons of metallurgical slag annually, occupying vast land dumps. We need a cost-effective geopolymer formulation to convert waste slag into high-strength load-bearing paving tiles for rural roads and community school yards.',
      category: 'Environment',
      district: 'East Singhbhum',
      block: 'Golmuri',
      village: 'Adityapur & Jugsalai',
      location: 'Adityapur Industrial Belt, Jamshedpur',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80'
      ]),
      impact: 'Diverts 100,000+ tons of slag from landfill while paving 50+ km of rural village roads.',
      peopleAffected: 80000,
      urgency: 'High',
      status: 'Implemented',
      tags: JSON.stringify(['CircularEconomy', 'SlagRecycling', 'TataSteel', 'GreenBuilding']),
      userId: industryUser.id,
    },
  });

  console.log('Challenges created.');

  // 5. Create Solutions
  const s1 = await prisma.solution.create({
    data: {
      title: 'Nanofiltration & Bio-Char Adsorption Column for Mine Water Reclamation',
      description: 'A low-cost hybrid system combining locally activated fly-ash biochar with hollow-fiber nanofiltration membranes capable of removing 99.4% heavy metals, arsenic, and sulfates from mine runoff water at just ₹0.12 per liter.',
      approach: 'Phase 1: Gravity settlement in bio-char pits. Phase 2: Solar-pumped pressure filtration through multi-layer poly-sulfone membrane modules. Phase 3: Community distribution standposts.',
      resources: '2 Solar PV Panels (400W), Poly-sulfone Membrane Modules, Activated Rice-Husk Bio-char, PVC Piping Network.',
      estimatedCost: '₹1,85,000 per village unit',
      estimatedTimeline: '6 Weeks setup time',
      expectedImpact: 'Pure WHO-grade potable water for 800 households per installation with 5-year operational warranty.',
      skillsRequired: JSON.stringify(['Environmental Chemistry', 'Membrane Filtration', 'Plumbing Tech', 'Solar PV Installation']),
      teamMembers: JSON.stringify(['Prof. Alok Kumar (IIT ISM)', 'Priya Sharma (BIT Mesra)', 'Dhanbad Water Works SHG']),
      status: 'Shortlisted',
      challengeId: c1.id,
      userId: studentUser.id,
    },
  });

  const s2 = await prisma.solution.create({
    data: {
      title: 'Phase-Change Material (PCM) Hybrid Solar Cold Pods',
      description: 'Thermal storage micro-chillers utilizing food-grade PCM gel batteries that store cold energy during peak daylight hours and maintain 4°C internal humidity-controlled climate for up to 36 hours without electrical power.',
      approach: 'Modular insulated containers manufactured with recycled polyurethane foam, cooled by 2.5 kW rooftop solar panels with zero lithium battery requirement.',
      resources: 'Rooftop Solar Array, Thermal Storage PCM Gel Cylinders, Insulated Modular Enclosure.',
      estimatedCost: '₹3,40,000 per 5-Ton Container',
      estimatedTimeline: '2 Months',
      expectedImpact: 'Zero-power night cooling for 50+ vegetable farmers per cluster, preventing spoilage.',
      skillsRequired: JSON.stringify(['Refrigeration Engg', 'Solar Thermal Systems', 'Agri-Logistics']),
      teamMembers: JSON.stringify(['Birsa Munda (Gumla Farmer Co-op)', 'GreenTech Innovations Ranchi']),
      status: 'Pilot',
      challengeId: c2.id,
      userId: facultyUser.id,
    },
  });

  console.log('Solutions created.');

  // 6. Create Comments
  await prisma.comment.createMany({
    data: [
      {
        content: 'This is a vital initiative for Katras area! The mine pit water has been unfit for drinking for two decades. Will IIT ISM assist in local water quality testing?',
        challengeId: c1.id,
        userId: citizenUser1.id,
        likes: 12,
      },
      {
        content: 'Yes, our Environmental Science Department will conduct free water sample mass spectrometer testing for all 45 affected hamlets starting next Monday.',
        challengeId: c1.id,
        userId: facultyUser.id,
        likes: 24,
      },
      {
        content: 'Tata Steel CSR department is willing to sponsor the pilot deployment of 5 PCM Solar Cold Pods in Bishunpur block under our rural livelihood acceleration grant!',
        challengeId: c2.id,
        userId: industryUser.id,
        likes: 35,
      },
    ],
  });

  // 7. Create Supports & Saved Challenges
  await prisma.support.createMany({
    data: [
      { userId: citizenUser1.id, challengeId: c1.id },
      { userId: studentUser.id, challengeId: c1.id },
      { userId: industryUser.id, challengeId: c1.id },
      { userId: studentUser.id, challengeId: c2.id },
      { userId: ngoUser.id, challengeId: c2.id },
      { userId: facultyUser.id, challengeId: c3.id },
    ],
  });

  await prisma.savedChallenge.createMany({
    data: [
      { userId: studentUser.id, challengeId: c1.id },
      { userId: studentUser.id, challengeId: c3.id },
      { userId: facultyUser.id, challengeId: c2.id },
    ],
  });

  // 8. Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: citizenUser1.id,
        title: 'Solution Shortlisted!',
        message: 'Your challenge "Solar Cold Storage in Gumla" received a sponsored pilot proposal from Tata Steel Ltd CSR.',
        link: `/challenges/${c2.id}`,
        type: 'solution',
      },
      {
        userId: facultyUser.id,
        title: 'New Challenge Support',
        message: 'Over 15 citizens supported your research challenge on Mine Water Reclamation in Dhanbad.',
        link: `/challenges/${c1.id}`,
        type: 'support',
      },
      {
        userId: studentUser.id,
        title: 'Collaboration Invitation',
        message: 'Prof. Alok Kumar invited you to join the Mine Water Reclamation research team.',
        link: `/collaborate`,
        type: 'collab',
      },
    ],
  });

  // 9. Create Achievements / Badges
  await prisma.achievement.createMany({
    data: [
      {
        userId: adminUser.id,
        badgeType: 'Impact Maker',
        name: 'Jharkhand Gaurav',
        description: 'Successfully implemented a solution benefiting over 500+ citizens',
      },
      {
        userId: facultyUser.id,
        badgeType: 'Problem Solver',
        name: 'Samadhan Karta',
        description: 'Submitted an actionable solution shortlisted by university/industry',
      },
      {
        userId: studentUser.id,
        badgeType: 'Community Contributor',
        name: 'Jan Sevak',
        description: 'Reported 3+ verified societal challenges for Jharkhand',
      },
    ],
  });

  console.log('Database successfully seeded with realistic Jharkhand data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
