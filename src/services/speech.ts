export function speakConsent(text: string, language: string) {
  if (!("speechSynthesis" in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = language
  window.speechSynthesis.speak(utterance)
  return true
}
