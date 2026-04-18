// Utility untuk memanggil nomor antrian dengan suara
export function speakNumber(number) {
  if (!number || !window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const padded = String(number).padStart(3, '0');
  const digits = padded.split('').join(' ');

  const text = `Nomor antrian ${digits}, silakan menuju loket. Nomor antrian ${digits}.`;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = 0.85;
  utterance.pitch = 1;
  utterance.volume = 1;

  // Try to use Indonesian voice if available
  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find(v => v.lang.startsWith('id'));
  if (idVoice) utterance.voice = idVoice;

  window.speechSynthesis.speak(utterance);
}

// Play a ding sound before speaking
export function dingThenSpeak(number) {
  if (!number) return;

  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  // Ding tone
  osc.frequency.value = 880;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.8);

  // Speak after ding
  setTimeout(() => {
    speakNumber(number);
    ctx.close();
  }, 900);
}
