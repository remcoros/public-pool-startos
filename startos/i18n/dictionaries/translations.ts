import { LangDict } from './default'

export default {
  es_ES: {
    210: 'Cambiar de red reinicia el pool. Configura los mineros con una dirección de la red seleccionada.',
    208: 'Nodo Bitcoin',
    209: 'Elige el nodo que proporciona plantillas de minería.',
    // main.ts
    1: 'El servidor Stratum está listo',
    2: 'El servidor Stratum no está listo',
    3: 'La interfaz web está lista',
    4: 'La interfaz web no está lista',
    5: 'Interfaz web',
    6: 'Bitcoin aún no es accesible en la red interna. Asegúrese de que esté instalado y en ejecución.',

    // interfaces.ts
    100: 'Interfaz web',
    101: 'Interfaz web personal para Public Pool',
    102: 'Servidor Stratum',
    103: 'Donde se conectan tus mineros',

    // actions/config.ts
    200: 'Identificador del pool',
    201: 'Se escribe en la transacción coinbase de cada bloque que construye este pool, así que se hace público en la cadena de bloques si uno de tus mineros encuentra un bloque. Si es demasiado largo para caber, el pool lo omite.',
    202: 'URL de visualización del servidor',
    203: 'La dirección stratum sin cifrar a la que la página principal de Public Pool indica a los mineros que se conecten. Cambia lo que muestra la página principal, no dónde escucha el pool. Elige una dirección IP de la LAN si tus mineros no pueden resolver nombres .local.',
    204: 'Configurar',
    205: 'Establece el identificador del pool y las direcciones stratum que la página principal muestra a los mineros.',
    206: 'URL de visualización segura del servidor',
    207: 'La dirección stratum+tls que se muestra a los mineros que se conectan por TLS. La interfaz web que incluye este paquete todavía no la muestra.',

    // dependencies.ts
    300: 'Hay que activar ZMQ en Bitcoin para usarlo con Public Pool',
  },
  de_DE: {
    210: 'Ein Netzwerkwechsel startet den Pool neu. Konfiguriere die Miner mit einer Adresse des ausgewählten Netzwerks.',
    208: 'Bitcoin-Knoten',
    209: 'Wähle den Knoten für Mining-Vorlagen.',
    // main.ts
    1: 'Stratum-Server ist bereit',
    2: 'Stratum-Server ist nicht bereit',
    3: 'Die Weboberfläche ist bereit',
    4: 'Die Weboberfläche ist nicht bereit',
    5: 'Weboberfläche',
    6: 'Bitcoin ist im internen Netzwerk noch nicht erreichbar. Stellen Sie sicher, dass es installiert ist und läuft.',

    // interfaces.ts
    100: 'Weboberfläche',
    101: 'Persönliche Weboberfläche für Public Pool',
    102: 'Stratum-Server',
    103: 'Wo sich Ihre Miner verbinden',

    // actions/config.ts
    200: 'Pool-Identifikator',
    201: 'Wird in die Coinbase-Transaktion jedes Blocks geschrieben, den dieser Pool erstellt, und wird damit in der Blockchain öffentlich, wenn einer Ihrer Miner einen Block findet. Ist er zu lang, lässt der Pool ihn weg.',
    202: 'Server-Anzeige-URL',
    203: 'Die unverschlüsselte Stratum-Adresse, mit der sich Miner laut der Public Pool-Startseite verbinden sollen. Sie ändert, was die Startseite anzeigt, nicht, wo der Pool lauscht. Wählen Sie eine LAN-IP-Adresse, wenn Ihre Miner keine .local-Namen auflösen können.',
    204: 'Konfigurieren',
    205: 'Legen Sie den Pool-Identifikator und die Stratum-Adressen fest, die die Startseite Minern anzeigt.',
    206: 'Sichere Server-Anzeige-URL',
    207: 'Die stratum+tls-Adresse, die Minern angezeigt wird, die sich über TLS verbinden. Die Weboberfläche dieses Pakets zeigt sie noch nicht an.',

    // dependencies.ts
    300: 'ZMQ muss in Bitcoin aktiviert sein, um es mit Public Pool zu verwenden',
  },
  pl_PL: {
    210: 'Zmiana sieci uruchamia pulę ponownie. Skonfiguruj koparki z adresem wybranej sieci.',
    208: 'Węzeł Bitcoin',
    209: 'Wybierz węzeł dostarczający szablony wydobycia.',
    // main.ts
    1: 'Serwer Stratum jest gotowy',
    2: 'Serwer Stratum nie jest gotowy',
    3: 'Interfejs webowy jest gotowy',
    4: 'Interfejs webowy nie jest gotowy',
    5: 'Interfejs webowy',
    6: 'Bitcoin nie jest jeszcze osiągalny w sieci wewnętrznej. Upewnij się, że jest zainstalowany i uruchomiony.',

    // interfaces.ts
    100: 'Interfejs webowy',
    101: 'Osobisty interfejs webowy dla Public Pool',
    102: 'Serwer Stratum',
    103: 'Miejsce, z którym łączą się twoje koparki',

    // actions/config.ts
    200: 'Identyfikator puli',
    201: 'Zapisywany w transakcji coinbase każdego bloku budowanego przez tę pulę, więc staje się publiczny w blockchainie, jeśli jedna z twoich koparek znajdzie blok. Jeśli jest za długi, pula go pomija.',
    202: 'URL wyświetlania serwera',
    203: 'Nieszyfrowany adres stratum, z którym strona główna Public Pool każe łączyć się koparkom. Zmienia to, co pokazuje strona główna, a nie to, na czym nasłuchuje pula. Wybierz adres IP w sieci LAN, jeśli twoje koparki nie rozpoznają nazw .local.',
    204: 'Konfiguruj',
    205: 'Ustaw identyfikator puli i adresy stratum, które strona główna pokazuje koparkom.',
    206: 'Bezpieczny URL wyświetlania serwera',
    207: 'Adres stratum+tls pokazywany koparkom łączącym się przez TLS. Interfejs webowy dostarczany w tym pakiecie jeszcze go nie wyświetla.',

    // dependencies.ts
    300: 'Aby używać Bitcoina z Public Pool, trzeba włączyć w nim ZMQ',
  },
  fr_FR: {
    210: 'Changer de réseau redémarre le pool. Configurez les mineurs avec une adresse du réseau sélectionné.',
    208: 'Nœud Bitcoin',
    209: 'Choisissez le nœud qui fournit les modèles de minage.',
    // main.ts
    1: 'Le serveur Stratum est prêt',
    2: "Le serveur Stratum n'est pas prêt",
    3: "L'interface web est prête",
    4: "L'interface web n'est pas prête",
    5: 'Interface web',
    6: "Bitcoin n'est pas encore accessible sur le réseau interne. Assurez-vous qu'il est installé et en cours d'exécution.",

    // interfaces.ts
    100: 'Interface web',
    101: 'Interface web personnelle pour Public Pool',
    102: 'Serveur Stratum',
    103: 'Là où vos mineurs se connectent',

    // actions/config.ts
    200: 'Identifiant du pool',
    201: "Inscrit dans la transaction coinbase de chaque bloc que ce pool construit : il devient donc public sur la blockchain si l'un de vos mineurs trouve un bloc. S'il est trop long pour tenir, le pool l'omet.",
    202: "URL d'affichage du serveur",
    203: "L'adresse stratum non chiffrée à laquelle la page d'accueil de Public Pool indique aux mineurs de se connecter. Elle change ce qu'affiche la page d'accueil, pas l'endroit où le pool écoute. Choisissez une adresse IP du réseau local si vos mineurs ne savent pas résoudre les noms .local.",
    204: 'Configurer',
    205: "Définissez l'identifiant du pool et les adresses stratum que la page d'accueil montre aux mineurs.",
    206: "URL d'affichage sécurisée du serveur",
    207: "L'adresse stratum+tls à montrer aux mineurs qui se connectent en TLS. L'interface web fournie par ce paquet ne l'affiche pas encore.",

    // dependencies.ts
    300: "ZMQ doit être activé dans Bitcoin pour l'utiliser avec Public Pool",
  },
} satisfies Record<string, LangDict>
