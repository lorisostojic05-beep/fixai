package casa.fixi.app;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;
import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.OutputStream;

/**
 * Salva un file nella cartella Download del telefono, quella vera che l'utente
 * trova nell'app File.
 *
 * Perché serve un plugin nostro: @capacitor/filesystem sa scrivere solo nelle
 * cartelle private dell'app o in Documenti, e da Android 10 (API 29) le app non
 * possono più scrivere da sole nelle cartelle pubbliche. L'unico canale che
 * Android concede è MediaStore, che non è esposto da nessun plugin ufficiale.
 *
 * Sotto Android 10 la vecchia strada richiederebbe il permesso
 * WRITE_EXTERNAL_STORAGE, che è invasivo e va chiesto all'utente. Non ne vale la
 * pena per una manciata di telefoni: lì rifiutiamo con un codice e il lato
 * JavaScript ripiega sul menù di condivisione, che funziona ovunque.
 */
@CapacitorPlugin(name = "SalvaFile")
public class SalvaFilePlugin extends Plugin {

    @PluginMethod
    public void nelleDownload(PluginCall call) {
        String nomeFile = call.getString("nomeFile");
        String dati = call.getString("dati"); // base64 puro, senza il prefisso "data:"
        String tipo = call.getString("tipo", "application/pdf");

        if (nomeFile == null || nomeFile.isEmpty() || dati == null || dati.isEmpty()) {
            call.reject("Servono nomeFile e dati", "DATI_MANCANTI");
            return;
        }

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            call.reject("Android troppo vecchio per MediaStore", "NON_SUPPORTATO");
            return;
        }

        Uri destinazione = null;
        ContentResolver resolver = getContext().getContentResolver();

        try {
            byte[] contenuto = Base64.decode(dati, Base64.DEFAULT);

            ContentValues valori = new ContentValues();
            valori.put(MediaStore.Downloads.DISPLAY_NAME, nomeFile);
            valori.put(MediaStore.Downloads.MIME_TYPE, tipo);
            // IS_PENDING nasconde il file finché non abbiamo finito di scriverlo:
            // senza, un'altra app potrebbe aprirlo mentre è ancora a metà.
            valori.put(MediaStore.Downloads.IS_PENDING, 1);

            destinazione = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, valori);
            if (destinazione == null) {
                call.reject("Android non ha concesso un posto nei Download", "POSTO_NEGATO");
                return;
            }

            try (OutputStream uscita = resolver.openOutputStream(destinazione)) {
                if (uscita == null) {
                    throw new IllegalStateException("Impossibile aprire il file in scrittura");
                }
                uscita.write(contenuto);
            }

            ContentValues fine = new ContentValues();
            fine.put(MediaStore.Downloads.IS_PENDING, 0);
            resolver.update(destinazione, fine, null, null);

            JSObject risposta = new JSObject();
            risposta.put("uri", destinazione.toString());
            risposta.put("nomeFile", nomeFile);
            call.resolve(risposta);
        } catch (Exception e) {
            // Se ci fermiamo a metà resta una riga fantasma nei Download, con un
            // file vuoto e invisibile: va tolta, altrimenti si accumulano.
            if (destinazione != null) {
                try {
                    resolver.delete(destinazione, null, null);
                } catch (Exception ignorata) {}
            }
            call.reject("Salvataggio non riuscito: " + e.getMessage(), "SCRITTURA_FALLITA", e);
        }
    }
}
