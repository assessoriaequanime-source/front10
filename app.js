import { initNeuralAtlas } from './neural_atlas.js';
import { initStateManager } from './state_manager.js';
import { initDefenseLayer } from './defense_layer.js';
import { initAuditLogs } from './audit_logs.js';
import { initEconomyHub } from './economy_hub.js';
import { initSovereigntyAudit } from './sovereignty_audit.js';

document.addEventListener('DOMContentLoaded', () => {

    lucide.createIcons();

    initNeuralAtlas();
    initStateManager();
    initDefenseLayer(); 
    initAuditLogs();
    initEconomyHub();
    initSovereigntyAudit();

    console.log("SingulAI Sovereign Command Center - Governance Layer Active v2.2");
});
