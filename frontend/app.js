const API_BASE = "/api";

// Initialize Charts
let resultsChart, shapChart;
const chartCtx = document.getElementById('resultsChart').getContext('2d');
const shapCtx = document.getElementById('shapChart').getContext('2d');

function setStatus(online) {
    const badge = $('backend-status');
    if (online) {
        badge.innerHTML = '<span class="pulse"></span> 9-HEAD ENGINE ACTIVE';
        badge.style.background = 'rgba(0, 242, 254, 0.1)';
        badge.style.color = '#00f2fe';
    } else {
        badge.innerHTML = '<span class="pulse offline"></span> GRID CONNECTION LOST';
        badge.style.background = 'rgba(255, 0, 127, 0.1)';
        badge.style.color = '#ff007f';
    }
}

function initCharts() {
    resultsChart = new Chart(chartCtx, {
        type: 'radar',
        data: {
            labels: ['Anger', 'Fear', 'Hate', 'Joy', 'Love', 'Sadness', 'Negative', 'Neutral', 'Positive'],
            datasets: [{
                label: 'Neural Confidence',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(0, 242, 254, 0.2)',
                borderColor: '#00f2fe',
                borderWidth: 2,
                pointBackgroundColor: '#00f2fe'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(255,255,255,0.1)' },
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    pointLabels: { color: '#e0e0e0', font: { size: 12, weight: 'bold' } },
                    ticks: { display: false, stepSize: 0.2 },
                    suggestedMin: 0,
                    suggestedMax: 1
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    shapChart = new Chart(shapCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'SHAP Value',
                data: [],
                backgroundColor: [],
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: { grid: { display: false }, ticks: { color: '#99aab5' } },
                y: { grid: { display: false }, ticks: { color: '#e0e0e0' } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// UI Helpers
const $ = id => document.getElementById(id);

function toggleLoading(show, status = "Waking up AI...") {
    const overlay = $('loading-overlay');
    if (show) {
        overlay.classList.remove('hidden');
        $('loading-status').innerText = status;
    } else {
        overlay.classList.add('hidden');
    }
}

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        $(btn.dataset.tab + '-tab').classList.add('active');
        
        // Tab Purge: Clear dashboard when switching context to prevent ghosting
        resetResultsUI();
    };
});

// File Handling & Drag/Drop
let selectedFile = null;

const dropZone = $('drop-zone');
const fileInput = $('file-input');

dropZone.onclick = () => fileInput.click();

fileInput.onchange = (e) => handleFileSelection(e.target.files[0]);

dropZone.ondragover = (e) => { e.preventDefault(); dropZone.style.borderColor = '#00f2fe'; };
dropZone.ondragleave = () => { dropZone.style.borderColor = 'rgba(255,255,255,0.08)'; };
dropZone.ondrop = (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'rgba(255,255,255,0.08)';
    handleFileSelection(e.dataTransfer.files[0]);
};

function handleFileSelection(file) {
    if (!file) return;
    selectedFile = file;
    
    // Neural Sync: Clear text context area when uploading vision evidence
    $('main-input').value = "";
    resetResultsUI();
    
    // Show Preview Card
    $('file-name-text').innerText = file.name;
    $('file-preview-card').classList.remove('hidden');
    dropZone.classList.add('hidden');
    
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => $('thumb-preview').src = e.target.result;
        reader.readAsDataURL(file);
    } else {
        $('thumb-preview').src = 'https://cdn-icons-png.flaticon.com/512/337/337946.png'; // Doc icon
    }
}

function resetMedia() {
    selectedFile = null;
    fileInput.value = "";
    $('file-preview-card').classList.add('hidden');
    dropZone.classList.remove('hidden');
    $('thumb-preview').src = "";
    $('loading-overlay').classList.add('hidden');
    resetResultsUI();
}

$('clear-media-btn').onclick = resetMedia;

$('compute-media-btn').onclick = () => {
    if (selectedFile) analyzeFile(selectedFile);
};

// Analysis Logic
function resetResultsUI() {
    // 1. Flush Stats Core
    const statCards = ['lang-stat', 'hate-stat', 'emotion-stat', 'sentiment-stat'];
    statCards.forEach(id => {
        const val = $(id).querySelector('.val');
        if (val) {
            val.innerText = '---';
            val.style.color = '#fff';
        }
    });
    
    // 2. Clear Verdict Area (Visual Reset Pulse)
    $('neural-verdict').innerHTML = '<span class="loading-inline">Initiating Neural Clean-Slate... Purging stale logic...</span>';
    
    // 3. Highlight Box Isolation
    $('text-highlight-area').innerHTML = '<span class="idle-text" style="color:#666; font-style:italic;">Awaiting EmiHate extraction for current context...</span>';
    
    // 4. Reset Animations & Themes
    document.body.classList.remove('state-hateful', 'state-safe', 'state-love');

    // 5. Zero-out Neural Charts
    if (resultsChart) {
        resultsChart.data.datasets[0].data = [0,0,0,0,0,0,0];
        resultsChart.update();
    }
    if (shapChart) {
        shapChart.data.labels = [];
        shapChart.data.datasets[0].data = [];
        shapChart.update();
        if ($('shap-msg')) $('shap-msg').remove();
    }
}

async function analyzeText() {
    const text = $('main-input').value;
    const useXAI = $('xai-toggle').checked;
    if (!text) return alert("Please enter some text!");

    resetResultsUI();
    toggleLoading(true, "Simultaneous Grid Analysis Active...");
    
    try {
        const res = await fetch(API_BASE + '/analyze/text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, explain: useXAI })
        });
        
        const data = await res.json();
        if (data.status === 'success') {
            updateUI(data.data);
            setStatus(true);
        }
    } catch (e) {
        setStatus(false);
    } finally {
        toggleLoading(false);
    }
}

async function analyzeFile(file) {
    const useXAI = $('xai-toggle').checked;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('explain', useXAI); 
    
    let endpoint = '/analyze/image';
    if (file.name.endsWith('.pdf')) endpoint = '/analyze/pdf';
    if (file.name.endsWith('.docx')) endpoint = '/analyze/docx';

    resetResultsUI();
    toggleLoading(true, "Deep Consolidated Neural Flush...");
    
    try {
        const res = await fetch(API_BASE + endpoint, { method: 'POST', body: formData });
        const data = await res.json();
        
        if (data.status === 'success') {
            updateUI(data.data);
            setStatus(true);
        } else {
            const msg = data.message || "Grid capacity limit reached.";
            $('neural-verdict').innerHTML = `<span class="error-msg" style="color:#ff007f;">⚠️ GRID ERROR: ${msg}</span>`;
        }
    } catch (e) {
        console.error("Neural Flush Interrupted:", e);
        // DEFENSIVE: Only show TIMEOUT if we have zero dashboard data
        const currentLang = $('lang-stat').querySelector('.val').innerText;
        if (!currentLang || currentLang === '---') {
            $('neural-verdict').innerHTML = `<span class="error-msg" style="color:#ff007f;">⚠️ CONNECTION TIMEOUT: High-resolution analysis took longer than 45s or the Grid is overwhelmed.</span>`;
            setStatus(false);
        } else {
            console.warn("Analysis completed with a secondary UI warning.");
        }
    } finally {
        toggleLoading(false);
    }
}

function updateUI(res) {
    const analysis = res.analysis;
    const explain = res.explainability || {};
    const xaiTarget = res.xai_target || "hate";
    
    // Update SHAP Chart Title dynamically for the presenter
    const xaiTitleMap = { 
        "hate": "Hate Detection Logic", 
        "emotion": "Emotion Analysis Insights", 
        "sentiment": "Sentiment Balance Weights" 
    };
    const xaiBadgeMap = {
        "hate": "Primary Evidence: Hate Detection",
        "emotion": "Primary Evidence: Emotion Analysis",
        "sentiment": "Primary Evidence: Sentiment Balance"
    };
    
    document.querySelector('.shap-panel h3').innerHTML = `<i class="fas fa-chart-line"></i> ${xaiTitleMap[xaiTarget]}`;
    if($('xai-active-head')) $('xai-active-head').innerText = xaiBadgeMap[xaiTarget];
    document.body.classList.remove('state-hateful', 'state-safe', 'state-love');
    const cards = document.querySelectorAll('.card');
    cards.forEach(c => {
        c.style.animation = 'none';
        setTimeout(() => c.style.animation = 'pulse-glow 0.8s ease-out', 10);
    });

    // 1. Stats row
    $('lang-stat').querySelector('.val').innerText = res.language_detected.toUpperCase();
    
    const hateLabel = analysis.hate_detection.final_label || "NEUTRAL";
    $('hate-stat').querySelector('.val').innerText = hateLabel;
    
    const emotionLabel = analysis.emotion.final_label || "---";
    $('emotion-stat').querySelector('.val').innerText = emotionLabel;

    // Reactive Theme Trigger
    const color = emotionLabel.includes('Love') ? '#ff00ff' : ((hateLabel === 'Hate' || hateLabel === 'Offense') ? '#ff007f' : '#00f2fe');
    const state = emotionLabel.includes('Love') ? 'state-love' : ((hateLabel === 'Hate' || hateLabel === 'Offense') ? 'state-hateful' : 'state-safe');
    
    document.body.classList.add(state);
    document.querySelectorAll('.stat-card .val').forEach(el => el.style.color = color);

    $('sentiment-stat').querySelector('.val').innerText = analysis.sentiment.final_label || "---";

    // 2. Neural Verdict Summary
    let verdict = `Analysis successful for <strong>${res.language_detected}</strong> script. `;
    if (hateLabel !== 'Neutral') {
        verdict += `The grid detected <strong>${hateLabel}</strong> content with a <strong>${analysis.sentiment.final_label}</strong> sentiment. The primary emotion is <strong>${analysis.emotion.final_label}</strong>.`;
    } else {
        verdict += `Content is <strong>Safu/Neutral</strong>. It expresses <strong>${analysis.emotion.final_label}</strong> with a <strong>${analysis.sentiment.final_label}</strong> tone.`;
    }
    $('neural-verdict').innerHTML = verdict;

    // 3. Radar Chart - Full Spectrum Sync
    const dataset = [
        analysis.emotion.anger,
        analysis.emotion.fear,
        analysis.emotion.hate,
        analysis.emotion.joy,
        analysis.emotion.love,
        analysis.emotion.sadness,
        analysis.sentiment.negative,
        analysis.sentiment.neutral,
        analysis.sentiment.positive
    ];
    resultsChart.data.datasets[0].data = dataset;
    resultsChart.update();

    // 3. SHAP Bar Chart
    const shapContainer = document.querySelector('.shap-chart-container');
    if (explain.shap && Object.keys(explain.shap).length > 0) {
        const entries = Object.entries(explain.shap).slice(0, 10);
        shapChart.data.labels = entries.map(e => e[0]);
        shapChart.data.datasets[0].data = entries.map(e => e[1]);
        
        // Dynamic Palette: If explaining Love/Positive, use Cyan/Magenta. If Hate, use Rose.
        const positiveTasks = ["emotion", "sentiment"];
        const isPositiveContext = positiveTasks.includes(xaiTarget) && (analysis.emotion.final_label === "Love" || analysis.sentiment.final_label === "Positive");
        
        shapChart.data.datasets[0].backgroundColor = entries.map(e => {
            if (isPositiveContext) {
                return e[1] > 0 ? 'rgba(0, 242, 254, 0.6)' : 'rgba(255, 0, 127, 0.4)';
            }
            return e[1] > 0 ? 'rgba(255, 51, 102, 0.6)' : 'rgba(0, 242, 254, 0.6)';
        });
        shapChart.update();
        if ($('shap-msg')) $('shap-msg').remove();
    } else {
        // Clear chart and show message
        shapChart.data.labels = [];
        shapChart.data.datasets[0].data = [];
        shapChart.update();
        
        let msgText = "XAI Diagnostics Offline (Library Check Required)";
        if (analysis.sentiment && analysis.sentiment.final_label) { 
             msgText = (res.text_processed.length > 500) ? "Logic too complex for deep SHAP. (Max 500 chars)" : "Fast Intelligence Sync: No critical features identified.";
        }

        if (!$('shap-msg')) {
            const msg = document.createElement('p');
            msg.id = 'shap-msg';
            msg.style.cssText = "font-size: 0.8rem; color: #8899a6; text-align: center; margin-top: 2rem; border: 1px dashed #444; padding: 10px; border-radius: 8px;";
            msg.innerText = msgText;
            shapContainer.appendChild(msg);
        } else {
            $('shap-msg').innerText = msgText;
        }
    }

    // 4. LIME Highlights - Calibrated for Positive vs Negative Context
    const text = res.text_processed; 
    let highlightedHtml = text || "";
    if (explain.lime && text) {
        // Dynamic Class Mapping: If context is Positive, 'Positive Contributors' should be Cyan
        const positiveTasks = ["emotion", "sentiment"];
        const isPositiveContext = positiveTasks.includes(xaiTarget) && (analysis.emotion.final_label === "Love" || analysis.sentiment.final_label === "Positive");

        explain.lime.forEach(([word, score]) => {
            let cls = "";
            if (isPositiveContext) {
                // In positive context, positive score = cyan (good), negative score = pink (alert)
                cls = score > 0.1 ? 'highlight-pos' : (score < -0.1 ? 'highlight-neg' : '');
            } else {
                // In negative/hate context, positive score = pink (hate), negative score = cyan (safe)
                cls = score > 0.1 ? 'highlight-neg' : (score < -0.1 ? 'highlight-pos' : '');
            }
            
            if (cls) {
                const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                highlightedHtml = highlightedHtml.replace(regex, `<span class="${cls}">$1</span>`);
            }
        });
    }
    $('text-highlight-area').innerHTML = highlightedHtml;
}

$('analyze-btn').onclick = analyzeText;

// --- Indestructible Multilingual Keyboard Matrix Pro V2.7 ---
let keyboard;
const NEURAL_LAYOUTS = {
    english: {
        default: [
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "{shift} z x c v b n m {backspace}",
            "{space} {ent}"
        ],
        shift: [
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "{shift} Z X C V B N M {backspace}",
            "{space} {ent}"
        ]
    },
    hindi: {
        default: [
            "ौ ै ा ी ू ब ह ग द ज ड ़ ो {backspace}",
            "ो े ् ि ु प र क त च ट",
            "{shift} ं म न व ल स , . य {shift}",
            "{space} {ent}"
        ],
        shift: [
            "औ ै ा ी ू भ ङ घ ध झ ढ ञ ॉ {backspace}",
            "ओ ए अ इ उ फ र ख थ छ ठ",
            "{shift} ँ ण न व ळ श ष । य {shift}",
            "{space} {ent}"
        ]
    },
    telugu: {
        default: [
            "ౌ ై ా ీ ూ బ హ గ ద జ డ ృ ో {backspace}",
            "ో ే ్ ి ు ప ర క త చ ట",
            "{shift} ొ ె అ ఇ ఉ ఫ ర ఖ థ ఛ ఠ {shift}",
            "{space} {ent}"
        ],
        shift: [
            "ఔ ఐ ఆ ఈ ఊ భ ఙ ఘ ధ ఝ ఢ ఞ ో {backspace}",
            "ఓ ఏ అ ఇ ఉ ఫ ర ఖ థ ఛ ఠ",
            "{shift} ౠ ఓ ఏ అ ఇ ఉ ఫ ర ఖ థ ఛ {shift}",
            "{space} {ent}"
        ]
    }
};

function initKeyboard() {
    const SimpleKeyboardClass = window.SimpleKeyboard ? window.SimpleKeyboard.default : null;

    if (!SimpleKeyboardClass) {
        console.warn("Keyboard Matrix initialization delayed... retrying.");
        return setTimeout(initKeyboard, 500);
    }
    
    try {
        keyboard = new SimpleKeyboardClass(".simple-keyboard", {
            onChange: input => {
                $('main-input').value = input;
                $('main-input').dispatchEvent(new Event('input'));
            },
            onKeyPress: button => {
                if (button === "{shift}" || button === "{lock}") handleShift();
                if (button === "{ent}") $('analyze-btn').click();
            },
            theme: "hg-theme-default",
            layout: NEURAL_LAYOUTS.english,
            display: {
                "{shift}": "SHIFT ⇧",
                "{backspace}": "BACKSPACE ⌫",
                "{ent}": "ANALYZE GRID ↵",
                "{space}": "SPACE [________]",
                "{tab}": "TAB ⇥",
                "{lock}": "LOCK ⇪"
            }
        });
        console.log("Full-Spectrum Keyboard Matrix Online [HI, TE, EN Ready]");
    } catch (err) {
        console.error("Critical Keyboard Sync Fault:", err);
    }
}

function handleShift() {
    let currentLayout = keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    keyboard.setOptions({
        layoutName: shiftToggle
    });
}

// Toggle Keyboard Visibility
$('toggle-keyboard').onclick = () => {
    $('keyboard-wrapper').classList.toggle('hidden');
    if (!keyboard) initKeyboard();
};

$('close-kb').onclick = () => {
    $('keyboard-wrapper').classList.add('hidden');
};

// Language Switching Logic - Pure Hardcoded Switch
$('kb-lang-select').onchange = (e) => {
    const lang = e.target.value;
    keyboard.setOptions({
        layout: NEURAL_LAYOUTS[lang] || NEURAL_LAYOUTS.english
    });
};

initCharts();
initKeyboard();
