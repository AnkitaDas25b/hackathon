Design a complete **modern healthcare web application UI/UX** for an **AI-powered medical imaging triage and doctor allocation platform**.

The system is used inside a hospital or diagnostic center and should support three major actors:

1. **Reception/Admin**
2. **Doctors**
3. **AI Triage System**

The application should feel clinical, trustworthy, modern, clean, and enterprise-grade. Prioritize clarity, speed, patient safety, accessibility, and minimal cognitive load. Avoid flashy consumer-app styling.

## Core Product Goal

The platform should allow a hospital to:

* Register patients
* Create imaging/test requests
* Upload or associate DICOM medical imaging studies such as CT, MRI, or X-ray
* Store imaging data using AWS HealthImaging
* Run AI inference on uploaded scans
* Categorize patients into priority levels such as:

  * Critical
  * Warning / Early Signs
  * Normal / Routine
* Allow reception/admin staff to assign patients to available doctors based on:

  * Clinical priority
  * Doctor specialty
  * Current workload
  * Existing critical patients
  * Availability
* Give doctors a prioritized patient queue
* Allow doctors to inspect medical scans using an embedded DICOM viewer
* Allow doctors to review AI-generated findings
* Support doctor-to-doctor referrals through the admin workflow
* Capture doctor feedback when the AI prediction is incorrect
* Store this feedback for controlled future model retraining

---

# Important Architecture Assumption

Do **not** treat all patient information as DICOM.

Patient demographic and workflow information such as:

* Name
* Age
* Sex
* Phone
* Patient ID
* Symptoms
* Reason for scan
* Encounter
* Assigned doctor
* Referral information
* Test orders
* AI triage status

should exist in the application database.

Actual medical imaging studies should be stored separately using **AWS HealthImaging**.

The UI should conceptually reflect:

Application Database
↕ linked through patient/study identifiers
AWS HealthImaging

AWS HealthImaging stores the actual CT/MRI/X-ray study, series, instances, metadata, and image frames.

---

# USER ROLE 1 — RECEPTION / ADMIN

Create a dedicated Reception/Admin dashboard.

## Admin Dashboard

The main dashboard should immediately show:

* Total patients waiting
* Critical patients
* Warning patients
* Routine patients
* Unassigned patients
* Available doctors
* Pending referrals
* Imaging scans currently processing

Example overview:

* Waiting: 18
* Critical: 3
* Warning: 6
* Routine: 9
* Available Doctors: 7
* Pending Referrals: 2

Use prominent but professional priority indicators.

Suggested priority colors:

* Critical → Red
* Warning → Amber/Yellow
* Routine → Green
* Processing → Blue/Neutral

Do not rely only on color; also use labels/icons for accessibility.

---

# Patient Registration Flow

Receptionist should be able to:

### Step 1 — Register Patient

Fields:

* Patient ID
* Full Name
* Age / Date of Birth
* Sex
* Contact information
* Emergency contact
* Existing patient / new patient
* Relevant symptoms
* Current complaint
* Referring physician if applicable

### Step 2 — Create Test Request

Fields:

* Imaging modality

  * CT
  * MRI
  * X-Ray
  * Other supported imaging
* Body region
* Reason for scan
* Clinical notes
* Requested specialty
* Urgency if already specified by a clinician

### Step 3 — Imaging Upload / Association

Create a UI for:

* Uploading DICOM study
  OR
* Associating an imaging study already uploaded by scanner/PACS

Show upload and processing states such as:

Uploading → Processing → Stored → AI Analysis → Ready

Reception staff should **not need to download or inspect the raw DICOM files**.

Once stored in AWS HealthImaging, the UI should simply show:

"Imaging Study Ready"

---

# AI TRIAGE FLOW

After the scan is stored, trigger AI analysis.

The AI analyzes the medical images and generates:

* Possible findings
* Confidence values
* Overall triage category
* Reason for prioritization
* Suggested specialty

Example:

AI TRIAGE

Priority: CRITICAL

Potential Finding:
Suspected intracranial hemorrhage

Confidence:
94%

Suggested Specialty:
Neurology / Neurosurgery

AI should not present itself as the final clinical diagnosis.

Use wording such as:

* "Potential finding"
* "AI-detected abnormality"
* "Suggested triage"
* "Requires clinician review"

Avoid wording such as:

"Patient definitely has disease X."

---

# ADMIN PATIENT QUEUE

Create a central patient table/list.

Columns should include:

* Patient
* Age / Sex
* Imaging Test
* Study Status
* AI Priority
* AI Finding
* Suggested Specialty
* Assigned Doctor
* Waiting Time
* Status

Example:

Ravi Kumar
CT Brain
CRITICAL
Possible hemorrhage
Neurology
Unassigned
Waiting 3 min

Priya Shah
CT Chest
WARNING
Possible pulmonary nodule
Pulmonology
Dr. Rao
Waiting 12 min

Allow filtering by:

* Critical
* Warning
* Routine
* Unassigned
* Specialty
* Doctor
* Modality
* Waiting time
* Referral patients

Allow sorting by:

1. Clinical priority
2. Waiting time
3. Referral urgency

---

# DOCTOR ASSIGNMENT UX

When reception selects an unassigned patient, show a doctor allocation panel.

Display:

Patient:
Ravi Kumar

Priority:
CRITICAL

AI Finding:
Possible intracranial hemorrhage

Suggested Specialty:
Neurology

Then show available doctors.

Each doctor card should contain:

* Doctor Name
* Specialty
* Current status
* Current patient
* Number of patients waiting
* Number of critical patients currently assigned
* Estimated workload
* Availability

Example:

Dr. Rao
Neurology
Available
2 patients waiting
0 critical patients

[Assign]

Dr. Sen
Neurology
Busy
5 patients waiting
2 critical patients

[Assign]

Admin retains control of assignment.

The system may provide:

"Recommended Doctor"

based on specialty + availability + workload, but it should not automatically assign without human confirmation unless explicitly configured.

---

# USER ROLE 2 — DOCTOR

Create a separate Doctor Dashboard.

The doctor dashboard should be clinically focused and less administrative.

## Doctor Home Screen

Show a prioritized patient queue.

Priority order:

1. Critical
2. Urgent referrals
3. Warning
4. Routine

Example:

CRITICAL

1. Ravi Kumar
   CT Brain
   Possible intracranial hemorrhage
   AI confidence: 94%
   Waiting: 3 min

WARNING

2. Priya Shah
   CT Chest
   Possible pulmonary nodule
   AI confidence: 71%

ROUTINE

3. Aman Das
   CT Chest
   No major abnormality detected

Each patient row/card should have:

* Open Case
* Quick patient information
* Priority badge
* Waiting time
* Referral indicator if applicable

---

# DOCTOR PATIENT CASE VIEW

Create a detailed patient workspace.

Suggested layout:

LEFT SIDEBAR:

* Doctor's patient queue

CENTER:

* DICOM medical image viewer

RIGHT PANEL:

* Patient information
* AI findings
* Reports
* Clinical notes

The DICOM viewer should support:

* Slice scrolling
* Zoom
* Pan
* Window/level controls
* Series selection
* Study selection
* Fullscreen view
* Previous studies if available

The UI should conceptually support viewers such as OHIF or Cornerstone.

Do not design the scan viewer as a basic image gallery.

---

# AI RESULTS PANEL

Show:

AI TRIAGE:
CRITICAL

Potential Findings:

Intracranial hemorrhage — 94%
Mass effect — 61%
Fracture — 12%

Reason for Priority:
High probability of acute intracranial bleeding.

Model Version:
v1.4

Include a visible disclaimer:

"AI-generated decision-support output. Final clinical assessment must be performed by a qualified clinician."

---

# DOCTOR ACTIONS

The doctor should have actions such as:

* Add clinical notes
* Confirm diagnosis
* Complete case
* Refer patient
* Flag AI prediction
* Agree with AI
* Disagree with AI
* Request additional imaging
* View patient history
* View previous scans
* View existing reports

---

# AI FEEDBACK / HUMAN-IN-THE-LOOP FLOW

Do NOT implement immediate reinforcement learning or automatically modify the AI model after a doctor's correction.

Instead create a controlled feedback workflow.

Example:

AI Prediction:
Possible Pneumonia — 91%

Was the AI assessment accurate?

[Agree]

[Disagree]

If Disagree:

Correct Finding:
[Dropdown / Search]

Doctor Comments:
[Text area]

Optional:
Mark incorrect region on scan

[Submit AI Feedback]

Store information including:

* Study ID
* Prediction ID
* AI model version
* AI finding
* Confidence
* Doctor agreement/disagreement
* Correct diagnosis/finding
* Doctor comments
* Timestamp

Show that this data goes into:

Feedback Dataset
→ Review / Curation
→ Offline Retraining
→ Model Validation
→ New Model Version
→ Controlled Deployment

Do not design automatic online learning.

---

# REFERRAL WORKFLOW

The doctor should be able to click:

"Refer Patient"

Referral form:

* Required specialty
* Specific doctor if needed
* Reason for referral
* Clinical notes
* Referral urgency

  * Critical
  * Urgent
  * Routine

Example:

Required Specialty:
Cardiology

Reason:
Possible aortic abnormality detected. Cardiology assessment recommended.

Urgency:
Urgent

After submission:

Doctor A
→ Referral Request
→ Admin Referral Queue
→ Admin assigns appropriate doctor
→ Doctor B receives patient in queue

The original scan should NOT be duplicated.

Both doctors access the same imaging study stored in AWS HealthImaging.

---

# ADMIN REFERRAL QUEUE

Create a page showing:

* Patient
* Referring doctor
* Requested specialty
* Reason
* Urgency
* Time submitted
* Assigned doctor
* Status

Example:

Ravi Kumar
From: Dr. Rao
Specialty: Cardiology
Urgent
"Possible aortic abnormality"

Available doctors:

Dr. Kapoor — Available
Dr. Sharma — 3 patients waiting

[Assign]

---

# PATIENT TIMELINE

Create a patient timeline showing the complete care journey.

Example:

10:02 — Patient registered
10:08 — CT ordered
10:21 — Scan uploaded
10:23 — AI analysis completed
10:23 — Marked CRITICAL
10:25 — Assigned to Dr. Rao
10:31 — Doctor opened scan
10:42 — Referral to Cardiology requested
10:45 — Assigned to Dr. Kapoor
11:02 — Case completed

This should improve traceability.

---

# NOTIFICATIONS

Design a notification system for important events.

Examples:

Admin:

* Critical patient waiting for assignment
* New referral request
* Doctor unavailable
* Imaging upload failed

Doctor:

* Critical patient assigned
* Urgent referral received
* New imaging results available
* Additional scan uploaded

Critical alerts should be visually prominent but should not create excessive alert fatigue.

---

# STATUS SYSTEM

Use clear workflow statuses such as:

Patient Status:

Registered
Test Ordered
Imaging Pending
Imaging Processing
AI Processing
Awaiting Assignment
Assigned
Under Review
Referral Requested
Reassigned
Completed

Imaging Status:

Uploading
Processing
Ready
Failed

AI Status:

Pending
Analyzing
Complete
Failed
Needs Review

---

# SEARCH AND FILTERING

Global search should support:

* Patient name
* Patient ID
* Doctor
* Study ID
* Modality

Filters should support:

* Priority
* Specialty
* Assigned/unassigned
* Imaging modality
* Date
* Doctor
* Waiting time
* Referral status

---

# SECURITY AND PERMISSIONS UX

Design role-based access.

Reception/Admin should mainly access:

* Patient registration
* Scheduling
* Assignment
* Referral coordination
* Workflow status
* AI priority

Doctors should access:

* Patient scans
* Medical history
* Reports
* AI findings
* Clinical notes
* Referrals
* AI feedback

Do not expose unnecessary medical imaging controls to reception staff.

Include UI concepts for:

* Secure login
* Role-based permissions
* Audit history
* Session expiry
* Access logging

---

# DESIGN STYLE

Create a polished healthcare SaaS design.

Preferred style:

* Clean white/light-neutral background
* Dark readable typography
* Professional clinical feel
* Minimal visual clutter
* Rounded cards used sparingly
* Consistent spacing
* Strong information hierarchy
* Accessible contrast
* Responsive layouts
* Desktop-first because hospital workstations are the primary use case

Use red/amber/green status indicators carefully.

Avoid:

* Excessive gradients
* Neon styling
* Glassmorphism
* Cartoon illustrations
* Oversized decorative elements
* Consumer fitness-app appearance

Think:

"Modern hospital operating dashboard + radiology workstation + enterprise SaaS."

---

# REQUIRED SCREENS

Design all of the following screens:

1. Login / Role Selection
2. Admin Dashboard
3. Patient Registration
4. Create Test Order
5. Imaging Upload / Study Association
6. AI Processing State
7. Admin Patient Queue
8. Patient Detail Page
9. Doctor Assignment Screen
10. Doctor Dashboard
11. Doctor Prioritized Queue
12. Doctor Patient Case Workspace
13. DICOM Viewer Workspace
14. AI Findings Panel
15. Doctor AI Feedback Modal
16. Referral Creation Modal
17. Admin Referral Queue
18. Doctor Referral Patient View
19. Patient Timeline
20. Notifications Center
21. Completed Cases
22. AI Feedback / Model Monitoring Dashboard

---

# MODEL MONITORING DASHBOARD

Also create an admin/AI operations screen showing model performance.

Metrics:

* Total scans analyzed
* Critical cases detected
* Doctor agreement rate
* Doctor disagreement rate
* False-positive feedback
* False-negative feedback
* Sensitivity
* Specificity
* Precision
* Recall
* Model version
* Performance by imaging modality
* Performance by disease
* Performance trends over time

Clearly separate this from the clinical doctor dashboard.

---

# MAIN UX PRINCIPLE

The application should always communicate:

AI assists prioritization.
Doctors make clinical decisions.
Admins manage patient routing and operations.

The system should never make the receptionist responsible for interpreting medical scans.

The AI should explain why a case received higher priority but should not claim definitive diagnosis.

---

# FINAL OUTPUT EXPECTATION

Generate:

* Complete information architecture
* User flows
* Sitemap
* High-fidelity UI concepts
* Reusable design system/components
* Desktop layouts for all important screens
* Responsive behavior
* Navigation structure
* Empty states
* Loading states
* Error states
* AI processing states
* Critical alert states
* Referral workflow
* Doctor allocation workflow
* Human-in-the-loop feedback workflow

The final product should feel like a realistic, deployable **AI-assisted hospital imaging triage platform**, not a generic hospital management system.

Prioritize the core workflow:

Patient Registration
→ Imaging Test
→ DICOM stored in AWS HealthImaging
→ AI Analysis
→ Priority Generated
→ Admin Assignment
→ Doctor Review
→ Diagnosis / Referral / AI Feedback
→ Case Completion
