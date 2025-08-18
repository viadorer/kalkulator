let selectedAPI = 'claude';
let uploadedFiles = [];

// API tab switching
document.querySelectorAll('.api-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.api-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        selectedAPI = tab.dataset.api;
    });
});

// File upload handling
const fileInput = document.getElementById('fileInput');
const uploadArea = document.querySelector('.upload-area');
const uploadedImagesContainer = document.getElementById('uploadedImages');

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    handleFiles(files);
});

fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
});

function handleFiles(files) {
    files.forEach(file => {
        if (uploadedFiles.length < 12) {
            uploadedFiles.push(file);
            displayImage(file);
        }
    });
    updateUploadArea();
}

function displayImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'image-preview';
        imageDiv.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <button class="image-remove" onclick="removeImage(${uploadedFiles.length - 1})">×</button>
        `;
        uploadedImagesContainer.appendChild(imageDiv);
    };
    reader.readAsDataURL(file);
}

function removeImage(index) {
    uploadedFiles.splice(index, 1);
    uploadedImagesContainer.innerHTML = '';
    uploadedFiles.forEach(file => displayImage(file));
    updateUploadArea();
}

function updateUploadArea() {
    const uploadText = uploadArea.querySelector('.upload-text');
    if (uploadedFiles.length > 0) {
        uploadText.textContent = `${uploadedFiles.length}/12 fotek nahráno`;
    } else {
        uploadText.textContent = 'Klikněte nebo přetáhněte fotky';
    }
}

async function analyzeProperty() {
    const apiKey = document.getElementById('apiKey').value;
    if (!apiKey) {
        alert('Zadejte prosím API klíč');
        return;
    }

    if (uploadedFiles.length < 3) {
        alert('Nahrajte prosím alespoň 3 fotky');
        return;
    }

    const button = document.querySelector('.analyze-btn');
    const results = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');

    button.disabled = true;
    button.textContent = 'Analyzuji...';
    results.classList.add('show');
    resultsContent.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>AI analyzuje fotky a checklist...</p>
        </div>
    `;

    try {
        // Prepare data
        const propertyData = {
            propertyType: document.getElementById('propertyType').value,
            location: document.getElementById('location').value,
            area: document.getElementById('area').value,
            structure: document.getElementById('structure').value,
            roof: document.getElementById('roof').value,
            windows: document.getElementById('windows').value,
            electrical: document.getElementById('electrical').value,
            plumbing: document.getElementById('plumbing').value,
            heating: document.getElementById('heating').value,
            walls: document.getElementById('walls').value,
            floors: document.getElementById('floors').value,
            bathroom: document.getElementById('bathroom').value,
            kitchen: document.getElementById('kitchen').value,
            exterior: document.getElementById('exterior').value,
            additional: document.getElementById('additional').value
        };

        // Convert images to base64
        const imagePromises = uploadedFiles.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        });

        const images = await Promise.all(imagePromises);

        // Call AI API
        const result = await callAI(selectedAPI, apiKey, propertyData, images);
        displayResults(result);

    } catch (error) {
        console.error('Chyba při analýze:', error);
        resultsContent.innerHTML = `
            <div class="result-card">
                <h3>Chyba při analýze</h3>
                <p>Nastala chyba: ${error.message}</p>
                <p>Zkontrolujte API klíč a zkuste to znovu.</p>
            </div>
        `;
    } finally {
        button.disabled = false;
        button.textContent = 'Analyzovat nemovitost s AI';
    }
}

async function callAI(apiType, apiKey, propertyData, images) {
    const prompt = `Jsi expert na oceňování nemovitostí v České republice. Analyzuj následující nemovitost na základě poskytnutých fotek a checklistu:

ZÁKLADNÍ ÚDAJE:
- Typ: ${propertyData.propertyType}
- Lokalita: ${propertyData.location}
- Plocha: ${propertyData.area} m²

TECHNICKÝ STAV:
- Nosné konstrukce: ${propertyData.structure}
- Střecha: ${propertyData.roof}
- Okna: ${propertyData.windows}
- Elektro: ${propertyData.electrical}%
- Voda/kanalizace: ${propertyData.plumbing}%
- Topení: ${propertyData.heating}%
- Omítky/povrchy: ${propertyData.walls}%
- Podlahy: ${propertyData.floors}%
- Koupelna/WC: ${propertyData.bathroom}%
- Kuchyň: ${propertyData.kitchen}%

EXTERIÉR: ${propertyData.exterior}
DALŠÍ FAKTORY: ${propertyData.additional}

Na základě analýzy fotek a checklistu poskytni:
1. Odhad tržní ceny (rozmezí min-max)
2. Hodnocení technického stavu (1-10)
3. Hlavní pozitiva nemovitosti
4. Hlavní negativa a rizika
5. Doporučení pro zvýšení hodnoty
6. Odhad nákladů na dokončení
7. Srovnání s trhem v dané lokalitě

Odpověz ve formátu JSON s českými texty:
{
  "cena_odhad": "4.2 mil. Kč",
  "cena_rozmezi": "3.8 - 4.6 mil. Kč",
  "technicky_stav": 7,
  "pozitiva": ["Dobrá lokalita", "Solidní konstrukce"],
  "negativa": ["Nedokončené instalace", "Potřeba renovace"],
  "doporuceni": ["Dokončit elektro", "Renovovat koupelnu"],
  "naklady_dokonceni": "800 000 Kč",
  "srovnani_trh": "Průměrná cena v lokalitě je 45 000 Kč/m²"
}`;

    if (apiType === 'claude') {
        return await callClaudeAPI(apiKey, prompt, images);
    } else {
        return await callOpenAI(apiKey, prompt, images);
    }
}

async function callClaudeAPI(apiKey, prompt, images) {
    const imageContents = images.map(img => ({
        type: "image",
        source: {
            type: "base64",
            media_type: "image/jpeg",
            data: img.split(',')[1]
        }
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2000,
            messages: [{
                role: 'user',
                content: [
                    { type: "text", text: prompt },
                    ...imageContents
                ]
            }]
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Claude API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    try {
        return JSON.parse(data.content[0].text);
    } catch (e) {
        // Fallback if JSON parsing fails
        return {
            cena_odhad: "Nelze určit",
            cena_rozmezi: "Nelze určit",
            technicky_stav: 5,
            pozitiva: ["Analýza dokončena"],
            negativa: ["Chyba při zpracování"],
            doporuceni: ["Zkuste znovu s lepšími fotkami"],
            naklady_dokonceni: "Nelze určit",
            srovnani_trh: data.content[0].text
        };
    }
}

async function callOpenAI(apiKey, prompt, images) {
    const imageContents = images.slice(0, 10).map(img => ({
        type: "image_url",
        image_url: { 
            url: img,
            detail: "low"
        }
    }));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{
                role: 'user',
                content: [
                    { type: "text", text: prompt },
                    ...imageContents
                ]
            }],
            max_tokens: 2000
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    try {
        return JSON.parse(data.choices[0].message.content);
    } catch (e) {
        // Fallback if JSON parsing fails
        return {
            cena_odhad: "Nelze určit",
            cena_rozmezi: "Nelze určit",
            technicky_stav: 5,
            pozitiva: ["Analýza dokončena"],
            negativa: ["Chyba při zpracování"],
            doporuceni: ["Zkuste znovu s lepšími fotkami"],
            naklady_dokonceni: "Nelze určit",
            srovnani_trh: data.choices[0].message.content
        };
    }
}

function displayResults(result) {
    const resultsContent = document.getElementById('resultsContent');
    
    resultsContent.innerHTML = `
        <div class="price-estimate">
            <div class="price-value">${result.cena_odhad || 'N/A'}</div>
            <div class="price-range">Rozmezí: ${result.cena_rozmezi || 'N/A'}</div>
        </div>

        <div class="result-card">
            <h3>Technický stav</h3>
            <p><strong>Hodnocení:</strong> ${result.technicky_stav || 'N/A'}/10</p>
            <div style="background: #e9ecef; height: 8px; border-radius: 4px; margin: 12px 0;">
                <div style="background: linear-gradient(135deg, #2980b9, #3498db); height: 100%; width: ${(result.technicky_stav || 0) * 10}%; border-radius: 4px;"></div>
            </div>
        </div>

        <div class="result-card">
            <h3>Pozitiva nemovitosti</h3>
            <ul>
                ${(result.pozitiva || []).map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>

        <div class="result-card">
            <h3>Negativa a rizika</h3>
            <ul>
                ${(result.negativa || []).map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>

        <div class="result-card">
            <h3>Doporučení pro zvýšení hodnoty</h3>
            <ul>
                ${(result.doporuceni || []).map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>

        <div class="result-card">
            <h3>Náklady na dokončení</h3>
            <p><strong>${result.naklady_dokonceni || 'N/A'}</strong></p>
        </div>

        <div class="result-card">
            <h3>Srovnání s trhem</h3>
            <p>${result.srovnani_trh || 'N/A'}</p>
        </div>

        <div style="margin-top: 30px; text-align: center;">
            <button onclick="exportResults()" style="background: #28a745; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; margin-right: 12px;">
                Export do PDF
            </button>
            <button onclick="copyResults()" style="background: #17a2b8; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer;">
                Kopírovat text
            </button>
        </div>
    `;
}

function exportResults() {
    const results = document.getElementById('resultsContent');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>AI Vyhodnocení Nemovitosti</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 40px; 
                    color: #333;
                    line-height: 1.6;
                }
                h1, h2, h3 { 
                    color: #1d1d1f; 
                    border-bottom: 2px solid #667eea;
                    padding-bottom: 10px;
                }
                .price-estimate { 
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    text-align: center;
                    padding: 30px;
                    border-radius: 12px;
                    margin: 20px 0;
                }
                .price-value { 
                    font-size: 2.5em; 
                    font-weight: bold; 
                }
                .result-card { 
                    background: #f8f9fa; 
                    padding: 20px; 
                    margin: 20px 0; 
                    border-radius: 8px; 
                    border-left: 4px solid #667eea;
                }
                ul { 
                    padding-left: 20px; 
                }
                li { 
                    margin: 8px 0; 
                }
            </style>
        </head>
        <body>
            <h1>AI Vyhodnocení Nemovitosti</h1>
            <p>Datum: ${new Date().toLocaleDateString('cs-CZ')}</p>
            ${results.innerHTML.replace(/<button[^>]*>.*?<\/button>/g, '')}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

function copyResults() {
    const resultsContent = document.getElementById('resultsContent');
    const textContent = resultsContent.innerText;
    
    navigator.clipboard.writeText(textContent).then(() => {
        alert('Výsledky zkopírovány do schránky!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Výsledky zkopírovány do schránky!');
    });
}
