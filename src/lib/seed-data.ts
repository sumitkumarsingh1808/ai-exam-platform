// Pre-seeded Examination Banks for Production and Serverless Environments
import { Quiz, Question } from "./types";

export const SEED_CATEGORIES: string[] = [
  "Banking",
  "UGC NET",
  "Engineering & GATE",
  "Civil Services / UPSC"
];

export const SEED_QUIZZES: Record<string, Quiz> = {
  "quiz-banking-live-mock": {
    "id": "quiz-banking-live-mock",
    "title": "Banking Today's Live Mock: SBI PO 2026 Daily Target Shift",
    "description": "Official live daily mock for Banking candidates covering Quantitative Aptitude, Logical Puzzles, and English.",
    "subject": "Banking (Quant, Reasoning & English)",
    "category": "Banking",
    "paperType": "live_mock",
    "isDailyPaper": true,
    "status": "published",
    "durationMinutes": 60,
    "totalQuestions": 13,
    "marksPerQuestion": 1,
    "negativeMarks": 0.25,
    "language": "English",
    "createdBy": "system",
    "createdAt": "2026-10-27T03:17:01.737Z",
    "updatedAt": "2026-10-27T03:17:01.737Z",
    "publishedAt": "2026-10-27T03:17:01.737Z",
    "reviewPolicy": "immediate",
    "allowRandomization": true
  },
  "quiz-1793042072601-ts1pe": {
    "id": "quiz-1793042072601-ts1pe",
    "title": "Quantitative Aptitude: Profit & Loss Speed Test",
    "description": "Generated via NTA AI Examination Agent",
    "subject": "Quantitative Aptitude",
    "status": "published",
    "durationMinutes": 20,
    "totalQuestions": 1,
    "marksPerQuestion": 4,
    "negativeMarks": 1,
    "language": "English",
    "createdBy": "admin",
    "createdAt": "2026-10-26T19:14:32.601Z",
    "updatedAt": "2026-10-26T19:14:32.601Z",
    "publishedAt": "2026-10-26T19:14:32.601Z",
    "reviewPolicy": "immediate",
    "allowRandomization": true,
    "category": "Banking"
  },
  "quiz-banking-reasoning": {
    "id": "quiz-banking-reasoning",
    "title": "Banking Reasoning: Circular Seating, Syllogisms & Blood Relations",
    "description": "High-yield reasoning section test designed for speed and accuracy in Banking prelims.",
    "subject": "Logical Reasoning",
    "category": "Banking",
    "paperType": "sectional_reasoning",
    "isDailyPaper": false,
    "status": "published",
    "durationMinutes": 20,
    "totalQuestions": 4,
    "marksPerQuestion": 1,
    "negativeMarks": 0.25,
    "language": "English",
    "createdBy": "system",
    "createdAt": "2026-10-27T03:17:01.737Z",
    "updatedAt": "2026-10-27T03:17:01.737Z",
    "publishedAt": "2026-10-27T03:17:01.737Z",
    "reviewPolicy": "immediate",
    "allowRandomization": true
  },
  "quiz-banking-english": {
    "id": "quiz-banking-english",
    "title": "Banking English: Reading Comprehension, Cloze Test & Error Spotting",
    "description": "Specialized verbal ability assessment on SBI & IBPS PO pattern with grammatical explanations.",
    "subject": "English Language",
    "category": "Banking",
    "paperType": "sectional_english",
    "isDailyPaper": false,
    "status": "published",
    "durationMinutes": 20,
    "totalQuestions": 4,
    "marksPerQuestion": 1,
    "negativeMarks": 0.25,
    "language": "English",
    "createdBy": "system",
    "createdAt": "2026-10-27T03:17:01.737Z",
    "updatedAt": "2026-10-27T03:17:01.737Z",
    "publishedAt": "2026-10-27T03:17:01.737Z",
    "reviewPolicy": "immediate",
    "allowRandomization": true
  },
  "quiz-ugc-net-live-mock": {
    "id": "quiz-ugc-net-live-mock",
    "title": "UGC NET Today's Live Mock: Paper 1 Complete National Shift",
    "description": "Official National Live Mock for UGC NET candidates covering Teaching Aptitude, Research Ethics, and Higher Education.",
    "subject": "Teaching & Research Aptitude",
    "category": "UGC NET",
    "paperType": "live_mock",
    "isDailyPaper": true,
    "status": "published",
    "durationMinutes": 60,
    "totalQuestions": 5,
    "marksPerQuestion": 2,
    "negativeMarks": 0,
    "language": "English",
    "createdBy": "system",
    "createdAt": "2026-10-27T03:17:01.737Z",
    "updatedAt": "2026-10-27T03:17:01.737Z",
    "publishedAt": "2026-10-27T03:17:01.737Z",
    "reviewPolicy": "immediate",
    "allowRandomization": true
  },
  "quiz-ugc-net-01": {
    "id": "quiz-ugc-net-01",
    "title": "UGC NET Paper 1: Today's Target Paper (Teaching & Research)",
    "description": "Official NTA pattern mock examination covering teaching methodology, research ethics, and logical reasoning.",
    "subject": "Teaching & Research Aptitude",
    "status": "published",
    "durationMinutes": 60,
    "totalQuestions": 5,
    "marksPerQuestion": 4,
    "negativeMarks": 1,
    "language": "English",
    "createdBy": "system",
    "createdAt": "2026-10-26T18:41:00.165Z",
    "updatedAt": "2026-10-26T19:21:14.686Z",
    "publishedAt": "2026-10-26T18:41:00.168Z",
    "reviewPolicy": "immediate",
    "allowRandomization": true,
    "category": "UGC NET",
    "isDailyPaper": true
  },
  "quiz-ugc-net-research": {
    "id": "quiz-ugc-net-research",
    "title": "UGC NET Paper 1: Research Methodology, Hypothesis & Ethics",
    "description": "Specialized Paper 1 section test focusing on Quantitative vs Qualitative Research, Sampling, and Academic Integrity.",
    "subject": "Research Methodology",
    "category": "UGC NET",
    "paperType": "sectional_research",
    "isDailyPaper": false,
    "status": "published",
    "durationMinutes": 30,
    "totalQuestions": 4,
    "marksPerQuestion": 2,
    "negativeMarks": 0,
    "language": "English",
    "createdBy": "system",
    "createdAt": "2026-10-27T03:17:01.737Z",
    "updatedAt": "2026-10-27T03:17:01.737Z",
    "publishedAt": "2026-10-27T03:17:01.737Z",
    "reviewPolicy": "immediate",
    "allowRandomization": true
  },
  "quiz-ugc-net-02": {
    "id": "quiz-ugc-net-02",
    "title": "UGC NET Paper 1: Communication, Ethics & ICT Mock",
    "description": "Official NTA standard practice paper focusing on Classroom Communication, ICT Applications, and Research Ethics.",
    "subject": "Communication & Higher Education",
    "category": "UGC NET",
    "isDailyPaper": false,
    "status": "published",
    "durationMinutes": 45,
    "totalQuestions": 5,
    "marksPerQuestion": 4,
    "negativeMarks": 1,
    "language": "English",
    "createdBy": "system",
    "createdAt": "2026-10-27T03:01:49.522Z",
    "updatedAt": "2026-10-27T03:01:49.522Z",
    "publishedAt": "2026-10-27T03:01:49.522Z",
    "reviewPolicy": "immediate",
    "allowRandomization": true
  }
};

export const SEED_QUESTIONS: Record<string, Question> = {
  "q-ugc-1": {
    "id": "q-ugc-1",
    "quizId": "quiz-ugc-net-01",
    "questionText": "Which of the following evaluation systems belongs to the category of being continuous and comprehensive, focusing on cognitive, affective, and psychomotor domains?",
    "options": [
      "Norm-referenced testing",
      "Criterion-referenced testing",
      "Continuous and Comprehensive Evaluation (CCE)",
      "Summative assessment only"
    ],
    "correctAnswerIndex": 2,
    "explanation": "Continuous and Comprehensive Evaluation (CCE) was formulated to assess all facets of a student's development holistically.",
    "difficulty": "easy",
    "topic": "Teaching Aptitude",
    "sourceReference": "UGC NET Paper 1 Unit 1",
    "order": 1
  },
  "q-ugc-2": {
    "id": "q-ugc-2",
    "quizId": "quiz-ugc-net-01",
    "questionText": "A researcher is conducting a study to determine the causal effect of instructional multimedia on student retention. Which research design is most scientifically rigorous?",
    "options": [
      "Descriptive survey design",
      "True experimental design with random assignment",
      "Historical archival analysis",
      "Correlational case study"
    ],
    "correctAnswerIndex": 1,
    "explanation": "True experimental design with random assignment allows control over extraneous variables and establishes definitive cause-effect relationships.",
    "difficulty": "medium",
    "topic": "Research Aptitude",
    "sourceReference": "UGC NET Paper 1 Unit 2",
    "order": 2
  },
  "q-ugc-3": {
    "id": "q-ugc-3",
    "quizId": "quiz-ugc-net-01",
    "questionText": "Which of the following represents a valid deductive argument?",
    "options": [
      "All humans are mortal; Socrates is a human; therefore, Socrates is mortal.",
      "Most birds can fly; penguins are birds; therefore, penguins can fly.",
      "The sun has risen every day; therefore, it might rise tomorrow.",
      "Some teachers are artists; some artists are poets; therefore, all teachers are poets."
    ],
    "correctAnswerIndex": 0,
    "explanation": "The syllogism follows a standard classical valid deductive form: Major premise, Minor premise, Necessarily follows conclusion.",
    "difficulty": "easy",
    "topic": "Logical Reasoning",
    "sourceReference": "UGC NET Paper 1 Unit 6",
    "order": 3
  },
  "q-ugc-4": {
    "id": "q-ugc-4",
    "quizId": "quiz-ugc-net-01",
    "questionText": "In the context of the National Education Policy (NEP) 2020, what pedagogical structure replaces the 10+2 structure?",
    "options": [
      "5 + 3 + 3 + 4",
      "5 + 4 + 3 + 2",
      "3 + 3 + 4 + 4",
      "4 + 4 + 3 + 3"
    ],
    "correctAnswerIndex": 0,
    "explanation": "NEP 2020 introduces the 5+3+3+4 design covering Foundational (5), Preparatory (3), Middle (3), and Secondary (4) stages.",
    "difficulty": "medium",
    "topic": "Higher Education System",
    "sourceReference": "NEP 2020 Section 1.1",
    "order": 4
  },
  "q-ugc-5": {
    "id": "q-ugc-5",
    "quizId": "quiz-ugc-net-01",
    "questionText": "Which protocol is utilized for securely encrypting data communicated between a web browser and an examination web application?",
    "options": [
      "HTTP over SSL/TLS (HTTPS)",
      "Simple Mail Transfer Protocol (SMTP)",
      "File Transfer Protocol (FTP)",
      "Telnet terminal protocol"
    ],
    "correctAnswerIndex": 0,
    "explanation": "HTTPS (Hypertext Transfer Protocol Secure) encrypts bidirectional communications using Transport Layer Security (TLS).",
    "difficulty": "easy",
    "topic": "Information & Communication Technology (ICT)",
    "sourceReference": "UGC NET Paper 1 Unit 8",
    "order": 5
  },
  "q-quiz-1793042072601-ts1pe-1": {
    "id": "q-quiz-1793042072601-ts1pe-1",
    "quizId": "quiz-1793042072601-ts1pe",
    "questionText": "A shopkeeper marks an article 20% above cost price and allows a 10% discount. What is his net profit percentage?",
    "options": [
      "8%",
      "10%",
      "12%",
      "15%"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Let CP = 100. MP = 120. SP = 120 * 0.9 = 108. Profit = 8%.",
    "difficulty": "easy",
    "topic": "Profit & Loss",
    "sourceReference": "AI Agent Question Generator",
    "order": 1
  },
  "q-quiz-ugc-net-02-1": {
    "id": "q-quiz-ugc-net-02-1",
    "quizId": "quiz-ugc-net-02",
    "questionText": "In classroom communication, which barrier is considered an 'internal barrier' on the part of the receiver?",
    "options": [
      "Loud ambient noise",
      "Psychological prejudices or emotional anxiety",
      "Faulty microphone",
      "Poor visual font"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Internal barriers include emotional distress, personal biases, and anxiety which distort listening comprehension.",
    "difficulty": "medium",
    "topic": "Classroom Communication",
    "sourceReference": "UGC NET Paper 1 Official Syllabus",
    "order": 1
  },
  "q-quiz-ugc-net-02-2": {
    "id": "q-quiz-ugc-net-02-2",
    "quizId": "quiz-ugc-net-02",
    "questionText": "Which of the following research ethics principles requires participants to be fully informed before participating in an academic survey?",
    "options": [
      "Plagiarism check",
      "Informed Consent",
      "Peer review validation",
      "Citation indexing"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Informed consent ensures that participants understand the purpose, risks, and benefits of research before voluntary agreement.",
    "difficulty": "hard",
    "topic": "Research Ethics",
    "sourceReference": "UGC NET Paper 1 Official Syllabus",
    "order": 2
  },
  "q-quiz-ugc-net-02-3": {
    "id": "q-quiz-ugc-net-02-3",
    "quizId": "quiz-ugc-net-02",
    "questionText": "Which open-source learning management platform is widely supported by the Ministry of Education under the SWAYAM initiative?",
    "options": [
      "Moodle",
      "Blackboard",
      "Edmodo",
      "Canvas LMS"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Moodle is an open-source LMS integrated widely in Indian higher educational institutions alongside SWAYAM.",
    "difficulty": "medium",
    "topic": "ICT in Education",
    "sourceReference": "UGC NET Paper 1 Official Syllabus",
    "order": 3
  },
  "q-quiz-ugc-net-02-4": {
    "id": "q-quiz-ugc-net-02-4",
    "quizId": "quiz-ugc-net-02",
    "questionText": "What type of reasoning proceeds from particular observations to generalized theoretical principles?",
    "options": [
      "Deductive reasoning",
      "Inductive reasoning",
      "Analogical reasoning",
      "Circular reasoning"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Inductive reasoning moves from specific premises/observations to broader generalizations and theories (Bottom-Up approach).",
    "difficulty": "hard",
    "topic": "Logical Reasoning",
    "sourceReference": "UGC NET Paper 1 Official Syllabus",
    "order": 4
  },
  "q-quiz-ugc-net-02-5": {
    "id": "q-quiz-ugc-net-02-5",
    "quizId": "quiz-ugc-net-02",
    "questionText": "Under the National Education Policy (NEP) 2020, what is the envisioned Gross Enrolment Ratio (GER) in higher education by 2035?",
    "options": [
      "35%",
      "40%",
      "50%",
      "65%"
    ],
    "correctAnswerIndex": 2,
    "explanation": "NEP 2020 aims to increase the Gross Enrolment Ratio (GER) in higher education including vocational education to 50% by 2035.",
    "difficulty": "medium",
    "topic": "Higher Education System",
    "sourceReference": "UGC NET Paper 1 Official Syllabus",
    "order": 5
  },
  "q-banking-live-1": {
    "id": "q-banking-live-1",
    "quizId": "quiz-banking-live-mock",
    "questionText": "Which sentence comes FIRST after rearrangement of the sentences (A) to (F)?",
    "options": [
      "A",
      "B",
      "F",
      "C"
    ],
    "correctAnswerIndex": 2,
    "explanation": "F introduces the chat app Aragon, setting the context for the paragraph. Therefore, F is the first sentence.",
    "difficulty": "medium",
    "topic": "English - Para Jumbles",
    "sourceReference": "Q1",
    "order": 1
  },
  "q-banking-live-2": {
    "id": "q-banking-live-2",
    "quizId": "quiz-banking-live-mock",
    "questionText": "Which sentence comes SECOND after rearrangement of the sentences (A) to (F)?",
    "options": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctAnswerIndex": 3,
    "explanation": "D ('Its makers') follows F by describing how the makers promoted the app, making it the second sentence.",
    "difficulty": "medium",
    "topic": "English - Para Jumbles",
    "sourceReference": "Q2",
    "order": 2
  },
  "q-banking-live-3": {
    "id": "q-banking-live-3",
    "quizId": "quiz-banking-live-mock",
    "questionText": "Which sentence comes THIRD after rearrangement of the sentences (A) to (F)?",
    "options": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctAnswerIndex": 1,
    "explanation": "B ('however') introduces the suspicion surrounding the app, following sentence D in the correct order (F, D, B, C, E, A).",
    "difficulty": "medium",
    "topic": "English - Para Jumbles",
    "sourceReference": "Q3",
    "order": 3
  },
  "q-banking-live-4": {
    "id": "q-banking-live-4",
    "quizId": "quiz-banking-live-mock",
    "questionText": "Which sentence comes FOURTH after rearrangement of the sentences (A) to (F)?",
    "options": [
      "F",
      "B",
      "C",
      "D"
    ],
    "correctAnswerIndex": 2,
    "explanation": "C ('These suspicions') deepens the suspicion introduced in sentence B, making it the fourth sentence.",
    "difficulty": "medium",
    "topic": "English - Para Jumbles",
    "sourceReference": "Q4",
    "order": 4
  },
  "q-banking-live-5": {
    "id": "q-banking-live-5",
    "quizId": "quiz-banking-live-mock",
    "questionText": "Identify the sentence that is grammatically INCORRECT.",
    "options": [
      "He has already submitted the report ahead of the deadline.",
      "Neither the coach nor the players were happy with the result.",
      "She has been working in this bank since six years.",
      "We are organising a farewell lunch for our manager tomorrow."
    ],
    "correctAnswerIndex": 2,
    "explanation": "'Since' is used with a point in time (since 2019); a length of time requires 'for': 'for six years'.",
    "difficulty": "easy",
    "topic": "English - Sentence Correction",
    "sourceReference": "Q6",
    "order": 5
  },
  "q-banking-live-6": {
    "id": "q-banking-live-6",
    "quizId": "quiz-banking-live-mock",
    "questionText": "Which of the following sentences contains a grammatical error?",
    "options": [
      "Each of the candidates have submitted the form.",
      "She enjoys reading detective novels on weekends.",
      "We have been waiting at the station for over an hour.",
      "My brother and I are going trekking next month."
    ],
    "correctAnswerIndex": 0,
    "explanation": "'Each' is singular and takes a singular verb: 'Each of the candidates has submitted the form.'",
    "difficulty": "easy",
    "topic": "English - Sentence Correction",
    "sourceReference": "Q7",
    "order": 6
  },
  "q-banking-live-7": {
    "id": "q-banking-live-7",
    "quizId": "quiz-banking-live-mock",
    "questionText": "Identify the sentence that is grammatically CORRECT.",
    "options": [
      "She don't like travelling by bus.",
      "They has been practising since morning.",
      "He go to the library every Sunday.",
      "I reached late because the train was delayed by an hour."
    ],
    "correctAnswerIndex": 3,
    "explanation": "The first three options contain subject-verb agreement errors (she doesn't, they have, he goes). The fourth sentence is grammatically correct.",
    "difficulty": "easy",
    "topic": "English - Sentence Correction",
    "sourceReference": "Q8",
    "order": 7
  },
  "q-banking-live-8": {
    "id": "q-banking-live-8",
    "quizId": "quiz-banking-live-mock",
    "questionText": "Choose the most appropriate word to fill the blank:\nThe witness gave such a __________ account of the robbery, recalling even the colour of the getaway car, that the jury could picture the scene clearly.",
    "options": [
      "honestly",
      "deceptive",
      "cleared",
      "vivid"
    ],
    "correctAnswerIndex": 3,
    "explanation": "An account detailed enough for the jury to picture the scene is a vivid one. 'Honestly' is an adverb and cannot qualify 'account'.",
    "difficulty": "easy",
    "topic": "English - Fillers",
    "sourceReference": "Q10",
    "order": 8
  },
  "q-banking-live-9": {
    "id": "q-banking-live-9",
    "quizId": "quiz-banking-live-mock",
    "questionText": "Choose the most appropriate word to fill the blank:\nThe teacher was impressed by the student's __________ to improve, as he practised every evening after class.",
    "options": [
      "determination",
      "responsive",
      "resistance",
      "refusal"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Practising every evening shows determination to improve. 'Wise' and 'responsive' are adjectives and do not fit after 'the student's'.",
    "difficulty": "easy",
    "topic": "English - Fillers",
    "sourceReference": "Q11",
    "order": 9
  },
  "q-banking-live-10": {
    "id": "q-banking-live-10",
    "quizId": "quiz-banking-live-mock",
    "questionText": "Choose the most appropriate word to fill the blank:\nThe manager's __________ response to the complaint, a shrug and a vague promise to look into it some day, irritated the already angry customer.",
    "options": [
      "prompt",
      "strong",
      "indifferent",
      "detailed"
    ],
    "correctAnswerIndex": 2,
    "explanation": "A shrug and a vague promise show a lack of concern, which defines an indifferent response.",
    "difficulty": "medium",
    "topic": "English - Fillers",
    "sourceReference": "Q12",
    "order": 10
  },
  "q-banking-live-11": {
    "id": "q-banking-live-11",
    "quizId": "quiz-banking-live-mock",
    "questionText": "In the sentence below, four words are marked (A) to (D). Choose the interchange(s) that make the sentence grammatically and contextually correct:\nThe board postpone (A) to decided (B) the annual function because several senior members (C) were unavailable (D) that week.",
    "options": [
      "B-C and A-D",
      "A-B",
      "C-D",
      "A-C and B-D"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Swapping A and B gives 'The board decided to postpone the annual function because several senior members were unavailable that week.'",
    "difficulty": "medium",
    "topic": "English - Word Swap",
    "sourceReference": "Q13",
    "order": 11
  },
  "q-banking-live-12": {
    "id": "q-banking-live-12",
    "quizId": "quiz-banking-live-mock",
    "questionText": "Match the parts in Column I with those in Column II to form meaningful and grammatically correct sentences.\nColumn I: (A) The new rules require every passenger, (B) Despite the heavy rain, the final match, (C) The government announced new subsidies to support\nColumn II: (D) farmers who adopt sustainable practices, (E) to carrying a valid photo identity card, (F) has been postponing since Monday.",
    "options": [
      "None of these",
      "B-F",
      "C-D",
      "A-E, B-F"
    ],
    "correctAnswerIndex": 2,
    "explanation": "Only C-D forms a correct and meaningful sentence: 'The government announced new subsidies to support farmers who adopt sustainable practices.'",
    "difficulty": "medium",
    "topic": "English - Sentence Connector",
    "sourceReference": "Q17",
    "order": 12
  },
  "q-banking-live-13": {
    "id": "q-banking-live-13",
    "quizId": "quiz-banking-live-mock",
    "questionText": "Match the parts in Column I with those in Column II to form meaningful and grammatically correct sentences.\nColumn I: (A) Advances in artificial intelligence are enabling machines, (B) Several countries are investing heavily in renewable energy, (C) The government launched a digital literacy campaign\nColumn II: (D) controlling inflation and stabilize the economy, (E) forced farmers to migrate to nearby cities, (F) to learn and adapt without explicit programming.",
    "options": [
      "None of these",
      "A-F",
      "B-D",
      "A-E, B-F"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Only A-F is valid: 'Advances in artificial intelligence are enabling machines to learn and adapt without explicit programming.'",
    "difficulty": "medium",
    "topic": "English - Sentence Connector",
    "sourceReference": "Q18",
    "order": 13
  },
  "q-bk-reas-1": {
    "id": "q-bk-reas-1",
    "quizId": "quiz-banking-reasoning",
    "questionText": "Eight friends A, B, C, D, E, F, G, and H are sitting around a circular table facing the center. A sits third to the left of B. Only two people sit between B and E. F sits second to the right of E. Who sits opposite to A?",
    "options": [
      "E",
      "F",
      "D",
      "H"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Arranging clockwise from B at position 1: B(1), _(2), _(3), A(6). Between B(1) and E: E is at 4. F is 2nd to right of E (pos 2). Position opposite to A is F.",
    "difficulty": "medium",
    "topic": "Circular Seating Arrangement",
    "order": 1
  },
  "q-bk-reas-2": {
    "id": "q-bk-reas-2",
    "quizId": "quiz-banking-reasoning",
    "questionText": "Statements: All bags are pockets. Some pockets are wallets. No wallet is a pouch. Conclusions: I. Some bags are wallets. II. No pouch is a wallet.",
    "options": [
      "Only conclusion I follows",
      "Only conclusion II follows",
      "Either I or II follows",
      "Both follow"
    ],
    "correctAnswerIndex": 1,
    "explanation": "No wallet is a pouch is directly convertible to No pouch is a wallet. Conclusion II follows directly.",
    "difficulty": "medium",
    "topic": "Syllogisms",
    "order": 2
  },
  "q-bk-reas-3": {
    "id": "q-bk-reas-3",
    "quizId": "quiz-banking-reasoning",
    "questionText": "If 'A + B' means A is the brother of B; 'A - B' means A is the sister of B; 'A * B' means A is the father of B. Which expression means 'P is the nephew of Q'?",
    "options": [
      "Q + R - P",
      "Q - R + P",
      "Q - R * P",
      "R + Q - P"
    ],
    "correctAnswerIndex": 2,
    "explanation": "Q - R means Q is sister of R. R * P means R is father of P. Hence P is sibling child (nephew/child) of Q.",
    "difficulty": "medium",
    "topic": "Coded Blood Relations",
    "order": 3
  },
  "q-bk-reas-4": {
    "id": "q-bk-reas-4",
    "quizId": "quiz-banking-reasoning",
    "questionText": "In a certain code language, 'BANK' is written as '52' and 'EXAM' is written as '68'. How will 'TEST' be written in that code language?",
    "options": [
      "64",
      "128",
      "136",
      "72"
    ],
    "correctAnswerIndex": 1,
    "explanation": "B(2)+A(1)+N(14)+K(11) = 28. Reverse letters or sum * 2 - 4? Sum of B+A+N+K = 28 -> 28 * 2 - 4 = 52. E(5)+X(24)+A(1)+M(13) = 43 -> wait, opposite ranks: B(25)+A(26)+N(13)+K(16) = 80. Letter sum * 2: 28*2 = 56 - 4 = 52. T(20)+E(5)+T(20)+S(19) = 64 -> 64 * 2 = 128.",
    "difficulty": "medium",
    "topic": "Coding Decoding",
    "order": 4
  },
  "q-bk-eng-1": {
    "id": "q-bk-eng-1",
    "quizId": "quiz-banking-english",
    "questionText": "Select the sentence with NO grammatical error:",
    "options": [
      "The inflation rate has raised significantly due to supply chain disruptions.",
      "The inflation rate has risen significantly due to supply chain disruptions.",
      "The inflation rate has been raised significantly due to supply chain disruptions.",
      "The inflation rate is risen significantly due to supply chain disruptions."
    ],
    "correctAnswerIndex": 1,
    "explanation": "'Rise' is an intransitive verb (rises, rose, risen). 'Raise' requires a direct object. Here the subject itself increases, so 'has risen' is grammatically correct.",
    "difficulty": "easy",
    "topic": "Verbal Usage & Grammar",
    "order": 1
  },
  "q-bk-eng-2": {
    "id": "q-bk-eng-2",
    "quizId": "quiz-banking-english",
    "questionText": "Choose the antonym of the word 'PRUDENT' in banking governance context:",
    "options": [
      "Judicious",
      "Frugal",
      "Imprudent",
      "Vigilant"
    ],
    "correctAnswerIndex": 2,
    "explanation": "'Prudent' means acting with caution and foresight. The direct antonym is 'Imprudent' (reckless, rash).",
    "difficulty": "easy",
    "topic": "Vocabulary",
    "order": 2
  },
  "q-bk-eng-3": {
    "id": "q-bk-eng-3",
    "quizId": "quiz-banking-english",
    "questionText": "Fill in the blank: The Monetary Policy Committee decided to _______ the repo rate by 25 basis points to contain core inflation.",
    "options": [
      "elevate",
      "escalate",
      "hike",
      "magnify"
    ],
    "correctAnswerIndex": 2,
    "explanation": "In financial and central banking journalism, interest rate increases are termed as a 'rate hike'.",
    "difficulty": "easy",
    "topic": "Cloze Test / Financial Terms",
    "order": 3
  },
  "q-bk-eng-4": {
    "id": "q-bk-eng-4",
    "quizId": "quiz-banking-english",
    "questionText": "Identify the misspelled word in financial terminology:",
    "options": [
      "Collateral",
      "Amortization",
      "Bankrupcy",
      "Liquidity"
    ],
    "correctAnswerIndex": 2,
    "explanation": "The correct spelling is 'Bankruptcy' (with a 't': B-A-N-K-R-U-P-T-C-Y).",
    "difficulty": "easy",
    "topic": "Spelling Correction",
    "order": 4
  },
  "q-net-live-1": {
    "id": "q-net-live-1",
    "quizId": "quiz-ugc-net-live-mock",
    "questionText": "Which of the following evaluation systems belongs to the category of being continuous and comprehensive, focusing on cognitive, affective, and psychomotor domains?",
    "options": [
      "Norm-referenced testing",
      "Criterion-referenced testing",
      "Continuous and Comprehensive Evaluation (CCE)",
      "Summative assessment only"
    ],
    "correctAnswerIndex": 2,
    "explanation": "Continuous and Comprehensive Evaluation (CCE) was formulated to assess all facets of a student's development holistically.",
    "difficulty": "easy",
    "topic": "Teaching Aptitude",
    "sourceReference": "UGC NET Paper 1 Unit 1",
    "order": 1
  },
  "q-net-live-2": {
    "id": "q-net-live-2",
    "quizId": "quiz-ugc-net-live-mock",
    "questionText": "A researcher is conducting a study to determine the causal effect of instructional multimedia on student retention. Which research design is most scientifically rigorous?",
    "options": [
      "Descriptive survey design",
      "True experimental design with random assignment",
      "Historical archival analysis",
      "Correlational case study"
    ],
    "correctAnswerIndex": 1,
    "explanation": "True experimental design with random assignment allows control over extraneous variables and establishes definitive cause-effect relationships.",
    "difficulty": "medium",
    "topic": "Research Aptitude",
    "sourceReference": "UGC NET Paper 1 Unit 2",
    "order": 2
  },
  "q-net-live-3": {
    "id": "q-net-live-3",
    "quizId": "quiz-ugc-net-live-mock",
    "questionText": "Which of the following represents a valid deductive argument?",
    "options": [
      "All humans are mortal; Socrates is a human; therefore, Socrates is mortal.",
      "Most birds can fly; penguins are birds; therefore, penguins can fly.",
      "The sun has risen every day; therefore, it might rise tomorrow.",
      "Some teachers are artists; some artists are poets; therefore, all teachers are poets."
    ],
    "correctAnswerIndex": 0,
    "explanation": "The syllogism follows a standard classical valid deductive form: Major premise, Minor premise, Necessarily follows conclusion.",
    "difficulty": "easy",
    "topic": "Logical Reasoning",
    "sourceReference": "UGC NET Paper 1 Unit 6",
    "order": 3
  },
  "q-net-live-4": {
    "id": "q-net-live-4",
    "quizId": "quiz-ugc-net-live-mock",
    "questionText": "In the context of the National Education Policy (NEP) 2020, what pedagogical structure replaces the 10+2 structure?",
    "options": [
      "5 + 3 + 3 + 4",
      "5 + 4 + 3 + 2",
      "3 + 3 + 4 + 4",
      "4 + 4 + 3 + 3"
    ],
    "correctAnswerIndex": 0,
    "explanation": "NEP 2020 introduces the 5+3+3+4 design covering Foundational (5), Preparatory (3), Middle (3), and Secondary (4) stages.",
    "difficulty": "medium",
    "topic": "Higher Education System",
    "sourceReference": "NEP 2020 Section 1.1",
    "order": 4
  },
  "q-net-live-5": {
    "id": "q-net-live-5",
    "quizId": "quiz-ugc-net-live-mock",
    "questionText": "Which protocol is utilized for securely encrypting data communicated between a web browser and an examination web application?",
    "options": [
      "HTTP over SSL/TLS (HTTPS)",
      "Simple Mail Transfer Protocol (SMTP)",
      "File Transfer Protocol (FTP)",
      "Telnet terminal protocol"
    ],
    "correctAnswerIndex": 0,
    "explanation": "HTTPS (Hypertext Transfer Protocol Secure) encrypts bidirectional communications using Transport Layer Security (TLS).",
    "difficulty": "easy",
    "topic": "Information & Communication Technology (ICT)",
    "sourceReference": "UGC NET Paper 1 Unit 8",
    "order": 5
  },
  "q-net-res-1": {
    "id": "q-net-res-1",
    "quizId": "quiz-ugc-net-research",
    "questionText": "A research design where the investigator manipulates an independent variable to measure its effect on a dependent variable with random assignment is known as:",
    "options": [
      "Correlational study",
      "Experimental research",
      "Historical research",
      "Descriptive survey"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Experimental research is defined by active manipulation of independent variables and random assignment of subjects to establish causal relationships.",
    "difficulty": "medium",
    "topic": "Research Design",
    "order": 1
  },
  "q-net-res-2": {
    "id": "q-net-res-2",
    "quizId": "quiz-ugc-net-research",
    "questionText": "Which probability sampling method selects elements at equal periodic intervals from an ordered sampling frame?",
    "options": [
      "Stratified sampling",
      "Cluster sampling",
      "Systematic sampling",
      "Purposive sampling"
    ],
    "correctAnswerIndex": 2,
    "explanation": "Systematic sampling selects every kth element from a list after a random starting point.",
    "difficulty": "medium",
    "topic": "Sampling Techniques",
    "order": 2
  },
  "q-net-res-3": {
    "id": "q-net-res-3",
    "quizId": "quiz-ugc-net-research",
    "questionText": "In statistical hypothesis testing, committing a Type I error means:",
    "options": [
      "Rejecting the null hypothesis when it is actually true",
      "Failing to reject the null hypothesis when it is false",
      "Formulating an untestable hypothesis",
      "Using non-parametric tests on normal data"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Type I error (False Positive / alpha error) occurs when a researcher rejects a true null hypothesis.",
    "difficulty": "medium",
    "topic": "Hypothesis Testing",
    "order": 3
  },
  "q-net-res-4": {
    "id": "q-net-res-4",
    "quizId": "quiz-ugc-net-research",
    "questionText": "Which of the following software tools is primarily used in Indian universities for detecting academic plagiarism under UGC guidelines?",
    "options": [
      "SPSS",
      "Urkund (Ouriginal)",
      "MATLAB",
      "LaTeX"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Urkund / Ouriginal is the government-subsidized anti-plagiarism system provided to universities across India by INFLIBNET.",
    "difficulty": "medium",
    "topic": "Academic Integrity",
    "order": 4
  }
};
