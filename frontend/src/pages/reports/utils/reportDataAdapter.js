/**
 * Maps a career category to a streamlined Class 8-10 stream and subject list.
 * Streams are strictly Science, Commerce, and Arts.
 * 
 * @param {string} career The name of the career.
 * @returns {Object} Stream information.
 */
export const getStreamForCareer = (career) => {
  const c = (career || "").toLowerCase();
  
  if (
    c.includes("doctor") || 
    c.includes("surgeon") || 
    c.includes("science") || 
    c.includes("technology") || 
    c.includes("software") || 
    c.includes("ai") || 
    c.includes("computer") || 
    c.includes("analyst") || 
    c.includes("architect")
  ) {
    return {
      stream: "Science",
      desc: "Recommended for analytical minds with strong reasoning and scientific curiosity. Focuses on physical sciences, life sciences, and technology foundations.",
      short: ["Choose Science stream in Class 11", "Participate in science clubs, coding camps, or school exhibitions"],
      long: ["Build analytical foundation through high school Mathematics and Science projects", "Participate in STEM Olympiads and Science exhibitions"],
      subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"]
    };
  }
  
  if (
    c.includes("finance") || 
    c.includes("accounting") || 
    c.includes("business") || 
    c.includes("management") || 
    c.includes("cfo") || 
    c.includes("entrepreneur") || 
    c.includes("accountant")
  ) {
    return {
      stream: "Commerce",
      desc: "Ideal for student profiles with strong budget tracking, business planning, and organizational skills. Focuses on economics, financial accounting, and business foundations.",
      short: ["Choose Commerce stream in Class 11", "Learn basic banking and corporate business structures"],
      long: ["Strengthen logical reasoning and data visualization habits through practical math", "Participate in school business clubs and youth entrepreneurship workshops"],
      subjects: ["Accountancy", "Business Studies", "Economics", "Mathematics / Applied Math"]
    };
  }
  
  return {
    stream: "Arts",
    desc: "Suited for creative expression, social studies, legal systems, behavioral psychology, and communication. Focuses on social sciences, psychology, and creative arts foundations.",
    short: ["Choose Arts/Humanities stream with Psychology, History, or Political Science", "Join public speaking, mock parliament, or school debate committees"],
    long: ["Strengthen communication and critical text analysis through structured reading", "Build foundation in human behavior, social structures, and history writing"],
    subjects: ["Psychology", "Political Science", "History", "Sociology", "English Literature"]
  };
};

/**
 * Maps a career to its respective target degrees and national entrance exams for Class 11-12.
 * 
 * @param {string} career The name of the career.
 * @returns {Object} Degrees and Exams list.
 */
export const getDegreesAndExamsForCareer = (career) => {
  const c = (career || "").toLowerCase();
  
  if (
    c.includes("software") || 
    c.includes("computer") || 
    c.includes("architect") || 
    c.includes("data") || 
    c.includes("ai")
  ) {
    return {
      degrees: ["B.Tech Computer Science (CSE)", "BCA (Computer Applications)", "B.Sc Data Science"],
      exams: ["JEE Main & Advanced", "BITSAT", "VITEEE", "CUET-UG"]
    };
  }
  
  if (
    c.includes("doctor") || 
    c.includes("medical") || 
    c.includes("specialist") || 
    c.includes("surgeon")
  ) {
    return {
      degrees: ["MBBS (Bachelor of Medicine & Surgery)", "BDS (Dental)", "B.Sc Biotechnology"],
      exams: ["NEET-UG"]
    };
  }
  
  if (c.includes("psychologist")) {
    return {
      degrees: ["B.A. Psychology (Honours)", "B.Sc Clinical Psychology"],
      exams: ["CUET-UG", "State University Entrance Exams"]
    };
  }
  
  if (
    c.includes("finance") || 
    c.includes("cfo") || 
    c.includes("accounting") || 
    c.includes("accountant")
  ) {
    return {
      degrees: ["B.Com (Honours)", "BBA Finance", "Chartered Accountancy (CA) Foundation"],
      exams: ["CUET-UG", "CA Foundation Entrance", "SET / IPMAT"]
    };
  }
  
  if (
    c.includes("counsel") || 
    c.includes("partner") || 
    c.includes("law") || 
    c.includes("lawyer")
  ) {
    return {
      degrees: ["BA LLB (5-Year Integrated)", "BBA LLB (5-Year Integrated)"],
      exams: ["CLAT-UG", "AILET", "LSAT India", "MH CET Law"]
    };
  }
  
  return {
    degrees: ["Bachelor of Business Administration (BBA)", "B.A. Liberal Arts", "B.Sc Applied Sciences"],
    exams: ["CUET-UG", "NPAT", "IPMAT", "Symbiosis Entrance Test"]
  };
};

/**
 * Returns generic cover text mapping for metadata headers.
 * 
 * @param {string} assessmentType 
 * @returns {Object} Cover layout metadata.
 */
export const getCoverDetails = (assessmentType) => {
  switch (assessmentType) {
    case 'class_5_8':
      return {
        title: "My Learning & Growth Report",
        badge: "Class 5-8 Learning Portfolio",
        desc: "A child-and-parent friendly learning portfolio analyzing study habits and school activities."
      };
    case 'class_9_10':
    case 'student_8_10':
      return {
        title: "Stream Exploration Report",
        badge: "Verified Guidance Portfolio",
        desc: "A stream-bound guidance report tracking stream choices, subject alignments, and study strategies."
      };
    case 'class_11_12':
    case 'student_11_12':
      return {
        title: "Career Planning Report",
        badge: "Verified Guidance Portfolio",
        desc: "A college-bound roadmap tracking recommended fields, degrees, and competitive entrance examinations."
      };
    case 'undergraduate':
      return {
        title: "Work Preparation & Career Report",
        badge: "Career Report",
        desc: "An entry-level work preparation report outlining target career paths, certificates, and internships."
      };
    case 'professional':
    default:
      return {
        title: "Executive Career Report",
        badge: "Executive Report",
        desc: "An advanced professional career report mapping leadership growth and lateral career transition paths."
      };
  }
};
