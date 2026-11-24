import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CampusGear database...");

  // Clear existing records
  await prisma.report.deleteMany({});
  await prisma.rating.deleteMany({});
  await prisma.exchange.deleteMany({});
  await prisma.pickupSlot.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.pickupLocation.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Seed Safe Campus Pickup Points
  const pickupLocations = await Promise.all([
    prisma.pickupLocation.create({
      data: {
        name: "Central Library Entrance",
        landmark: "Ground floor lobby beside RFID book drop and security counter",
        isSafeSpot: true,
      },
    }),
    prisma.pickupLocation.create({
      data: {
        name: "Main Canteen",
        landmark: "Covered outdoor pavilion next to Fresh Juice stall",
        isSafeSpot: true,
      },
    }),
    prisma.pickupLocation.create({
      data: {
        name: "Mechanical Dept Notice Board",
        landmark: "Workshop wing corridor, right outside CAD & Simulation Lab",
        isSafeSpot: true,
      },
    }),
    prisma.pickupLocation.create({
      data: {
        name: "CSE Block Foyer",
        landmark: "Alan Turing Seminar Hall entrance on ground floor",
        isSafeSpot: true,
      },
    }),
    prisma.pickupLocation.create({
      data: {
        name: "Hostel Common Room",
        landmark: "Hostel Block 3 central quadrangle reception lounge",
        isSafeSpot: true,
      },
    }),
    prisma.pickupLocation.create({
      data: {
        name: "Faculty Exchange Desk",
        landmark: "Academic Section Helpdesk Window #3, Main Admin Building",
        isSafeSpot: true,
      },
    }),
  ]);

  console.log(`Seeded ${pickupLocations.length} safe pickup points.`);

  // 2. Seed 6 Users (Diverse Indian Engineering Students across Years + Admin)
  const users = {
    rohan: await prisma.user.create({
      data: {
        id: "usr_rohan_me2",
        name: "Rohan Sharma",
        email: "rohan.me25@college.edu.in",
        enrollmentNumber: "2025ME042",
        branch: "Mechanical",
        currentSemester: 2,
        isVerified: true,
        ratingAvg: 4.9,
        ratingCount: 5,
        completedExchanges: 3,
        estimatedSavingsInr: 1200,
        role: "STUDENT",
        avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80",
      },
    }),
    aarav: await prisma.user.create({
      data: {
        id: "usr_aarav_me8",
        name: "Aarav Patel",
        email: "aarav.me22@college.edu.in",
        enrollmentNumber: "2022ME009",
        branch: "Mechanical",
        currentSemester: 8,
        isVerified: true,
        ratingAvg: 5.0,
        ratingCount: 14,
        completedExchanges: 14,
        estimatedSavingsInr: 9400,
        role: "STUDENT",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
      },
    }),
    priya: await prisma.user.create({
      data: {
        id: "usr_priya_cs3",
        name: "Priya Iyer",
        email: "priya.cs24@college.edu.in",
        enrollmentNumber: "2024CS088",
        branch: "CSE",
        currentSemester: 3,
        isVerified: true,
        ratingAvg: 4.8,
        ratingCount: 7,
        completedExchanges: 6,
        estimatedSavingsInr: 3850,
        role: "STUDENT",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
      },
    }),
    vikram: await prisma.user.create({
      data: {
        id: "usr_vikram_ce6",
        name: "Vikram Singh",
        email: "vikram.ce23@college.edu.in",
        enrollmentNumber: "2023CE015",
        branch: "Civil",
        currentSemester: 6,
        isVerified: true,
        ratingAvg: 4.7,
        ratingCount: 8,
        completedExchanges: 8,
        estimatedSavingsInr: 5100,
        role: "STUDENT",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
      },
    }),
    ananya: await prisma.user.create({
      data: {
        id: "usr_ananya_ec4",
        name: "Ananya Gupta",
        email: "ananya.ec24@college.edu.in",
        enrollmentNumber: "2024EC102",
        branch: "ECE",
        currentSemester: 4,
        isVerified: true,
        ratingAvg: 4.9,
        ratingCount: 6,
        completedExchanges: 5,
        estimatedSavingsInr: 3200,
        role: "STUDENT",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      },
    }),
    admin: await prisma.user.create({
      data: {
        id: "usr_admin_fac0",
        name: "Prof. / Admin Sharma",
        email: "admin.gear@college.edu.in",
        enrollmentNumber: "FAC2021ADMIN",
        branch: "CSE",
        currentSemester: 0,
        isVerified: true,
        ratingAvg: 5.0,
        ratingCount: 42,
        completedExchanges: 42,
        estimatedSavingsInr: 25000,
        role: "ADMIN",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80",
      },
    }),
  };

  console.log("Seeded 6 sample students and admin.");

  // 3. Seed Listings (17 rich items)
  // Required: Exactly 3 distinct options for "Engineering Drawing Drafter" (Mechanical Sem 2)
  const drafterSell = await prisma.listing.create({
    data: {
      id: "lst_drafter_sell",
      title: "Omega Mini-Drafter with Dual Protractor Clamps",
      description: "Heavy duty Omega mini-drafter in mint condition. Smooth arms, crisp millimeter graduations, and heavy clamp for drawing board. Barely used for 1 semester.",
      category: "Lab Gear / Mini-Drafter",
      branch: "Mechanical",
      semester: 2,
      subjectName: "Engineering Drawing",
      subjectCode: "ME202",
      condition: "LIKE_NEW",
      exchangeMode: "SELL",
      priceInr: 400,
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.aarav.id,
      pickupSlots: {
        create: [
          { locationName: "Mechanical Dept Notice Board", timeWindow: "Daily 1:15 PM - 2:00 PM (Lunch break)" },
          { locationName: "Central Library Entrance", timeWindow: "Mon, Wed, Fri 5:00 PM - 6:00 PM" },
        ],
      },
    },
  });

  const drafterLend = await prisma.listing.create({
    data: {
      id: "lst_drafter_lend",
      title: "Isomars Professional Mini Drafter with Carrying Case",
      description: "High precision Isomars mini-drafter with padded canvas carrying case and extra butterfly screws. Ideal for completing the 4 weekly sheets during sem 2 submission season.",
      category: "Lab Gear / Mini-Drafter",
      branch: "Mechanical",
      semester: 2,
      subjectName: "Engineering Drawing",
      subjectCode: "ME202",
      condition: "GOOD",
      exchangeMode: "LEND",
      priceInr: 50,
      lendDurationDays: 7,
      lendRateText: "₹50 / week",
      depositInr: 150,
      imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.vikram.id,
      pickupSlots: {
        create: [
          { locationName: "Mechanical Dept Notice Board", timeWindow: "Mon & Thu 4:00 PM - 5:00 PM" },
          { locationName: "Main Canteen", timeWindow: "Sat 11:30 AM - 1:00 PM" },
        ],
      },
    },
  });

  const drafterDonate = await prisma.listing.create({
    data: {
      id: "lst_drafter_donate",
      title: "Classic Steel Mini Drafter (Junior Pass-on)",
      description: "Passing on my first-year engineering drafter to any 2nd-semester mechanical junior! Solid steel arms, fully functional. Help keep our campus reuse circle going. Completely Free!",
      category: "Lab Gear / Mini-Drafter",
      branch: "Mechanical",
      semester: 2,
      subjectName: "Engineering Drawing",
      subjectCode: "ME202",
      condition: "USABLE",
      exchangeMode: "DONATE",
      priceInr: 0,
      imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.aarav.id,
      pickupSlots: {
        create: [
          { locationName: "Hostel Common Room", timeWindow: "Evening 7:00 PM - 9:00 PM" },
          { locationName: "Central Library Entrance", timeWindow: "Tue & Thu 4:30 PM - 5:30 PM" },
        ],
      },
    },
  });

  // Additional 14 listings across branches & semesters
  const listingsData = [
    {
      id: "lst_dbms_korth",
      title: "Database System Concepts (6th International Edition)",
      description: "Silberschatz, Korth, Sudarshan. The gold standard for DBMS CS301. Clean pages with pencil notes on SQL and Normalization chapters. No missing sheets.",
      category: "Textbook",
      branch: "CSE",
      semester: 3,
      subjectName: "Database Management Systems",
      subjectCode: "CS301",
      isbn: "978-0073523323",
      edition: "6th Edition",
      condition: "GOOD",
      exchangeMode: "SELL",
      priceInr: 350,
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.priya.id,
      pickup: ["CSE Block Foyer", "Central Library Entrance"],
    },
    {
      id: "lst_labcoat_white",
      title: "Pure White Cotton Lab Coat (Size L, Chest 40)",
      description: "Heavy-duty 100% cotton lab coat required for Chemistry Lab and Workshop practices. Cleanly laundered with college crest on pocket. Free for any junior!",
      category: "Lab Coat",
      branch: "Mechanical",
      semester: 2,
      subjectName: "Workshop Practice & Material Science",
      subjectCode: "ME201",
      condition: "LIKE_NEW",
      exchangeMode: "DONATE",
      priceInr: 0,
      imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.aarav.id,
      pickup: ["Mechanical Dept Notice Board", "Hostel Common Room"],
    },
    {
      id: "lst_calc_casio991",
      title: "Casio fx-991EX ClassWiz Scientific Calculator",
      description: "Official non-programmable 552-function calculator approved for mid-terms and university end-sem exams. High-res LCD, matrix & complex calculations. Available for short term lend.",
      category: "Scientific Calculator",
      branch: "Mechanical",
      semester: 2,
      subjectName: "Applied Mathematics II",
      subjectCode: "MA201",
      condition: "LIKE_NEW",
      exchangeMode: "LEND",
      priceInr: 40,
      lendDurationDays: 7,
      lendRateText: "₹40 / week",
      depositInr: 300,
      imageUrl: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.ananya.id,
      pickup: ["Main Canteen", "Central Library Entrance"],
    },
    {
      id: "lst_dbms_notes",
      title: "Handwritten DBMS Topper Notes + PYQ Solved Papers",
      description: "Spiral-bound handwritten lecture notes for CS301 (DBMS). Includes detailed ER diagrams, Relational Algebra, B+ Trees derivations, and 5 years solved university question papers.",
      category: "Handwritten Notes",
      branch: "CSE",
      semester: 3,
      subjectName: "Database Management Systems",
      subjectCode: "CS301",
      condition: "LIKE_NEW",
      exchangeMode: "DONATE",
      priceInr: 0,
      imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.priya.id,
      pickup: ["CSE Block Foyer", "Main Canteen"],
    },
    {
      id: "lst_arduino_kit",
      title: "Arduino Uno R3 Starter Kit with 30+ Sensors & Breadboard",
      description: "Complete electronics prototyping kit including Arduino Uno, ultrasonic sensor, DHT11, servo motor, relay, LCD 16x2, jumper cables, and 830-point breadboard. Great for microcontrollers lab.",
      category: "Electronics Kit",
      branch: "ECE",
      semester: 4,
      subjectName: "Microcontrollers & Embedded Systems",
      subjectCode: "EC402",
      condition: "LIKE_NEW",
      exchangeMode: "LEND",
      priceInr: 100,
      lendDurationDays: 14,
      lendRateText: "₹100 / 2 weeks",
      depositInr: 500,
      imageUrl: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.ananya.id,
      pickup: ["CSE Block Foyer", "Faculty Exchange Desk"],
    },
    {
      id: "lst_math_grewal",
      title: "Higher Engineering Mathematics (44th Edition)",
      description: "Dr. B.S. Grewal. Standard Khanna Publishers edition. Indispensable for Sem 1 and 2 Calculus, Vector Algebra, and Differential Equations. Very well kept.",
      category: "Textbook",
      branch: "Mechanical",
      semester: 2,
      subjectName: "Engineering Mathematics II",
      subjectCode: "MA201",
      isbn: "978-8193328491",
      edition: "44th Edition",
      condition: "GOOD",
      exchangeMode: "SELL",
      priceInr: 320,
      imageUrl: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.rohan.id,
      pickup: ["Central Library Entrance", "Mechanical Dept Notice Board"],
    },
    {
      id: "lst_surveying_punmia",
      title: "Surveying (Vol I & II) by Dr. B.C. Punmia",
      description: "Comprehensive guide for Civil Engineering Chain Surveying, Compass, Theodolite and Plane Table Surveying. Both volumes bundled together.",
      category: "Textbook",
      branch: "Civil",
      semester: 4,
      subjectName: "Surveying & Geomatics",
      subjectCode: "CE403",
      isbn: "978-8170088837",
      edition: "16th Edition",
      condition: "GOOD",
      exchangeMode: "SELL",
      priceInr: 310,
      imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.vikram.id,
      pickup: ["Central Library Entrance", "Hostel Common Room"],
    },
    {
      id: "lst_digital_mano",
      title: "Digital Design (5th Edition)",
      description: "M. Morris Mano & Michael D. Ciletti. Covers Boolean algebra, logic gates, combinational and synchronous sequential circuits with Verilog HDL.",
      category: "Textbook",
      branch: "ECE",
      semester: 3,
      subjectName: "Digital Logic Design",
      subjectCode: "EC301",
      isbn: "978-0132774208",
      edition: "5th Edition",
      condition: "LIKE_NEW",
      exchangeMode: "SELL",
      priceInr: 280,
      imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.ananya.id,
      pickup: ["Central Library Entrance", "Main Canteen"],
    },
    {
      id: "lst_fluid_bansal",
      title: "A Textbook of Fluid Mechanics & Hydraulic Machines",
      description: "Dr. R.K. Bansal. Essential for Mechanical Sem 4. Covers fluid statics, kinematics, Bernoulli equation, and hydraulic turbines with solved numericals.",
      category: "Reference Book",
      branch: "Mechanical",
      semester: 4,
      subjectName: "Fluid Mechanics",
      subjectCode: "ME402",
      isbn: "978-8131808153",
      edition: "9th Edition (Revised)",
      condition: "GOOD",
      exchangeMode: "LEND",
      priceInr: 60,
      lendDurationDays: 7,
      lendRateText: "₹60 / week",
      depositInr: 250,
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.aarav.id,
      pickup: ["Mechanical Dept Notice Board", "Central Library Entrance"],
    },
    {
      id: "lst_sheet_tube",
      title: "Expandable A1 Engineering Drawing Sheet Storage Tube",
      description: "Heavy-duty waterproof telescopic sheet tube with adjustable shoulder strap. Fits up to 15 full-size imperial drawing sheets without creasing. Free donation!",
      category: "Lab Gear / Mini-Drafter",
      branch: "Mechanical",
      semester: 2,
      subjectName: "Engineering Drawing",
      subjectCode: "ME202",
      condition: "LIKE_NEW",
      exchangeMode: "DONATE",
      priceInr: 0,
      imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.aarav.id,
      pickup: ["Mechanical Dept Notice Board", "Hostel Common Room"],
    },
    {
      id: "lst_bimbhra_machinery",
      title: "Electrical Machinery (7th Edition)",
      description: "Dr. P.S. Bimbhra. Classical textbook for Transformers, DC Machines, Synchronous machines, and Induction motors. Clean copy.",
      category: "Textbook",
      branch: "EEE",
      semester: 4,
      subjectName: "Electrical Machines I",
      subjectCode: "EE401",
      isbn: "978-8174091734",
      edition: "7th Edition",
      condition: "GOOD",
      exchangeMode: "SELL",
      priceInr: 380,
      imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.vikram.id,
      pickup: ["Central Library Entrance", "Faculty Exchange Desk"],
    },
    {
      id: "lst_os_dino",
      title: "Operating System Concepts ('Dinosaur Book', 9th Edition)",
      description: "Silberschatz, Galvin, Gagne. Comprehensive coverage of processes, threads, synchronization, memory management, and storage. Available for lending.",
      category: "Textbook",
      branch: "CSE",
      semester: 4,
      subjectName: "Operating Systems",
      subjectCode: "CS402",
      isbn: "978-1118063330",
      edition: "9th Edition",
      condition: "LIKE_NEW",
      exchangeMode: "LEND",
      priceInr: 50,
      lendDurationDays: 7,
      lendRateText: "₹50 / week",
      depositInr: 300,
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.priya.id,
      pickup: ["CSE Block Foyer", "Central Library Entrance"],
    },
    {
      id: "lst_mechanics_timo",
      title: "Engineering Mechanics (5th Edition)",
      description: "S. Timoshenko, D.H. Young, J.V. Rao. Standard textbook for Statics and Dynamics for 1st/2nd-semester foundational engineering.",
      category: "Textbook",
      branch: "Mechanical",
      semester: 2,
      subjectName: "Engineering Mechanics",
      subjectCode: "ME201",
      isbn: "978-0070104808",
      edition: "5th Edition",
      condition: "GOOD",
      exchangeMode: "SELL",
      priceInr: 220,
      imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.rohan.id,
      pickup: ["Mechanical Dept Notice Board", "Main Canteen"],
    },
    {
      id: "lst_solder_kit",
      title: "60W Adjustable Temperature Soldering Kit with Stand",
      description: "Temperature controlled (200°C - 450°C) soldering gun with extra tips, desoldering pump, solder wire spool, and anti-static tweezers. Ideal for lab projects.",
      category: "Electronics Kit",
      branch: "ECE",
      semester: 4,
      subjectName: "Electronic Devices & Circuits Lab",
      subjectCode: "EC304",
      condition: "LIKE_NEW",
      exchangeMode: "LEND",
      priceInr: 50,
      lendDurationDays: 7,
      lendRateText: "₹50 / week",
      depositInr: 200,
      imageUrl: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.ananya.id,
      pickup: ["Central Library Entrance", "Main Canteen"],
    },
    {
      id: "lst_dsa_thareja",
      title: "Data Structures Using C (2nd Edition)",
      description: "Reema Thareja (Oxford University Press). Thorough walkthrough of Arrays, Linked Lists, Stacks, Queues, Trees, and Sorting algorithms with C code.",
      category: "Textbook",
      branch: "CSE",
      semester: 3,
      subjectName: "Data Structures & Algorithms",
      subjectCode: "CS302",
      isbn: "978-0198099307",
      edition: "2nd Edition",
      condition: "LIKE_NEW",
      exchangeMode: "SELL",
      priceInr: 260,
      imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80",
      status: "AVAILABLE",
      ownerId: users.priya.id,
      pickup: ["CSE Block Foyer", "Hostel Common Room"],
    },
  ];

  for (const item of listingsData) {
    await prisma.listing.create({
      data: {
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        branch: item.branch,
        semester: item.semester,
        subjectName: item.subjectName,
        subjectCode: item.subjectCode,
        isbn: item.isbn,
        edition: item.edition,
        condition: item.condition,
        exchangeMode: item.exchangeMode,
        priceInr: item.priceInr,
        lendDurationDays: item.lendDurationDays || null,
        lendRateText: item.lendRateText || null,
        depositInr: item.depositInr || 0,
        imageUrl: item.imageUrl,
        status: item.status,
        ownerId: item.ownerId,
        pickupSlots: {
          create: item.pickup.map((loc) => ({
            locationName: loc,
            timeWindow: "Mon-Fri 4:00 PM - 5:30 PM",
          })),
        },
      },
    });
  }

  console.log("Seeded 18 total listings including 3 distinct Engineering Drawing Drafter options.");

  // 4. Seed Exchanges Across Stages (Requested, Approved/Reserved 24h, Picked Up, Completed)
  // Stage 1: REQUESTED (Rohan requests DBMS textbook from Priya)
  await prisma.exchange.create({
    data: {
      id: "exc_demo_requested",
      listingId: "lst_dbms_korth",
      borrowerId: users.rohan.id,
      lenderId: users.priya.id,
      exchangeMode: "SELL",
      status: "REQUESTED",
      pickupLocation: "CSE Block Foyer",
      pickupTimeWindow: "Mon-Fri 4:00 PM - 5:30 PM",
      borrowerNote: "Hi Priya! I'm taking DBMS as an elective this semester. Would love to pick this up at the CSE Foyer tomorrow after 4 PM.",
    },
  });

  // Stage 2: APPROVED / RESERVED (24h Hold) - Rohan requested Omega Drafter from Aarav, Aarav approved!
  const holdExpires = new Date();
  holdExpires.setHours(holdExpires.getHours() + 24);

  await prisma.exchange.create({
    data: {
      id: "exc_demo_approved_hold",
      listingId: "lst_drafter_sell",
      borrowerId: users.rohan.id,
      lenderId: users.aarav.id,
      exchangeMode: "SELL",
      status: "APPROVED",
      pickupLocation: "Mechanical Dept Notice Board",
      pickupTimeWindow: "Daily 1:15 PM - 2:00 PM (Lunch break)",
      holdExpiresAt: holdExpires,
      borrowerNote: "Hey Aarav bhaiya, need this drafter for ME202 sheet 1 submission next week! Ready with cash or UPI.",
    },
  });

  // Update listing to RESERVED
  await prisma.listing.update({
    where: { id: "lst_drafter_sell" },
    data: {
      status: "RESERVED",
      reservedUntil: holdExpires,
    },
  });

  // Stage 3: PICKED_UP (Lend in progress) - Vikram borrowed Casio calculator from Ananya
  const returnDue = new Date();
  returnDue.setDate(returnDue.getDate() + 5);

  await prisma.exchange.create({
    data: {
      id: "exc_demo_picked_up_lend",
      listingId: "lst_calc_casio991",
      borrowerId: users.vikram.id,
      lenderId: users.ananya.id,
      exchangeMode: "LEND",
      status: "PICKED_UP",
      pickupLocation: "Central Library Entrance",
      pickupTimeWindow: "Main Canteen 1:30 PM",
      intendedReturnDate: returnDue,
      lenderConfirmedHandover: true,
      borrowerConfirmedHandover: true,
      conditionChecklistLender: true,
      conditionChecklistBorrower: true,
      handoverCompletedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      borrowerNote: "Borrowing for mid-semester math calculations.",
    },
  });

  await prisma.listing.update({
    where: { id: "lst_calc_casio991" },
    data: {
      status: "LENT",
      lentUntil: returnDue,
    },
  });

  // Stage 4: COMPLETED with Rating - Aarav donated lab coat to Rohan
  const completedExchange = await prisma.exchange.create({
    data: {
      id: "exc_demo_completed_donate",
      listingId: "lst_labcoat_white",
      borrowerId: users.rohan.id,
      lenderId: users.aarav.id,
      exchangeMode: "DONATE",
      status: "COMPLETED",
      pickupLocation: "Mechanical Dept Notice Board",
      pickupTimeWindow: "1:15 PM",
      lenderConfirmedHandover: true,
      borrowerConfirmedHandover: true,
      conditionChecklistLender: true,
      conditionChecklistBorrower: true,
      handoverCompletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      borrowerNote: "Thanks a lot bhaiya for passing on the workshop coat!",
    },
  });

  // Create Rating for Aarav
  await prisma.rating.create({
    data: {
      exchangeId: completedExchange.id,
      raterId: users.rohan.id,
      targetUserId: users.aarav.id,
      score: 5,
      comment: "Aarav bhaiya was super punctual at the Mech notice board. The lab coat was freshly washed and in great shape. Huge help for a junior!",
    },
  });

  console.log("Seeded exchange records across all lifecycle states.");
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
