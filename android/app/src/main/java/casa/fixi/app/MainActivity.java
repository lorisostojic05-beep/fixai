package casa.fixi.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
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
                if (web != null && web.canGoBack()) {
                    web.goBack();
                    return;
                }
                // Niente dietro: si esce davvero. Va disattivato prima, se no
                // la richiesta rimbalza di nuovo qui e l'app non si chiude.
                setEnabled(false);
                getOnBackPressedDispatcher().onBackPressed();
            }
        });
    }

    // NOTA per il futuro, costata una serata (05/09/2026).
    //
    // Qui prima non c'era goBack() ma un calcolo: si leggeva la cronologia con
    // copyBackForwardList(), si cercava a ritroso la prima pagina non-Stripe e
    // si saltava là con goBackOrForward(passi). Serviva a non far ricadere sulla
    // cassa di Stripe chi aveva appena pagato.
    //
    // Funzionava, finché la pagina non ha iniziato a proteggersi da sola con
    // history.pushState. Quelle tappe NON compaiono in copyBackForwardList: il
    // conto usciva giusto sulla cronologia nativa e sbagliato su quella vera,
    // e "due passi indietro" atterrava esattamente su Stripe — il posto che il
    // calcolo doveva evitare. Il diario di bordo l'ha dimostrato: la tappa
    // veniva messa, ma la pressione non arrivava mai alla pagina.
    //
    // Un passo per volta non ha questo problema, perché non c'e' nessun conto
    // da sbagliare: goBack() usa la stessa cronologia che vede la pagina. Di
    // Stripe si occupa la pagina, che intercetta la pressione prima ancora che
    // si arrivi fin lì.
    //
    // Morale: non calcolare indici su due liste che non sai se coincidono.

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
