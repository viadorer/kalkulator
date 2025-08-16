# Auto-Loader pro Měsíční Náklady

Automatický systém pro načítání měsíčních nákladů ze složky Downloads.

## 📋 Přehled

Auto-loader je utilita, která automaticky vyhledává a načítá nejnovější soubory s měsíčními náklady ze složky Downloads uživatele. Eliminuje potřebu manuálního výběru souborů a zajišťuje, že kalkulačka vždy pracuje s nejnovějšími daty.

## 🚀 Funkce

### ✅ Automatické vyhledávání
- Prohledává Downloads složku pro soubory s náklady
- Identifikuje soubory podle vzoru: `mesicni-naklady_*.json`
- Automaticky vybírá nejnovější soubor podle data modifikace

### ✅ Inteligentní načítání
- Načítá JSON data z nejnovějšího souboru
- Validuje strukturu dat před aplikováním
- Zobrazuje informativní zprávy o úspěchu/chybách

### ✅ Automatická aplikace
- Vymaže stávající položky nákladů
- Načte všechny kategorie a položky z souboru
- Přepočítá celkové součty
- Obnoví event listenery pro editaci

### ✅ UI integrace
- Přidává tlačítko "Auto-načíst z Downloads" do rozhraní
- Konzistentní design s existujícím UI
- Hover efekty a vizuální feedback

## 📁 Soubory

### `auto-load-costs.js`
Hlavní soubor s třídou `CostsAutoLoader` obsahující:
- Detekci operačního systému
- Vyhledávání souborů v Downloads
- Načítání a parsování JSON dat
- Aplikaci dat do kalkulačky
- Sledování změn (simulace)

### `auto-load-config.json`
Konfigurační soubor s nastavením:
- Cesty k Downloads složce pro různé OS
- Vzor pro vyhledávání souborů
- UI nastavení
- Logging konfigurace

## 🔧 Instalace

1. Soubory jsou automaticky integrovány do `reality_commission_calculator-2.html`
2. Script se načítá automaticky při otevření stránky
3. Tlačítko se přidává do sekce ovládacích prvků

## 📖 Použití

### Automatické načtení
```javascript
// Vytvoření instance auto-loaderu
const autoLoader = new CostsAutoLoader();

// Automatické načtení nejnovějšího souboru
await autoLoader.loadAndApplyCosts();
```

### Manuální načtení
1. Klikněte na tlačítko **"Auto-načíst z Downloads"**
2. Systém automaticky najde nejnovější soubor
3. Data se načtou a aplikují do kalkulačky

### Sledování změn
```javascript
// Spuštění sledování Downloads složky
const watchId = autoLoader.watchDownloadsFolder((data) => {
    console.log('Nová data načtena:', data);
});

// Zastavení sledování
autoLoader.stopWatching(watchId);
```

## 🗂️ Struktura dat

Očekávaná struktura JSON souboru:
```json
{
    "timestamp": "2025-07-27T11:30:00.000Z",
    "categories": {
        "automobily": [
            {"name": "Autoleasing Opel Astra", "value": 4037},
            {"name": "Benzin nafta", "value": 8000}
        ],
        "sluzby": [
            {"name": "Telefon", "value": 5000},
            {"name": "Hosting", "value": 2000}
        ],
        // ... další kategorie
    }
}
```

## 🔍 Podporované kategorie

- `automobily` - Automobily
- `sluzby` - Služby a technologie  
- `kancelar` - Kancelář a provoz
- `finance` - Finance a účetnictví
- `marketing` - Marketing a reklama
- `ostatni` - Ostatní služby
- `parkovani` - Parkování

## ⚙️ Konfigurace

### Změna cesty k Downloads
```javascript
const autoLoader = new CostsAutoLoader();
autoLoader.downloadsPath = '/custom/path/to/downloads';
```

### Změna vzoru pro soubory
```javascript
autoLoader.filePattern = /^custom-pattern_.*\.json$/;
```

## 🚨 Omezení

### Bezpečnost prohlížeče
- Prohlížeče neumožňují přímý přístup k souborovému systému
- Auto-loader používá File API s uživatelskou interakcí
- Pro plnou funkcionalnost by bylo potřeba backend řešení

### Simulace funkcí
- Vyhledávání souborů je simulováno
- Sledování změn používá polling místo real-time
- V produkci by bylo potřeba server-side komponenta

## 🔮 Budoucí vylepšení

### Backend integrace
- REST API pro přístup k souborovému systému
- WebSocket pro real-time sledování změn
- Automatická synchronizace mezi zařízeními

### Rozšířené funkce
- Verzování souborů nákladů
- Automatické zálohování
- Import z více formátů (CSV, Excel)
- Cloud storage integrace

## 🐛 Řešení problémů

### Soubor nebyl nalezen
- Zkontrolujte, že soubor je ve správné Downloads složce
- Ověřte, že název souboru odpovídá vzoru `mesicni-naklady_*.json`
- Zkontrolujte oprávnění k Downloads složce

### Chyba při načítání
- Ověřte, že JSON soubor má správnou strukturu
- Zkontrolujte, že soubor není poškozený
- Ujistěte se, že soubor obsahuje všechny požadované kategorie

### UI problémy
- Obnovte stránku pro reset auto-loaderu
- Zkontrolujte konzoli prohlížeče pro chybové zprávy
- Ověřte, že JavaScript je povolen

## 📞 Podpora

Pro další informace nebo řešení problémů:
1. Zkontrolujte konzoli prohlížeče pro detailní chybové zprávy
2. Ověřte strukturu JSON souboru
3. Ujistěte se, že máte nejnovější verzi kalkulačky
