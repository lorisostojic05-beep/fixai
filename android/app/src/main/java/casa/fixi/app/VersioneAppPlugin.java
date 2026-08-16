package casa.fixi.app;

import android.content.pm.PackageInfo;
import android.os.Build;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Dice alla pagina web quale versione dell'app è installata.
 *
 * Serve perché Fixi è un guscio che carica il sito: il sito si aggiorna da solo,
 * l'app no. Sapendo il numero di versione, il sito può accorgersi da sé che
 * l'app è rimasta indietro e dirlo all'utente — per QUALSIASI aggiornamento,
 * non solo per quelli che aggiungono funzioni riconoscibili.
 *
 * Da qui in avanti non servirà più toccare il codice nativo per questo: basterà
 * cambiare VERSIONE_PUBBLICATA in lib/versione-app.js dopo ogni pubblicazione.
 */
@CapacitorPlugin(name = "VersioneApp")
public class VersioneAppPlugin extends Plugin {

    @PluginMethod
    public void leggi(PluginCall call) {
        try {
            PackageInfo info = getContext()
                    .getPackageManager()
                    .getPackageInfo(getContext().getPackageName(), 0);

            long codice;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                codice = info.getLongVersionCode();
            } else {
                // Deprecato dall'API 28 in poi, ma è l'unico modo sotto
                @SuppressWarnings("deprecation")
                int vecchio = info.versionCode;
                codice = vecchio;
            }

            JSObject risposta = new JSObject();
            risposta.put("codice", codice);
            risposta.put("nome", info.versionName);
            call.resolve(risposta);
        } catch (Exception e) {
            call.reject("Versione non leggibile: " + e.getMessage(), "VERSIONE_ILLEGGIBILE", e);
        }
    }
}
