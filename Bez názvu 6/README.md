# 🏢 Kalkulačky Realitní Kanceláře

Kompletní sada kalkulaček pro realitní kanceláře v České republice s pokročilými funkcemi pro analýzu trhu, správu nákladů a ekonomické plánování.

## 📋 Přehled

Tento projekt obsahuje tři specializované kalkulačky pro realitní kanceláře:

1. **Hlavní kalkulačka** (`index.html`) - Základní kalkulace s analýzou trhu
2. **Kompletní kalkulačka** (`reality_commission_calculator-2.html`) - Pokročilá kalkulačka s více záložkami
3. **Developer kalkulačka** (`developer_calculator.html`) - Specializovaná kalkulačka pro developery

## ✨ Klíčové funkce

### 🎯 Analýza reálného trhu
- Analýza potenciálu lokality s real-time daty
- Porovnání plánovaných metrik s reálnými tržními podmínkami
- Automatické doporučení pro velikost týmu a očekávané příjmy
- Identifikace příležitostí a rizik na trhu

### 💾 Save/Load funkcionalita
- Uložení všech dat kalkulačky do JSON formátu
- Automatické generování názvů souborů s datem a časem
- Kompletní obnovení stavu kalkulačky při načtení
- Podpora pro více scénářů a lokalit

### 📄 PDF Export
- Profesionální PDF reporty se všemi výpočty
- České formátování čísel a dat
- Automatické stránkování pro dlouhé reporty
- Vhodné pro prezentace a obchodní jednání

### 🔄 Auto-loader pro měsíční náklady
- Automatické načítání nákladů ze složky Downloads
- Inteligentní vyhledávání nejnovějších souborů
- Real-time sledování změn (simulace)
- Bezpečná validace a aplikace dat

### ✏️ Editovatelné měsíční náklady
- Úprava existujících položek nákladů
- Přidávání neomezeného počtu nových položek
- Automatické přepočítání celkových součtů
- 7 kategorií nákladů (automobily, služby, kancelář, finance, marketing, ostatní, parkování)

## 🚀 Rychlý start

1. **Stáhněte projekt**
   ```bash
   git clone https://github.com/viadorer/Kalkulator.git
   cd Kalkulator
   ```

2. **Otevřete v prohlížeči**
   - Hlavní kalkulačka: `index.html`
   - Kompletní kalkulačka: `reality_commission_calculator-2.html`
   - Developer kalkulačka: `developer_calculator.html`

3. **Začněte kalkulovat**
   - Vyplňte základní parametry
   - Použijte analýzu trhu pro přesnější odhady
   - Exportujte výsledky do PDF nebo JSON

## 📁 Struktura projektu

```
├── index.html                           # Hlavní kalkulačka s analýzou trhu
├── reality_commission_calculator-2.html # Kompletní kalkulačka (4 záložky)
├── developer_calculator.html            # Developer kalkulačka
├── auto-load-costs.js                  # Auto-loader pro měsíční náklady
├── auto-load-config.json               # Konfigurace auto-loaderu
├── README-auto-loader.md                # Dokumentace auto-loaderu
└── README.md                           # Tento soubor
```

## 🛠️ Technologie

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **PDF generování**: jsPDF library
- **Formátování**: Intl.NumberFormat pro české locale
- **File handling**: File API pro import/export
- **Styling**: Modern CSS Grid a Flexbox

## 📊 Kalkulačky v detailu

### Hlavní kalkulačka (`index.html`)
- ✅ Základní parametry (agenti, ceny, provize)
- ✅ Analýza reálného trhu lokality
- ✅ Porovnání s plánovanými metrikami
- ✅ Save/Load/PDF export funkcionalita
- ✅ České lokalizace a formátování

### Kompletní kalkulačka (`reality_commission_calculator-2.html`)
- ✅ **Prodej** - Kalkulace prodejních provizí
- ✅ **Pronájem** - Kalkulace pronájmů
- ✅ **Ekonomická rozvaha** - Komplexní finanční analýza
- ✅ **Měsíční náklady** - Editovatelné náklady s auto-loaderem

### Developer kalkulačka (`developer_calculator.html`)
- ✅ Specializované výpočty pro developery
- ✅ Analýza projektů a investic
- ✅ ROI kalkulace

## 🔧 Auto-loader funkcionalita

Auto-loader automaticky načítá měsíční náklady ze složky Downloads:

```javascript
// Automatické načtení nejnovějšího souboru
const autoLoader = new CostsAutoLoader();
await autoLoader.loadAndApplyCosts();
```

**Podporované funkce:**
- 🔍 Vyhledávání souborů podle vzoru `mesicni-naklady_*.json`
- 📅 Automatický výběr nejnovějšího souboru
- ✅ Validace a bezpečné načtení dat
- 🔄 Real-time sledování změn (simulace)

## 💡 Použití

### Základní kalkulace
1. Otevřete požadovanou kalkulačku
2. Vyplňte základní parametry (počet agentů, ceny, provize)
3. Použijte analýzu trhu pro přesnější odhady
4. Exportujte výsledky do PDF nebo uložte jako JSON

### Správa měsíčních nákladů
1. Přejděte na záložku "Měsíční náklady"
2. Upravte existující položky nebo přidejte nové
3. Použijte "Auto-načíst z Downloads" pro automatické načtení
4. Uložte konfiguraci pro budoucí použití

### Export a sdílení
- **PDF export**: Profesionální reporty pro prezentace
- **JSON export**: Záloha dat a sdílení mezi zařízeními
- **Auto-loader**: Automatická synchronizace nákladů

## 🌍 Lokalizace

Všechny kalkulačky jsou plně lokalizovány pro český trh:
- 💰 České koruny (CZK) jako výchozí měna
- 📅 České formátování data a času
- 🔢 České formátování čísel (mezery jako oddělovače tisíců)
- 🏠 České realitní trhy a benchmarky

## 🚨 Známé problémy

### Encoding v developer_calculator.html
- **Problém**: Nesprávné zobrazení českých znaků
- **Příčina**: Soubor není uložen v UTF-8 encoding
- **Řešení**: Přeuložit soubor v UTF-8 encoding

### Auto-loader omezení
- **Problém**: Prohlížeče neumožňují přímý přístup k souborovému systému
- **Současné řešení**: Simulace s File API
- **Budoucí řešení**: Backend integrace pro plnou funkcionalnost

## 🔮 Plánovaná vylepšení

- 🌐 Backend API pro real-time přístup k souborovému systému
- 📱 Responzivní design pro mobilní zařízení
- 🔄 Cloud synchronizace dat
- 📈 Pokročilé analytické funkce
- 🎨 Témata a customizace UI

## 🤝 Přispívání

1. Forkněte repository
2. Vytvořte feature branch (`git checkout -b feature/nova-funkcionalita`)
3. Commitněte změny (`git commit -am 'Přidána nová funkcionalita'`)
4. Pushněte do branch (`git push origin feature/nova-funkcionalita`)
5. Vytvořte Pull Request

## 📄 Licence

Tento projekt je licencován pod MIT licencí - viz [LICENSE](LICENSE) soubor pro detaily.

## 📞 Podpora

Pro otázky, návrhy nebo hlášení chyb:
- 🐛 Vytvořte issue na GitHubu
- 📧 Kontaktujte autora
- 📖 Prostudujte dokumentaci v README-auto-loader.md

## 🏆 Autoři

- **David** - Vývoj a design kalkulaček
- **Cascade AI** - Implementace pokročilých funkcí

---

**Vytvořeno s ❤️ pro českou realitní komunitu**
