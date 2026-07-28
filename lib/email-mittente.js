// Da dove partono le email di Fixi.
//
// Finché il dominio non è verificato su Resend si resta sul mittente di
// prova `onboarding@resend.dev`, che però consegna SOLO all'indirizzo
// dell'account Resend: nessun tecnico e nessun cliente riceve niente.
//
// Il passaggio al dominio vero non richiede di toccare il codice: basta
// impostare EMAIL_MITTENTE fra le variabili d'ambiente su Vercel, per
// esempio  Fixi <assistenza@fixiai.it>  — e solo DOPO che Resend ha
// verificato il dominio, altrimenti gli invii vengono rifiutati.
export const MITTENTE = process.env.EMAIL_MITTENTE || "Fixi <onboarding@resend.dev>";

// Il mittente è un indirizzo che non riceve posta: senza casella, chi
// premesse "Rispondi" vedrebbe l'email tornare indietro. Con questo le
// risposte arrivano invece in una casella vera, senza doverne comprare una.
export const RISPOSTA_A = process.env.EMAIL_RISPOSTA || "lorisostojic05@gmail.com";

// Codice breve da mettere nell'oggetto delle email, tipo #A3F91C.
//
// Non è un vezzo: Gmail (e quasi tutti i client) raggruppano in un'unica
// conversazione i messaggi che hanno lo STESSO oggetto. Due richieste per una
// "Bosch Lavatrice a Milano" generavano due email con oggetto identico, e la
// seconda finiva nascosta dentro la discussione della prima — cioè un lavoro
// nuovo che il tecnico rischia di non vedere.
//
// Serve anche a cliente e tecnico per citare una pratica precisa.
// Senza token si ripiega sull'orario: basta a distinguerle fra loro.
export const riferimento = (token) =>
  String(token || Date.now().toString(36))
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 6)
    .toUpperCase();
