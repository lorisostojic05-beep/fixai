// AcquistiPlugin.swift
// Il pagamento Apple della diagnosi da 9,90 €, con StoreKit 2.
//
// Su iPhone la diagnosi non si puo' vendere con Stripe: e' un servizio
// digitale usato dentro l'app, e Apple richiede il suo sistema di pagamento.
// Le riparazioni invece restano su Stripe, perche' sono un servizio fisico
// svolto fuori dall'app.
//
// Il plugin fa solo la parte che deve stare sul telefono: mostrare la
// finestra di Apple e restituire il numero della transazione. Se il pagamento
// e' valido lo decide il server, chiedendolo ad Apple (lib/verifica-apple.js).
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  LA TRANSAZIONE SI CHIUDE SOLO DOPO IL SERVER                             │
// │                                                                           │
// │  compra() NON chiama finish(). Lo fa concludi(), che la pagina chiama     │
// │  solo quando /api/acquisto-apple ha risposto ok. Finche' una transazione  │
// │  resta aperta, Apple la riconsegna a ogni avvio (inSospeso): e' cosi'     │
// │  che un cliente che ha pagato e a cui si e' spento il telefono non perde  │
// │  i suoi 9,90 €.                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
//
// Registrato in ViewControllerFixi.swift: da Capacitor 6 i plugin scritti
// dentro l'app non si trovano da soli.

import Foundation
import Capacitor
import StoreKit

@objc(AcquistiPlugin)
public class AcquistiPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "AcquistiPlugin"
    public let jsName = "Acquisti"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "prodotto", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "compra", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "concludi", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "inSospeso", returnType: CAPPluginReturnPromise)
    ]

    /// Il prezzo come lo scrive Apple per quel paese ("9,90 €"). La pagina lo
    /// mostra sul pulsante: Apple rifiuta le app che dichiarano un prezzo
    /// diverso da quello che poi fanno pagare.
    @objc func prodotto(_ call: CAPPluginCall) {
        guard let id = call.getString("id") else {
            call.reject("Manca l'identificativo del prodotto", "ARGOMENTI")
            return
        }
        Task {
            do {
                guard let prodotto = try await Product.products(for: [id]).first else {
                    call.reject("Prodotto non trovato su App Store: \(id)", "NON_TROVATO")
                    return
                }
                call.resolve(["id": prodotto.id, "prezzo": prodotto.displayPrice])
            } catch {
                call.reject(error.localizedDescription, "STOREKIT")
            }
        }
    }

    /// Apre la finestra di pagamento di Apple. Risolve sempre con uno stato:
    /// "acquistato" (con transactionId), "annullato" o "in_attesa". Rifiuta
    /// solo per un guasto vero.
    @objc func compra(_ call: CAPPluginCall) {
        guard let id = call.getString("id") else {
            call.reject("Manca l'identificativo del prodotto", "ARGOMENTI")
            return
        }
        Task {
            do {
                guard let prodotto = try await Product.products(for: [id]).first else {
                    call.reject("Prodotto non trovato su App Store: \(id)", "NON_TROVATO")
                    return
                }
                let esito = try await prodotto.purchase()
                switch esito {
                case .success(let verifica):
                    switch verifica {
                    case .verified(let transazione):
                        call.resolve(["stato": "acquistato", "transactionId": String(transazione.id)])
                    case .unverified(_, let errore):
                        call.reject("Acquisto non verificato da Apple: \(errore.localizedDescription)", "NON_VERIFICATO")
                    }
                case .userCancelled:
                    call.resolve(["stato": "annullato"])
                case .pending:
                    // "Chiedi di acquistare" in famiglia, o una conferma della
                    // banca: arrivera' piu' tardi, e inSospeso() la raccogliera'.
                    call.resolve(["stato": "in_attesa"])
                @unknown default:
                    call.reject("Esito del pagamento sconosciuto", "SCONOSCIUTO")
                }
            } catch {
                call.reject(error.localizedDescription, "STOREKIT")
            }
        }
    }

    /// Chiude la transazione con Apple. Da chiamare SOLO dopo che il server
    /// l'ha registrata: vedi il riquadro in cima.
    @objc func concludi(_ call: CAPPluginCall) {
        guard let testo = call.getString("transactionId"), let numero = UInt64(testo) else {
            call.reject("Identificativo della transazione non valido", "ARGOMENTI")
            return
        }
        Task {
            for await risultato in StoreKit.Transaction.unfinished {
                if case .verified(let transazione) = risultato, transazione.id == numero {
                    await transazione.finish()
                    call.resolve(["concluso": true])
                    return
                }
            }
            // Gia' chiusa, o mai esistita su questo telefono: non e' un errore.
            call.resolve(["concluso": false])
        }
    }

    /// Le transazioni pagate e non ancora chiuse: i pagamenti rimasti a meta'
    /// la volta prima. La pagina le rimanda al server all'avvio.
    @objc func inSospeso(_ call: CAPPluginCall) {
        Task {
            var numeri: [String] = []
            for await risultato in StoreKit.Transaction.unfinished {
                if case .verified(let transazione) = risultato {
                    numeri.append(String(transazione.id))
                }
            }
            call.resolve(["transazioni": numeri])
        }
    }
}
