package casa.fixi.app;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Fa arrivare alla pagina web la pressione dei tasti del volume, così si può
 * analizzare quello che si inquadra senza toccare lo schermo.
 *
 * Serve perché i tasti del volume li gestisce Android: nella WebView non
 * generano nessun evento da tastiera, quindi dal JavaScript sono invisibili.
 *
 * L'ascolto si accende SOLO durante la videodiagnosi (lo decide la pagina con
 * ascolta/smettiDiAscoltare). Fuori da lì i tasti tornano a fare il volume: un
 * app che si tiene i tasti del volume per sempre è un'app che dà fastidio.
 */
@CapacitorPlugin(name = "TastiVolume")
public class TastiVolumePlugin extends Plugin {

    private boolean inAscolto = false;

    @PluginMethod
    public void ascolta(PluginCall call) {
        inAscolto = true;
        call.resolve();
    }

    @PluginMethod
    public void smettiDiAscoltare(PluginCall call) {
        inAscolto = false;
        call.resolve();
    }

    /**
     * Vero mentre la videodiagnosi è in corso. MainActivity lo chiede prima di
     * decidere se tenersi la pressione o passarla al sistema: se è vero, la
     * pressione E il rilascio vanno consumati entrambi, altrimenti Android
     * cambia il volume lo stesso e fa comparire la sua barretta.
     */
    boolean staAscoltando() {
        return inAscolto;
    }

    /** Dice alla pagina web di analizzare quello che si sta inquadrando. */
    void notificaPressione() {
        notifyListeners("premuto", new JSObject());
    }
}
