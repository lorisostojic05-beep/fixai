package casa.fixi.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    // Colore delle fasce sotto le barre di sistema: è lo stesso sfondo crema
    // della pagina iniziale, così lo stacco non si nota.
    private static final int SFONDO = Color.parseColor("#FAF8F3");

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Da Android 16 il disegno "bordo a bordo" è obbligatorio: la WebView
        // occupa tutto lo schermo, barra di stato e barra di navigazione
        // comprese, e windowOptOutEdgeToEdgeEnforcement viene ignorato.
        //
        // Nella WebView di Android le variabili CSS env(safe-area-inset-*) NON
        // riportano l'altezza di quelle barre — coprono solo le tacche dello
        // schermo — quindi la soluzione lato CSS da sola non basta: lo spazio
        // va riservato qui.
        //
        // Chiediamo al sistema quanto misurano le barre e lo trasformiamo in
        // spaziatura della WebView. Vale per tutte le versioni di Android: dove
        // le barre non si sovrappongono, i valori arrivano a zero.
        View webView = getBridge().getWebView();
        webView.setBackgroundColor(SFONDO);

        ViewCompat.setOnApplyWindowInsetsListener(webView, (vista, finestra) -> {
            Insets barre = finestra.getInsets(
                    WindowInsetsCompat.Type.systemBars()
                            | WindowInsetsCompat.Type.displayCutout());
            vista.setPadding(barre.left, barre.top, barre.right, barre.bottom);
            return WindowInsetsCompat.CONSUMED;
        });
    }
}
