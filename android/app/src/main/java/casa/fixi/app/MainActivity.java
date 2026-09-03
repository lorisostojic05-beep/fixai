package casa.fixi.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.WebBackForwardList;
import android.webkit.WebView;

import androidx.activity.OnBackPressedCallback;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.PluginHandle;

public class MainActivity extends BridgeActivity {

    // Colore delle fasce sotto le barre di sistema: è lo stesso sfondo crema
    // della pagina iniziale, così lo stacco non si nota.
    private static final int SFONDO = Color.parseColor("#FAF8F3");

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // I plugin nostri vanno registrati PRIMA di super.onCreate: è lì dentro
        // che Capacitor costruisce il ponte con la pagina web, e quello che non
        // è registrato a quel momento la pagina non lo vede.
        registerPlugin(SalvaFilePlugin.class);
        registerPlugin(TastiVolumePlugin.class);
        registerPlugin(VersioneAppPlugin.class);

        super.onCreate(savedInstanceState);

        // Da Android 16 il disegno "bordo a bordo" è obbligatorio: la finestra
        // occupa tutto lo schermo, barra di stato e barra di navigazione
        // comprese, e windowOptOutEdgeToEdgeEnforcement viene ignorato.
        //
        // Nella WebView di Android le variabili CSS env(safe-area-inset-*) NON
        // riportano l'altezza di quelle barre — coprono solo le tacche dello
        // schermo — quindi lo spazio va riservato qui, lato nativo.
        //
        // ATTENZIONE al punto in cui si aggancia l'ascoltatore: Capacitor mette
        // la WebView dentro un CoordinatorLayout, che NON gira ai figli le
        // informazioni sulle barre. Agganciarlo alla WebView non funziona (già
        // provato). Va messo sul contenitore di primo livello dell'activity,
        // che le riceve sempre.
        View contenuto = findViewById(android.R.id.content);
        contenuto.setBackgroundColor(SFONDO);

        ViewCompat.setOnApplyWindowInsetsListener(contenuto, (vista, finestra) -> {
            Insets barre = finestra.getInsets(
                    WindowInsetsCompat.Type.systemBars()
                            | WindowInsetsCompat.Type.displayCutout());
            Insets tastiera = finestra.getInsets(WindowInsetsCompat.Type.ime());

            // Quando la tastiera è aperta lo spazio in basso dev'essere il suo,
            // non quello della barra di navigazione (che la tastiera copre).
            // Senza questo la pagina non si accorge della tastiera e il campo
            // di testo resta nascosto sotto.
            int bassoLibero = Math.max(barre.bottom, tastiera.bottom);

            vista.setPadding(barre.left, barre.top, barre.right, bassoLibero);
            return WindowInsetsCompat.CONSUMED;
        });

        // Se la finestra è già disegnata, chiediamo di riapplicare subito le
        // misure invece di aspettare il prossimo cambio di configurazione.
        ViewCompat.requestApplyInsets(contenuto);

        preparaTastoIndietro();
    }

    // Il tasto indietro del telefono torna alla pagina precedente, e chiude
    // l'app solo quando non c'è più niente dietro.
    //
    // Capacitor 6 NON fa nulla con questo tasto: nel suo codice Android non
    // esiste alcun riferimento a onBackPressed o canGoBack. Senza questo
    // metodo la pressione arriva ad Android, che chiude subito l'activity —
    // da qualunque schermata, videodiagnosi pagata compresa. Finché l'app era
    // una pagina sola quasi non si notava; da quando ci sono home, guide e
    // diagnosi collegate tra loro è diventato un vicolo cieco.
    //
    // Si usa OnBackPressedDispatcher e non l'override di onBackPressed()
    // perché con targetSdk 36 quest'ultimo può non essere più chiamato: da
    // Android 15 il "ritorno predittivo" scavalca il vecchio percorso. Questa
    // API funziona in entrambi i casi.
    private void preparaTastoIndietro() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView web = getBridge() == null ? null : getBridge().getWebView();
                int passi = web == null ? 0 : passiIndietroUtili(web);
                if (passi < 0) {
                    web.goBackOrForward(passi);
                    return;
                }
                // Niente dietro: si esce davvero. Va disattivato prima, se no
                // la richiesta rimbalza di nuovo qui e l'app non si chiude.
                setEnabled(false);
                getOnBackPressedDispatcher().onBackPressed();
            }
        });
    }

    // Quanti passi indietro servono per arrivare a una pagina NOSTRA.
    //
    // Il pagamento avviene su checkout.stripe.com dentro la stessa WebView,
    // quindi resta nella cronologia: tornando indietro di uno, chi ha appena
    // pagato si ritroverebbe davanti alla cassa già saldata. Le pagine di
    // Stripe si saltano tutte insieme.
    //
    // Restituisce un numero negativo (i passi da fare) oppure 0 se dietro non
    // c'è nulla di utile.
    private static int passiIndietroUtili(WebView web) {
        WebBackForwardList cronologia = web.copyBackForwardList();
        int corrente = cronologia.getCurrentIndex();
        for (int i = corrente - 1; i >= 0; i--) {
            String url = cronologia.getItemAtIndex(i).getUrl();
            if (url != null && !url.contains("stripe.com")) return i - corrente;
        }
        return 0;
    }

    private TastiVolumePlugin tastiVolume() {
        if (getBridge() == null) return null;
        PluginHandle h = getBridge().getPlugin("TastiVolume");
        return h == null ? null : (TastiVolumePlugin) h.getInstance();
    }

    private static boolean eVolume(int keyCode) {
        return keyCode == KeyEvent.KEYCODE_VOLUME_UP || keyCode == KeyEvent.KEYCODE_VOLUME_DOWN;
    }

    // Durante la videodiagnosi i tasti del volume scattano la foto da
    // analizzare, come sulla fotocamera del telefono: con il telefono infilato
    // dietro un forno il pulsante a schermo non si raggiunge.
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (eVolume(keyCode)) {
            TastiVolumePlugin p = tastiVolume();
            if (p != null && p.staAscoltando()) {
                // Analizza solo la PRIMA pressione: tenendo premuto, Android
                // manda una raffica di ripetizioni. Le ripetizioni però vanno
                // consumate lo stesso (return true fuori dall'if), altrimenti
                // finiscono al sistema e il volume cambia comunque.
                if (event.getRepeatCount() == 0) p.notificaPressione();
                return true;
            }
        }
        return super.onKeyDown(keyCode, event);
    }

    // Va consumato anche il rilascio: se passa al sistema, il volume cambia
    // lo stesso e compare la sua barretta, vanificando l'intercettazione.
    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (eVolume(keyCode)) {
            TastiVolumePlugin p = tastiVolume();
            if (p != null && p.staAscoltando()) return true;
        }
        return super.onKeyUp(keyCode, event);
    }
}
