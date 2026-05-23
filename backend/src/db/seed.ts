import { pool } from "./client";

const colleges = [
  {
    name: "Indian Institute of Technology Bombay",
    location: "Powai, Mumbai, Maharashtra",
    city: "Mumbai", state: "Maharashtra",
    fees_min: 100000, fees_max: 200000,
    rating: 4.8, type: "Government", established: 1958,
    placement_percent: 95, avg_package: 18.5, highest_package: 120.0,
    description: "IIT Bombay is one of India's premier engineering institutions, known for excellence in technology and research.",
    website: "https://www.iitb.ac.in",
    courses: ["B.Tech", "M.Tech", "MBA", "M.Sc", "PhD"],
  },
  {
    name: "Indian Institute of Technology Delhi",
    location: "Hauz Khas, New Delhi",
    city: "New Delhi", state: "Delhi",
    fees_min: 100000, fees_max: 210000,
    rating: 4.8, type: "Government", established: 1961,
    placement_percent: 94, avg_package: 17.8, highest_package: 110.0,
    description: "IIT Delhi is a leading technical university with world-class infrastructure and industry connections.",
    website: "https://home.iitd.ac.in",
    courses: ["B.Tech", "M.Tech", "MBA", "M.Sc", "PhD"],
  },
  {
    name: "BITS Pilani",
    location: "Vidya Vihar, Pilani, Rajasthan",
    city: "Pilani", state: "Rajasthan",
    fees_min: 180000, fees_max: 350000,
    rating: 4.6, type: "Deemed", established: 1964,
    placement_percent: 90, avg_package: 14.2, highest_package: 85.0,
    description: "BITS Pilani is a leading private university renowned for its engineering and science programs.",
    website: "https://www.bits-pilani.ac.in",
    courses: ["B.E.", "M.E.", "M.Sc", "MBA", "PhD"],
  },
  {
    name: "National Institute of Technology Trichy",
    location: "Tanjore Main Road, Tiruchirappalli, Tamil Nadu",
    city: "Tiruchirappalli", state: "Tamil Nadu",
    fees_min: 75000, fees_max: 150000,
    rating: 4.5, type: "Government", established: 1964,
    placement_percent: 88, avg_package: 12.5, highest_package: 60.0,
    description: "NIT Trichy is consistently ranked as one of India's top NITs with strong placement records.",
    website: "https://www.nitt.edu",
    courses: ["B.Tech", "M.Tech", "MCA", "MBA", "PhD"],
  },
  {
    name: "Vellore Institute of Technology",
    location: "Katpadi, Vellore, Tamil Nadu",
    city: "Vellore", state: "Tamil Nadu",
    fees_min: 200000, fees_max: 350000,
    rating: 4.2, type: "Deemed", established: 1984,
    placement_percent: 82, avg_package: 9.8, highest_package: 44.0,
    description: "VIT is a top-ranked deemed university offering diverse engineering programs with excellent placements.",
    website: "https://vit.ac.in",
    courses: ["B.Tech", "M.Tech", "MBA", "MCA", "PhD"],
  },
  {
    name: "Delhi Technological University",
    location: "Bawana Road, Rohini, Delhi",
    city: "New Delhi", state: "Delhi",
    fees_min: 80000, fees_max: 160000,
    rating: 4.3, type: "Government", established: 1941,
    placement_percent: 86, avg_package: 11.2, highest_package: 52.0,
    description: "DTU is a state government university with strong industry ties and a vibrant campus life.",
    website: "http://www.dtu.ac.in",
    courses: ["B.Tech", "M.Tech", "MBA", "PhD"],
  },
  {
    name: "Manipal Institute of Technology",
    location: "Manipal, Udupi, Karnataka",
    city: "Manipal", state: "Karnataka",
    fees_min: 220000, fees_max: 400000,
    rating: 4.1, type: "Deemed", established: 1957,
    placement_percent: 80, avg_package: 8.9, highest_package: 38.0,
    description: "MIT Manipal is a leading private university with a cosmopolitan campus and strong alumni network.",
    website: "https://manipal.edu/mit.html",
    courses: ["B.Tech", "M.Tech", "BCA", "MBA", "PhD"],
  },
  {
    name: "Jadavpur University",
    location: "Raja S.C. Mullick Road, Kolkata, West Bengal",
    city: "Kolkata", state: "West Bengal",
    fees_min: 20000, fees_max: 60000,
    rating: 4.4, type: "Government", established: 1955,
    placement_percent: 85, avg_package: 10.5, highest_package: 48.0,
    description: "Jadavpur University is a premier state university known for its engineering and arts faculties.",
    website: "http://www.jaduniv.edu.in",
    courses: ["B.E.", "M.E.", "M.Sc", "MBA", "PhD"],
  },
  {
    name: "SRM Institute of Science and Technology",
    location: "Kattankulathur, Chennai, Tamil Nadu",
    city: "Chennai", state: "Tamil Nadu",
    fees_min: 250000, fees_max: 450000,
    rating: 3.9, type: "Deemed", established: 1985,
    placement_percent: 78, avg_package: 7.5, highest_package: 32.0,
    description: "SRM University is a large private university with multiple campuses and strong industry partnerships.",
    website: "https://www.srmist.edu.in",
    courses: ["B.Tech", "M.Tech", "MBA", "MCA", "PhD"],
  },
  {
    name: "Indian Institute of Technology Madras",
    location: "Sardar Patel Road, Adyar, Chennai, Tamil Nadu",
    city: "Chennai", state: "Tamil Nadu",
    fees_min: 100000, fees_max: 200000,
    rating: 4.9, type: "Government", established: 1959,
    placement_percent: 96, avg_package: 19.2, highest_package: 130.0,
    description: "IIT Madras is India's top-ranked engineering institution with exceptional research output.",
    website: "https://www.iitm.ac.in",
    courses: ["B.Tech", "M.Tech", "MBA", "M.Sc", "PhD"],
  },
  {
    name: "Amity University",
    location: "Sector 125, Noida, Uttar Pradesh",
    city: "Noida", state: "Uttar Pradesh",
    fees_min: 180000, fees_max: 320000,
    rating: 3.7, type: "Private", established: 2005,
    placement_percent: 72, avg_package: 6.8, highest_package: 28.0,
    description: "Amity University is a large private university with diverse programs and a modern campus.",
    website: "https://www.amity.edu",
    courses: ["B.Tech", "MBA", "BBA", "LLB", "MBBS", "PhD"],
  },
  {
    name: "Thapar Institute of Engineering and Technology",
    location: "Bhadson Road, Patiala, Punjab",
    city: "Patiala", state: "Punjab",
    fees_min: 200000, fees_max: 380000,
    rating: 4.2, type: "Deemed", established: 1956,
    placement_percent: 84, avg_package: 11.8, highest_package: 55.0,
    description: "Thapar University is a top private engineering institution with excellent placements in core and IT sectors.",
    website: "https://www.thapar.edu",
    courses: ["B.E.", "M.E.", "MBA", "M.Sc", "PhD"],
  },
  {
    name: "PSG College of Technology",
    location: "Avinashi Road, Coimbatore, Tamil Nadu",
    city: "Coimbatore", state: "Tamil Nadu",
    fees_min: 90000, fees_max: 180000,
    rating: 4.1, type: "Private", established: 1951,
    placement_percent: 82, avg_package: 8.5, highest_package: 36.0,
    description: "PSG Tech is a reputed autonomous engineering institution with strong industry-academia partnerships.",
    website: "https://www.psgtech.edu",
    courses: ["B.E.", "B.Tech", "M.E.", "MBA", "MCA"],
  },
  {
    name: "Anna University",
    location: "Sardar Patel Road, Guindy, Chennai, Tamil Nadu",
    city: "Chennai", state: "Tamil Nadu",
    fees_min: 50000, fees_max: 100000,
    rating: 4.0, type: "Government", established: 1978,
    placement_percent: 78, avg_package: 7.2, highest_package: 30.0,
    description: "Anna University is the technical university of Tamil Nadu, affiliating over 500 engineering colleges.",
    website: "https://www.annauniv.edu",
    courses: ["B.E.", "B.Tech", "M.E.", "M.Tech", "MBA", "PhD"],
  },
  {
    name: "Pune University (SPPU)",
    location: "Ganeshkhind Road, Pune, Maharashtra",
    city: "Pune", state: "Maharashtra",
    fees_min: 40000, fees_max: 120000,
    rating: 3.8, type: "Government", established: 1949,
    placement_percent: 74, avg_package: 6.5, highest_package: 24.0,
    description: "Savitribai Phule Pune University is one of the largest universities in India with over 800 affiliated colleges.",
    website: "http://www.unipune.ac.in",
    courses: ["B.E.", "MBA", "MCA", "M.Sc", "LLB", "PhD"],
  },
  {
    name: "Chandigarh University",
    location: "NH-95, Ludhiana Highway, Mohali, Punjab",
    city: "Mohali", state: "Punjab",
    fees_min: 160000, fees_max: 300000,
    rating: 4.0, type: "Private", established: 2012,
    placement_percent: 81, avg_package: 9.2, highest_package: 42.0,
    description: "Chandigarh University is a fast-growing private university with strong placement drives and industry tie-ups.",
    website: "https://www.cuchd.in",
    courses: ["B.Tech", "MBA", "BBA", "LLB", "M.Tech", "PhD"],
  },
  {
    name: "National Institute of Technology Karnataka",
    location: "Srinivasnagar, Surathkal, Mangaluru, Karnataka",
    city: "Mangaluru", state: "Karnataka",
    fees_min: 75000, fees_max: 150000,
    rating: 4.4, type: "Government", established: 1960,
    placement_percent: 87, avg_package: 12.0, highest_package: 56.0,
    description: "NIT Karnataka Surathkal is a top-10 NIT known for its engineering programs and research culture.",
    website: "https://www.nitk.ac.in",
    courses: ["B.Tech", "M.Tech", "MCA", "MBA", "PhD"],
  },
  {
    name: "Symbiosis Institute of Technology",
    location: "Lavale, Pune, Maharashtra",
    city: "Pune", state: "Maharashtra",
    fees_min: 250000, fees_max: 420000,
    rating: 4.0, type: "Deemed", established: 2008,
    placement_percent: 83, avg_package: 10.2, highest_package: 46.0,
    description: "SIT Pune is a reputed private engineering institution under Symbiosis International University.",
    website: "https://www.sitpune.edu.in",
    courses: ["B.Tech", "M.Tech", "MBA"],
  },
  {
    name: "Lovely Professional University",
    location: "GT Road, Jalandhar, Punjab",
    city: "Jalandhar", state: "Punjab",
    fees_min: 130000, fees_max: 260000,
    rating: 3.8, type: "Private", established: 2005,
    placement_percent: 76, avg_package: 7.0, highest_package: 30.0,
    description: "LPU is one of India's largest private universities with a vibrant international student community.",
    website: "https://www.lpu.in",
    courses: ["B.Tech", "MBA", "BBA", "LLB", "M.Tech", "BCA", "PhD"],
  },
  {
    name: "Indian Institute of Technology Kharagpur",
    location: "Kharagpur, West Bengal",
    city: "Kharagpur", state: "West Bengal",
    fees_min: 100000, fees_max: 200000,
    rating: 4.7, type: "Government", established: 1951,
    placement_percent: 93, avg_package: 16.5, highest_package: 100.0,
    description: "IIT Kharagpur is India's oldest IIT and a global research powerhouse with 22,000+ students.",
    website: "http://www.iitkgp.ac.in",
    courses: ["B.Tech", "M.Tech", "MBA", "M.Sc", "BArch", "PhD"],
  },
];

const reviews = [
  { college_index: 0, rating: 5.0, author_name: "Rahul M.", comment: "Best institute in India. World-class faculty and infrastructure." },
  { college_index: 0, rating: 4.5, author_name: "Priya S.", comment: "Placements are excellent, research opportunities are top-notch." },
  { college_index: 1, rating: 4.8, author_name: "Aditya K.", comment: "Incredible campus in Delhi. Strong alumni network." },
  { college_index: 2, rating: 4.5, author_name: "Sneha R.", comment: "BITS has the best campus culture. Dual degree is a great option." },
  { college_index: 3, rating: 4.4, author_name: "Vikram P.", comment: "NIT Trichy offers excellent value for money with strong placements." },
  { college_index: 4, rating: 4.0, author_name: "Ananya T.", comment: "VIT has great infrastructure but fees are on the higher side." },
  { college_index: 9, rating: 4.9, author_name: "Suresh B.", comment: "IIT Madras is the best. Ranked #1 in NIRF for years!" },
  { college_index: 19, rating: 4.6, author_name: "Meera G.", comment: "IIT KGP has an amazing campus life and strong alumni." },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("🌱 Starting seed...");
    await client.query("BEGIN");

    // Clear existing data (order matters due to FK)
    await client.query("DELETE FROM reviews");
    await client.query("DELETE FROM saved_colleges");
    await client.query("DELETE FROM colleges");
    console.log("🗑️  Cleared existing college/review data");

    // Insert colleges
    const insertedIds: number[] = [];
    for (const c of colleges) {
      const result = await client.query(
        `INSERT INTO colleges
          (name, location, city, state, fees_min, fees_max, rating, type,
           established, placement_percent, avg_package, highest_package,
           description, website, courses)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
         RETURNING id`,
        [
          c.name, c.location, c.city, c.state,
          c.fees_min, c.fees_max, c.rating, c.type,
          c.established, c.placement_percent, c.avg_package, c.highest_package,
          c.description, c.website, c.courses,
        ]
      );
      const row = result.rows[0];
      if (row && row.id) insertedIds.push(row.id as number);
    }
    console.log(`✅ Inserted ${insertedIds.length} colleges`);

    // Insert reviews
    for (const r of reviews) {
      const collegeId = insertedIds[r.college_index];
      if (!collegeId) continue;
      await client.query(
        `INSERT INTO reviews (college_id, rating, author_name, comment)
         VALUES ($1, $2, $3, $4)`,
        [collegeId, r.rating, r.author_name, r.comment]
      );
    }
    console.log(`✅ Inserted ${reviews.length} reviews`);

    await client.query("COMMIT");
    console.log("🎉 Seed complete!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Seed failed:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();