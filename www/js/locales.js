goog.provide('app.locales');

app.TRANSLATION = {
    'cs_CZ': {
        'logo-msg': 'Simulátor difraktivní optiky',
        // menu
        'simulation-menu-msg': 'Simulace',
        'settings-menu-msg': 'Nastavení',
        'import-menu-msg': 'Importovat simulaci',
        'export-menu-msg': 'Exportovat simulaci',
        'reset-menu-msg': 'Začít znovu',
        'components-menu-msg': 'Komponenty',
        'help-menu-msg': 'Nápověda',
        'reflections-count': 'Počet odrazů',
        'languages': 'Jazyk',
        'lang-cs-cz': 'Čeština',
        'lang-en-us': 'Angličtina',
        'mirror-menu-msg': 'Přidat zrcátko',
        'splitter-menu-msg': 'Přidat dělič',
        'lens-menu-msg': 'Přidat čočku',
        'holo-menu-msg': 'Přidat holografické plátno',
        'wall-menu-msg': 'Přidat zeď',
        'light-menu-msg': 'Přidat světlo',
        // popups
        'new-table': 'Nová tabulka',
        'new-view': 'Nový pohled',
        'view-name': 'Jméno pohledu: ',
        'edit-name': 'Změnit jméno: ',
        'table-name': 'Jméno stolu: ',
        'edit-table': 'Upravit tabulku',
        'edit-view': 'Upravit pohled',
        'save-view': 'Uložit',
        'save-table': 'Uložit',
        'remove-table': 'Odstranit Stůl',
        'remove-view': 'Odstranit pohled',
        'copy-btn': 'Copy',
        'ref-count': 'Insert count: ',
        'help-title': 'Pomoc',
        'copy-title': 'Kopírovat komponentu',
        'copy-no-tables': 'Žádné stoly nejsou k dispozici.',
        'cancel-btn': 'Zavřít',
        'hol-rec-err': 'Neuložené paprsky',
        'ref-errors': 'Chyby v následujících oddílech: ',
        'ref-err-sec': 'V oddílu ',
        'ref-err-src': ', parsek světelného zdroje ',
        'ref-err-ray': ', překročil limit délky koherence o ',
        'screen-size': 'Úhlopříčka displeje',
        'set-screen-size': 'Nastavit úhlopříčku (v palcích): ',
        // component configuration popup
        'add-com-popup': 'Kliknutím na plátno přidáte komponentu',
        'com-conf-header': 'Konfigurace komponenty',
        'com-position': 'Pozice:',
        'com-rotation': 'Rotace:',
        'com-dimensions': 'Rozměry:',
        'com-light': 'Světlo:',
        'com-copy-btn': 'Kopírovat',
        'com-delete-btn': 'Smazat',
        'com-close-btn': 'Zavřít',
        'com-height-title': 'Výška',
        'com-width-title': 'Šířka',
        'com-record-btn': 'Zaznamenat',
        'com-lens-type-div': 'Rozptylka',
        'com-lens-type-con': 'Spojka',
        'com-lens-type-title': 'Typ čočky',
        'com-lens-focus-offset': 'Vzdálenost ohniska:',
        'com-light-size': 'A: ',
        'com-light-beam': 'Kužel',
        'com-light-circle': 'Kruh',
        'com-light-type-title': 'Typ světla: ',
        'com-light-rays-count': 'Počet paprsků: ',
        'com-light-radius': 'Rádius: ',
        'com-plate-settings': 'Nastavení plátna',
        'com-plate-resolution': 'Rozlišení: ',
        'com-plate-tolerance': 'Odchylka: ',
        'pick-ref-light': 'Výběr referenčního světla',
        'ref-light': 'Světlo: ',
        'pick-light': 'Vyber',
        'pick-all-lights': 'Všechna',
        // help popup text
        'how-to-title': 'Nápověda',
        // language
        'ht-change-lg-title': 'Změna jazyka',
        'ht-change-lg-text': 'Jazyk lze změni na kartě Simulace/Mastavení/Jazyk.',
        // count of reflections
        'ht-change-cr-title': 'Změna počtu odrazů paprsku',
        'ht-change-cr-text': 'Počet odrazů parsku lze změnit na kartě Simulace/Nastavení/Počet odrazů.',
        // screen size
        'ht-change-sz-title': 'Oprava vzdálenosti v CM',
        'ht-change-sz-text': 'Vzdálenost lze upravit na kartě Simulace/Nastavení/Úhlopříčka displeje a zde zadat správnou úhlopříčku' +
        'vašeho displeje v palcích.',
        // export/import
        'ht-change-xi-title': 'Jak sdílet',
        'ht-change-xi-text': 'Vaše vytvořené experimenty můžete sdílet s práteli. Na kartě Simulace/Export simulace si lze nechat' +
        ' vygeneratovat JSON objekt aktuálně sestaveného experimentu. ',
        // components
        'ht-change-cm-title': 'Komponenty',

        'ht-change-cm-text': 'Dostupné komponenty lze přidávat na kartě komponenty. Každá komponenta má sadu nastavitelných' +
        ' atributů, které mužete zobrazit kliknutím na přidanou komponentu. jednotlivé komponenty jsou spojeny se stolem a ' +
        'zobrazovány v pohledech. Komponenty mouhou být také kopírovány na sousední stoly a to tlačítkem kopírovat na ' +
        'konfiguračním panelu komponenty.'
    },
    'en_US': {
        'logo-msg': 'Diffractive optics simulator',
        // menu
        'simulation-menu-msg': 'Simulation',
        'settings-menu-msg': 'Settings',
        'import-menu-msg': 'Import simulation',
        'export-menu-msg': 'Export simulation',
        'reset-menu-msg': 'Reset simulation',
        'components-menu-msg': 'Components',
        'help-menu-msg': 'Help',
        'reflections-count': 'Count of reflections',
        'languages': 'Language',
        'lang-cs-cz': 'Czech',
        'lang-en-us': 'English',
        'mirror-menu-msg': 'Add mirror',
        'splitter-menu-msg': 'Add splitter',
        'lens-menu-msg': 'Add lens',
        'holo-menu-msg': 'Add holographic plate',
        'wall-menu-msg': 'Add wall',
        'light-menu-msg': 'Add light',
        // popups
        'new-table': 'New table',
        'new-view': 'New view',
        'view-name': 'View name: ',
        'table-name': 'Table name: ',
        'edit-name': 'Change name: ',
        'edit-table': 'Edit table',
        'edit-view': 'Edit view',
        'save-view': 'Save',
        'save-table': 'Save',
        'remove-table': 'Remove table',
        'remove-view': 'Remove view',
        'copy-btn': 'Copy',
        'ref-count': 'Insert count: ',
        'help-title': 'Help',
        'copy-title': 'Copy component',
        'copy-no-tables': 'No tables are available.',
        'cancel-btn': 'Close',
        'hol-rec-err': 'Unrecorded rays',
        'ref-errors': 'Errors in following sectors: ',
        'ref-err-sec': 'In sector ',
        'ref-err-src': ',ray of light source ',
        'ref-err-ray': ', crossed coherence limit about ',
        'screen-size': 'Screen diagonal',
        'set-screen-size': 'Set diagonal (in inches): ',
        // component configuration popup
        'add-com-popup': 'Click to canvas adds the component',
        'com-conf-header': 'Component configuration',
        'com-position': 'Position:',
        'com-rotation': 'Rotation:',
        'com-dimensions': 'Dimensions:',
        'com-light': 'Light:',
        'com-copy-btn': 'Copy',
        'com-delete-btn': 'Delete',
        'com-close-btn': 'Close',
        'com-height-title': 'Height',
        'com-width-title': 'Width',
        'com-record-btn': 'Make record',
        'com-lens-type-div': 'Diverging',
        'com-lens-type-con': 'Converging',
        'com-lens-type-title': 'Lens type:',
        'com-lens-focus-offset': 'Focus offset:',
        'com-light-size': 'A: ',
        'com-light-beam': 'Beam',
        'com-light-circle': 'Circle',
        'com-light-type-title': 'Light type: ',
        'com-light-rays-count': 'Rays count: ',
        'com-light-radius': 'Radius: ',
        'com-plate-settings': 'Plate settings',
        'com-plate-resolution': 'Resolution: ',
        'com-plate-tolerance': 'Tolerance: ',
        'pick-ref-light': 'Pick reference light',
        'ref-light': 'Light: ',
        'pick-light': 'Pick',
        'pick-all-lights': 'All',
        // help popup text
        'how-to-title': 'How to',
        // language
        'ht-change-lg-title': 'Change language',
        'ht-change-lg-text': 'Go to Simulation/Settings/Language and pick preferred language.',
        // count of reflections
        'ht-change-cr-title': 'Increase number of light reflections',
        'ht-change-cr-text': 'Go to Simulation/Settings and click on Count of reflections.',
        // screen size
        'ht-change-sz-title': 'Correct size in CM',
        'ht-change-sz-text': 'Go to Simulation/Settings and click on Screen diagonal and insert correct display size in inches.',
        // export/import
        'ht-change-xi-title': 'How to share',
        'ht-change-xi-text': 'If you want to share your experiment go to Simulation and click on Export simulation. ' +
        'This will generate JSON object of your simulation which you can send to your friends.',
        // components
        'ht-change-cm-title': 'Components',
        'ht-change-cm-text': 'To create experiment go to Components and pick component you want to add. Each component' +
        'has own specific settings and you can display them by clicking on added component. Components are bind to a table' +
        ' and can be viewed on views. You can share copy components between tables when you click on copy button in component' +
        'configuration panel.'
    }
};