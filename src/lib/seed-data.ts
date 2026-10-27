// Pre-seeded Examination Banks for Production and Serverless Environments
import { Quiz, Question } from "./types";

export const SEED_CATEGORIES: string[] = [
  "Banking",
  "UGC NET",
  "Engineering & GATE",
  "Civil Services / UPSC"
];

export const SEED_QUIZZES: Record<string, Quiz> = {
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
  "quiz-cs-gate-01": {
    "id": "quiz-cs-gate-01",
    "title": "Computer Science: Data Structures & Algorithms",
    "description": "National Level CBT test covering asymptotic analysis, trees, graph algorithms, and dynamic programming.",
    "subject": "Computer Science",
    "status": "draft",
    "durationMinutes": 45,
    "totalQuestions": 5,
    "marksPerQuestion": 4,
    "negativeMarks": 1,
    "language": "English",
    "createdBy": "system",
    "createdAt": "2026-10-26T18:41:00.168Z",
    "updatedAt": "2026-10-26T19:21:17.850Z",
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
  "quiz-1793042348661-sldpa": {
    "id": "quiz-1793042348661-sldpa",
    "title": "SBI PO 2026: Today's Target Paper (Shift 1 Live Mock)",
    "description": "Banking Aptitude & Reasoning Mock Test based on official patterns.",
    "subject": "Banking Aptitude & Reasoning",
    "status": "published",
    "durationMinutes": 60,
    "totalQuestions": 13,
    "marksPerQuestion": 1,
    "negativeMarks": 0.25,
    "language": "English",
    "createdBy": "sumit045",
    "createdAt": "2026-10-26T19:19:08.661Z",
    "updatedAt": "2026-10-26T19:19:08.661Z",
    "publishedAt": "2026-10-26T19:19:08.661Z",
    "reviewPolicy": "immediate",
    "allowRandomization": true,
    "category": "Banking",
    "isDailyPaper": true
  },
  "quiz-1793042626200-jdbh7": {
    "id": "quiz-1793042626200-jdbh7",
    "title": "apti",
    "description": "High-quality multiple-choice questions based on the provided study material for Banking Aptitude & Reasoning.",
    "subject": "Banking Aptitude & Reasoning",
    "status": "published",
    "durationMinutes": 1,
    "totalQuestions": 10,
    "marksPerQuestion": 1,
    "negativeMarks": 0.25,
    "language": "English",
    "createdBy": "sumit045",
    "createdAt": "2026-10-26T19:23:46.200Z",
    "updatedAt": "2026-10-26T19:23:46.200Z",
    "publishedAt": "2026-10-26T19:23:46.200Z",
    "reviewPolicy": "immediate",
    "allowRandomization": true,
    "category": "Banking"
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
  },
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
  "quiz-1793081740316-9o3jc": {
    "id": "quiz-1793081740316-9o3jc",
    "title": "General",
    "description": "General Banking Examination Assessment",
    "subject": "Banking ",
    "category": "Banking",
    "isDailyPaper": true,
    "status": "published",
    "durationMinutes": 35,
    "totalQuestions": 40,
    "marksPerQuestion": 1,
    "negativeMarks": 0.25,
    "language": "English",
    "createdBy": "sumit045",
    "createdAt": "2026-10-27T06:15:40.316Z",
    "updatedAt": "2026-10-27T06:15:40.316Z",
    "publishedAt": "2026-10-27T06:15:40.316Z",
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
  "q-cs-1": {
    "id": "q-cs-1",
    "quizId": "quiz-cs-gate-01",
    "questionText": "What is the worst-case time complexity of inserting an element into an AVL Tree with N elements?",
    "options": [
      "O(1)",
      "O(log N)",
      "O(N)",
      "O(N log N)"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Because an AVL tree remains strictly height-balanced with maximum height ~ 1.44 log2(N), insertion and rotation take O(log N).",
    "difficulty": "medium",
    "topic": "Self-Balancing Trees",
    "sourceReference": "Algorithms & Data Structures",
    "order": 1
  },
  "q-cs-2": {
    "id": "q-cs-2",
    "quizId": "quiz-cs-gate-01",
    "questionText": "Which algorithmic paradigm is employed in Dijkstra's single-source shortest path algorithm on non-negative weighted graphs?",
    "options": [
      "Divide and Conquer",
      "Greedy approach",
      "Dynamic Programming",
      "Backtracking"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Dijkstra's algorithm greedily chooses the unvisited vertex with the minimum tentative distance at each step.",
    "difficulty": "easy",
    "topic": "Graph Algorithms",
    "sourceReference": "Network Analysis",
    "order": 2
  },
  "q-cs-3": {
    "id": "q-cs-3",
    "quizId": "quiz-cs-gate-01",
    "questionText": "In a B+ Tree of order M, where are the actual data records or record pointers stored?",
    "options": [
      "Exclusively in the leaf nodes",
      "In the root node only",
      "Evenly distributed across internal and leaf nodes",
      "In a separate non-indexed hash file"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In a B+ Tree, internal nodes strictly store search keys and navigation pointers, while all data records reside in linked leaf nodes.",
    "difficulty": "medium",
    "topic": "Database Indexing",
    "sourceReference": "Database System Concepts",
    "order": 3
  },
  "q-cs-4": {
    "id": "q-cs-4",
    "quizId": "quiz-cs-gate-01",
    "questionText": "Which problem among the following is known to be NP-Complete?",
    "options": [
      "Shortest path between two vertices with non-negative edge weights",
      "Finding minimum spanning tree using Kruskal's algorithm",
      "Traveling Salesperson Problem (Decision version)",
      "Sorting an array of numbers using Quicksort"
    ],
    "correctAnswerIndex": 2,
    "explanation": "The decision version of the Traveling Salesperson Problem (TSP) is NP-Complete, whereas MST and Shortest Path are polynomial time solvable.",
    "difficulty": "hard",
    "topic": "Complexity Theory",
    "sourceReference": "Theory of Computation",
    "order": 4
  },
  "q-cs-5": {
    "id": "q-cs-5",
    "quizId": "quiz-cs-gate-01",
    "questionText": "In hash table implementations, what mechanism resolves collisions by searching for the next open slot using secondary hash functions?",
    "options": [
      "Separate Chaining with linked lists",
      "Double Hashing",
      "Binary heap restructuring",
      "Trie traversal"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Double Hashing is an open addressing technique that uses a secondary hash function to calculate probing intervals.",
    "difficulty": "medium",
    "topic": "Hashing",
    "sourceReference": "Data Structures",
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
  "q-quiz-1793042348661-sldpa-1": {
    "id": "q-quiz-1793042348661-sldpa-1",
    "quizId": "quiz-1793042348661-sldpa",
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
  "q-quiz-1793042348661-sldpa-2": {
    "id": "q-quiz-1793042348661-sldpa-2",
    "quizId": "quiz-1793042348661-sldpa",
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
  "q-quiz-1793042348661-sldpa-3": {
    "id": "q-quiz-1793042348661-sldpa-3",
    "quizId": "quiz-1793042348661-sldpa",
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
  "q-quiz-1793042348661-sldpa-4": {
    "id": "q-quiz-1793042348661-sldpa-4",
    "quizId": "quiz-1793042348661-sldpa",
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
  "q-quiz-1793042348661-sldpa-5": {
    "id": "q-quiz-1793042348661-sldpa-5",
    "quizId": "quiz-1793042348661-sldpa",
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
  "q-quiz-1793042348661-sldpa-6": {
    "id": "q-quiz-1793042348661-sldpa-6",
    "quizId": "quiz-1793042348661-sldpa",
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
  "q-quiz-1793042348661-sldpa-7": {
    "id": "q-quiz-1793042348661-sldpa-7",
    "quizId": "quiz-1793042348661-sldpa",
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
  "q-quiz-1793042348661-sldpa-8": {
    "id": "q-quiz-1793042348661-sldpa-8",
    "quizId": "quiz-1793042348661-sldpa",
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
  "q-quiz-1793042348661-sldpa-9": {
    "id": "q-quiz-1793042348661-sldpa-9",
    "quizId": "quiz-1793042348661-sldpa",
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
  "q-quiz-1793042348661-sldpa-10": {
    "id": "q-quiz-1793042348661-sldpa-10",
    "quizId": "quiz-1793042348661-sldpa",
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
  "q-quiz-1793042348661-sldpa-11": {
    "id": "q-quiz-1793042348661-sldpa-11",
    "quizId": "quiz-1793042348661-sldpa",
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
  "q-quiz-1793042348661-sldpa-12": {
    "id": "q-quiz-1793042348661-sldpa-12",
    "quizId": "quiz-1793042348661-sldpa",
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
  "q-quiz-1793042348661-sldpa-13": {
    "id": "q-quiz-1793042348661-sldpa-13",
    "quizId": "quiz-1793042348661-sldpa",
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
  "q-quiz-1793042626200-jdbh7-1": {
    "id": "q-quiz-1793042626200-jdbh7-1",
    "quizId": "quiz-1793042626200-jdbh7",
    "questionText": "A can complete a work in 12 days and B can complete the same work in 24 days. If they work together, how many days will it take to finish the work?",
    "options": [
      "6 days",
      "8 days",
      "9 days",
      "10 days"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Combined 1-day work = 1/12 + 1/24 = (2 + 1)/24 = 3/24 = 1/8. Total time = 8 days.",
    "difficulty": "easy",
    "topic": "Time & Work",
    "sourceReference": "Question 1",
    "order": 1
  },
  "q-quiz-1793042626200-jdbh7-2": {
    "id": "q-quiz-1793042626200-jdbh7-2",
    "quizId": "quiz-1793042626200-jdbh7",
    "questionText": "An article bought for $800 is sold at a gain of 15%. What is the selling price?",
    "options": [
      "$900",
      "$910",
      "$920",
      "$940"
    ],
    "correctAnswerIndex": 2,
    "explanation": "Selling Price = 800 * 1.15 = 920.",
    "difficulty": "easy",
    "topic": "Profit & Loss",
    "sourceReference": "Question 2",
    "order": 2
  },
  "q-quiz-1793042626200-jdbh7-3": {
    "id": "q-quiz-1793042626200-jdbh7-3",
    "quizId": "quiz-1793042626200-jdbh7",
    "questionText": "A 150-meter-long train is running at a speed of 54 km/h. How many seconds will it take to pass a stationary telegraph post?",
    "options": [
      "8 sec",
      "10 sec",
      "12 sec",
      "15 sec"
    ],
    "correctAnswerIndex": 1,
    "explanation": "54 km/h = 54 * (5/18) = 15 m/s. Time = 150 / 15 = 10 seconds.",
    "difficulty": "medium",
    "topic": "Speed, Time & Distance (Trains)",
    "sourceReference": "Question 3",
    "order": 3
  },
  "q-quiz-1793042626200-jdbh7-4": {
    "id": "q-quiz-1793042626200-jdbh7-4",
    "quizId": "quiz-1793042626200-jdbh7",
    "questionText": "At what rate of simple interest per annum will a sum of money double itself in 8 years?",
    "options": [
      "10%",
      "12%",
      "12.5%",
      "15%"
    ],
    "correctAnswerIndex": 2,
    "explanation": "If principal is P, interest earned is P. P = (P * R * 8) / 100 => R = 100 / 8 = 12.5%.",
    "difficulty": "medium",
    "topic": "Simple & Compound Interest",
    "sourceReference": "Question 4",
    "order": 4
  },
  "q-quiz-1793042626200-jdbh7-5": {
    "id": "q-quiz-1793042626200-jdbh7-5",
    "quizId": "quiz-1793042626200-jdbh7",
    "questionText": "If A : B = 3 : 4 and B : C = 8 : 9, what is A : C?",
    "options": [
      "1 : 2",
      "2 : 3",
      "3 : 2",
      "4 : 5"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A / C = (A / B) * (B / C) = (3 / 4) * (8 / 9) = 24 / 36 = 2 / 3.",
    "difficulty": "easy",
    "topic": "Ratio & Proportion",
    "sourceReference": "Question 5",
    "order": 5
  },
  "q-quiz-1793042626200-jdbh7-6": {
    "id": "q-quiz-1793042626200-jdbh7-6",
    "quizId": "quiz-1793042626200-jdbh7",
    "questionText": "Find the next number in the sequence: 2, 6, 12, 20, 30, ?",
    "options": [
      "40",
      "42",
      "44",
      "46"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Differences between terms increase by 2: +4, +6, +8, +10, +12. 30 + 12 = 42 (or n(n+1) where 6 * 7 = 42).",
    "difficulty": "medium",
    "topic": "Number Series (Logical Reasoning)",
    "sourceReference": "Question 6",
    "order": 6
  },
  "q-quiz-1793042626200-jdbh7-7": {
    "id": "q-quiz-1793042626200-jdbh7-7",
    "quizId": "quiz-1793042626200-jdbh7",
    "questionText": "What is the angle between the minute hand and the hour hand of a clock at 3:30?",
    "options": [
      "70°",
      "75°",
      "80°",
      "85°"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Theta = |30H - 5.5M| = |30(3) - 5.5(30)| = |90 - 165| = 75°.",
    "difficulty": "medium",
    "topic": "Clocks",
    "sourceReference": "Question 7",
    "order": 7
  },
  "q-quiz-1793042626200-jdbh7-8": {
    "id": "q-quiz-1793042626200-jdbh7-8",
    "quizId": "quiz-1793042626200-jdbh7",
    "questionText": "Two dice are thrown simultaneously. What is the probability of getting a sum of 7?",
    "options": [
      "1/6",
      "1/12",
      "5/36",
      "7/36"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Favorable pairs are (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) (6 outcomes). Total outcomes = 36. Probability = 6 / 36 = 1 / 6.",
    "difficulty": "medium",
    "topic": "Probability",
    "sourceReference": "Question 8",
    "order": 8
  },
  "q-quiz-1793042626200-jdbh7-9": {
    "id": "q-quiz-1793042626200-jdbh7-9",
    "quizId": "quiz-1793042626200-jdbh7",
    "questionText": "In how many different ways can the letters of the word \"APPLE\" be arranged?",
    "options": [
      "60",
      "120",
      "240",
      "720"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Total letters = 5, with 'P' repeating 2 times: 5! / 2! = 120 / 2 = 60.",
    "difficulty": "medium",
    "topic": "Permutations & Combinations",
    "sourceReference": "Question 9",
    "order": 9
  },
  "q-quiz-1793042626200-jdbh7-10": {
    "id": "q-quiz-1793042626200-jdbh7-10",
    "quizId": "quiz-1793042626200-jdbh7",
    "questionText": "Pointing to a photograph, a man said, \"I have no brother or sister, but that man's father is my father's son.\" Whose photograph was it?",
    "options": [
      "His own",
      "His son's",
      "His father's",
      "His nephew's"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Since he has no siblings, \"my father's son\" is himself. Therefore, \"that man's father is [myself]\", making the photograph his son's.",
    "difficulty": "hard",
    "topic": "Blood Relations (Reasoning)",
    "sourceReference": "Question 10",
    "order": 10
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
  },
  "q-quiz-1793081740316-9o3jc-1": {
    "id": "q-quiz-1793081740316-9o3jc-1",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is the primary function of a central bank in an economy?",
    "options": [
      "To provide retail banking services to the general public",
      "To regulate the monetary system and oversee commercial banks",
      "To maximize profit for its shareholders",
      "To offer high-interest savings accounts to individuals"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A central bank is the apex institution responsible for monetary policy, currency issuance, and the regulation of the commercial banking system.",
    "difficulty": "easy",
    "topic": "Central Banking",
    "sourceReference": "General Principles",
    "order": 1
  },
  "q-quiz-1793081740316-9o3jc-2": {
    "id": "q-quiz-1793081740316-9o3jc-2",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "Which of the following is considered a liability on a commercial bank's balance sheet?",
    "options": [
      "Customer deposits",
      "Government securities held",
      "Loans extended to customers",
      "Cash in the vault"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Customer deposits represent money owed by the bank to its depositors, making them a primary liability.",
    "difficulty": "easy",
    "topic": "Bank Balance Sheet",
    "sourceReference": "General Principles",
    "order": 2
  },
  "q-quiz-1793081740316-9o3jc-3": {
    "id": "q-quiz-1793081740316-9o3jc-3",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What does the term 'Liquidity Coverage Ratio' (LCR) primarily measure?",
    "options": [
      "Long-term capital adequacy",
      "A bank's ability to meet short-term obligations with high-quality liquid assets",
      "The ratio of non-performing assets to total loans",
      "The profitability of retail operations"
    ],
    "correctAnswerIndex": 1,
    "explanation": "LCR ensures that a bank has an adequate stock of unencumbered high-quality liquid assets that can be converted easily and immediately in private markets to cash to meet its liquidity needs for a 30 calendar day stress scenario.",
    "difficulty": "medium",
    "topic": "Risk Management",
    "sourceReference": "General Principles",
    "order": 3
  },
  "q-quiz-1793081740316-9o3jc-4": {
    "id": "q-quiz-1793081740316-9o3jc-4",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "Which of the following describes a Non-Performing Asset (NPA)?",
    "options": [
      "A loan where interest and/or principal payments are overdue for a specified period (typically 90 days)",
      "An asset that generates exceptionally high returns for the bank",
      "Cash reserves kept with the central bank",
      "Fixed assets like bank buildings and computers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "An asset becomes non-performing when it ceases to generate income for the bank, usually when principal or interest payments are overdue for 90 days or more.",
    "difficulty": "easy",
    "topic": "Asset Quality",
    "sourceReference": "General Principles",
    "order": 4
  },
  "q-quiz-1793081740316-9o3jc-5": {
    "id": "q-quiz-1793081740316-9o3jc-5",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is the main purpose of the Capital Adequacy Ratio (CAR)?",
    "options": [
      "To determine employee bonuses",
      "To ensure banks can absorb a reasonable amount of loss and comply with statutory capital requirements",
      "To calculate the interest rate on mortgage loans",
      "To measure the efficiency of digital banking channels"
    ],
    "correctAnswerIndex": 1,
    "explanation": "CAR is a measure of a bank's capital. It is expressed as a percentage of a bank's risk-weighted credit exposures and is used to protect depositors and promote the stability and efficiency of financial systems.",
    "difficulty": "medium",
    "topic": "Capital Regulation",
    "sourceReference": "General Principles",
    "order": 5
  },
  "q-quiz-1793081740316-9o3jc-6": {
    "id": "q-quiz-1793081740316-9o3jc-6",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "Which monetary policy tool involves the central bank buying or selling government securities in the open market?",
    "options": [
      "Cash Reserve Ratio",
      "Open Market Operations",
      "Bank Rate",
      "Statutory Liquidity Ratio"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Open Market Operations (OMO) refer to the buying and selling of government securities by the central bank to control the money supply in the economy.",
    "difficulty": "easy",
    "topic": "Monetary Policy",
    "sourceReference": "General Principles",
    "order": 6
  },
  "q-quiz-1793081740316-9o3jc-7": {
    "id": "q-quiz-1793081740316-9o3jc-7",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is 'Collateral' in the context of bank lending?",
    "options": [
      "The interest charged on a loan",
      "An asset pledged by a borrower to secure a loan",
      "The processing fee paid upfront",
      "The credit score of the applicant"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Collateral is a property or other asset that a borrower offers as a way for a lender to secure the loan, which can be seized if the borrower defaults.",
    "difficulty": "easy",
    "topic": "Credit Operations",
    "sourceReference": "General Principles",
    "order": 7
  },
  "q-quiz-1793081740316-9o3jc-8": {
    "id": "q-quiz-1793081740316-9o3jc-8",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What does KYC stand for in the banking sector?",
    "options": [
      "Keep Your Capital",
      "Know Your Customer",
      "Key Yield Calculation",
      "Known Yearly Credit"
    ],
    "correctAnswerIndex": 0,
    "explanation": "KYC stands for Know Your Customer, a mandatory process by financial institutions to verify the identity of their clients to prevent fraud and money laundering.",
    "difficulty": "easy",
    "topic": "Compliance",
    "sourceReference": "General Principles",
    "order": 8
  },
  "q-quiz-1793081740316-9o3jc-9": {
    "id": "q-quiz-1793081740316-9o3jc-9",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "Which type of account typically offers higher interest rates but restricts the number of withdrawals a customer can make per month?",
    "options": [
      "Current Account",
      "Savings Account",
      "Fixed Deposit Account",
      "Overdraft Account"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Savings accounts typically offer interest on deposits while placing certain limitations on transaction frequencies compared to current accounts.",
    "difficulty": "easy",
    "topic": "Deposit Products",
    "sourceReference": "General Principles",
    "order": 9
  },
  "q-quiz-1793081740316-9o3jc-10": {
    "id": "q-quiz-1793081740316-9o3jc-10",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is the primary characteristic of a 'Current Account'?",
    "options": [
      "It pays high interest to encourage long-term savings",
      "It is meant for businesses and allows frequent transactions with no interest paid",
      "It locks funds for a minimum of 5 years",
      "It is exclusively used for government transactions"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Current accounts are designed for business entities to facilitate high volumes of daily transactions and generally do not earn interest.",
    "difficulty": "easy",
    "topic": "Deposit Products",
    "sourceReference": "General Principles",
    "order": 10
  },
  "q-quiz-1793081740316-9o3jc-11": {
    "id": "q-quiz-1793081740316-9o3jc-11",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is meant by 'Repo Rate'?",
    "options": [
      "The rate at which commercial banks lend to retail customers",
      "The rate at which the central bank lends short-term money to commercial banks",
      "The rate at which commercial banks park their excess funds with the central bank",
      "The inflation rate target set by the government"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Repo rate (Repurchase rate) is the benchmark interest rate at which the central bank lends money to commercial banks in the event of any shortfall of funds.",
    "difficulty": "medium",
    "topic": "Monetary Policy",
    "sourceReference": "General Principles",
    "order": 11
  },
  "q-quiz-1793081740316-9o3jc-12": {
    "id": "q-quiz-1793081740316-9o3jc-12",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is the 'Reverse Repo Rate'?",
    "options": [
      "The rate at which commercial banks borrow from the public",
      "The rate at which the central bank borrows money from commercial banks",
      "The penalty rate for delayed loan repayments",
      "The rate charged on credit card debt"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Reverse repo rate is the rate at which the central bank borrows funds from commercial banks within the country.",
    "difficulty": "medium",
    "topic": "Monetary Policy",
    "sourceReference": "General Principles",
    "order": 12
  },
  "q-quiz-1793081740316-9o3jc-13": {
    "id": "q-quiz-1793081740316-9o3jc-13",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "Which of the following risks refers to the potential loss resulting from inadequate or failed internal processes, people, and systems?",
    "options": [
      "Credit Risk",
      "Market Risk",
      "Operational Risk",
      "Liquidity Risk"
    ],
    "correctAnswerIndex": 2,
    "explanation": "Operational risk is defined as the risk of loss resulting from inadequate or failed internal processes, people and systems or from external events.",
    "difficulty": "medium",
    "topic": "Risk Management",
    "sourceReference": "General Principles",
    "order": 13
  },
  "q-quiz-1793081740316-9o3jc-14": {
    "id": "q-quiz-1793081740316-9o3jc-14",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is a Letter of Credit (LC)?",
    "options": [
      "A guarantee from a bank that a buyer's payment to a seller will be received on time and for the correct amount",
      "A letter recommending a customer for a bank loan",
      "A statement of account balance sent monthly",
      "An agreement to sell foreign currency at a future date"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A Letter of Credit is a financial document issued by a bank guaranteeing payment to a seller, provided that the conditions specified in the document are met.",
    "difficulty": "medium",
    "topic": "Trade Finance",
    "sourceReference": "General Principles",
    "order": 14
  },
  "q-quiz-1793081740316-9o3jc-15": {
    "id": "q-quiz-1793081740316-9o3jc-15",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What does 'NEFT' stand for in banking transactions?",
    "options": [
      "National Electronic Funds Transfer",
      "New Economic Financial Trust",
      "National Exchange Foreign Trade",
      "Net Electronic Fund Turnover"
    ],
    "correctAnswerIndex": 0,
    "explanation": "NEFT stands for National Electronic Funds Transfer, an Indian nationwide payment system providing one-to-one funds transfer.",
    "difficulty": "easy",
    "topic": "Payment Systems",
    "sourceReference": "General Principles",
    "order": 15
  },
  "q-quiz-1793081740316-9o3jc-16": {
    "id": "q-quiz-1793081740316-9o3jc-16",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is the main feature of RTGS (Real Time Gross Settlement)?",
    "options": [
      "Transactions are settled in batches at the end of the day",
      "Transactions are processed and settled continuously and in real-time on a gross basis",
      "It is only used for international remittances",
      "It has a maximum limit of $100 per transaction"
    ],
    "correctAnswerIndex": 1,
    "explanation": "RTGS stands for Real Time Gross Settlement, meaning the transaction is settled as soon as it is processed without waiting for any batch processing, on a gross (one-to-one) basis.",
    "difficulty": "medium",
    "topic": "Payment Systems",
    "sourceReference": "General Principles",
    "order": 16
  },
  "q-quiz-1793081740316-9o3jc-17": {
    "id": "q-quiz-1793081740316-9o3jc-17",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is an overdraft facility?",
    "options": [
      "A penalty charged for depositing too much money",
      "A line of credit that allows an account holder to withdraw more money than they have in their account up to an approved limit",
      "A type of long-term mortgage loan",
      "A fixed deposit with premature withdrawal options"
    ],
    "correctAnswerIndex": 1,
    "explanation": "An overdraft facility permits a customer to continue withdrawing funds even if their account balance has reached zero, up to a pre-agreed limit.",
    "difficulty": "easy",
    "topic": "Credit Operations",
    "sourceReference": "General Principles",
    "order": 17
  },
  "q-quiz-1793081740316-9o3jc-18": {
    "id": "q-quiz-1793081740316-9o3jc-18",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "Which document outlines the terms and conditions between a bank and a borrower for a term loan?",
    "options": [
      "Loan Agreement / Promissory Note",
      "Bank Statement",
      "Passbook",
      "Cheque Leaf"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A loan agreement or promissory note is the legal contract detailing the terms, conditions, repayment schedule, and interest rates for a loan.",
    "difficulty": "easy",
    "topic": "Credit Operations",
    "sourceReference": "General Principles",
    "order": 18
  },
  "q-quiz-1793081740316-9o3jc-19": {
    "id": "q-quiz-1793081740316-9o3jc-19",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is the primary purpose of anti-money laundering (AML) regulations in banks?",
    "options": [
      "To maximize interest income from foreign clients",
      "To prevent criminals from disguising illegally obtained funds as legitimate income",
      "To reduce the operational costs of cash handling",
      "To increase the speed of international wire transfers"
    ],
    "correctAnswerIndex": 1,
    "explanation": "AML regulations are designed to prevent the practice of generating income through illegal actions and cleaning it through the financial system.",
    "difficulty": "medium",
    "topic": "Compliance",
    "sourceReference": "General Principles",
    "order": 19
  },
  "q-quiz-1793081740316-9o3jc-20": {
    "id": "q-quiz-1793081740316-9o3jc-20",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What does 'CASA' ratio represent in banking terminology?",
    "options": [
      "Current Account and Savings Account deposits as a percentage of total deposits",
      "Credit and Savings Allocation ratio",
      "Capital Adequacy and Statutory Asset ratio",
      "Cost of Assets to Savings Average"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CASA ratio measures the proportion of total deposits coming from Current and Savings Accounts, which are cheaper sources of funds for a bank compared to term deposits.",
    "difficulty": "medium",
    "topic": "Bank Balance Sheet",
    "sourceReference": "General Principles",
    "order": 20
  },
  "q-quiz-1793081740316-9o3jc-21": {
    "id": "q-quiz-1793081740316-9o3jc-21",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is a 'Fixed Deposit' (FD)?",
    "options": [
      "An investment where money is deposited for a fixed period at a predetermined interest rate",
      "A savings account with variable daily interest rates",
      "An account used exclusively for stock market trading",
      "A revolving line of credit with no fixed maturity date"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A fixed deposit is a financial instrument provided by banks which provides investors a higher rate of interest than a regular savings account, until the given maturity date.",
    "difficulty": "easy",
    "topic": "Deposit Products",
    "sourceReference": "General Principles",
    "order": 21
  },
  "q-quiz-1793081740316-9o3jc-22": {
    "id": "q-quiz-1793081740316-9o3jc-22",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is the definition of 'Bad Debt' or 'Write-off'?",
    "options": [
      "A loan that is fully repaid ahead of schedule",
      "A debt that is unlikely to be recovered and is removed from the bank's book of accounts",
      "An interest-free loan given to high-net-worth individuals",
      "A deposit account with zero balance for over a year"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A write-off occurs when a bank recognizes that a loan is uncollectible and removes it from its assets while taking provisions against it.",
    "difficulty": "medium",
    "topic": "Asset Quality",
    "sourceReference": "General Principles",
    "order": 22
  },
  "q-quiz-1793081740316-9o3jc-23": {
    "id": "q-quiz-1793081740316-9o3jc-23",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "Which committee is internationally known for formulating capital adequacy standards for banks (Basel Accords)?",
    "options": [
      "Basel Committee on Banking Supervision (BCBS)",
      "Financial Action Task Force (FATF)",
      "International Monetary Fund (IMF) Executive Board",
      "World Bank Treasury Committee"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The Basel Committee on Banking Supervision (BCBS) is the primary global standard-setter for the prudential regulation of banks.",
    "difficulty": "medium",
    "topic": "Capital Regulation",
    "sourceReference": "General Principles",
    "order": 23
  },
  "q-quiz-1793081740316-9o3jc-24": {
    "id": "q-quiz-1793081740316-9o3jc-24",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is 'Credit Risk'?",
    "options": [
      "The risk of loss arising from a borrower's failure to repay a loan or meet contractual obligations",
      "The risk of loss due to fluctuations in market interest rates",
      "The risk of system failure during online transactions",
      "The risk of penalty for non-compliance with tax laws"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Credit risk is the possibility of a loss resulting from a borrower's failure to repay loan principal or interest.",
    "difficulty": "easy",
    "topic": "Risk Management",
    "sourceReference": "General Principles",
    "order": 24
  },
  "q-quiz-1793081740316-9o3jc-25": {
    "id": "q-quiz-1793081740316-9o3jc-25",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What does 'SWIFT' stand for in international banking?",
    "options": [
      "Society for Worldwide Interbank Financial Telecommunication",
      "Secure Wire Interbank Foreign Transfer",
      "System for Worldwide International Finance and Trade",
      "Standard Wire Information Financial Transfer"
    ],
    "correctAnswerIndex": 0,
    "explanation": "SWIFT is a vast messaging network used by financial institutions globally to securely transmit information and instructions through a standardized system of codes.",
    "difficulty": "medium",
    "topic": "Payment Systems",
    "sourceReference": "General Principles",
    "order": 25
  },
  "q-quiz-1793081740316-9o3jc-26": {
    "id": "q-quiz-1793081740316-9o3jc-26",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is the primary role of a Credit Rating Agency?",
    "options": [
      "To issue loans directly to consumers",
      "To assess the creditworthiness of borrowers or debt issuers",
      "To audit commercial banks annually",
      "To set national monetary policy rates"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Credit rating agencies evaluate the financial stability of companies and governments and express an opinion on their ability to pay back debts.",
    "difficulty": "easy",
    "topic": "Credit Operations",
    "sourceReference": "General Principles",
    "order": 26
  },
  "q-quiz-1793081740316-9o3jc-27": {
    "id": "q-quiz-1793081740316-9o3jc-27",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is 'Net Interest Margin' (NIM)?",
    "options": [
      "The difference between interest income generated by banks and the amount of interest paid out to their lenders, relative to interest-earning assets",
      "The total profit earned by a bank from non-interest sources like fees and commissions",
      "The ratio of net profit to total equity",
      "The tax rate applicable to banking profits"
    ],
    "correctAnswerIndex": 0,
    "explanation": "NIM is a measure of the difference between the interest income generated by banks and the amount of interest paid out to their lenders, relative to the amount of their earning assets.",
    "difficulty": "hard",
    "topic": "Bank Financial Analysis",
    "sourceReference": "General Principles",
    "order": 27
  },
  "q-quiz-1793081740316-9o3jc-28": {
    "id": "q-quiz-1793081740316-9o3jc-28",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is a 'Subprime Loan'?",
    "options": [
      "A loan offered to prime corporate clients at the lowest interest rate",
      "A loan granted to borrowers with lower credit scores or higher default risk, typically carrying a higher interest rate",
      "A government-backed agricultural loan",
      "A short-term interbank lending rate"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Subprime loans are risky loans extended to individuals who do not qualify for prime market interest rates due to blemished credit histories.",
    "difficulty": "medium",
    "topic": "Credit Operations",
    "sourceReference": "General Principles",
    "order": 28
  },
  "q-quiz-1793081740316-9o3jc-29": {
    "id": "q-quiz-1793081740316-9o3jc-29",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is 'Securitization' in banking?",
    "options": [
      "The process of enhancing physical bank branch security",
      "The pooling of various types of contractual debt and selling their related cash flows to third-party investors as securities",
      "Issuing new shares of stock to the general public",
      "Converting short-term deposits into long-term bonds"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Securitization involves packaging loans (like mortgages or auto loans) into marketable securities that can be sold to investors.",
    "difficulty": "hard",
    "topic": "Financial Markets",
    "sourceReference": "General Principles",
    "order": 29
  },
  "q-quiz-1793081740316-9o3jc-30": {
    "id": "q-quiz-1793081740316-9o3jc-30",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is a 'Bank Guarantee'?",
    "options": [
      "A promise by a bank to assume responsibility for a debt or performance obligation if the primary obligor defaults",
      "An insurance policy on customer savings accounts",
      "A guaranteed minimum interest rate on fixed deposits",
      "A government assurance that banks will never fail"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A bank guarantee is a lending institution's promise to cover a loss if a borrower fails to fulfill a contractual obligation with a third party.",
    "difficulty": "medium",
    "topic": "Trade Finance",
    "sourceReference": "General Principles",
    "order": 30
  },
  "q-quiz-1793081740316-9o3jc-31": {
    "id": "q-quiz-1793081740316-9o3jc-31",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is the primary purpose of a 'Statutory Liquidity Ratio' (SLR)?",
    "options": [
      "To restrict banks from lending to specific sectors",
      "To ensure that commercial banks maintain a minimum proportion of their net demand and time liabilities in liquid assets like cash, gold, or approved securities",
      "To control the foreign exchange reserves of the country",
      "To determine the minimum capital required for bank incorporation"
    ],
    "correctAnswerIndex": 1,
    "explanation": "SLR is a monetary policy requirement mandated by central banks where commercial banks must maintain a specific percentage of deposits in liquid assets before lending to customers.",
    "difficulty": "medium",
    "topic": "Monetary Policy",
    "sourceReference": "General Principles",
    "order": 31
  },
  "q-quiz-1793081740316-9o3jc-32": {
    "id": "q-quiz-1793081740316-9o3jc-32",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What does 'ATM' stand for in consumer banking?",
    "options": [
      "Automated Teller Machine",
      "Anytime Transaction Money",
      "Automatic Transfer Method",
      "Automated Transaction Mechanism"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ATM stands for Automated Teller Machine, an electronic telecommunications device that enables customers to perform financial transactions without the need for a human cashier.",
    "difficulty": "easy",
    "topic": "Digital Banking",
    "sourceReference": "General Principles",
    "order": 32
  },
  "q-quiz-1793081740316-9o3jc-33": {
    "id": "q-quiz-1793081740316-9o3jc-33",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is 'Retail Banking'?",
    "options": [
      "Banking services targeted at large corporations and governments",
      "Banking services provided to individual consumers rather than corporations or institutional clients",
      "Trading of securities and equities on stock exchanges",
      "International trade finance and foreign exchange operations"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Retail banking refers to mass-market banking where individual customers use local branches of larger commercial banks for savings, checking, mortgages, and personal loans.",
    "difficulty": "easy",
    "topic": "Banking Types",
    "sourceReference": "General Principles",
    "order": 33
  },
  "q-quiz-1793081740316-9o3jc-34": {
    "id": "q-quiz-1793081740316-9o3jc-34",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is 'Wholesale Banking'?",
    "options": [
      "Services offered to large corporate clients, institutions, and governments",
      "Providing bulk cash supplies to retail bank branches",
      "Online shopping portals managed by banks",
      "Microfinance loans given to rural cooperatives"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Wholesale banking involves borrowing and lending activities on a large scale, typically involving corporate clients, commercial banks, and government agencies.",
    "difficulty": "easy",
    "topic": "Banking Types",
    "sourceReference": "General Principles",
    "order": 34
  },
  "q-quiz-1793081740316-9o3jc-35": {
    "id": "q-quiz-1793081740316-9o3jc-35",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is a 'Non-Banking Financial Company' (NBFC)?",
    "options": [
      "A company that offers banking services without meeting the legal definition of a bank, specifically not holding a banking license or taking demand deposits",
      "A central bank branch operating overseas",
      "An international regulatory body for financial institutions",
      "A charitable organization providing micro-grants"
    ],
    "correctAnswerIndex": 0,
    "explanation": "An NBFC provides financial services and banking-like products but does not hold a banking license and typically cannot accept demand deposits from the public.",
    "difficulty": "medium",
    "topic": "Financial Institutions",
    "sourceReference": "General Principles",
    "order": 35
  },
  "q-quiz-1793081740316-9o3jc-36": {
    "id": "q-quiz-1793081740316-9o3jc-36",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is 'Foreign Exchange Risk' (FX Risk)?",
    "options": [
      "The risk of financial loss due to fluctuations in exchange rates when dealing in foreign currencies",
      "The risk of bank notes being counterfeit",
      "The risk of foreign customers defaulting on loans",
      "The risk of international wire transfer delays"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Foreign exchange risk is a financial risk posed by an exposure to unanticipated changes in the exchange rate between currencies.",
    "difficulty": "medium",
    "topic": "Risk Management",
    "sourceReference": "General Principles",
    "order": 36
  },
  "q-quiz-1793081740316-9o3jc-37": {
    "id": "q-quiz-1793081740316-9o3jc-37",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is the primary function of a Credit Bureau?",
    "options": [
      "To collect credit information on individual borrowers and create credit history reports for lenders",
      "To provide direct government loans to low-income families",
      "To regulate bank interest rates on savings accounts",
      "To print and distribute national currency"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Credit bureaus gather data on consumers' borrowing and repayment activities and compile credit scores and reports for financial institutions.",
    "difficulty": "easy",
    "topic": "Credit Operations",
    "sourceReference": "General Principles",
    "order": 37
  },
  "q-quiz-1793081740316-9o3jc-38": {
    "id": "q-quiz-1793081740316-9o3jc-38",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What does 'MICR' stand for on a cheque?",
    "options": [
      "Magnetic Ink Character Recognition",
      "Monetary International Clearing Record",
      "Machine Interbank Credit Register",
      "Master Identification Code Reference"
    ],
    "correctAnswerIndex": 0,
    "explanation": "MICR is a character recognition technology used mainly by the banking industry to ease the processing and clearance of cheques and other documents.",
    "difficulty": "medium",
    "topic": "Payment Systems",
    "sourceReference": "General Principles",
    "order": 38
  },
  "q-quiz-1793081740316-9o3jc-39": {
    "id": "q-quiz-1793081740316-9o3jc-39",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is a 'Demand Draft' (DD)?",
    "options": [
      "A negotiable instrument issued by a bank directing another bank to pay a specified sum to a specified payee on demand",
      "An order given by an account holder to transfer funds on a fixed future date",
      "A verbal instruction to withdraw cash from an ATM",
      "A loan that must be repaid immediately upon request"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A demand draft is a pre-paid negotiable instrument where the drawee bank is bound to make payment in full to the payee on demand.",
    "difficulty": "easy",
    "topic": "Payment Systems",
    "sourceReference": "General Principles",
    "order": 39
  },
  "q-quiz-1793081740316-9o3jc-40": {
    "id": "q-quiz-1793081740316-9o3jc-40",
    "quizId": "quiz-1793081740316-9o3jc",
    "questionText": "What is 'Interest Rate Risk' in banking?",
    "options": [
      "The risk that a bank's earnings or capital will be adversely affected by changes in interest rates",
      "The risk that customers will close their accounts due to low interest rates",
      "The penalty charged by the central bank for late filing",
      "The risk of fixed deposits maturing during a holiday"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Interest rate risk is the vulnerability of an institution's financial condition to adverse movements in interest rates, impacting both net interest income and economic value.",
    "difficulty": "medium",
    "topic": "Risk Management",
    "sourceReference": "General Principles",
    "order": 40
  }
};
