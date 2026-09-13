import { useState } from "react"
import { useApp } from "../context"
import type { PatientFlowStep, PatientLanguage } from "../types"
import {
  extractAbhaIdentifier,
  normalizeAbha,
  validateAbha,
  verifyAbhaForDevelopment,
} from "../services/abha"
import { speakConsent } from "../services/speech"

const LANGUAGES: {
  id: PatientLanguage
  label: string
  speech: string
  welcome: string
  consent: string
}[] = [
  {
    id: "en",
    label: "English",
    speech: "en-IN",
    welcome: "Welcome",
    consent:
      "MediKiosk will ask questions about your health and use the information you provide to prepare your medical history for your healthcare provider.",
  },
  {
    id: "hi",
    label: "हिन्दी",
    speech: "hi-IN",
    welcome: "स्वागत है",
    consent:
      "मेडीकियोस्क आपके स्वास्थ्य के बारे में प्रश्न पूछेगा और आपके स्वास्थ्य सेवा प्रदाता के लिए आपकी चिकित्सा जानकारी तैयार करने में इसका उपयोग करेगा।",
  },
  {
    id: "ta",
    label: "தமிழ்",
    speech: "ta-IN",
    welcome: "வரவேற்கிறோம்",
    consent:
      "மெடிகியோஸ்க் உங்கள் உடல்நலம் பற்றிய கேள்விகளைக் கேட்டு, உங்கள் மருத்துவ வழங்குநருக்கான மருத்துவத் தகவலைத் தயாரிக்க பயன்படுத்தும்.",
  },
]

const steps = ["Identify", "Consent", "Health assessment", "Complete"]

export function PatientKiosk() {
  const {
    patientLanguage,
    setPatientLanguage,
    setPatientKioskOpen,
    setVerifiedPatient,
    verifiedPatient,
    createIntakeSession,
    recordConsent,
    intakeSession,
    resetPatientIntake,
  } = useApp()
  const [step, setStep] = useState<PatientFlowStep>("welcome")
  const [method, setMethod] = useState<"manual" | "qr" | "document" | null>(
    null,
  )
  const [abha, setAbha] = useState("")
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const language =
    LANGUAGES.find((item) => item.id === patientLanguage) ?? LANGUAGES[0]
  const progress =
    step === "consent" || step === "declined"
      ? 1
      : step === "ready" || step === "history"
        ? 3
        : 0

  const goHome = () => {
    resetPatientIntake()
    setPatientKioskOpen(false)
  }
  const verify = async (candidate = abha) => {
    const normalized = normalizeAbha(candidate)
    const validation = validateAbha(normalized)
    setAbha(normalized)
    if (validation) {
      setError(validation)
      return
    }
    setError("")
    setIsVerifying(true)
    const result = await verifyAbhaForDevelopment(normalized)
    setIsVerifying(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setVerifiedPatient(result.patient)
    setStep("confirm")
  }
  const acceptConsent = () => {
    if (!verifiedPatient) return
    const session = createIntakeSession(verifiedPatient, patientLanguage)
    recordConsent({
      sessionId: session.sessionId,
      patientId: verifiedPatient.patientId,
      consentType: "clinical_intake",
      status: "granted",
      language: patientLanguage,
      consentVersion: "1.0",
      timestamp: new Date().toISOString(),
    })
    setStep("ready")
  }

  return (
    <div className="min-h-full bg-[#ecf7f7] p-3 sm:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-24px)] max-w-5xl flex-col rounded-[28px] bg-white shadow-xl shadow-teal-900/10 sm:min-h-[calc(100vh-48px)]">
        <header className="flex items-center justify-between border-b border-teal-100 px-5 py-4 sm:px-8">
          <button
            onClick={goHome}
            className="flex items-center gap-2 text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-xl text-white">
              ✚
            </span>
            <span>
              <strong className="block text-lg text-slate-900">
                MediKiosk
              </strong>
              <small className="text-slate-500">Patient check-in</small>
            </span>
          </button>
          <button
            onClick={goHome}
            className="rounded-lg px-4 py-3 text-base font-semibold text-slate-600 hover:bg-slate-100"
          >
            Exit
          </button>
        </header>
        <div className="px-5 pt-5 sm:px-10">
          <div className="grid grid-cols-4 gap-1">
            {steps.map((name, index) => (
              <div key={name} className="text-center">
                <div
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                    index <= progress
                      ? "bg-teal-700 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {index < progress ? "✓" : index + 1}
                </div>
                <div
                  className={`mt-2 text-xs font-semibold sm:text-sm ${
                    index === progress ? "text-teal-800" : "text-slate-400"
                  }`}
                >
                  {name}
                </div>
              </div>
            ))}
          </div>
        </div>
        <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-10">
          <div className="w-full max-w-2xl text-center">
            {step === "welcome" && (
              <>
                <div className="mb-5 text-6xl">👋</div>
                <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
                  {language.welcome}
                </h1>
                <p className="mt-4 text-xl text-slate-600">
                  Choose your language
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setPatientLanguage(item.id)}
                      className={`min-h-24 rounded-2xl border-2 text-2xl font-bold transition ${
                        patientLanguage === item.id
                          ? "border-teal-700 bg-teal-50 text-teal-900"
                          : "border-slate-200 text-slate-700 hover:border-teal-400"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <Primary
                  onClick={() => setStep("patient-type")}
                  label="Continue →"
                />
              </>
            )}
            {step === "patient-type" && (
              <>
                <Title
                  title="Are you already registered?"
                  subtitle="Choose the option that is right for you."
                />
                <Choice
                  icon="🪪"
                  title="Yes, I have an ABHA ID"
                  onClick={() => setStep("identify")}
                />
                <Choice
                  icon="✦"
                  title="No, I am a new patient"
                  detail="We will not create an ABHA ID here. A staff member can help you register."
                  onClick={() => setStep("identify")}
                />
                <Back onClick={() => setStep("welcome")} />
              </>
            )}
            {step === "identify" && !method && (
              <>
                <Title
                  title="How would you like to provide your ABHA ID?"
                  subtitle="Choose one simple way to continue."
                />
                <Choice
                  icon="▣"
                  title="Scan QR / Barcode"
                  detail="Use a camera or scanner if available."
                  onClick={() => setMethod("qr")}
                />
                <Choice
                  icon="▤"
                  title="Scan ABHA card"
                  detail="Document reading only extracts an ID; it does not verify identity."
                  onClick={() => setMethod("document")}
                />
                <Choice
                  icon="⌨"
                  title="Enter ABHA ID manually"
                  onClick={() => setMethod("manual")}
                />
                <Back onClick={() => setStep("patient-type")} />
              </>
            )}
            {step === "identify" && method === "manual" && (
              <IdentifierEntry
                title="Enter your ABHA ID"
                onChange={(value) => {
                  setAbha(normalizeAbha(value))
                  setError("")
                }}
                value={abha}
                error={error}
                onContinue={() => verify()}
                busy={isVerifying}
                onBack={() => setMethod(null)}
              />
            )}
            {step === "identify" && method === "qr" && (
              <>
                <Title
                  title="Scan QR / Barcode"
                  subtitle="For this development kiosk, paste or type the scanner result below. A camera scanner adapter can be connected here."
                />
                <IdentifierEntry
                  title="Scanner result"
                  value={abha}
                  onChange={(value) => {
                    setAbha(value)
                    setError("")
                  }}
                  error={error}
                  onContinue={() => {
                    const found = extractAbhaIdentifier(abha)
                    if (!found) {
                      setError(
                        "We couldn't read an ABHA ID. Please try again or enter it manually.",
                      )
                      return
                    }
                    verify(found)
                  }}
                  busy={isVerifying}
                  onBack={() => setMethod(null)}
                />
              </>
            )}
            {step === "identify" && method === "document" && (
              <>
                <Title
                  title="Scan your ABHA card"
                  subtitle="OCR is not configured in this development build. It will never be used as authentication."
                />
                <div className="rounded-2xl border-2 border-dashed border-slate-300 p-8">
                  <div className="text-4xl">📷</div>
                  <p className="mt-3 text-lg text-slate-600">
                    We could not clearly read the ABHA ID.
                  </p>
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setMethod("document")}
                    className="flex-1 rounded-xl border-2 border-teal-700 py-4 text-lg font-bold text-teal-800"
                  >
                    Try again
                  </button>
                  <button
                    onClick={() => setMethod("manual")}
                    className="flex-1 rounded-xl bg-teal-700 py-4 text-lg font-bold text-white"
                  >
                    Enter manually
                  </button>
                </div>
                <Back onClick={() => setMethod(null)} />
              </>
            )}
            {step === "confirm" && verifiedPatient && (
              <>
                <div className="mb-4 text-5xl">✓</div>
                <Title
                  title="Patient found"
                  subtitle="Please check the details below."
                />
                <div className="rounded-2xl bg-teal-50 p-6 text-left text-lg">
                  <p>
                    <b>Name:</b> {verifiedPatient.name}
                  </p>
                  <p className="mt-3">
                    <b>Age:</b> {verifiedPatient.age}
                  </p>
                  <p className="mt-3">
                    <b>Gender:</b> {verifiedPatient.gender}
                  </p>
                </div>
                <p className="mt-6 text-xl font-semibold">Is this you?</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setStep("consent")}
                    className="rounded-xl bg-teal-700 py-5 text-xl font-bold text-white"
                  >
                    Yes, continue
                  </button>
                  <button
                    onClick={() => {
                      setVerifiedPatient(null)
                      setStep("identify")
                      setMethod(null)
                    }}
                    className="rounded-xl border-2 border-slate-300 py-5 text-xl font-bold text-slate-700"
                  >
                    No, go back
                  </button>
                </div>
                <p className="mt-5 text-sm text-amber-800">
                  Development note: identity data comes from a mock verification
                  adapter, not ABDM.
                </p>
              </>
            )}
            {step === "consent" && (
              <>
                <Title title="Your consent" subtitle={language.consent} />
                <button
                  onClick={() =>
                    speakConsent(language.consent, language.speech)
                  }
                  className="mt-2 rounded-xl border-2 border-teal-700 px-7 py-4 text-lg font-bold text-teal-800"
                >
                  🔊 Listen
                </button>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <button
                    onClick={acceptConsent}
                    className="rounded-xl bg-teal-700 py-5 text-xl font-bold text-white"
                  >
                    I agree
                  </button>
                  <button
                    onClick={() => setStep("declined")}
                    className="rounded-xl border-2 border-slate-300 py-5 text-xl font-bold text-slate-700"
                  >
                    I do not agree
                  </button>
                </div>
                <p className="mt-5 text-sm text-slate-500">
                  Consent wording and version should be reviewed with the
                  hospital's legal and compliance teams before production use.
                </p>
              </>
            )}
            {step === "declined" && (
              <>
                <div className="text-6xl">ⓘ</div>
                <Title
                  title="Consent was not provided."
                  subtitle="Your health assessment has not been started."
                />
                <Primary onClick={goHome} label="Return" />
              </>
            )}
            {step === "ready" && (
              <>
                <div className="text-6xl">✓</div>
                <Title
                  title="You are all set."
                  subtitle="Your health assessment can now begin."
                />
                <div className="mb-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  Session prepared:{" "}
                  <span className="font-mono">{intakeSession?.sessionId}</span>
                </div>
                <Primary
                  onClick={() => setStep("history")}
                  label="Start health assessment →"
                />
              </>
            )}
            {step === "history" && (
              <>
                <div className="text-6xl">🩺</div>
                <Title
                  title="Clinical history assessment module"
                  subtitle="Your information has been securely prepared for the next step."
                />
                <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                  This is a placeholder. AI history-taking has not been
                  implemented.
                </p>
                <Primary onClick={goHome} label="Finish" />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function Title({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
        {subtitle}
      </p>
    </>
  )
}
function Choice({
  icon,
  title,
  detail,
  onClick,
}: {
  icon: string
  title: string
  detail?: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="mt-4 flex w-full items-center gap-5 rounded-2xl border-2 border-slate-200 p-5 text-left transition hover:border-teal-600 hover:bg-teal-50"
    >
      <span className="text-3xl">{icon}</span>
      <span>
        <strong className="block text-xl text-slate-900">{title}</strong>
        {detail && (
          <small className="mt-1 block text-base text-slate-600">
            {detail}
          </small>
        )}
      </span>
      <span className="ml-auto text-2xl text-teal-700">›</span>
    </button>
  )
}
function Primary({ onClick, label }: { onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className="mt-8 min-h-16 w-full rounded-2xl bg-teal-700 px-6 text-xl font-bold text-white shadow-lg shadow-teal-900/20 hover:bg-teal-800"
    >
      {label}
    </button>
  )
}
function Back({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-6 px-5 py-3 text-lg font-semibold text-slate-600"
    >
      ← Back
    </button>
  )
}
function IdentifierEntry({
  title,
  value,
  onChange,
  error,
  onContinue,
  busy,
  onBack,
}: {
  title: string
  value: string
  onChange: (value: string) => void
  error: string
  onContinue: () => void
  busy: boolean
  onBack: () => void
}) {
  return (
    <>
      <Title
        title={title}
        subtitle="Your ABHA ID is used only to find your identity."
      />
      <input
        aria-label={title}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode="numeric"
        placeholder="12-3456-7890-1234"
        className="mt-8 w-full rounded-2xl border-2 border-slate-300 px-5 py-5 text-center font-mono text-2xl tracking-wider outline-none focus:border-teal-700"
      />
      {error && (
        <p className="mt-3 rounded-xl bg-red-50 p-3 text-base text-red-800">
          {error}
        </p>
      )}
      <Primary onClick={onContinue} label={busy ? "Checking…" : "Continue →"} />
      <Back onClick={onBack} />
    </>
  )
}
