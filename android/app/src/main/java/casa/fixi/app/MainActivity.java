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
            vista.setPadding(barre.left, barre.top, barre.right, barre.bottom);
            return WindowInsetsCompat.CONSUMED;
        });

        // Se la finestra è già disegnata, chiediamo di riapplicare subito le
        // misure invece di aspettare il prossimo cambio di configurazione.
        ViewCompat.requestApplyInsets(contenuto);
    }
}
