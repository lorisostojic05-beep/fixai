// ViewControllerFixi.swift
// Dove l'app iPhone presenta a Capacitor i plugin scritti per Fixi.
//
// I plugin che arrivano da npm (Filesystem, Share, riconoscimento vocale) si
// registrano da soli. Quelli scritti dentro l'app no: da Capacitor 6 vanno
// presentati a mano, qui. Main.storyboard usa questa classe al posto di
// CAPBridgeViewController — se un giorno si rigenera il progetto iOS, quella
// riga va rimessa, se no il plugin Acquisti sparisce e il pulsante di
// pagamento dice "non disponibile".

import UIKit
import Capacitor

class ViewControllerFixi: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(AcquistiPlugin())
    }
}
