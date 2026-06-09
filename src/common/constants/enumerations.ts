import {
  casesAttachmentsFieldName,
  incidentsAttachmentsFieldName,
  memoAttachmentsFieldName,
  srAttachmentsFieldName,
} from './parameter-constants';

enum RecordType {
  Case = 'case',
  Incident = 'incident',
  SR = 'sr',
  Memo = 'memo',
}

enum EntityType {
  Case = 'Case',
  Incident = 'Incident',
  SR = 'Service Request',
}

const RecordEntityMap = {
  [RecordType.Case]: EntityType.Case,
  [RecordType.Incident]: EntityType.Incident,
  [RecordType.SR]: EntityType.SR,
} as const;

const EntityRecordMap = {
  [EntityType.Case]: RecordType.Case,
  [EntityType.Incident]: RecordType.Incident,
  [EntityType.SR]: RecordType.SR,
} as const;

enum VisitDetails {
  PrivateVisitZeroToFive = 'Private visit age 0-5',
  PrivateVisitInHome = 'Private visit in home',
  PrivateVisitMedSupportNeeds = 'Private visit medical or support needs',
  PrivateVisitNotInHome = 'Private visit not in home',
  ExemptionVisitChildDeclined = 'Exemption to private visit - Child declined to meet',
  ExemptionVisitOther = 'Exemption to private visit - Other',
  NotPrivatePlanMeeting = 'Not private - Planning meeting',
  NotPrivateRelation = 'Not private - Relational visit',
  NotPrivateInHome = 'Not private - Visit in the home',
  NotPrivateCaregiver = 'Not private - Visit with caregiver',
}

enum BooleanStringEnum {
  True = 'true',
  False = 'false',
}

enum YNEnum {
  True = 'Y',
  False = 'N',
}

enum YesNoEnum {
  True = 'Yes',
  False = 'No',
}

const AttachmentParentIdFieldMap = {
  [RecordType.Case]: casesAttachmentsFieldName,
  [RecordType.Incident]: incidentsAttachmentsFieldName,
  [RecordType.SR]: srAttachmentsFieldName,
  [RecordType.Memo]: memoAttachmentsFieldName,
} as const;

enum AttachmentStatusEnum {
  Profiled = 'Profiled',
  UnProfiled = 'Un-Profiled',
  Recycled = 'Recycled',
  Void = 'Void',
  Archived = 'Archived',
  Open = 'Open',
  InProgress = 'In Progress',
  Complete = 'Complete',
  Cancelled = 'Cancelled',
  // There is an additional value of 'System Only', but we shouldn't allow
  // the user to set this.
}

enum CaseType {
  ChildServices = 'Child Services',
  FamilyServices = 'Family Services',
  CYSNFamilyServices = 'CYSN Family Services',
  Resource = 'Resource',
  // There are additional types, but these are the only ones we want to show
}

enum IncidentType {
  ChildProtection = 'Child Protection',
  // There are additional types, but these are the only ones we want to show
}

enum EntityStatus {
  Open = 'Open',
  // We only want to show open cases
}

enum SafetyAssessmentDecisionUnsafe {
  All = 'All children placed',
  Some = 'Some children placed',
}

enum ContactLanguage {
  AmericanSignLanguage = 'American Sign Language',
  Amharic = 'Amharic',
  Arabic = 'Arabic',
  Armenian = 'Armenian',
  BabineWitsuwiten = "Babine-Witsuwit'en",
  Beaver = 'Beaver',
  Bengali = 'Bengali',
  Braille = 'Braille',
  Cajun = 'Cajun',
  Cantonese = 'Cantonese',
  Chilcotin = 'Chilcotin',
  ChinookJargon = 'Chinook Jargon',
  CoastTsimshian = 'Coast Tsimshian',
  ComoxSliamon = 'Comox/Sliamon',
  Cree = 'Cree',
  Croatian = 'Croatian',
  Czech = 'Czech',
  Danish = 'Danish',
  DitidatNitinat = 'Ditidat (Nitinat)',
  Dutch = 'Dutch',
  English = 'English',
  Farsi = 'Farsi',
  Finnish = 'Finnish',
  French = 'French',
  FrenchCreole = 'French Creole',
  German = 'German',
  Greek = 'Greek',
  Haida = 'Haida',
  Heiltsuk = 'Heiltsuk',
  Hindi = 'Hindi',
  Hungarian = 'Hungarian',
  Ilocano = 'Ilocano',
  Italian = 'Italian',
  Japanese = 'Japanese',
  Klallam = 'Klallam',
  KwakwalaKwakiutl = "Kwakw'ala (Kwakiutl)",
  Lillooet = 'Lillooet',
  Mandarin = 'Mandarin',
  Norwegian = 'Norwegian',
  Other = 'Other',
  Polish = 'Polish',
  Portuguese = 'Portuguese',
  Punjabi = 'Punjabi',
  Rumanian = 'Rumanian',
  Russian = 'Russian',
  Slave = 'Slave',
  SouthTsimshian = 'South Tsimshian',
  Spanish = 'Spanish',
  Squamish = 'Squamish',
  Swedish = 'Swedish',
  Tlingit = 'Tlingit',
  Turkish = 'Turkish',
  Ukrainian = 'Ukrainian',
  Yiddish = 'Yiddish',
}

enum ContactLanguageType {
  SignLanguage = 'Sign Language',
  WrittenSpoken = 'Written/Spoken',
  Written = 'Written',
  Spoken = 'Spoken',
  AssistiveTechnology = 'Assistive Technology',
}

enum ContactMedicalBehavioralCategory {
  Allergy = 'Allergy',
  Behavioural = 'Behavioural',
  Circulatory = 'Circulatory',
  CognitiveLearning = 'Cognitive/Learning',
  Communicable = 'Communicable',
  CongenitalAnomalies = 'Congenital Anomalies',
  Developmental = 'Developmental',
  DigestiveEndocrineDisorders = 'Digestive/Endocrine Disorders',
  MentalHealth = 'Mental Health',
  Musculoskeletal = 'Musculoskeletal',
  Neoplasms = 'Neoplasms',
  Neurological = 'Neurological',
  Other = 'Other',
  Respiratory = 'Respiratory',
  Sensory = 'Sensory',
  Skin = 'Skin',
  SkinAndSubcutaneous = 'Skin and subcutaneous',
}

enum ContactMedicalBehavioralAllergyCondition {
  EnvironmentalSensitivities = 'Environmental sensitivities',
  LifeThreatening = 'Life Threatening',
  NonLifeThreatening = 'Non - Life Threatening',
  SpecialDiet = 'Special Diet',
}

enum ContactMedicalBehavioralBehaviouralCondition {
  Abilities = 'Abilities',
  Aggression = 'Aggression',
  CriminalJusticeActivity = 'Criminal/Justice activity',
  DangerToOthersSelf = 'Danger to others/self',
  DegreeOfIndependence = 'Degree of Independence',
  Firesetting = 'Firesetting',
  Interests = 'Interests',
  Other = 'Other',
  SelfAbusive = 'Self-abusive',
  SexualActingOut = 'Sexual acting out',
  SexuallyIntrusive = 'Sexually intrusive',
}

enum ContactMedicalBehavioralCirculatoryCondition {
  Anaemia = 'Anaemia',
  Cardiomyopathy = 'Cardiomyopathy',
  CerebralVascularAccident = 'Cerebral vascular accident',
  CongenitalHeartDisease = 'Congenital heart disease',
  CoronaryArteryDisease = 'Coronary Artery Disease',
  HeartAttackCardiacArrest = 'Heart attack/cardiac arrest',
  Other = 'Other',
  PeripheralArterialDisease = 'Peripheral arterial disease',
  PulmonaryHypertension = 'Pulmonary Hypertension',
  Stroke = 'Stroke',
}

enum ContactMedicalBehavioralCognitiveLearningCondition {
  ADD = 'ADD',
  ADDADHD = 'ADD / ADHD',
  ADHD = 'ADHD',
  LearningDisability = 'Learning Disability',
}

enum ContactMedicalBehavioralCommunicableCondition {
  AIDS = 'AIDS',
  HIV = 'HIV',
  Hepatitis = 'Hepatitis',
  HepatitisC = 'Hepatitis C',
  Tuberculosis = 'Tuberculosis',
}

enum ContactMedicalBehavioralCongenitalAnomaliesCondition {
  CleftPalate = 'Cleft Palate',
  SpinaBifida = 'Spina Bifida',
  ThalidomideSyndrome = 'Thalidomide syndrome',
}

enum ContactMedicalBehavioralDevelopmentalCondition {
  AlternativeCommunication = 'Alternative Communication',
  AutismSpectrumDisorder = 'Autism Spectrum Disorder',
  AutisticDisorder = 'Autistic Disorder',
  Delays = 'Delays',
  DownSyndrome = 'Down Syndrome',
  FASD = 'FASD',
  FailureToThrive = 'Failure to Thrive',
  NAS = 'NAS',
}

enum ContactMedicalBehavioralDigestiveEndocrineDisordersCondition {
  ChronicLiverDisease = 'Chronic liver disease',
  Cirrhosis = 'Cirrhosis',
  Colitis = 'Colitis',
  CrohnsDisease = "Crohn's disease",
  DiabetesTypeOne = 'Diabetes - type 1',
  DiabetesTypeTwo = 'Diabetes - type 2',
  DiabetesTypeUnspecified = 'Diabetes - Type Unspecified',
  Dysphagia = 'Dysphagia',
  FecalIncontinence = 'Fecal incontinence',
  GERD = 'GERD',
  IBS = 'IBS',
  Malnutrition = 'Malnutrition',
  MorbidObesity = 'Morbid Obesity',
  Pancreatitis = 'Pancreatitis',
  PepticUlcer = 'Peptic Ulcer',
  PituitaryDisorders = 'Pituitary Disorders',
  RenalFailure = 'Renal failure',
  ThyroidDisorders = 'Thyroid Disorders',
  TubeFeed = 'Tube Feed',
  WeightRelated = 'Weight Related',
}

enum ContactMedicalBehavioralMentalHealthCondition {
  AdjustmentDisorder = 'Adjustment Disorder',
  AnxietyDisorders = 'Anxiety Disorders',
  BipolarDisorder = 'Bipolar Disorder',
  Depression = 'Depression',
  DissociativeDisorders = 'Dissociative Disorders',
  Dysthymia = 'Dysthymia',
  EatingDisorder = 'Eating Disorder',
  ImpulseControlDisorder = 'Impulse Control Disorder',
  MoodDisorders = 'Mood Disorders',
  OppositionalDefiantDisorder = 'Oppositional Defiant Disorder',
  PTSD = 'PTSD',
  PersonalityDisorders = 'Personality Disorders',
  PsychoticDisorders = 'Psychotic Disorders',
  Schizophrenia = 'Schizophrenia',
  SexualDisorder = 'Sexual Disorder',
  SomatoformDisorders = 'Somatoform Disorders',
  SubstanceRelatedDisorders = 'Substance-related Disorders',
  SuicideIdeation = 'Suicide ideation',
}

enum ContactMedicalBehavioralMusculoskeletalCondition {
  Arthritis = 'Arthritis',
  CarpalTunnelSyndrome = 'Carpal Tunnel Syndrome',
  DegenerativeDiscDisease = 'Degenerative Disc Disease',
  HalluxValgus = 'Hallux Valgus',
  Lupus = 'Lupus',
  Metatarsalgia = 'Metatarsalgia',
  Osteoarthritis = 'Osteoarthritis',
  Osteopenia = 'Osteopenia',
  Osteoporosis = 'Osteoporosis',
  PesPlanus = 'Pes Planus',
  PlantarFasciitis = 'Plantar fasciitis',
  RheumatoidArthritis = 'Rheumatoid arthritis',
  Scleroderma = 'Scleroderma',
  Scoliosis = 'Scoliosis',
  SpinalStenosis = 'Spinal Stenosis',
}

enum ContactMedicalBehavioralNeoplasmsCondition {
  Benign = 'Benign',
  DigestiveOrgans = 'Digestive organs',
  GenitourinaryOrgans = 'Genitourinary organs',
  InSitu = 'In Situ',
  Leukemia = 'Leukemia',
  LipOralCavityAndPharynx = 'Lip, oral cavity & pharynx',
  Malignant = 'Malignant',
  NeoplasticDisordersOther = 'Neoplastic disorders - other',
  Other = 'Other',
  RespiratoryIntrathoracic = 'Respiratory/Intrathoracic',
  SkinOrBreast = 'Skin or Breast',
}

enum ContactMedicalBehavioralNeurologicalCondition {
  ALS = 'ALS',
  AlzheimersDisease = "Alzheimer's disease",
  BrainInjury = 'Brain Injury',
  CerebralPalsy = 'Cerebral palsy',
  Dementia = 'Dementia',
  Fibromyalgia = 'Fibromyalgia',
  HydroMicrocephalus = 'Hydro/Microcephalus',
  Migraine = 'Migraine',
  MultipleSclerosis = 'Multiple sclerosis',
  MuscularDystrophy = 'Muscular dystrophy',
  Paraplegia = 'Paraplegia',
  ParkinsonsDisease = "Parkinson's disease",
  Quadriplegia = 'Quadriplegia',
  RettSyndrome = 'Rett Syndrome',
  SeizureDisorder = 'Seizure Disorder',
  SpasticQuadraplegia = 'Spastic Quadraplegia',
  SpinalCordInjury = 'Spinal Cord Injury',
  SpinalMuscularAtrophy = 'Spinal Muscular Atrophy',
  TouretteSyndrome = 'Tourette Syndrome',
}

enum ContactMedicalBehavioralOtherCondition {
  Amputations = 'Amputations',
  ChronicHealthCondition = 'Chronic Health Condition',
  ChronicFatigue = 'Chronic fatigue',
  ChronicPainGeneralized = 'Chronic pain (generalized)',
  Fractures = 'Fractures',
  Incontinence = 'Incontinence',
  Insomnia = 'Insomnia',
  OtherInjuries = 'Other injuries',
}

enum ContactMedicalBehavioralRespiratoryCondition {
  Asthma = 'Asthma',
  COPD = 'COPD',
  ChronicLungDisorder = 'Chronic lung disorder',
  CysticFibrosis = 'Cystic fibrosis',
  Emphysemia = 'Emphysemia',
  SleepApnea = 'Sleep Apnea',
}

enum ContactMedicalBehavioralSensoryCondition {
  ADD = 'ADD',
  HearingImpaired = 'Hearing Impaired',
  OrganicSpeechLoss = 'Organic speech loss',
  VisuallyImpaired = 'Visually Impaired',
}

enum ContactMedicalBehavioralSkinCondition {
  Eczema = 'Eczema',
  Psoriasis = 'Psoriasis',
}

enum ContactMedicalBehavioralSkinAndSubcutaneousCondition {
  Psoriasis = 'Psoriasis',
  SkinDisordersOther = 'Skin Disorders - other',
}

const ContactMedicalBehavioralCategoryConditionMap = {
  [ContactMedicalBehavioralCategory.Allergy]:
    ContactMedicalBehavioralAllergyCondition,
  [ContactMedicalBehavioralCategory.Behavioural]:
    ContactMedicalBehavioralBehaviouralCondition,
  [ContactMedicalBehavioralCategory.Circulatory]:
    ContactMedicalBehavioralCirculatoryCondition,
  [ContactMedicalBehavioralCategory.CognitiveLearning]:
    ContactMedicalBehavioralCognitiveLearningCondition,
  [ContactMedicalBehavioralCategory.Communicable]:
    ContactMedicalBehavioralCommunicableCondition,
  [ContactMedicalBehavioralCategory.CongenitalAnomalies]:
    ContactMedicalBehavioralCongenitalAnomaliesCondition,
  [ContactMedicalBehavioralCategory.Developmental]:
    ContactMedicalBehavioralDevelopmentalCondition,
  [ContactMedicalBehavioralCategory.DigestiveEndocrineDisorders]:
    ContactMedicalBehavioralDigestiveEndocrineDisordersCondition,
  [ContactMedicalBehavioralCategory.MentalHealth]:
    ContactMedicalBehavioralMentalHealthCondition,
  [ContactMedicalBehavioralCategory.Musculoskeletal]:
    ContactMedicalBehavioralMusculoskeletalCondition,
  [ContactMedicalBehavioralCategory.Neoplasms]:
    ContactMedicalBehavioralNeoplasmsCondition,
  [ContactMedicalBehavioralCategory.Neurological]:
    ContactMedicalBehavioralNeurologicalCondition,
  [ContactMedicalBehavioralCategory.Other]:
    ContactMedicalBehavioralOtherCondition,
  [ContactMedicalBehavioralCategory.Respiratory]:
    ContactMedicalBehavioralRespiratoryCondition,
  [ContactMedicalBehavioralCategory.Sensory]:
    ContactMedicalBehavioralSensoryCondition,
  [ContactMedicalBehavioralCategory.Skin]:
    ContactMedicalBehavioralSkinCondition,
  [ContactMedicalBehavioralCategory.SkinAndSubcutaneous]:
    ContactMedicalBehavioralSkinAndSubcutaneousCondition,
} as const;

enum ActivityActionBy {
  Client = 'Client',
  External = 'External',
  Health = 'Health',
  Staff = 'Staff',
  Supervisor = 'Supervisor',
  System = 'System',
}

enum ActivityPriority {
  Urgent = '1-Urgent',
  High = '2-High',
  Standard = '3-Standard',
}

enum ActivityStatus {
  Cancelled = 'Cancelled',
  Closed = 'Closed',
  IsError = 'Error',
  InProgress = 'In Progress',
  Open = 'Open',
  Pending = 'Pending',
  Scheduled = 'Scheduled',
  SetUp = 'Set Up',
}

enum ContactEducationDegree {
  One = '1',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Eleven = '11',
  Twelve = '12',
  Daycare = 'Daycare',
  ElementarySchool = 'Elementary school',
  Grade12GEDEquiv = 'Grade 12 grad/GED/equivalent',
  GraduatedAdult = 'Graduated Adult',
  HomeSchooledStudent = 'Home Schooled Student',
  FullDayKindergarten = 'KF - full day kindergarten',
  HalfDayKindergarten = 'KH - half day kindergarten',
  LessThanGrade10 = 'Less than grade 10',
  PostSecondaryCertFirstYearAppren = 'Post-sec certif/1st yr appren',
  PostSecondaryDiplomaSecondYearAppren = 'Post-sec diploma/2st yr appren',
  PostSecondaryDegree = 'Post-secondary degree',
  PreKindergarten = 'Pre-Kindergarten',
  SecondarySchool = 'Secondary school',
  SomeHighSchool = 'Some high school(grades 10-12)',
  SomePostSecondaryTrades = 'Some post-sec/entry trds train',
  TradesThirdFourthYear = 'Trades (3rd/4th yr appren)',
  TradesCert = 'Trades cert (Journey Person)',
  Unspecified = 'Unspecified',
}

export {
  RecordType,
  EntityType,
  RecordEntityMap,
  EntityRecordMap,
  VisitDetails,
  BooleanStringEnum,
  YNEnum,
  YesNoEnum,
  AttachmentParentIdFieldMap,
  AttachmentStatusEnum,
  CaseType,
  IncidentType,
  EntityStatus,
  SafetyAssessmentDecisionUnsafe,
  ContactLanguage,
  ContactLanguageType,
  ContactMedicalBehavioralCategory,
  ContactMedicalBehavioralAllergyCondition,
  ContactMedicalBehavioralBehaviouralCondition,
  ContactMedicalBehavioralCirculatoryCondition,
  ContactMedicalBehavioralCognitiveLearningCondition,
  ContactMedicalBehavioralCommunicableCondition,
  ContactMedicalBehavioralCongenitalAnomaliesCondition,
  ContactMedicalBehavioralDevelopmentalCondition,
  ContactMedicalBehavioralDigestiveEndocrineDisordersCondition,
  ContactMedicalBehavioralMentalHealthCondition,
  ContactMedicalBehavioralMusculoskeletalCondition,
  ContactMedicalBehavioralNeoplasmsCondition,
  ContactMedicalBehavioralNeurologicalCondition,
  ContactMedicalBehavioralOtherCondition,
  ContactMedicalBehavioralRespiratoryCondition,
  ContactMedicalBehavioralSensoryCondition,
  ContactMedicalBehavioralSkinAndSubcutaneousCondition,
  ContactMedicalBehavioralSkinCondition,
  ContactMedicalBehavioralCategoryConditionMap,
  ActivityActionBy,
  ActivityPriority,
  ActivityStatus,
  ContactEducationDegree,
};
