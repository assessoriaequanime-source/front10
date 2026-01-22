let sglBalance = 2450.45;
let yieldChart = null;
const SGL_TO_USD = 0.42;
const SGL_TO_ETH = 0.00015;

export function initEconomyHub() {
    initChart();
    setupLiquidateButton();
    startMockEconomyEngine();
}

function initChart() {
    const ctx = document.getElementById('yield-chart').getContext('2d');
    
    yieldChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(10).fill(''),
            datasets: [{
                label: 'Yield',
                data: [12, 19, 15, 25, 22, 30, 28, 45, 38, 52],
                borderColor: '#D4AF37',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
                fill: true,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) return null;
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, 'rgba(212, 175, 55, 0)');
                    gradient.addColorStop(1, 'rgba(212, 175, 55, 0.1)');
                    return gradient;
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            animation: { duration: 1000 }
        }
    });
}

function updateWalletDisplay() {
    const sglEl = document.getElementById('wallet-sgl');
    const usdEl = document.getElementById('wallet-usd');
    const ethEl = document.getElementById('wallet-eth');

    sglEl.innerText = `${sglBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SGL`;
    usdEl.innerText = `$${(sglBalance * SGL_TO_USD).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    ethEl.innerText = `${(sglBalance * SGL_TO_ETH).toFixed(4)} ETH`;
}

function addEconomyLog(msg) {
    const container = document.getElementById('economy-logs');
    const div = document.createElement('div');
    div.className = "text-[9px] border-l border-[#D4AF37]/30 pl-2 opacity-0 transform translate-x-2";
    
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    div.innerHTML = `
        <span class="text-white/20">[${time}]</span>
        <span class="text-white/70">${msg}</span>
    `;

    container.prepend(div);
    gsap.to(div, { opacity: 1, x: 0, duration: 0.4 });

    if (container.children.length > 20) {
        container.removeChild(container.lastChild);
    }
}

function setupLiquidateButton() {
    const btn = document.getElementById('btn-liquidate');
    btn.addEventListener('click', () => {
        const bonus = Math.random() * 50;
        sglBalance += bonus;
        addEconomyLog(`<span class="text-[#D4AF37] font-bold">KNOWLEDGE LIQUIDATED:</span> +${bonus.toFixed(2)} SGL`);
        updateWalletDisplay();
        
        gsap.to(btn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
        

        const newData = [...yieldChart.data.datasets[0].data];
        newData.push(newData[newData.length - 1] + 15);
        newData.shift();
        yieldChart.data.datasets[0].data = newData;
        yieldChart.update();
    });
}

function startMockEconomyEngine() {
    updateWalletDisplay();

    setInterval(() => {
        const queryId = Math.floor(Math.random() * 999);
        const reward = (Math.random() * 0.1).toFixed(2);
        
        sglBalance += parseFloat(reward);
        updateWalletDisplay();
        
        addEconomyLog(`HLM Query #${queryId} signed by Wallet - <span class="text-green-400">+${reward} SGL</span>`);
        

        const newData = [...yieldChart.data.datasets[0].data];
        const lastVal = newData[newData.length - 1];
        const nextVal = Math.max(10, lastVal + (Math.random() * 10 - 5));
        newData.push(nextVal);
        newData.shift();
        yieldChart.data.datasets[0].data = newData;
        yieldChart.update('none');

        document.getElementById('current-yield-val').innerText = `+${reward} SGL`;
    }, 4000);
}
