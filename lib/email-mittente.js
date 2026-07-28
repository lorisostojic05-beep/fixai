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
