/**
 * Auto-loader pro měsíční náklady z Downloads složky
 * Automaticky načítá nejnovější soubor s měsíčními náklady ze složky Downloads
 */

class CostsAutoLoader {
    constructor() {
        this.downloadsPath = this.getDownloadsPath();
        this.filePattern = /^mesicni-naklady_.*\.json$/;
        this.loadedData = null;
    }

    /**
     * Získání cesty k Downloads složce podle operačního systému
     */
    getDownloadsPath() {
        const os = this.detectOS();
        const userHome = this.getUserHome();
        
        switch (os) {
            case 'mac':
                return `${userHome}/Downloads`;
            case 'windows':
                return `${userHome}\\Downloads`;
            case 'linux':
                return `${userHome}/Downloads`;
            default:
                return `${userHome}/Downloads`;
        }
    }

    /**
     * Detekce operačního systému
     */
    detectOS() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('mac')) return 'mac';
        if (userAgent.includes('win')) return 'windows';
        if (userAgent.includes('linux')) return 'linux';
        return 'unknown';
    }

    /**
     * Získání domovské složky uživatele
     */
    getUserHome() {
        // V prohlížeči nemůžeme přímo přistupovat k souborovému systému
        // Toto je simulace - v reálné aplikaci by bylo potřeba backend
        const username = this.getCurrentUsername();
        const os = this.detectOS();
        
        switch (os) {
            case 'mac':
                return `/Users/${username}`;
            case 'windows':
                return `C:\\Users\\${username}`;
            case 'linux':
                return `/home/${username}`;
            default:
                return `/Users/${username}`;
        }
    }

    /**
     * Získání aktuálního uživatelského jména (simulace)
     */
    getCurrentUsername() {
        // V reálné aplikaci by toto bylo získáno z backend API
        return 'david'; // Výchozí hodnota pro tento projekt
    }

    /**
     * Simulace načtení souborů z Downloads složky
     * V reálné aplikaci by toto bylo backend API volání
     */
    async getDownloadFiles() {
        try {
            // Simulace - v reálné aplikaci by toto bylo fetch na backend endpoint
            // který by vracel seznam souborů z Downloads složky
            
            // Pro demonstraci vytvoříme simulovaný seznam souborů
            const simulatedFiles = [
                {
                    name: 'mesicni-naklady_27-7-2025_11-30.json',
                    path: `${this.downloadsPath}/mesicni-naklady_27-7-2025_11-30.json`,
                    lastModified: new Date('2025-07-27T11:30:00'),
                    size: 2048
                },
                {
                    name: 'mesicni-naklady_26-7-2025_15-45.json',
                    path: `${this.downloadsPath}/mesicni-naklady_26-7-2025_15-45.json`,
                    lastModified: new Date('2025-07-26T15:45:00'),
                    size: 1856
                }
            ];

            return simulatedFiles.filter(file => this.filePattern.test(file.name));
        } catch (error) {
            console.error('Chyba při načítání souborů z Downloads:', error);
            return [];
        }
    }

    /**
     * Najde nejnovější soubor s měsíčními náklady
     */
    async findLatestCostsFile() {
        const files = await this.getDownloadFiles();
        
        if (files.length === 0) {
            console.log('Žádné soubory s měsíčními náklady nebyly nalezeny v Downloads.');
            return null;
        }

        // Seřadí soubory podle data modifikace (nejnovější první)
        files.sort((a, b) => b.lastModified - a.lastModified);
        
        const latestFile = files[0];
        console.log(`Nalezen nejnovější soubor: ${latestFile.name}`);
        return latestFile;
    }

    /**
     * Načte obsah souboru s měsíčními náklady
     */
    async loadCostsFromFile(file) {
        try {
            // V reálné aplikaci by toto bylo fetch na backend endpoint
            // který by načetl obsah souboru
            
            // Pro demonstraci použijeme File API s input elementem
            return new Promise((resolve, reject) => {
                // Vytvoření skrytého file input elementu
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.style.display = 'none';
                
                input.addEventListener('change', (event) => {
                    const selectedFile = event.target.files[0];
                    if (!selectedFile) {
                        reject(new Error('Žádný soubor nebyl vybrán'));
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const data = JSON.parse(e.target.result);
                            resolve(data);
                        } catch (parseError) {
                            reject(new Error('Chyba při parsování JSON souboru'));
                        }
                    };
                    reader.onerror = () => reject(new Error('Chyba při čtení souboru'));
                    reader.readAsText(selectedFile);
                });

                // Automatické kliknutí pro otevření file dialogu
                document.body.appendChild(input);
                input.click();
                document.body.removeChild(input);
            });
        } catch (error) {
            console.error('Chyba při načítání souboru:', error);
            throw error;
        }
    }

    /**
     * Automatické načtení nejnovějších měsíčních nákladů
     */
    async autoLoadLatestCosts() {
        try {
            console.log('Hledám nejnovější soubor s měsíčními náklady...');
            
            const latestFile = await this.findLatestCostsFile();
            if (!latestFile) {
                throw new Error('Žádný soubor s měsíčními náklady nebyl nalezen');
            }

            console.log(`Načítám soubor: ${latestFile.name}`);
            const data = await this.loadCostsFromFile(latestFile);
            
            this.loadedData = data;
            console.log('Měsíční náklady byly úspěšně načteny');
            
            return data;
        } catch (error) {
            console.error('Chyba při automatickém načítání nákladů:', error);
            throw error;
        }
    }

    /**
     * Aplikuje načtená data do kalkulačky
     */
    applyCostsToCalculator(data) {
        if (!data || !data.categories) {
            throw new Error('Neplatná data nákladů');
        }

        try {
            // Vymazání stávajících položek
            const categories = ['automobily', 'sluzby', 'kancelar', 'finance', 'marketing', 'ostatni', 'parkovani'];
            categories.forEach(category => {
                const categoryDiv = document.querySelector(`[data-category="${category}"]`);
                if (categoryDiv) {
                    const costItems = categoryDiv.querySelectorAll('.cost-item');
                    costItems.forEach(item => item.remove());
                }
            });

            // Načtení nových položek
            Object.keys(data.categories).forEach(category => {
                const categoryDiv = document.querySelector(`[data-category="${category}"]`);
                if (categoryDiv && data.categories[category]) {
                    data.categories[category].forEach(item => {
                        const newItemDiv = document.createElement('div');
                        newItemDiv.className = 'cost-item';
                        newItemDiv.innerHTML = `
                            <input type="text" class="cost-item-name" value="${item.name}" style="flex: 1; padding: 5px; border: 1px solid #ddd; border-radius: 3px; margin-right: 10px;">
                            <input type="number" class="cost-item-value" value="${item.value}" style="width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; margin-right: 10px;">
                            <button onclick="removeCostItem(this)" style="background: #dc2626; color: white; border: none; border-radius: 3px; padding: 5px 8px; cursor: pointer;">×</button>
                        `;
                        categoryDiv.appendChild(newItemDiv);

                        // Přidání event listenerů
                        const nameInput = newItemDiv.querySelector('.cost-item-name');
                        const valueInput = newItemDiv.querySelector('.cost-item-value');
                        if (typeof updateMonthlyCostsTotals === 'function') {
                            nameInput.addEventListener('input', updateMonthlyCostsTotals);
                            valueInput.addEventListener('input', updateMonthlyCostsTotals);
                        }
                    });
                }
            });

            // Aktualizace celkových součtů
            if (typeof updateMonthlyCostsTotals === 'function') {
                updateMonthlyCostsTotals();
            }

            const timestamp = new Date(data.timestamp).toLocaleString('cs-CZ');
            return `Měsíční náklady byly automaticky načteny z Downloads (uloženo: ${timestamp})`;
        } catch (error) {
            console.error('Chyba při aplikování nákladů do kalkulačky:', error);
            throw error;
        }
    }

    /**
     * Hlavní funkce pro automatické načtení a aplikování nákladů
     */
    async loadAndApplyCosts() {
        try {
            const data = await this.autoLoadLatestCosts();
            const message = this.applyCostsToCalculator(data);
            
            // Zobrazení úspěšné zprávy
            if (typeof alert === 'function') {
                alert(message);
            } else {
                console.log(message);
            }
            
            return data;
        } catch (error) {
            const errorMessage = `Chyba při automatickém načítání nákladů: ${error.message}`;
            
            if (typeof alert === 'function') {
                alert(errorMessage);
            } else {
                console.error(errorMessage);
            }
            
            throw error;
        }
    }

    /**
     * Sledování změn v Downloads složce (simulace)
     */
    watchDownloadsFolder(callback) {
        // V reálné aplikaci by toto bylo WebSocket připojení k backend serveru
        // který by sledoval změny v Downloads složce
        
        console.log('Sledování Downloads složky je aktivní...');
        
        // Simulace kontroly každých 30 sekund
        const interval = setInterval(async () => {
            try {
                const latestFile = await this.findLatestCostsFile();
                if (latestFile && (!this.loadedData || new Date(latestFile.lastModified) > new Date(this.loadedData.timestamp))) {
                    console.log('Nalezen nový soubor s náklady, automaticky načítám...');
                    await this.loadAndApplyCosts();
                    if (callback) callback(this.loadedData);
                }
            } catch (error) {
                console.error('Chyba při sledování Downloads složky:', error);
            }
        }, 30000); // Kontrola každých 30 sekund

        return interval;
    }

    /**
     * Zastavení sledování Downloads složky
     */
    stopWatching(intervalId) {
        if (intervalId) {
            clearInterval(intervalId);
            console.log('Sledování Downloads složky bylo zastaveno');
        }
    }
}

// Export pro použití v jiných souborech
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CostsAutoLoader;
} else {
    window.CostsAutoLoader = CostsAutoLoader;
}

// Automatická inicializace při načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    // Vytvoření globální instance
    window.costsAutoLoader = new CostsAutoLoader();
    
    // Přidání tlačítka pro automatické načtení do UI
    const costsControls = document.querySelector('.costs-controls');
    if (costsControls) {
        const autoLoadButton = document.createElement('button');
        autoLoadButton.textContent = 'Auto-načíst z Downloads';
        autoLoadButton.style.cssText = 'background: #7c3aed; color: white; padding: 10px 20px; border: none; border-radius: 8px; margin: 0 5px; cursor: pointer;';
        autoLoadButton.onclick = () => {
            window.costsAutoLoader.loadAndApplyCosts();
        };
        costsControls.appendChild(autoLoadButton);
    }
    
    console.log('CostsAutoLoader byl inicializován');
});
