import { Material, Project, DaySchedule, Lesson, Difficulty } from './types';

const BASE_STORE_URL = "https://www.eptecstore.com/product-category/3d-printer/";

export const MATERIALS: Material[] = [
  { 
    id: '1', 
    name: 'Bambu Lab P2S 3D Printer', 
    category: '3D Printer', 
    quantity: '5 units', 
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1633526543814-9718c8922b7a?auto=format&fit=crop&q=80&w=600',
    description: 'The Icon, Redefined. Global Version.',
    externalUrl: BASE_STORE_URL
  },
  { 
    id: '2', 
    name: 'Bambu Lab H2S Large Format 3D Printer', 
    category: '3D Printer', 
    quantity: '3 units', 
    status: 'Low Stock',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    description: 'Your Personal Industrial Grade Solution.',
    externalUrl: BASE_STORE_URL
  },
  { 
    id: '3', 
    name: 'Bambu Lab A1 Mini 3D Printer', 
    category: '3D Printer', 
    quantity: '12 units', 
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=600',
    description: 'Support Multi-Color 3D Printing.',
    externalUrl: BASE_STORE_URL
  },
  { 
    id: '4', 
    name: 'Bambu Lab A1 3D Printer', 
    category: '3D Printer', 
    quantity: '8 units', 
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1533150567089-915904d603a1?auto=format&fit=crop&q=80&w=600',
    description: 'Support Multi-Color 3D Printing, High Speed.',
    externalUrl: BASE_STORE_URL
  },
  { 
    id: '5', 
    name: 'Bambu Lab X1C 3D Printer', 
    category: '3D Printer', 
    quantity: '2 units', 
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1581092341396-d99612958c01?auto=format&fit=crop&q=80&w=600',
    description: '16 Multi Color Dual Auto Bed.',
    externalUrl: BASE_STORE_URL
  },
  { 
    id: '6', 
    name: 'Bambu Lab AMS - Automatic Material System', 
    category: 'Accessories', 
    quantity: '10 units', 
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&q=80&w=600',
    description: 'Multi-color printing made simple.',
    externalUrl: "https://www.eptecstore.com/product-category/accessories/"
  },
  { 
    id: '7', 
    name: 'micro:bit V2.2 Master Kit', 
    category: 'Coding', 
    quantity: '25 units', 
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80&w=600',
    description: 'The heart of our coding curriculum.',
    externalUrl: "https://www.eptecstore.com/product-category/microcontrollers/"
  },
  { 
    id: '8', 
    name: 'PLA 3D Printing Filament', 
    category: 'Filament', 
    quantity: '50 spools', 
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1579762594991-49fa7567099f?auto=format&fit=crop&q=80&w=600',
    description: 'Biodegradable thermoplastic for easy printing.',
    externalUrl: "https://www.eptecstore.com/product-category/filaments/"
  }
];

export const PROJECTS: Project[] = [
  { 
    id: 'p1', 
    title: 'Cardboard Castle', 
    student: 'Emma T.', 
    grade: 'Primary 3', 
    category: 'Building Structures', 
    description: 'A medieval castle made entirely from recycled cardboard boxes with working drawbridge.',
    fullDescription: 'Emma wanted to create a sustainable architectural model that was interactive. This project explores recycled materials and simple mechanical linkages. The drawbridge is powered by a manual pulley system made from string and popsicle sticks.',
    materials: [
      { name: 'Double-walled Cardboard', quantity: '3 Sheets' },
      { name: 'Popsicle Sticks', quantity: '20 pcs' },
      { name: 'Hot Glue Gun', quantity: '1 unit' },
      { name: 'Nylon String', quantity: '2 Meters' }
    ],
    steps: [
      { title: 'Blueprinting', icon: 'fa-pencil', content: 'Sketching the castle layout and measuring the wall heights to ensure stability.' },
      { title: 'Cutting & Sizing', icon: 'fa-scissors', content: 'Using safety cutters to shape the battlements and the main gate.' },
      { title: 'Pulley Assembly', icon: 'fa-gear', content: 'Installing the popsicle stick axle to allow the drawbridge to lift and lower.' },
      { title: 'Final Painting', icon: 'fa-paint-brush', content: 'Applying grey stone textures using sponges and water-based acrylics.' }
    ],
    likes: 42,
    imageUrl: 'https://images.unsplash.com/photo-1598114441544-0b4274092f69?auto=format&fit=crop&q=80&w=600',
    award: 'Best Design Award'
  },
  { 
    id: 'p3', 
    title: 'Smart Plant Monitor', 
    student: 'Aisha K.', 
    grade: 'Primary 6', 
    category: 'Microcontrollers', 
    description: 'Micro:bit sensor system that alerts when plants need water using moisture sensors.',
    fullDescription: 'Aisha noticed her classroom plants were often dry. She engineered a solution using the micro:bit to measure soil conductivity. If the moisture drops below 40%, the micro:bit displays a sad face and sends a Bluetooth alert to her tablet.',
    materials: [
      { name: 'micro:bit V2', quantity: '1 unit', icon: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80&w=100' },
      { name: 'Soil Moisture Sensor', quantity: '1 pc' },
      { name: 'Crocodile Clips', quantity: '4 pcs' },
      { name: 'AAA Battery Pack', quantity: '1 unit' }
    ],
    steps: [
      { title: 'Hardware Wiring', icon: 'fa-plug', content: 'Connecting the moisture sensor to the P0 and 3V pins of the micro:bit.' },
      { title: 'Coding Logic', icon: 'fa-code', content: 'Writing a "forever" loop that reads the analog value and maps it to a percentage.' },
      { title: 'Calibration', icon: 'fa-vial', content: 'Testing the sensor in dry vs. wet soil to find the perfect "alert" threshold.' },
      { title: 'Housing Design', icon: 'fa-box', content: 'Creating a water-resistant 3D printed case to protect the electronics.' }
    ],
    likes: 51,
    imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=600',
    award: 'STEM Excellence Award'
  },
  { 
    id: 'p6', 
    title: 'Line-Following Robot', 
    student: 'Daniel W.', 
    grade: 'Primary 5', 
    category: 'Robotics', 
    description: 'Autonomous robot that follows black lines using infrared sensors and micro:bit.',
    fullDescription: 'Daniel build this robot to navigate a custom maze. It uses two IR sensors to detect contrast. By modulating the motor speeds based on sensor input, the robot can follow complex paths smoothly without manual control.',
    materials: [
      { name: 'Ring:bit V2 Car Kit', quantity: '1 unit' },
      { name: 'micro:bit V2', quantity: '1 unit' },
      { name: 'Tracking Sensors', quantity: '2 units' },
      { name: 'AA Batteries', quantity: '3 units' }
    ],
    steps: [
      { title: 'Chassis Assembly', icon: 'fa-wrench', content: 'Assembling the wheels, servos, and the Ring:bit breakout board.' },
      { title: 'Sensor Alignment', icon: 'fa-bullseye', content: 'Mounting the IR sensors at the correct height for optimal line detection.' },
      { title: 'Algorithm Dev', icon: 'fa-brain', content: 'Implementing a "P-Controller" logic to smooth out the turning movements.' },
      { title: 'Track Testing', icon: 'fa-road', content: 'Refining the code to handle sharp 90-degree turns and gaps in the line.' }
    ],
    likes: 47,
    imageUrl: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=600',
    award: 'Robotics Champion'
  }
];

export const LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'Level 1: 3D Slicing Basics',
    category: '3D Printing Mastery',
    difficulty: Difficulty.BEGINNER,
    duration: '45 mins',
    description: 'The foundation for every print. Master orientation, supports, and layer height using Ultimaker Cura.',
    projectGoal: 'This project focuses on transforming a digital 3D model into a physical object. You will learn how a printer "reads" your designs and how to optimize settings to ensure your first prints are successful and strong. We will be designing and slicing a customized nameplate for your lab station.',
    imageUrl: 'https://images.unsplash.com/photo-1633526543814-9718c8922b7a?auto=format&fit=crop&q=80&w=600',
    author: 'CiferTech',
    publishedDate: 'January 10, 2024',
    tags: ['3D Printing', 'Slicing', 'Beginner'],
    storySteps: [
      { title: 'Overview', icon: 'fa-eye', content: 'In this level, we focus on the fundamental bridge between a 3D model and a physical object: The Slicer.' },
      { title: 'Software Setup', icon: 'fa-cog', content: 'We begin by installing Ultimaker Cura and configuring it for our specific lab printers.' },
      { title: 'The Shield Settings', icon: 'fa-shield-halved', content: 'Understanding layer height and wall thickness to ensure your print is strong enough for play.' },
      { title: 'Final Adjustments', icon: 'fa-check-double', content: 'Checking the g-code preview for any artifacts before hitting print.' }
    ]
  },
  {
    id: 'l2',
    title: 'Level 2: Dual-Extrusion Tech',
    category: '3D Printing Mastery',
    difficulty: Difficulty.INTERMEDIATE,
    duration: '90 mins',
    description: 'Move beyond single colors. Learn to configure dual nozzles for complex multi-material prototypes.',
    projectGoal: 'In this intermediate challenge, you will build a multi-part mechanical gear system. By utilizing dual-extrusion, you will learn how to print internal moving parts using dissolvable support materials, allowing you to create complex mechanisms that cannot be made with traditional single-nozzle printers.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    author: 'CiferTech',
    publishedDate: 'January 15, 2024',
    tags: ['Dual Extrusion', 'Complex Geometry', 'Intermediate'],
    storySteps: [
      { title: 'Multi-Material Intro', icon: 'fa-layer-group', content: 'Dual extrusion allows us to use two different materials at once, like PLA and PVA supports.' },
      { title: 'UI Philosophy', icon: 'fa-comment-dots', content: 'How to manage two nozzle temperatures and switch points in the UI.' },
      { title: 'Wi-Fi Monitoring', icon: 'fa-wifi', content: 'Observing the complex toolhead swaps via the lab\'s remote camera system.' },
      { title: 'Code & PCB', icon: 'fa-microchip', content: 'Understanding how the machine handles the tool-changing scripts.' }
    ]
  },
  {
    id: 'l3',
    title: 'Level 3: Functional Engineering',
    category: '3D Printing Mastery',
    difficulty: Difficulty.HARD,
    duration: '180 mins',
    description: 'Stress testing and tolerances. Design mechanical parts that snap together perfectly with zero post-processing.',
    projectGoal: 'This advanced project challenges you to design a modular enclosure for a micro-controller. You will need to account for precise tolerances to ensure ports align and the case snaps shut without glue. This is where engineering meets artistry—creating a professional, functional product ready for use.',
    imageUrl: 'https://images.unsplash.com/photo-1581092341396-d99612958c01?auto=format&fit=crop&q=80&w=600',
    author: 'CiferTech',
    publishedDate: 'January 25, 2024',
    tags: ['Engineering', 'Tolerances', 'Advanced'],
    storySteps: [
      { title: 'Structural Integrity', icon: 'fa-building', content: 'Advanced infill patterns like Gyroid and understanding tensile strength across different axes.' },
      { title: 'Tolerance Control', icon: 'fa-ruler-combined', content: 'Designing for the "real world" where plastic expands and contracts.' },
      { title: 'Bluetooth Control', icon: 'fa-bluetooth', content: 'Integrating printed parts with wireless testing toolkits powered by ESP32.' },
      { title: 'Schematics', icon: 'fa-diagram-project', content: 'Mapping out mechanical assemblies and electrical integration for a "Better Than Flipper" device.' }
    ]
  }
];

export const WEEKLY_SCHEDULE: DaySchedule[] = [
  {
    day: 'Monday',
    date: '',
    items: [
      { 
        type: 'Recess Time', 
        title: 'Customer Onboarding', 
        time: '10:00 - 10:30 AM', 
        audience: 'New Kit Owners', 
        description: 'Daily technical walkthrough for customers who recently purchased the Smart World Kit.', 
        instructor: 'Mr. Tan',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200'
      },
      { 
        type: 'CCA', 
        title: 'Robotics CCA', 
        time: '3:00 - 4:30 PM', 
        audience: 'P4-P6 (25 students)', 
        description: 'Build and program robots using micro:bit and robot kits.', 
        instructor: 'Ms. Lee', 
        lessonId: 'l2',
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200'
      }
    ]
  },
  {
    day: 'Tuesday',
    date: '',
    items: [
      { 
        type: 'Recess Time', 
        title: 'Product Deep-Dive', 
        time: '10:00 - 10:30 AM', 
        audience: 'All Kit Users', 
        description: 'Advanced troubleshooting and new feature reveal for our subscribers.', 
        instructor: 'Mrs. Wong',
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200'
      },
      { 
        type: 'CCA', 
        title: 'Makers Club CCA', 
        time: '3:00 - 4:30 PM', 
        audience: 'P3-P5 (30 students)', 
        description: 'Creative making with crafts, cardboard construction, and 3D pens.', 
        instructor: 'Mr. Tan', 
        lessonId: 'l1',
        imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200'
      }
    ]
  },
  {
    day: 'Wednesday',
    date: '',
    items: [
      { 
        type: 'Workshop', 
        title: 'Advanced Splicing', 
        time: '2:00 - 4:00 PM', 
        audience: 'P6 Students', 
        description: 'Deep dive into 3D print settings for engineering grade materials.', 
        instructor: 'Ms. Chen',
        lessonId: 'l3',
        imageUrl: 'https://images.unsplash.com/photo-1633526543814-9718c8922b7a?auto=format&fit=crop&q=80&w=1200'
      }
    ]
  },
  {
    day: 'Thursday',
    date: '',
    items: [
      { 
        type: 'Workshop', 
        title: 'IoT Garden Systems', 
        time: '2:00 - 4:00 PM', 
        audience: 'P5-P6 Students', 
        description: 'Building automated watering systems using ESP32 and moisture sensors.', 
        instructor: 'Mr. Lim',
        imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=1200'
      }
    ]
  },
  {
    day: 'Friday',
    date: '',
    items: [
      { 
        type: 'Exhibition', 
        title: 'Weekly Project Showcase', 
        time: '3:00 - 5:00 PM', 
        audience: 'Open to All', 
        description: 'A casual event where students present their weekly builds and get feedback from peers.', 
        instructor: 'Lab Mentors',
        imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200'
      }
    ]
  },
  {
    day: 'Saturday',
    date: '',
    items: [
      { 
        type: 'Competition', 
        title: 'Rapid Prototype Challenge', 
        time: '10:00 AM - 1:00 PM', 
        audience: 'Advanced Makers', 
        description: '3 hours to design, slice, and print a solution to a secret engineering problem.', 
        instructor: 'Elite Staff',
        imageUrl: 'https://images.unsplash.com/photo-1581092341396-d99612958c01?auto=format&fit=crop&q=80&w=1200'
      }
    ]
  },
  {
    day: 'Sunday',
    date: '',
    items: [
      { 
        type: 'Workshop', 
        title: 'Family Maker Sunday', 
        time: '11:00 AM - 1:00 PM', 
        audience: 'Parents & Children', 
        description: 'Guided parent-child projects using simple electronics and crafts.', 
        instructor: 'Community Team',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200'
      }
    ]
  }
];