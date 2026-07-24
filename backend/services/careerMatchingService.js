import { matchSchoolCareers } from './matching/schoolMatchingService.js';
import { matchHighSchoolCareers } from './matching/highSchoolMatchingService.js';
import { matchProfessionalCareers } from './matching/professionalMatchingService.js';

export const matchCareers = (answers, questions, type = 'professional') => {
  if (type === 'student_8_10' || type === 'class_5_8' || type === 'class_9_10') {
    return matchSchoolCareers(answers, questions);
  }
  if (type === 'student_11_12' || type === 'class_11_12') {
    return matchHighSchoolCareers(answers, questions);
  }
  return matchProfessionalCareers(answers, questions);
};
