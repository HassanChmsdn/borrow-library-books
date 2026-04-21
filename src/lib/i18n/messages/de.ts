export const deMessages = {
  ui: {
    appName: "Bibliotheksbücher ausleihen",
    publicLibraryName: "Gemeindebibliothek",
    adminConsoleName: "Admin-Konsole",
    languageSwitcher: {
      label: "Sprache",
      selectLabel: "Sprache auswählen",
      locales: {
        ar: "العربية",
        de: "Deutsch",
      },
    },
  },
  templates: {
    catalog: {
      booksFound: "{count} {itemLabel} gefunden{categorySuffix}.",
      inCategory: " in {category}",
      singular: "Buch",
      plural: "Bücher",
    },
    borrowings: {
      sectionItems: "{count} {itemLabel} in diesem Bereich.",
      singular: "Eintrag",
      plural: "Einträge",
    },
  },
  literals: {
    common: {
      Admin: "Admin",
      Primary: "Primär",
      "Open navigation": "Navigation öffnen",
      "Close navigation": "Navigation schließen",
      "Book fee": "Buchgebühr",
      "Borrow Library Books": "Bibliotheksbücher ausleihen",
      "Community Library": "Gemeindebibliothek",
      "Admin Console": "Admin-Konsole",
      "Member sign in": "Mitglied anmelden",
      "Admin console": "Admin-Konsole",
      "My account": "Mein Konto",
      "Sign out": "Abmelden",
      "Reader Experience": "Leseransicht",
      "Catalog queue": "Katalogwarteschlange",
      "View profile": "Profil anzeigen",
      "Back to catalog": "Zurück zum Katalog",
      "Back to users": "Zurück zu Benutzern",
      "Dismiss": "Schließen",
      "Try again": "Erneut versuchen",
      "Search": "Suchen",
      "Cancel": "Abbrechen",
      "Confirm": "Bestätigen",
      "Name": "Name",
      "Authorized role": "Autorisierte Rolle",
      "Unknown staff member": "Unbekanntes Mitarbeitermitglied",
      "Staff account": "Mitarbeiterkonto",
      "Duration": "Dauer",
      "Dates": "Daten",
      "Reset filters": "Filter zurücksetzen",
      "Clear filters": "Filter löschen",
      "Clear search and role": "Suche und Rolle löschen",
      "Details": "Details",
      "Collection": "Bestand",
      "Search by title or author...": "Nach Titel oder Autor suchen...",
      "Search books by title or author": "Bücher nach Titel oder Autor suchen",
      "Sort by": "Sortieren nach",
      "All": "Alle",
      "Status": "Status",
      "Free": "Kostenlos",
      "Free pick": "Kostenlose Ausleihe",
      "Unavailable": "Nicht verfügbar",
      "Available": "Verfügbar",
      "Low stock": "Niedriger Bestand",
      "Out of stock": "Nicht vorrätig",
      "Active": "Aktiv",
      "Pending": "Ausstehend",
      "Returned": "Zurückgegeben",
      "Overdue": "Überfällig",
      "Pending review": "Prüfung ausstehend",
      "Due soon": "Bald fällig",
      "Ready for pickup": "Zur Abholung bereit",
      "Saved for later": "Für später gespeichert",
      "Checked out": "Ausgeliehen",
      "Review borrowings": "Ausleihen prüfen",
      "Open inventory": "Inventar öffnen",
      "Open books management": "Buchverwaltung öffnen",
      "Open borrowings": "Ausleihen öffnen",
      "No data available": "Keine Daten verfügbar"
    },
    auth: {
      "Restricted Access": "Eingeschränkter Zugriff",
      "Staff sign in": "Mitarbeiter-Anmeldung",
      "Continue with an authorized staff identity to open the operations workspace and protected management routes.": "Melden Sie sich mit einer autorisierten Mitarbeiteridentität an, um den Arbeitsbereich und geschützte Verwaltungsrouten zu öffnen.",
      "Admin workspace access": "Zugriff auf den Admin-Arbeitsbereich",
      "Authentication is completed on the secure Auth0 page. Only users with an authorized staff role can enter this workspace.": "Die Anmeldung wird auf der sicheren Auth0-Seite abgeschlossen. Nur Benutzer mit einer autorisierten Mitarbeiterrolle können diesen Arbeitsbereich betreten.",
      "Requested destination": "Angefordertes Ziel",
      "If you are redirected here from a protected admin route, sign in with the staff account that should access that destination.": "Wenn Sie von einer geschützten Admin-Route hierher weitergeleitet wurden, melden Sie sich mit dem Mitarbeiterkonto an, das auf dieses Ziel zugreifen darf.",
      "Continue to admin login": "Weiter zur Admin-Anmeldung",
      "Admin authentication is unavailable until Auth0 is configured for this environment.": "Die Admin-Authentifizierung ist erst verfügbar, wenn Auth0 für diese Umgebung konfiguriert wurde.",
      "Authentication": "Authentifizierung",
      "Choose whether you want to sign in or start a new member registration, then continue on the secure Auth0 page for the actual authentication step.": "Wählen Sie, ob Sie sich anmelden oder eine neue Mitgliedsregistrierung starten möchten, und fahren Sie dann auf der sicheren Auth0-Seite mit dem eigentlichen Anmeldeschritt fort.",
      "Sign in to borrow": "Zum Ausleihen anmelden",
      "Create a member account": "Mitgliedskonto erstellen",
      "Login": "Anmelden",
      "Register": "Registrieren",
      "Continue on the secure Auth0 page to enter your credentials and complete member sign-in.": "Fahren Sie auf der sicheren Auth0-Seite fort, um Ihre Zugangsdaten einzugeben und die Mitgliederanmeldung abzuschließen.",
      "Share the member name you want attached to the account, then finish registration on the secure Auth0 page.": "Geben Sie den Namen an, der mit dem Konto verknüpft werden soll, und schließen Sie dann die Registrierung auf der sicheren Auth0-Seite ab.",
      "After Auth0 completes, you will return to {redirectTo}.": "Nach Abschluss bei Auth0 kehren Sie zu {redirectTo} zurück.",
      "Auth0 must be configured before members can continue through the shared sign-in experience.": "Auth0 muss konfiguriert sein, bevor Mitglieder mit dem gemeinsamen Anmeldeablauf fortfahren können.",
      "Full name": "Vollständiger Name",
      "Enter the full name you want ready for post-signup profile completion.": "Geben Sie den vollständigen Namen ein, der nach der Registrierung für das Profil bereitstehen soll.",
      "We keep this name in the app flow so the member record can be created cleanly after Auth0 finishes signup.": "Wir speichern diesen Namen im App-Ablauf, damit der Mitgliedseintrag nach Abschluss der Auth0-Registrierung sauber erstellt werden kann.",
      "Secure authentication": "Sichere Authentifizierung",
      "Credentials and any enabled social sign-in options are handled on the Auth0-hosted page.": "Anmeldedaten und aktivierte Social-Login-Optionen werden auf der von Auth0 gehosteten Seite verarbeitet.",
      "Password setup, verification, and any enabled social signup options are completed on the Auth0-hosted page.": "Passwortvergabe, Verifizierung und aktivierte Social-Signup-Optionen werden auf der von Auth0 gehosteten Seite abgeschlossen.",
      "Continue to login": "Weiter zur Anmeldung",
      "Redirecting to register...": "Weiterleitung zur Registrierung...",
      "Continue to register": "Weiter zur Registrierung",
      "Keep browsing": "Weiter stöbern",
      "Member authentication is unavailable until Auth0 is configured for this environment.": "Die Mitgliederauthentifizierung ist erst verfügbar, wenn Auth0 für diese Umgebung konfiguriert wurde.",
      "Auth0 is not configured for this environment yet.": "Auth0 ist für diese Umgebung noch nicht konfiguriert."
    },
    public: {
      "All Books": "Alle Bücher",
      Featured: "Empfohlen",
      "Title A-Z": "Titel A-Z",
      "Author A-Z": "Autor A-Z",
      Availability: "Verfügbarkeit",
      Fee: "Gebühr",
      Category: "Kategorie",
      "Borrow fee": "Ausleihgebühr",
      Description: "Beschreibung",
      "Borrowing details": "Ausleihdetails",
      "Borrow duration": "Ausleihdauer",
      "Borrow action": "Ausleihaktion",
      "Selected duration": "Ausgewählte Dauer",
      "Fee due onsite": "Vor Ort fällige Gebühr",
      "Copy assignment": "Exemplarzuweisung",
      "First available copy": "Erstes verfügbares Exemplar",
      "Onsite cash payment only": "Nur Barzahlung vor Ort",
      "Currently unavailable": "Derzeit nicht verfügbar",
      "View My Borrowings": "Meine Ausleihen anzeigen",
      "Ready to borrow": "Bereit zur Ausleihe",
      "Waitlist only": "Nur Warteliste",
      "Preparing catalog cards and filters.": "Katalogkarten und Filter werden vorbereitet.",
      "Sort all books": "Alle Bücher sortieren",
      "Browse more books": "Weitere Bücher durchsuchen",
      "Registration details saved": "Registrierungsdaten gespeichert",
      Welcome: "Willkommen",
      "Payment note": "Zahlungshinweis",
      "borrowing records": "Ausleiheinträge",
      records: "Einträge",
      item: "Eintrag",
      items: "Einträge",
      "View book": "Buch anzeigen",
      Book: "Buch",
      Payment: "Zahlung",
      Action: "Aktion",
      "Due / Pickup": "Fällig / Abholung",
      "Payment status": "Zahlungsstatus",
      "No payment due": "Keine Zahlung fällig",
      "Cash due on pickup": "Barzahlung bei Abholung fällig",
      "Paid onsite": "Vor Ort bezahlt",
      "Cash due onsite": "Barzahlung vor Ort fällig",
      "Fees are settled onsite in cash only when pickup or return requires payment.": "Gebühren werden nur vor Ort in bar beglichen, wenn bei Abholung oder Rückgabe eine Zahlung erforderlich ist.",
      "Your Auth0 signup is complete, and this name is now ready for your local member profile.": "Ihre Auth0-Registrierung ist abgeschlossen, und dieser Name ist jetzt für Ihr lokales Mitgliederprofil vorbereitet.",
      "Due and pickup timing stays visible in both mobile cards and the desktop table.": "Fälligkeits- und Abholzeiten bleiben sowohl in den mobilen Karten als auch in der Desktop-Tabelle sichtbar.",
      "Borrowing records": "Ausleiheinträge",
      "Loading the current account view.": "Die aktuelle Kontenansicht wird geladen.",
      "Requested on": "Angefragt am",
      "Due on": "Fällig am",
      "Pickup by": "Abholung bis",
      "Custom duration request": "Anfrage für benutzerdefinierte Dauer",
      "Request a custom number of days": "Benutzerdefinierte Anzahl von Tagen anfragen",
      "Custom requests are unavailable for this title": "Benutzerdefinierte Anfragen sind für diesen Titel nicht verfügbar",
      "Leave blank to use the predefined option above. The first available copy is assigned automatically.": "Lassen Sie das Feld leer, um die vordefinierte Option oben zu verwenden. Das erste verfügbare Exemplar wird automatisch zugewiesen.",
      "This title uses predefined borrowing durations only.": "Für diesen Titel sind nur vordefinierte Ausleihdauern verfügbar.",
      "Bring the exact amount when collecting your book. Online checkout and card payments are not available yet.": "Bringen Sie bei der Abholung Ihres Buchs den passenden Betrag mit. Online-Checkout und Kartenzahlungen sind noch nicht verfügbar.",
      "Custom duration requests are not available for this title.": "Benutzerdefinierte Dauern sind für diesen Titel nicht verfügbar.",
      "Enter the number of days you want to request before submitting a custom duration.": "Geben Sie die gewünschte Anzahl von Tagen ein, bevor Sie eine benutzerdefinierte Dauer absenden.",
      "Creating request...": "Anfrage wird erstellt...",
      "Submitting request...": "Anfrage wird gesendet...",
      "Custom duration unavailable": "Benutzerdefinierte Dauer nicht verfügbar",
      "Book Details": "Buchdetails",
      "The selected book could not be found in the local mock catalog.": "Das ausgewählte Buch konnte im lokalen Beispielkatalog nicht gefunden werden.",
      "Browse Books": "Bücher durchsuchen",
      Email: "E-Mail",
      Phone: "Telefon",
      "Membership location": "Mitgliedsstandort",
      Notifications: "Benachrichtigungen",
      "Borrowing preferences": "Ausleihpräferenzen",
      "Account security": "Kontosicherheit",
      "Onsite cash payments only": "Nur Barzahlungen vor Ort",
      "Staff-assisted updates": "Mitarbeiterunterstützte Änderungen",
      "Reopen the member profile once local account data is available again. The empty state is kept simple so it can evolve safely before backend wiring.": "Öffnen Sie das Mitgliederprofil erneut, sobald lokale Kontodaten wieder verfügbar sind. Der Leerstaat bleibt bewusst einfach, damit er sich vor der Backend-Anbindung sicher weiterentwickeln kann.",
      "Member Sign In": "Mitglieder-Anmeldung",
      "We couldn't load the catalog": "Der Katalog konnte nicht geladen werden",
      "The mock catalog could not be rendered. Retry the page and, if it persists, inspect the local module data before wiring a backend.": "Der Beispielkatalog konnte nicht dargestellt werden. Laden Sie die Seite erneut, und prüfen Sie bei weiter bestehendem Problem die lokalen Moduldaten, bevor ein Backend angebunden wird.",
      "Public view unavailable": "Öffentliche Ansicht nicht verfügbar",
      "A route-level error interrupted this member-facing screen. You can retry the page or return to the public catalog.": "Ein Fehler auf Routenebene hat diese Mitgliederansicht unterbrochen. Sie können die Seite erneut laden oder zum öffentlichen Katalog zurückkehren.",
      "We couldn't load this page": "Diese Seite konnte nicht geladen werden",
      "Try again now. If the problem persists, return to the public catalog and reopen the affected page.": "Versuchen Sie es jetzt erneut. Wenn das Problem bestehen bleibt, kehren Sie zum öffentlichen Katalog zurück und öffnen Sie die betroffene Seite erneut.",
      "Discover and borrow from the full library catalog. Search, refine, and scan availability at a glance with the same mobile-first spacing and tokens used throughout the shell.": "Entdecken und leihen Sie aus dem vollständigen Bibliothekskatalog aus. Suchen, filtern und prüfen Sie die Verfügbarkeit auf einen Blick mit demselben mobilfreundlichen Layout und denselben Tokens wie im restlichen System.",
      "Try a different title, author, or category filter to bring matching catalog records back into view.": "Probieren Sie einen anderen Titel-, Autor- oder Kategoriefilter aus, um passende Katalogeinträge wieder anzuzeigen.",
      "No books match your filters": "Keine Bücher passen zu Ihren Filtern",
      "Reset catalog filters": "Katalogfilter zurücksetzen",
      "Catalog": "Katalog",
      "Discover and borrow from the full library catalog.": "Entdecken und leihen Sie aus dem vollständigen Bibliothekskatalog aus.",
      "Review availability, borrowing duration options, and onsite fee policy before placing a borrowing request.": "Prüfen Sie Verfügbarkeit, Ausleihdauern und die Gebührenregelung vor Ort, bevor Sie eine Ausleihanfrage stellen.",
      "Borrow this book": "Dieses Buch ausleihen",
      "Switch to member to borrow": "Für die Ausleihe zu Mitglied wechseln",
      "Sign in to borrow": "Zum Ausleihen anmelden",
      "Request custom duration": "Benutzerdefinierte Dauer anfragen",
      "Switch to member for custom duration": "Für benutzerdefinierte Dauer zu Mitglied wechseln",
      "Sign in for custom duration": "Für benutzerdefinierte Dauer anmelden",
      "Borrowing actions require a member session. Guests can keep browsing publicly and sign in only when they are ready to borrow.": "Ausleihaktionen erfordern eine Mitgliedssitzung. Gäste können öffentlich weiter stöbern und sich erst anmelden, wenn sie ausleihen möchten.",
      "Mock admin sessions cannot borrow titles directly. Switch to a member session to continue into the borrowing flow.": "Admin-Sitzungen können Titel nicht direkt ausleihen. Wechseln Sie zu einer Mitgliedssitzung, um mit dem Ausleihvorgang fortzufahren.",
      "Borrow requests are created from this page and the first available physical copy is assigned automatically. My Borrowings remains the member list and status page.": "Ausleihanfragen werden auf dieser Seite erstellt und das erste verfügbare physische Exemplar wird automatisch zugewiesen. Meine Ausleihen bleibt die Mitgliederliste und Statusseite.",
      "7 days": "7 Tage",
      "14 days": "14 Tage",
      "21 days": "21 Tage",
      "Short hold": "Kurze Leihe",
      "Standard": "Standard",
      "Extended": "Erweitert",
      "Account": "Konto",
      "My Borrowings": "Meine Ausleihen",
      "Track current loans, pending requests, desk pickups, and overdue items in the authenticated member account view.": "Verfolgen Sie aktuelle Ausleihen, offene Anfragen, Abholungen am Schalter und überfällige Titel in der authentifizierten Mitgliederansicht.",
      "Preparing your borrowing history, statuses, and payment notes.": "Ihre Ausleihhistorie, Statusangaben und Zahlungsnotizen werden vorbereitet.",
      "No active borrowings": "Keine aktiven Ausleihen",
      "No pending requests": "Keine offenen Anfragen",
      "No returned books yet": "Noch keine zurückgegebenen Bücher",
      "No overdue books": "Keine überfälligen Bücher",
      "Books currently on loan, including items due soon.": "Aktuell ausgeliehene Bücher, einschließlich bald fälliger Titel.",
      "Requests waiting for review or desk pickup confirmation.": "Anfragen, die auf Prüfung oder Abholbestätigung am Schalter warten.",
      "Recently completed loans and their payment outcomes.": "Kürzlich abgeschlossene Ausleihen und ihre Zahlungsergebnisse.",
      "Items that need attention before the next renewal cycle.": "Titel, die vor dem nächsten Verlängerungszyklus Aufmerksamkeit benötigen.",
      "You do not have any currently checked out books in the current account view.": "In der aktuellen Kontenansicht haben Sie derzeit keine ausgeliehenen Bücher.",
      "New borrowing requests and desk holds will appear here once they are created.": "Neue Ausleihanfragen und Reservierungen am Schalter erscheinen hier, sobald sie erstellt wurden.",
      "Completed borrowings will appear here once there is account history beyond the current sample records.": "Abgeschlossene Ausleihen erscheinen hier, sobald Kontohistorie über die aktuellen Beispieldaten hinaus vorhanden ist.",
      "Any overdue titles will appear here with the next due date and cash payment guidance where needed.": "Überfällige Titel erscheinen hier mit dem nächsten Fälligkeitsdatum und ggf. Hinweisen zur Barzahlung.",
      "Profile": "Profil",
      "Browse books": "Bücher durchsuchen",
      "Review personal details, account information, and borrowing preferences in the member shell.": "Prüfen Sie persönliche Daten, Kontoinformationen und Ausleihpräferenzen in der Mitgliederansicht.",
      "Profile unavailable in mock data": "Profil in Beispieldaten nicht verfügbar",
      "The member profile could not be loaded from the local mock data set.": "Das Mitgliederprofil konnte nicht aus dem lokalen Beispieldatensatz geladen werden.",
      "Preparing personal details, borrowing summaries, and member settings.": "Persönliche Daten, Ausleihübersichten und Mitgliedseinstellungen werden vorbereitet.",
      "Settings": "Einstellungen",
      "Account details": "Kontodetails",
      "Account support": "Kontounterstützung",
      "Choose a standard duration or request a custom number of days for staff review.": "Wählen Sie eine Standarddauer oder fragen Sie eine benutzerdefinierte Anzahl von Tagen zur Prüfung durch das Personal an.",
      "Predefined durations keep the selection quick on mobile while still scaling to larger screens.": "Vordefinierte Dauern halten die Auswahl mobil schnell und skalieren dennoch auf größere Bildschirme.",
      "Payment is collected onsite in cash only when the book is picked up from the library desk.": "Die Zahlung wird nur vor Ort in bar erhoben, wenn das Buch am Bibliotheksschalter abgeholt wird.",
      "Book not available in the mock catalog": "Buch im Beispielkatalog nicht verfügbar",
      "Try another book from the catalog grid. This state is rendered locally so it can be iterated on safely before any backend wiring exists.": "Versuchen Sie ein anderes Buch aus dem Katalograster. Dieser Zustand wird lokal gerendert, damit er vor jeder Backend-Anbindung sicher weiterentwickelt werden kann.",
      "Preparing the selected title, borrowing options, and payment guidance.": "Der ausgewählte Titel, Ausleihoptionen und Zahlungshinweise werden vorbereitet.",
      "Browse available books": "Verfügbare Bücher durchsuchen",
      "Borrowing fees are settled onsite in cash only when a title is picked up or returned with outstanding dues.": "Ausleihgebühren werden nur dann vor Ort in bar beglichen, wenn ein Titel mit offenen Gebühren abgeholt oder zurückgegeben wird.",
      "A clean, mobile-first settings layout for future self-service flows. The current values are ready for progressive account wiring.": "Ein klares, mobilfreundliches Einstellungslayout für spätere Self-Service-Abläufe. Die aktuellen Werte sind für eine schrittweise Kontoanbindung vorbereitet.",
      "Keep reminders concise and mobile-friendly across email and text messages.": "Halten Sie Erinnerungen per E-Mail und SMS kompakt und mobilfreundlich.",
      "Due date reminders": "Fälligkeitserinnerungen",
      "Sent two days before a book is due and again the morning of the due date.": "Wird zwei Tage vor der Fälligkeit eines Buches und erneut am Morgen des Fälligkeitstags gesendet.",
      "Email and SMS": "E-Mail und SMS",
      "Edit reminders": "Erinnerungen bearbeiten",
      "Pickup alerts": "Abholbenachrichtigungen",
      "Triggered when a reserved title is ready at the desk or its hold window is about to expire.": "Wird ausgelöst, wenn ein reservierter Titel am Schalter bereitliegt oder sein Abholfenster bald abläuft.",
      "Enabled": "Aktiviert",
      "Update alerts": "Benachrichtigungen aktualisieren",
      "Desk and duration preferences stay visible here before any real account editing is connected.": "Schalter- und Dauerpräferenzen bleiben hier sichtbar, bevor echte Kontobearbeitung angebunden ist.",
      "Default pickup branch": "Standard-Abholstelle",
      "New reservations are routed to the member's preferred branch by default.": "Neue Reservierungen werden standardmäßig an die bevorzugte Zweigstelle des Mitglieds geleitet.",
      "Main library desk": "Hauptbibliotheksschalter",
      "Change branch": "Zweigstelle ändern",
      "Custom duration requests": "Anfragen für benutzerdefinierte Dauer",
      "Staff review is required for requests longer than the standard borrowing window.": "Für Anfragen, die länger als das Standard-Ausleihfenster sind, ist eine Personalprüfung erforderlich.",
      "Request at checkout": "Bei der Ausleihe anfragen",
      "View policy": "Richtlinie anzeigen",
      "A clean placeholder for the future self-service settings flow.": "Ein klarer Platzhalter für den künftigen Self-Service-Einstellungsablauf.",
      "Password and sign-in": "Passwort und Anmeldung",
      "Identity is currently managed through the authentication provider and staff-assisted workflows.": "Die Identität wird derzeit über den Authentifizierungsanbieter und personalgestützte Abläufe verwaltet.",
      "Managed account": "Verwaltetes Konto",
      "Security info": "Sicherheitsinfo",
      "Library card": "Bibliotheksausweis",
      "Member since": "Mitglied seit",
      "Preferred pickup branch": "Bevorzugte Abholstelle",
      "Membership tier": "Mitgliedschaftsstufe",
      "Borrowing window": "Ausleihfenster",
      "14 days standard": "14 Tage Standard",
      "Payment policy": "Zahlungsrichtlinie",
      "Active loans": "Aktive Ausleihen",
      "Titles currently checked out on the member account.": "Titel, die derzeit auf dem Mitgliedskonto ausgeliehen sind.",
      "Pending pickups": "Ausstehende Abholungen",
      "Reserved books waiting at the library desk.": "Reservierte Bücher, die am Bibliotheksschalter bereitliegen.",
      "Overdue items": "Überfällige Titel",
      "Loans that need attention before the next visit.": "Ausleihen, die vor dem nächsten Besuch Aufmerksamkeit benötigen.",
      "Onsite cash due": "Vor Ort fällige Barzahlung",
      "Fees collected onsite only when the member visits.": "Gebühren werden nur vor Ort erhoben, wenn das Mitglied die Bibliothek besucht.",
      "Active member": "Aktives Mitglied",
      "Suspended account": "Gesperrtes Konto",
      "Main library membership": "Mitgliedschaft Hauptbibliothek",
      "Staff assisted": "Durch Personal betreut",
      "A clear reference for branch preferences, payment policy, and member metadata.": "Eine klare Übersicht über Zweigstellenpräferenzen, Zahlungsrichtlinie und Mitgliedsdaten.",
      "Guidance that stays visible on mobile without adding decorative complexity.": "Hinweise, die auf Mobilgeräten sichtbar bleiben, ohne dekorative Komplexität hinzuzufügen.",
      "Fee-bearing borrowings are paid in person at pickup or return. Online payment is intentionally out of scope for this mock phase.": "Gebührenpflichtige Ausleihen werden bei Abholung oder Rückgabe persönlich bezahlt. Online-Zahlungen sind in dieser Mock-Phase bewusst nicht vorgesehen.",
      "Member profile edits are represented here visually first. Real editing flows can attach to this layout later without redesigning the shell.": "Änderungen am Mitgliederprofil werden hier zunächst visuell dargestellt. Echte Bearbeitungsabläufe können später an dieses Layout angebunden werden, ohne die Hülle neu zu gestalten.",
      "Library member account synchronized from the application user store.": "Mitgliedskonto aus dem Anwendungs-Benutzerspeicher synchronisiert.",
      "Library member": "Bibliotheksmitglied",
      "Science": "Wissenschaft",
      "Technology": "Technologie",
      "History": "Geschichte",
      "Philosophy": "Philosophie",
      "Business": "Wirtschaft",
      "Travel": "Reisen",
      "Fiction": "Belletristik",
      "Art & Design": "Kunst und Design",
      "{available}/{total} available": "{available}/{total} verfügbar"
    },
    admin: {
      "Library Admin": "Bibliotheksverwaltung",
      "Operations Workspace": "Arbeitsbereich",
      "A shared admin frame for dashboard, catalog, borrowing, inventory, category, and member management modules built on the existing token and shell system.": "Ein gemeinsamer Admin-Rahmen für Dashboard-, Katalog-, Ausleih-, Inventar-, Kategorie- und Mitgliedsverwaltungsmodule auf Basis des bestehenden Token- und Shell-Systems.",
      "Shift lead account": "Schichtleitungs-Konto",
      "is covering catalog, circulation, and member operations this afternoon.": "betreut heute Nachmittag Katalog, Ausleihe und Mitgliederbetrieb.",
      "Mock-data admin workspace. Backend integration is intentionally deferred.": "Admin-Arbeitsbereich mit Beispieldaten. Die Backend-Integration ist bewusst zurückgestellt.",
      "Workspace": "Arbeitsbereich",
      "Organization": "Organisation",
      "Governance": "Governance",
      "Dashboard": "Dashboard",
      "Daily operations summary, alerts, and branch pulse.": "Tagesübersicht des Betriebs, Hinweise und Filialstatus.",
      "Borrowings": "Ausleihen",
      "Review holds, renewals, due-soon items, and returns.": "Reservierungen, Verlängerungen, bald fällige Titel und Rückgaben prüfen.",
      "Books": "Bücher",
      "Manage catalog records, shelf details, and fees.": "Katalogeinträge, Regaldetails und Gebühren verwalten.",
      "Inventory": "Inventar",
      "Track stock health, branch balances, and restock plans.": "Bestandszustand, Filialverteilung und Nachbestandspläne verfolgen.",
      "Categories": "Kategorien",
      "Shape collection mix, shelves, and demand by category.": "Bestandsmix, Regale und Nachfrage nach Kategorien steuern.",
      "Users": "Benutzer",
      "Monitor members, balances, and engagement activity.": "Mitglieder, Salden und Aktivität überwachen.",
      "Financial": "Finanzen",
      "Review fee intake, reconciliations, and cashier workflows.": "Gebühreneinnahmen, Abstimmungen und Kassenabläufe prüfen.",
      "Access Control": "Zugriffssteuerung",
      "Inspect role defaults and prepare targeted access overrides.": "Rollenstandards prüfen und gezielte Zugriffsüberschreibungen vorbereiten.",
      "Library operations dashboard": "Dashboard des Bibliotheksbetriebs",
      "A production-oriented overview of pending circulation work, active borrowing pressure, overdue follow-up, cash fee intake, and member activity.": "Eine produktionsnahe Übersicht über offene Ausleiharbeiten, aktuelle Ausleihlast, Nachverfolgung überfälliger Titel, Bareinnahmen aus Gebühren und Mitgliederaktivität.",
      "No dashboard data available": "Keine Dashboard-Daten verfügbar",
      "The dashboard is ready, but there is no operational mock data to summarize yet. Reconnect the derived dataset or seed new records to repopulate this overview.": "Das Dashboard ist bereit, aber es gibt noch keine Betriebsdaten zur Zusammenfassung. Verbinden Sie den abgeleiteten Datensatz erneut oder erzeugen Sie neue Einträge, um diese Übersicht wieder zu füllen.",
      "KPI cards, notices, trends, and recent activity will appear here once the admin data source contains operational records again.": "KPI-Karten, Hinweise, Trends und letzte Aktivitäten erscheinen hier, sobald die Admin-Datenquelle wieder Betriebsdaten enthält.",
      "User management": "Benutzerverwaltung",
      "Review member and staff roles, account health, and borrowing posture through a responsive roster built for future profile management flows.": "Prüfen Sie Mitglieder- und Mitarbeiterrollen, Kontostatus und Ausleihlage in einer responsiven Übersicht, die für künftige Profilverwaltungsabläufe vorbereitet ist.",
      "Add account": "Konto hinzufügen",
      "Account created": "Konto erstellt",
      "Library accounts": "Bibliothekskonten",
      "Search accounts": "Konten durchsuchen",
      "Search by name, email, or borrowing summary...": "Nach Name, E-Mail oder Ausleihübersicht suchen...",
      "Open profile": "Profil öffnen",
      "Profile pending": "Profil ausstehend",
      "No date recorded": "Kein Datum erfasst",
      "Member account": "Mitgliedskonto",
      "Desktop favors a dense roster table while mobile keeps the same hierarchy in stacked cards for quick review across member and staff accounts.": "Desktop zeigt eine dichte Übersichtstabelle, während Mobilgeräte dieselbe Hierarchie in gestapelten Karten für eine schnelle Prüfung von Mitglieder- und Mitarbeiterkonten beibehalten.",
      "No accounts are available yet": "Noch keine Konten verfügbar",
      "Once member and staff records are connected or imported, this roster will support role filtering, account review, and profile navigation.": "Sobald Mitglieder- und Mitarbeitereinträge verbunden oder importiert sind, unterstützt diese Übersicht Rollenfilter, Kontoprüfung und Profilnavigation.",
      "No accounts match the current filters": "Keine Konten passen zu den aktuellen Filtern",
      "Try another name, email, or role filter to bring matching staff and member accounts back into view.": "Probieren Sie einen anderen Namens-, E-Mail- oder Rollenfilter aus, um passende Mitarbeiter- und Mitgliederkonten wieder anzuzeigen.",
      "Loading account management surfaces.": "Oberflächen der Kontoverwaltung werden geladen.",
      "Book management": "Buchverwaltung",
      "Manage titles, copy availability, and borrowing fees in a dense but readable catalog workspace prepared for future backend workflows.": "Verwalten Sie Titel, Exemplarverfügbarkeit und Ausleihgebühren in einem dichten, aber gut lesbaren Katalog-Arbeitsbereich, der für künftige Backend-Abläufe vorbereitet ist.",
      "Library catalog": "Bibliothekskatalog",
      "A responsive management table for book records, borrowing fees, and copy availability.": "Eine responsive Verwaltungstabelle für Bucheinträge, Ausleihgebühren und Exemplarverfügbarkeit.",
      "Loading catalog management surfaces.": "Oberflächen der Katalogverwaltung werden geladen.",
      "Inventory management": "Inventarverwaltung",
      "Manage physical copies, copy condition, and circulation readiness in a dense but readable operations workspace.": "Verwalten Sie physische Exemplare, Exemplarzustand und Ausleihbereitschaft in einem dichten, aber gut lesbaren Arbeitsbereich.",
      "Physical copy roster": "Übersicht physischer Exemplare",
      "Desktop uses a dense copy table, while mobile falls back to stacked cards that preserve the same hierarchy for status and condition.": "Desktop verwendet eine dichte Exemplartabelle, während Mobilgeräte auf gestapelte Karten zurückfallen, die dieselbe Hierarchie für Status und Zustand beibehalten.",
      "No inventory copies yet": "Noch keine Inventarexemplare",
      "Add the first physical copy to start tracking copy condition, status, and circulation readiness.": "Fügen Sie das erste physische Exemplar hinzu, um Zustand, Status und Ausleihbereitschaft zu verfolgen.",
      "No copies match these filters": "Keine Exemplare passen zu diesen Filtern",
      "Try another copy code, title, author, or status filter to find the physical record you need.": "Probieren Sie einen anderen Exemplarcode-, Titel-, Autoren- oder Statusfilter aus, um den benötigten physischen Datensatz zu finden.",
      "Loading inventory management surfaces.": "Oberflächen der Inventarverwaltung werden geladen.",
      "Financial operations": "Finanzvorgänge",
      "Monitor borrowing-fee intake, unresolved cash exposure, and recent fee records in a shared admin workspace that can later connect to real payments and reporting pipelines.": "Überwachen Sie Einnahmen aus Ausleihgebühren, offene Bargeldrisiken und aktuelle Gebühreneinträge in einem gemeinsamen Admin-Arbeitsbereich, der später an echte Zahlungs- und Reporting-Pipelines angeschlossen werden kann.",
      "Recent borrowing fee records": "Aktuelle Ausleihgebühren-Einträge",
      "No fee records are available yet": "Noch keine Gebühreneinträge verfügbar",
      "Revenue summary": "Umsatzübersicht",
      "Collection posture": "Inkassostatus",
      "Loading fee tracking and finance review surfaces.": "Oberflächen für Gebührenverfolgung und Finanzprüfung werden geladen.",
      "Current account": "Aktuelles Konto",
      "Review the currently authenticated admin account, workspace scope, and recent operating activity.": "Prüfen Sie das aktuell authentifizierte Admin-Konto, den Arbeitsbereichsumfang und die jüngsten Betriebsaktivitäten.",
      "Profile summary": "Profilübersicht",
      "Account summary": "Kontozusammenfassung",
      "Recent workspace activity": "Letzte Arbeitsbereichsaktivität",
      "Profile unavailable": "Profil nicht verfügbar",
      "Loading the authenticated admin summary, account details, and recent workspace activity.": "Die authentifizierte Admin-Übersicht, Kontodetails und jüngsten Arbeitsbereichsaktivitäten werden geladen.",
      "Core account details and circulation posture for staff review.": "Zentrale Kontodetails und Ausleihstatus für die Prüfung durch Mitarbeitende.",
      "Borrowing overview": "Ausleihübersicht",
      "Total borrowings": "Gesamte Ausleihen",
      "Historical completed and active circulation records.": "Historische abgeschlossene und aktive Ausleiheinträge.",
      "Active now": "Derzeit aktiv",
      "Current active and pending circulation items on the account.": "Aktuell aktive und ausstehende Ausleihen auf diesem Konto.",
      "Requires staff follow-up before the account is cleared.": "Erfordert eine Nachverfolgung durch Mitarbeitende, bevor das Konto bereinigt werden kann.",
      "No overdue exposure is currently recorded.": "Derzeit sind keine überfälligen Vorgänge erfasst.",
      "Cash settled": "Bar bezahlt",
      "Custom duration": "Benutzerdefinierte Dauer",
      "No personal loans": "Keine persönlichen Ausleihen",
      "No borrowing activity yet": "Noch keine Ausleihaktivität",
      "Staff account used for admin operations": "Mitarbeiterkonto für Verwaltungsaufgaben",
      "Temporary password prepared for mocked onboarding": "Temporäres Passwort für simuliertes Onboarding vorbereitet",
      "{count} overdue case": "{count} überfälliger Fall",
      "{count} overdue cases": "{count} überfällige Fälle",
      "{active} active, {pending} pending": "{active} aktiv, {pending} ausstehend",
      "{count} pending request": "{count} ausstehende Anfrage",
      "{count} pending requests": "{count} ausstehende Anfragen",
      "{count} active loan": "{count} aktive Ausleihe",
      "{count} active loans": "{count} aktive Ausleihen",
      "{count} completed borrowing": "{count} abgeschlossene Ausleihe",
      "{count} completed borrowings": "{count} abgeschlossene Ausleihen",
      "{count} request awaiting approval": "{count} Anfrage wartet auf Freigabe",
      "{count} requests awaiting approval": "{count} Anfragen warten auf Freigabe",
      "Due {date}": "Fällig {date}",
      "Started {date}": "Gestartet {date}",
      "Requested {date}": "Angefragt {date}",
      "Returned {date}": "Zurückgegeben {date}",
      "Onboarding note: {note}": "Onboarding-Notiz: {note}",
      "{amount} cash": "{amount} bar",
      "{count} days": "{count} Tage",
      "Administrator": "Administrator",
      "Primary workspace": "Primärer Arbeitsbereich",
      "Managed areas": "Betreute Bereiche",
      "Mocked scope for the current authenticated admin session.": "Simulierter Zuständigkeitsbereich für die aktuelle authentifizierte Admin-Sitzung.",
      "Auth mode": "Authentifizierungsmodus",
      "Mocked admin access": "Simulierter Admin-Zugang",
      "Prepared to map later to Auth0 identity and Mongo-backed staff records.": "Vorbereitet für die spätere Zuordnung zu Auth0-Identität und Mongo-gestützten Mitarbeiterdatensätzen.",
      "Pending requests": "Ausstehende Anfragen",
      "Current pickup approvals and assignment requests waiting for staff action.": "Aktuelle Abholfreigaben und Zuweisungsanfragen, die auf Bearbeitung durch Mitarbeitende warten.",
      "Overdue follow-up": "Nachverfolgung überfälliger Fälle",
      "Accounts that still need circulation follow-up before they can be cleared.": "Konten, die vor der Freigabe noch Nachverfolgung im Ausleihbetrieb benötigen.",
      "Maintenance copies": "Wartungsexemplare",
      "Physical copies currently held back from circulation for repair or review.": "Physische Exemplare, die derzeit für Reparatur oder Prüfung aus der Ausleihe zurückgehalten werden.",
      "This mocked admin profile is scoped for future Auth0 identity and Mongo-backed staff preferences, while still surfacing the current workspace posture in a realistic way.": "Dieses simulierte Admin-Profil ist für künftige Auth0-Identitäten und Mongo-gestützte Mitarbeitereinstellungen vorbereitet und bildet zugleich den aktuellen Arbeitsbereich realistisch ab.",
      "Mocked admin profile data is active for this account and can later be replaced by Auth0 and Mongo-backed profile records.": "Für dieses Konto sind simulierte Admin-Profildaten aktiv; sie können später durch Auth0- und Mongo-gestützte Profil-Datensätze ersetzt werden.",
      "Pending request cluster reviewed": "Cluster ausstehender Anfragen geprüft",
      "Three pickup requests were routed into the midday approval queue, including one extended-duration science title.": "Drei Abholanfragen wurden in die Mittagsfreigabewarteschlange verschoben, darunter ein Wissenschaftstitel mit verlängerter Dauer.",
      "Design copy moved to maintenance": "Design-Exemplar in Wartung verschoben",
      "One copy of Ways of Seeing was marked for cover replacement before it can re-enter circulation.": "Ein Exemplar von Ways of Seeing wurde vor der Rückkehr in die Ausleihe für einen Coveraustausch markiert.",
      "Updated": "Aktualisiert",
      "Overdue account escalated": "Überfälliges Konto eskaliert",
      "Lina Saad was moved into suspension while overdue recovery and onsite cash settlement remain open.": "Lina Saad wurde gesperrt, während die Rückholung überfälliger Titel und die Barzahlung vor Ort noch offen sind.",
      "Needs review": "Prüfung erforderlich",
      "Cash settlement recorded on return": "Barzahlung bei Rückgabe erfasst",
      "Sara Chehab completed a return for A Brief History of Time and settled the onsite circulation fee.": "Sara Chehab hat A Brief History of Time zurückgegeben und die Ausleihgebühr vor Ort beglichen.",
      "Resolved": "Erledigt",
      "The authenticated admin profile could not be prepared from the current mocked session.": "Das authentifizierte Admin-Profil konnte aus der aktuellen simulierten Sitzung nicht erstellt werden.",
      "Try returning to the dashboard and reopening the profile page. The page is wired for future Auth0 and Mongo-backed account data, but it currently depends on the mocked admin session.": "Gehen Sie zurück zum Dashboard und öffnen Sie die Profilseite erneut. Die Seite ist für künftige Auth0- und Mongo-gestützte Kontodaten vorbereitet, hängt derzeit aber noch von der simulierten Admin-Sitzung ab.",
      "The signed-in operator below is authorized to manage role assignment and section access policy surfaces.": "Der unten angemeldete Benutzer ist berechtigt, Rollenzuweisungen und Oberflächen für Bereichszugriffsrichtlinien zu verwalten.",
      "Role defaults resolve first. User-specific section access is then applied as an optional override through access.sections, which keeps the model ready for persisted Mongo-backed authorization without changing the admin shell structure.": "Zuerst greifen die Rollenstandards. Benutzerspezifischer Bereichszugriff wird dann optional über access.sections überschrieben, sodass das Modell für persistente Mongo-gestützte Autorisierung bereit bleibt, ohne die Struktur der Admin-Oberfläche zu ändern.",
      "Role access policies": "Rollen-Zugriffsrichtlinien",
      "The current session cannot edit any role-level access-control defaults.": "Die aktuelle Sitzung kann keine rollenbasierten Standardwerte der Zugriffssteuerung bearbeiten.",
      "Review user-specific access only, or sign in with a session that has broader access-control authority.": "Prüfen Sie nur benutzerspezifische Zugriffe oder melden Sie sich mit einer Sitzung an, die weitergehende Rechte zur Zugriffssteuerung hat.",
      "User access management": "Benutzer-Zugriffsverwaltung",
      "No accounts are currently available for access management.": "Derzeit sind keine Konten für die Zugriffsverwaltung verfügbar.",
      "Assign roles to individual accounts and optionally layer user-specific section permissions on top of the selected role defaults.": "Weisen Sie einzelnen Konten Rollen zu und ergänzen Sie bei Bedarf benutzerspezifische Abschnittsrechte über die ausgewählten Rollenstandards.",
      "Current user": "Aktueller Benutzer",
      "Borrowing history": "Ausleihhistorie",
      "Current borrowings": "Aktuelle Ausleihen",
      "No borrowing history": "Keine Ausleihhistorie",
      "Publication metadata": "Publikationsmetadaten",
      "Capture optional publication context now so real API integration later has a typed surface for editor metadata and operational status.": "Erfassen Sie optionale Publikationsangaben jetzt, damit die spätere API-Integration eine typisierte Grundlage für Redaktionsmetadaten und Betriebsstatus hat.",
      "Publisher": "Verlag",
      "Publisher or imprint": "Verlag oder Imprint",
      "Leave blank when this metadata is not yet available from the catalog source.": "Leer lassen, wenn diese Metadaten aus der Katalogquelle noch nicht verfügbar sind.",
      "Publication year": "Erscheinungsjahr",
      "e.g. 2015": "z. B. 2015",
      "Use a four-digit year when known.": "Verwenden Sie ein vierstelliges Jahr, wenn es bekannt ist.",
      "Language": "Sprache",
      "Primary language": "Primärsprache",
      "Edition": "Ausgabe",
      "Edition or format": "Ausgabe oder Format",
      "Record status": "Datensatzstatus",
      "Inactive": "Inaktiv",
      "Inactive records remain in admin management but can later be hidden from public discovery.": "Inaktive Datensätze bleiben in der Admin-Verwaltung sichtbar, können aber später aus der öffentlichen Ansicht ausgeblendet werden.",
      "Account actions": "Kontoaktionen",
      "Existing account controls now run through the shared admin user-management flow.": "Bestehende Kontosteuerungen laufen jetzt über den gemeinsamen Admin-Benutzerverwaltungsfluss.",
      "Current role": "Aktuelle Rolle",
      "Current status": "Aktueller Status",
      "Suspended": "Gesperrt",
      "Suspend this user?": "Diesen Benutzer sperren?",
      "Suspend the selected account while preserving its linked identity record and borrowing history.": "Sperren Sie das ausgewählte Konto, während der verknüpfte Identitätseintrag und die Ausleihhistorie erhalten bleiben.",
      "Suspend user": "Benutzer sperren",
      "Reactivate user": "Benutzer reaktivieren",
      "Change account role?": "Kontorolle ändern?",
      "Select the application role that should be assigned to this account. Super-admin assignment remains restricted to explicitly authorized operators.": "Wählen Sie die Anwendungsrolle aus, die diesem Konto zugewiesen werden soll. Die Vergabe der Super-Admin-Rolle bleibt ausdrücklich autorisierten Benutzern vorbehalten.",
      "Save role": "Rolle speichern",
      "Change role": "Rolle ändern",
      "Assigned role": "Zugewiesene Rolle",
      "Suspend, reactivate, and role changes now use the shared admin user-management actions.": "Sperren, Reaktivieren und Rollenänderungen verwenden jetzt die gemeinsamen Admin-Benutzerverwaltungsaktionen.",
      "This account can be reviewed here, but the current session is not allowed to change its role or status.": "Dieses Konto kann hier geprüft werden, aber die aktuelle Sitzung darf Rolle oder Status nicht ändern.",
      "Add category": "Kategorie hinzufügen",
      "Edit category": "Kategorie bearbeiten",
      "Create a reusable category record for browse organization, admin filtering, and future CRUD-backed collection workflows.": "Erstellen Sie einen wiederverwendbaren Kategorieeintrag für Browse-Struktur, Admin-Filter und zukünftige CRUD-gestützte Bestandsabläufe.",
      "Update the category details while keeping the same admin card structure and typed data boundaries.": "Aktualisieren Sie die Kategoriedetails, während dieselbe Admin-Kartenstruktur und die typisierten Datengrenzen erhalten bleiben.",
      "Category name": "Kategoriename",
      "Use a short, public-facing label that also works cleanly in browse filters and admin tables.": "Verwenden Sie eine kurze, öffentlich sichtbare Bezeichnung, die auch in Browse-Filtern und Admin-Tabellen sauber funktioniert.",
      "Enter category name": "Kategorienamen eingeben",
      "Short description": "Kurzbeschreibung",
      "Optional. Add a short explanation for how this category is used across browse and admin management views.": "Optional. Fügen Sie eine kurze Erklärung hinzu, wie diese Kategorie in Browse- und Admin-Ansichten verwendet wird.",
      "Describe how this category is used across the catalog and admin management flows.": "Beschreiben Sie, wie diese Kategorie im Katalog und in den Admin-Verwaltungsabläufen verwendet wird.",
      "Saving category...": "Kategorie wird gespeichert...",
      "Updating category...": "Kategorie wird aktualisiert...",
      "Save category": "Kategorie speichern",
      "Save changes": "Änderungen speichern",
      "Add inventory copy": "Inventarexemplar hinzufügen",
      "Edit inventory copy": "Inventarexemplar bearbeiten",
      "Create a new physical copy record with future-ready fields for search, filtering, and CRUD integration.": "Erstellen Sie einen neuen physischen Exemplardatensatz mit zukunftsfähigen Feldern für Suche, Filterung und CRUD-Integration.",
      "Update copy metadata, shelf placement, and operational status without leaving the inventory workspace.": "Aktualisieren Sie Exemplarmetadaten, Regalplatzierung und Betriebsstatus, ohne den Inventar-Arbeitsbereich zu verlassen.",
      "Copy code": "Exemplarcode",
      "Use a clear branch and shelf-safe identifier.": "Verwenden Sie eine klare Kennung für Filiale und Regal.",
      "Book title": "Buchtitel",
      "Select an existing catalog record so this copy stays linked to the canonical book entry.": "Wählen Sie einen bestehenden Katalogeintrag aus, damit dieses Exemplar mit dem kanonischen Bucheintrag verknüpft bleibt.",
      "Condition": "Zustand",
      "Borrowed": "Ausgeliehen",
      "Maintenance": "Wartung",
      "New": "Neu",
      "Good": "Gut",
      "Fair": "Akzeptabel",
      "Poor": "Schlecht",
      "Use maintenance for staff-held or repair-bound copies.": "Verwenden Sie Wartung für vom Personal zurückgehaltene oder reparaturbedürftige Exemplare.",
      "Save copy": "Exemplar speichern",
      "Choose an existing catalog record.": "Wählen Sie einen vorhandenen Katalogeintrag.",
      "Create account": "Konto erstellen",
      "Add a new member or staff account using the existing admin flow. The same form now supports local mock creation and safe Auth0-linked provisioning for persisted environments.": "Fügen Sie über den bestehenden Admin-Ablauf ein neues Mitglieder- oder Mitarbeiterkonto hinzu. Dasselbe Formular unterstützt jetzt lokale Mock-Erstellung und sichere Auth0-verknüpfte Bereitstellung für persistente Umgebungen.",
      "Enter the user full name": "Vollständigen Namen des Benutzers eingeben",
      "Use the name that will appear in account-facing borrowing, admin, and profile views.": "Verwenden Sie den Namen, der in Ausleihe, Admin-Ansichten und Profilansichten sichtbar sein soll.",
      "Auth0 user id": "Auth0-Benutzer-ID",
      "The mocked flow checks this email for duplicates before creating a local roster entry.": "Der Mock-Ablauf prüft diese E-Mail auf Duplikate, bevor ein lokaler Eintrag erstellt wird.",
      "Optional in the mock flow. Required when this account should be persisted against an existing Auth0 identity, including manual super-admin bootstrap.": "Optional im Mock-Ablauf. Erforderlich, wenn dieses Konto gegen eine bestehende Auth0-Identität persistiert werden soll, einschließlich manuellem Super-Admin-Bootstrap.",
      "Role": "Rolle",
      "Account status": "Kontostatus",
      "Temporary password": "Temporäres Passwort",
      "Optional mocked temporary password": "Optionales temporäres Testpasswort",
      "Optional. Keep this for mocked onboarding only until Auth0 owns invitation and password flows for each account type.": "Optional. Nur für simuliertes Onboarding beibehalten, bis Auth0 Einladungs- und Passwortabläufe je Kontotyp übernimmt.",
      "Onboarding note": "Onboarding-Notiz",
      "Optional staff note about this mock account or onboarding context.": "Optionale Mitarbeiternotiz zu diesem Testkonto oder Onboarding-Kontext.",
      "Optional. Use this to capture placeholder onboarding context until real invites and staff notes are wired to persistent data.": "Optional. Verwenden Sie dies, um vorläufigen Onboarding-Kontext zu erfassen, bis echte Einladungen und Mitarbeiternotizen an persistente Daten angebunden sind.",
      "Creating account...": "Konto wird erstellt...",
      "Super Admin": "Super-Admin",
      "Employee": "Mitarbeiter",
      "Member": "Mitglied",
      "Copies": "Exemplare",
      "Shelf code": "Regalcode",
      "available": "verfügbar",
      "borrowed": "ausgeliehen",
      "View only": "Nur Ansicht",
      "book": "Buch",
      "books": "Bücher",
      "No description added yet.": "Noch keine Beschreibung hinzugefügt.",
      "Book count": "Buchanzahl",
      "No current borrowings": "Keine aktuellen Ausleihen"
      ,"Delete {title}?": "{title} löschen?"
      ,"Edit {title}": "{title} bearbeiten"
      ,"Add new book": "Neues Buch hinzufügen"
      ,"Edit book": "Buch bearbeiten"
      ,"Basic info": "Grundinformationen"
      ,"Keep the primary catalog data short, typed, and valid for the live catalog record.": "Halten Sie die primären Katalogdaten kurz, strukturiert und für den Live-Katalogeintrag gültig."
      ,"Title": "Titel"
      ,"This title is used in the management table and public catalog.": "Dieser Titel wird in der Verwaltungstabelle und im öffentlichen Katalog verwendet."
      ,"Enter book title": "Buchtitel eingeben"
      ,"Author": "Autor"
      ,"Use the name as it should appear in both admin and public screens.": "Verwenden Sie den Namen so, wie er sowohl in Admin- als auch in öffentlichen Ansichten erscheinen soll."
      ,"Enter author name": "Autorennamen eingeben"
      ,"ISBN": "ISBN"
      ,"ISBN-10 or ISBN-13 formats are accepted.": "ISBN-10- oder ISBN-13-Formate werden akzeptiert."
      ,"This category controls both admin grouping and public discovery filters.": "Diese Kategorie steuert sowohl die Admin-Gruppierung als auch die öffentlichen Entdeckungsfilter."
      ,"Aim for a concise operational description that can later be replaced by real catalog copy.": "Zielen Sie auf eine prägnante operative Beschreibung, die später durch echten Katalogtext ersetzt werden kann."
      ,"Inventory summary": "Inventarübersicht"
      ,"Current operational numbers derived from the stored copy and borrowing records for this title.": "Aktuelle Betriebszahlen, abgeleitet aus den gespeicherten Exemplar- und Ausleihdatensätzen für diesen Titel."
      ,"Form actions": "Formularaktionen"
      ,"Saving writes catalog changes to MongoDB and refreshes the related admin and public views.": "Beim Speichern werden Katalogänderungen nach MongoDB geschrieben und die zugehörigen Admin- und öffentlichen Ansichten aktualisiert."
      ,"Create mode saves a new book record immediately and then routes to its detail page.": "Der Erstellungsmodus speichert sofort einen neuen Bucheintrag und leitet dann zu dessen Detailseite weiter."
      ,"Edit mode keeps the current inventory summary visible while catalog changes are persisted and revalidated.": "Der Bearbeitungsmodus hält die aktuelle Inventarübersicht sichtbar, während Katalogänderungen gespeichert und erneut validiert werden."
      ,"Delete this catalog title. Books with borrowing history remain protected from destructive removal.": "Löschen Sie diesen Katalogtitel. Bücher mit Ausleihhistorie bleiben vor destruktivem Entfernen geschützt."
      ,"Delete book": "Buch löschen"
      ,"Borrowing durations": "Ausleihdauern"
      ,"Select the predefined durations staff can approve quickly, then choose whether librarians may accept a custom duration request.": "Wählen Sie die vordefinierten Dauern aus, die das Personal schnell genehmigen kann, und legen Sie dann fest, ob Bibliothekare Anfragen mit benutzerdefinierter Dauer akzeptieren dürfen."
      ,"Allow custom duration requests": "Anfragen für benutzerdefinierte Dauer erlauben"
      ,"Turn this on when staff may approve a non-standard duration after review.": "Aktivieren Sie dies, wenn das Personal nach Prüfung eine nicht standardmäßige Dauer genehmigen darf."
      ,"Selected presets:": "Ausgewählte Vorgaben:"
      ,"None": "Keine"
      ,"day": "Tag"
      ,"days": "Tage"
      ,"Cover image": "Coverbild"
      ,"Use the existing admin cover language for now. This upload area only captures a file name until real media storage is wired.": "Verwenden Sie vorerst die bestehende Admin-Cover-Sprache. Dieser Upload-Bereich erfasst nur einen Dateinamen, bis echte Medienspeicherung angebunden ist."
      ,"Author name": "Name des Autors"
      ,"No cover selected yet": "Noch kein Cover ausgewählt"
      ,"Upload a mock cover reference so the API contract already expects media metadata.": "Laden Sie eine simulierte Cover-Referenz hoch, damit der API-Vertrag bereits Medienmetadaten erwartet."
      ,"Replace the current cover reference if this title has a refreshed edition or a cleaner asset.": "Ersetzen Sie die aktuelle Cover-Referenz, wenn dieser Titel eine aktualisierte Ausgabe oder ein besseres Asset hat."
      ,"Replace file": "Datei ersetzen"
      ,"Upload file": "Datei hochladen"
      ,"Remove file": "Datei entfernen"
      ,"Helper text": "Hilfetext"
      ,"The preview tone follows the selected category so the form stays visually aligned with the existing catalog and admin tables.": "Der Vorschauton folgt der ausgewählten Kategorie, damit das Formular visuell mit dem bestehenden Katalog und den Admin-Tabellen übereinstimmt."
      ,"Fee settings": "Gebühreneinstellungen"
      ,"Keep the fee treatment explicit so circulation staff can see whether a title is free or collected in cash onsite.": "Halten Sie die Gebührenregelung explizit, damit das Ausleihpersonal sehen kann, ob ein Titel kostenlos ist oder vor Ort in bar kassiert wird."
      ,"Fee mode": "Gebührenmodus"
      ,"No pickup cash collected": "Keine Barzahlung bei Abholung"
      ,"Cash fee": "Bargebühr"
      ,"Collected at the desk": "Am Schalter kassiert"
      ,"Cash fee amount": "Betrag der Bargebühr"
      ,"Free titles keep the fee input disabled and will show a Free badge in the management table.": "Kostenlose Titel deaktivieren das Gebührenfeld und zeigen ein Kostenlos-Badge in der Verwaltungstabelle an."
      ,"Enter the cash amount collected onsite when a reader picks up the book.": "Geben Sie den Barbetrag ein, der vor Ort kassiert wird, wenn ein Leser das Buch abholt."
      ,"Fee preview": "Gebührenvorschau"
      ,"This mirrors how the fee appears in catalog and admin table rows.": "Dies spiegelt wider, wie die Gebühr in Katalog- und Admin-Tabellenzeilen erscheint."
      ,"reserved": "reserviert"
      ,"This is still a mock delete flow. Later it can be connected to a real category removal request.": "Dies ist noch ein simulierte Löschablauf. Später kann er mit einer echten Anfrage zum Entfernen einer Kategorie verbunden werden."
      ,"Back to dashboard": "Zurück zum Dashboard"
      ,"Admin view unavailable": "Admin-Ansicht nicht verfügbar"
      ,"Could not load this admin page": "Diese Admin-Seite konnte nicht geladen werden"
      ,"Access management": "Zugriffsverwaltung"
      ,"Manage staff role defaults and per-user section access from one surface. Only staff sessions with explicit access-control permission can reach this page, and super-admin remains the highest-privilege role for protected changes.": "Verwalten Sie Rollenstandards für Mitarbeitende und bereichsbezogene Zugriffe pro Benutzer an einem Ort. Nur Mitarbeitersitzungen mit ausdrücklicher Berechtigung für die Zugriffssteuerung können diese Seite öffnen, und Super-Admin bleibt die Rolle mit den höchsten Rechten für geschützte Änderungen."
      ,"Current operator": "Aktueller Benutzer"
      ,"Policy model": "Richtlinienmodell"
      ,"Operational notices": "Betriebshinweise"
      ,"Priority work that needs attention before circulation slows down.": "Priorisierte Aufgaben, die Aufmerksamkeit brauchen, bevor der Ausleihbetrieb abklingt."
      ,"No operational notices": "Keine Betriebshinweise"
      ,"Pending request and overdue follow-up cards will appear here when the data layer is connected.": "Karten für offene Anfragen und die Nachverfolgung überfälliger Fälle erscheinen hier, sobald die Datenebene angebunden ist."
      ,"Borrowing trends": "Ausleihtrends"
      ,"Seven-day circulation movement for borrowings, returns, and overdue escalation using mock operational data.": "Siebentägige Ausleihbewegung für Ausleihen, Rückgaben und Eskalationen überfälliger Fälle auf Basis simulierter Betriebsdaten."
      ,"Last 7 days": "Letzte 7 Tage"
      ,"Returns": "Rückgaben"
      ,"No borrowing trends yet": "Noch keine Ausleihtrends"
      ,"Trend bars and weekly summaries will appear here once circulation analytics are available.": "Trendbalken und Wochenübersichten erscheinen hier, sobald Ausleihanalysen verfügbar sind."
      ,"Quick actions": "Schnellaktionen"
      ,"Fast entry points into the highest-traffic management areas.": "Schnelle Einstiege in die am stärksten genutzten Verwaltungsbereiche."
      ,"No quick actions configured": "Keine Schnellaktionen konfiguriert"
      ,"Add admin action entries once the next workflow priorities are settled.": "Fügen Sie Admin-Aktionseinträge hinzu, sobald die nächsten Workflow-Prioritäten feststehen."
      ,"Recent activity": "Letzte Aktivitäten"
      ,"A running panel of the latest circulation, catalog, and member support changes.": "Ein laufendes Panel mit den neuesten Änderungen bei Ausleihe, Katalog und Mitgliederbetreuung."
      ,"Open borrowings queue": "Ausleihwarteschlange öffnen"
      ,"No recent activity": "Keine aktuellen Aktivitäten"
      ,"Recent dashboard activity will appear here once circulation and catalog events are connected.": "Letzte Dashboard-Aktivitäten erscheinen hier, sobald Ausleih- und Katalogereignisse angebunden sind."
      ,"Showing {visibleCount} of {totalCount} catalog {recordLabel}.": "{visibleCount} von {totalCount} Katalog-{recordLabel} angezeigt."
      ,"Showing {visibleCount} of {totalCount} {categoryLabel}.": "{visibleCount} von {totalCount} {categoryLabel} angezeigt."
      ,"record": "Eintrag"
      ,"records": "Einträge"
      ,"No pending borrowings": "Keine ausstehenden Ausleihen"
      ,"No overdue borrowings": "Keine überfälligen Ausleihen"
      ,"No returned borrowings": "Keine zurückgegebenen Ausleihen"
      ,"Borrowing records in the pending queue will appear here once circulation data is available.": "Ausleihdatensätze in der Warteschlange für ausstehende Fälle erscheinen hier, sobald Ausleihdaten verfügbar sind."
      ,"Borrowing records in the active queue will appear here once circulation data is available.": "Ausleihdatensätze in der aktiven Warteschlange erscheinen hier, sobald Ausleihdaten verfügbar sind."
      ,"Borrowing records in the overdue queue will appear here once circulation data is available.": "Ausleihdatensätze in der Warteschlange für überfällige Fälle erscheinen hier, sobald Ausleihdaten verfügbar sind."
      ,"Borrowing records in the returned queue will appear here once circulation data is available.": "Ausleihdatensätze in der Warteschlange für Rückgaben erscheinen hier, sobald Ausleihdaten verfügbar sind."
      ,"Activity": "Aktivität"
      ,"Fee source": "Gebührenquelle"
      ,"Settled cash": "Eingenommenes Bargeld"
      ,"Borrowing fees already marked settled in the current shared data source.": "Ausleihgebühren, die in der aktuellen gemeinsamen Datenquelle bereits als beglichen markiert sind."
      ,"Outstanding cash": "Offenes Bargeld"
      ,"Fee exposure still waiting for onsite settlement before reconciliation is complete.": "Gebührenpositionen, die noch auf eine Begleichung vor Ort warten, bevor die Abstimmung abgeschlossen ist."
      ,"Fee-bearing records": "Gebührenpflichtige Einträge"
      ,"Borrowing records that currently carry a payable borrowing fee.": "Ausleihdatensätze, für die derzeit eine zu zahlende Ausleihgebühr anfällt."
      ,"Collection rate": "Einzugsquote"
      ,"Share of current fee exposure already captured as settled cash in the admin dataset.": "Anteil der aktuellen Gebührenpositionen, der im Admin-Datensatz bereits als beglichenes Bargeld erfasst ist."
      ,"Exposure-based": "Expositionsbasiert"
      ,"No fees yet": "Noch keine Gebühren"
      ,"Settled records": "Beglichene Einträge"
      ,"Borrowing fees already closed out onsite.": "Ausleihgebühren, die bereits vor Ort abgeschlossen wurden."
      ,"Open cash exposure": "Offene Bargeldposition"
      ,"Unsettled borrowing fees still needing collection.": "Offene Ausleihgebühren, die noch eingezogen werden müssen."
      ,"Overdue unpaid fees": "Überfällige unbezahlte Gebühren"
      ,"Overdue borrowing records that still show unpaid cash.": "Überfällige Ausleihdatensätze, die noch unbezahltes Bargeld ausweisen."
      ,"Settled onsite": "Vor Ort beglichen"
      ,"Onsite cash only": "Nur Barzahlung vor Ort"
      ,"Paid cash": "Bar bezahlt"
      ,"Unpaid cash": "Bar offen"
      ,"No fee": "Keine Gebühr"
      ,"Requested": "Angefragt"
      ,"Started": "Gestartet"
      ,"{requestType} request for {count} days at {branch}.": "{requestType}-Anfrage für {count} Tage in {branch}."
      ,"Custom-duration": "Benutzerdefinierte Dauer"
      ,"{count} custom review": "{count} benutzerdefinierte Prüfungen"
      ,"{count} on track": "{count} planmäßig"
      ,"{count} need cash review": "{count} mit Prüfbedarf für Barzahlung"
      ,"{count} settled records": "{count} beglichene Einträge"
      ,"{count} member accounts": "{count} Mitgliedskonten"
      ,"{count} open items": "{count} offene Einträge"
      ,"{count} custom-duration requests need manual review.": "{count} Anfragen mit benutzerdefinierter Dauer benötigen manuelle Prüfung."
      ,"{count} accounts still owe onsite cash.": "{count} Konten schulden noch Barzahlung vor Ort."
      ,"Average of {count} borrowings started or requested per day.": "Durchschnittlich {count} pro Tag gestartete oder angefragte Ausleihen."
      ,"{count} loans": "{count} Ausleihen"
      ,"{count} copies currently held for maintenance.": "{count} Exemplare sind derzeit in Wartung."
      ,"Healthy": "Gut"
      ,"Watch": "Beobachten"
      ,"Onsite only": "Nur vor Ort"
      ,"{count} overdue dues": "{count} überfällige Gebühren"
      ,"{amount} last 30 days": "{amount} in den letzten 30 Tagen"
      ,"Add book": "Buch hinzufügen"
      ,"Add copy": "Exemplar hinzufügen"
      ,"Add first copy": "Erstes Exemplar hinzufügen"
      ,"Clear search and status": "Suche und Status löschen"
      ,"Reset search": "Suche zurücksetzen"
      ,"Accounts": "Konten"
      ,"Collections": "Sammlungen"
      ,"Catalog": "Katalog"
      ,"Loading category management surfaces.": "Oberflächen der Kategorienverwaltung werden geladen."
      ,"Restore baseline defaults": "Basis-Standards wiederherstellen"
      ,"Reset draft": "Entwurf zurücksetzen"
      ,"Saving...": "Wird gespeichert..."
      ,"Save role defaults": "Rollenstandards speichern"
      ,"Staff role": "Mitarbeiterrolle"
      ,"Configure the default access granted to the {role} role.": "Konfigurieren Sie den Standardzugriff für die Rolle {role}."
      ,"Access": "Zugriff"
      ,"Manage": "Verwalten"
      ,"Role default: {summary}": "Rollenstandard: {summary}"
      ,"Effective: {summary}": "Effektiv: {summary}"
      ,"Use role default": "Rollenstandard verwenden"
      ,"Clear custom access": "Benutzerdefinierten Zugriff löschen"
      ,"Save user access": "Benutzerzugriff speichern"
      ,"User account": "Benutzerkonto"
      ,"Custom section access": "Benutzerdefinierter Bereichszugriff"
      ,"Role defaults only": "Nur Rollenstandards"
      ,"This account can be reviewed here, but the current session is not allowed to change its role or section access.": "Dieses Konto kann hier geprüft werden, aber die aktuelle Sitzung darf seine Rolle oder seinen Bereichszugriff nicht ändern."
      ,"Member accounts do not receive admin workspace sections. Saving this role clears any existing admin section overrides.": "Mitgliedskonten erhalten keine Bereiche des Admin-Arbeitsbereichs. Beim Speichern dieser Rolle werden bestehende Bereichsüberschreibungen entfernt."
      ,"Effective access summary": "Zusammenfassung des effektiven Zugriffs"
      ,"{section}: {summary}": "{section}: {summary}"
      ,"Add or provision an account first, then return here to assign roles and section access.": "Fügen Sie zuerst ein Konto hinzu oder provisionieren Sie eines und kehren Sie dann hierher zurück, um Rollen und Bereichszugriffe zuzuweisen."
      ,"Borrowing operations": "Ausleihvorgänge"
      ,"Review pending approvals, active loans, overdue follow-up, and returned records in a dense but readable circulation workspace.": "Prüfen Sie ausstehende Freigaben, aktive Ausleihen, die Nachverfolgung überfälliger Fälle und zurückgegebene Einträge in einem dichten, aber gut lesbaren Ausleih-Arbeitsbereich."
      ,"Search borrowing records": "Ausleihdatensätze durchsuchen"
      ,"Search book, member, email, or branch...": "Nach Buch, Mitglied, E-Mail oder Filiale suchen..."
      ,"Borrowing queue": "Ausleihwarteschlange"
      ,"Desktop uses a dense management table, while mobile falls back to stacked operational cards with the same status, fee, and action hierarchy.": "Desktop verwendet eine dichte Verwaltungstabelle, während Mobilgeräte auf gestapelte operative Karten mit derselben Hierarchie für Status, Gebühr und Aktionen zurückgreifen."
      ,"No active borrowings": "Keine aktiven Ausleihen"
      ,"No borrowings match this search": "Keine Ausleihen entsprechen dieser Suche"
      ,"Try a different member name, book title, email, or branch to find the borrowing record you need.": "Versuchen Sie einen anderen Mitgliedsnamen, Buchtitel, eine andere E-Mail oder Filiale, um den benötigten Ausleihdatensatz zu finden."
      ,"Duration and dates": "Dauer und Termine"
      ,"Fee and payment": "Gebühr und Zahlung"
      ,"Custom request": "Benutzerdefinierte Anfrage"
      ,"{count}-day loan": "{count}-Tage-Ausleihe"
      ,"{count}-day custom": "{count}-Tage benutzerdefiniert"
      ,"No due date": "Kein Fälligkeitsdatum"
      ,"Unknown book": "Unbekanntes Buch"
      ,"Unknown author": "Unbekannter Autor"
      ,"Unknown member": "Unbekanntes Mitglied"
      ,"All states": "Alle Status"
      ,"Short pickup cycle": "Kurzer Abholzyklus"
      ,"Standard circulation": "Standardausleihe"
      ,"Extended loan": "Verlängerte Ausleihe"
      ,"Research hold": "Forschungsreservierung"
      ,"No copies tracked yet": "Noch keine Exemplare erfasst"
      ,"Select a book": "Buch auswählen"
      ,"Category management": "Kategorienverwaltung"
      ,"Organize browse groupings, keep collection descriptions consistent, and prepare category records for future CRUD-backed staff workflows.": "Organisieren Sie Browse-Gruppierungen, halten Sie Bestandsbeschreibungen konsistent und bereiten Sie Kategorieeinträge für künftige mit CRUD unterstützte Mitarbeiterabläufe vor."
      ,"Category records": "Kategorieeinträge"
      ,"Manage browse labels and optional descriptions in the same responsive table pattern used across the admin workspace.": "Verwalten Sie Browse-Bezeichnungen und optionale Beschreibungen im selben responsiven Tabellenmuster, das im gesamten Admin-Arbeitsbereich verwendet wird."
      ,"Search categories": "Kategorien durchsuchen"
      ,"Search category name or description...": "Nach Kategorienamen oder Beschreibung suchen..."
      ,"Search books": "Bücher durchsuchen"
      ,"Search title, author, or shelf code...": "Nach Titel, Autor oder Regalcode suchen..."
      ,"Review account posture, live circulation exposure, and staff actions from one account management screen built for future server integration.": "Prüfen Sie Kontostatus, aktuelle Ausleihbelastung und Mitarbeiteraktionen auf einer Kontoverwaltungsseite, die für eine spätere Serverintegration vorbereitet ist."
      ,"Live circulation items currently attached to this account, including overdue exposure and onsite cash reminders where relevant.": "Aktuelle Ausleiheinträge, die diesem Konto derzeit zugeordnet sind, einschließlich überfälliger Fälle und Hinweise auf Barzahlungen vor Ort, sofern relevant."
      ,"Recent completed borrowing records to support staff review and future profile management actions.": "Kürzlich abgeschlossene Ausleihdatensätze zur Unterstützung der Mitarbeiterprüfung und künftiger Profilverwaltungsaktionen."
      ,"This account does not currently hold any active or pending circulation items.": "Dieses Konto hat derzeit keine aktiven oder ausstehenden Ausleihen."
      ,"History entries will appear here once this account completes or settles previous borrowing activity.": "Historieneinträge erscheinen hier, sobald dieses Konto frühere Ausleihaktivitäten abgeschlossen oder beglichen hat."
      ,"User not found": "Benutzer nicht gefunden"
      ,"The selected account could not be found in the current mock admin roster.": "Das ausgewählte Konto konnte in der aktuellen simulierten Admin-Übersicht nicht gefunden werden."
      ,"Preparing the account summary, circulation history, and admin action panels.": "Kontozusammenfassung, Ausleihhistorie und Admin-Aktionsbereiche werden vorbereitet."
      ,"Current admin identity details derived from the mocked authenticated session.": "Aktuelle Details zur Admin-Identität aus der simulierten authentifizierten Sitzung."
      ,"A compact workspace snapshot tied to the current admin session.": "Eine kompakte Arbeitsbereichsübersicht, die an die aktuelle Admin-Sitzung gebunden ist."
      ,"The latest mocked operational changes surfaced for the active admin workspace.": "Die neuesten simulierten betrieblichen Änderungen für den aktiven Admin-Arbeitsbereich."
      ,"Adjust the default admin section access granted to each staff role before any user-specific override is applied.": "Passen Sie den standardmäßigen Admin-Bereichszugriff an, der jeder Mitarbeiterrolle gewährt wird, bevor benutzerspezifische Überschreibungen angewendet werden."
      ,"These totals come from the existing borrowing-fee model so the section remains safe on mock data today and extensible for a real reporting backend later.": "Diese Summen stammen aus dem bestehenden Modell für Ausleihgebühren, sodass der Bereich heute mit Beispieldaten sicher bleibt und später für ein echtes Reporting-Backend erweiterbar ist."
      ,"A lightweight operational snapshot for staff who need to review cash due pressure before deeper payment tooling exists.": "Eine leichtgewichtige Betriebsübersicht für Mitarbeitende, die den Druck offener Barzahlungen prüfen müssen, bevor tiefere Zahlungstools vorhanden sind."
      ,"My Borrowings": "Meine Ausleihen"
      ,"Track current loans, pending requests, desk pickups, and overdue items in the authenticated member account view.": "Verfolgen Sie aktuelle Ausleihen, ausstehende Anfragen, Abholungen am Schalter und überfällige Titel in der authentifizierten Kontenansicht für Mitglieder."
      ,"Browse more books": "Weitere Bücher durchsuchen"
      ,"Dismiss": "Schließen"
      ,"Due and pickup timing stays visible in both mobile cards and the desktop table.": "Fälligkeiten und Abholzeiten bleiben sowohl in mobilen Karten als auch in der Desktop-Tabelle sichtbar."
      ,"Preparing your borrowing history, statuses, and payment notes.": "Ihre Ausleihhistorie, Statusangaben und Zahlungshinweise werden vorbereitet."
      ,"Loading the current account view.": "Die aktuelle Kontenansicht wird geladen."
      ,"All Books": "Alle Bücher"
      ,"Discover and borrow from the full library catalog. Search, refine, and scan availability at a glance with the same mobile-first spacing and tokens used throughout the shell.": "Entdecken und entleihen Sie aus dem gesamten Bibliothekskatalog. Suchen, filtern und prüfen Sie die Verfügbarkeit auf einen Blick mit denselben Mobile-First-Abständen und Tokens wie im restlichen Interface."
      ,"Search by title or author...": "Nach Titel oder Autor suchen..."
      ,"Reset catalog filters": "Katalogfilter zurücksetzen"
      ,"Try a different title, author, or category filter to bring matching catalog records back into view.": "Versuchen Sie einen anderen Titel-, Autoren- oder Kategorienfilter, um passende Katalogeinträge wieder anzuzeigen."
      ,"No books match your filters": "Keine Bücher entsprechen Ihren Filtern"
      ,"Discover and borrow from the full library catalog.": "Entdecken und entleihen Sie aus dem gesamten Bibliothekskatalog."
      ,"Review availability, borrowing duration options, and onsite fee policy before placing a borrowing request.": "Prüfen Sie Verfügbarkeit, Ausleihdauer-Optionen und die Gebührenregelung vor Ort, bevor Sie eine Ausleihanfrage stellen."
      ,"Back to catalog": "Zurück zum Katalog"
      ,"Book Details": "Buchdetails"
      ,"The selected book could not be found in the local mock catalog.": "Das ausgewählte Buch konnte im lokalen Mock-Katalog nicht gefunden werden."
      ,"Browse Books": "Bücher durchsuchen"
      ,"Try another book from the catalog grid. This state is rendered locally so it can be iterated on safely before any backend wiring exists.": "Versuchen Sie ein anderes Buch aus dem Katalograster. Dieser Zustand wird lokal gerendert, damit er sicher weiterentwickelt werden kann, bevor eine Backend-Anbindung existiert."
      ,"Book not available in the mock catalog": "Buch im Mock-Katalog nicht verfügbar"
      ,"Preparing the selected title, borrowing options, and payment guidance.": "Der ausgewählte Titel, Ausleihoptionen und Zahlungshinweise werden vorbereitet."
      ,"Profile": "Profil"
      ,"Review personal details, account information, and borrowing preferences in the member shell.": "Prüfen Sie persönliche Angaben, Kontoinformationen und Ausleihpräferenzen in der Mitgliederansicht."
      ,"The member profile could not be loaded from the local mock data set.": "Das Mitgliederprofil konnte nicht aus dem lokalen Mock-Datensatz geladen werden."
      ,"Profile unavailable in mock data": "Profil in Mock-Daten nicht verfügbar"
      ,"Reopen the member profile once local account data is available again. The empty state is kept simple so it can evolve safely before backend wiring.": "Öffnen Sie das Mitgliederprofil erneut, sobald lokale Kontodaten wieder verfügbar sind. Der Leerzustand bleibt bewusst einfach, damit er vor der Backend-Anbindung sicher weiterentwickelt werden kann."
      ,"Browse books": "Bücher durchsuchen"
      ,"Preparing personal details, borrowing summaries, and member settings.": "Persönliche Angaben, Ausleihübersichten und Mitgliedereinstellungen werden vorbereitet."
      ,"Public view unavailable": "Öffentliche Ansicht nicht verfügbar"
      ,"A route-level error interrupted this member-facing screen. You can retry the page or return to the public catalog.": "Ein Fehler auf Routenebene hat diese mitgliederbezogene Ansicht unterbrochen. Sie können die Seite erneut laden oder zum öffentlichen Katalog zurückkehren."
      ,"We couldn't load this page": "Diese Seite konnte nicht geladen werden"
      ,"Try again now. If the problem persists, return to the public catalog and reopen the affected page.": "Versuchen Sie es jetzt erneut. Wenn das Problem bestehen bleibt, kehren Sie zum öffentlichen Katalog zurück und öffnen Sie die betroffene Seite erneut."
      ,"We couldn't load the catalog": "Der Katalog konnte nicht geladen werden"
      ,"The mock catalog could not be rendered. Retry the page and, if it persists, inspect the local module data before wiring a backend.": "Der Mock-Katalog konnte nicht gerendert werden. Laden Sie die Seite erneut und prüfen Sie bei anhaltendem Problem die lokalen Moduldaten, bevor ein Backend angebunden wird."
      ,"Member sign in": "Mitgliederanmeldung"
      ,"Choose whether you want to sign in or start a new member registration, then continue on the secure Auth0 page for the actual authentication step.": "Wählen Sie, ob Sie sich anmelden oder eine neue Mitgliederregistrierung starten möchten, und fahren Sie dann auf der sicheren Auth0-Seite mit dem eigentlichen Authentifizierungsschritt fort."
      ,"Member authentication is unavailable until Auth0 is configured for this environment.": "Die Mitgliederanmeldung ist nicht verfügbar, solange Auth0 für diese Umgebung nicht konfiguriert ist."
      ,"Page not found": "Seite nicht gefunden"
      ,"The page you requested does not exist, or the route is no longer available.": "Die angeforderte Seite existiert nicht oder die Route ist nicht mehr verfügbar."
      ,"This page is unavailable": "Diese Seite ist nicht verfügbar"
      ,"Return to the catalog or continue from a known navigation path.": "Kehren Sie zum Katalog zurück oder fahren Sie über einen bekannten Navigationspfad fort."
      ,"Access + manage": "Zugriff + Verwaltung"
      ,"Access only": "Nur Zugriff"
      ,"No access": "Kein Zugriff"
    }
  },
} as const;