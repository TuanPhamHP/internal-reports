import { KPI_TARGETS, KPI_DESIGNER_TARGETS, KPI_BA_TARGETS } from '~/models/index';
import type { KpiTarget, MemberLevel } from '~/models/index';

const DEV_KEY = 'kpi-targets-dev';
const DESIGNER_KEY = 'kpi-targets-designer';
const BA_KEY = 'kpi-targets-ba';

function loadOrDefault(key: string, fallback: Record<MemberLevel, KpiTarget>): Record<MemberLevel, KpiTarget> {
	if (import.meta.client) {
		const stored = localStorage.getItem(key);
		if (stored) {
			try { return JSON.parse(stored) as Record<MemberLevel, KpiTarget>; } catch {}
		}
	}
	return JSON.parse(JSON.stringify(fallback)) as Record<MemberLevel, KpiTarget>;
}

export function useKpiTargets() {
	const devTargets = useState<Record<MemberLevel, KpiTarget>>('kpiDevTargets', () =>
		loadOrDefault(DEV_KEY, KPI_TARGETS),
	);
	const designerTargets = useState<Record<MemberLevel, KpiTarget>>('kpiDesignerTargets', () =>
		loadOrDefault(DESIGNER_KEY, KPI_DESIGNER_TARGETS),
	);
	const baTargets = useState<Record<MemberLevel, KpiTarget>>('kpiBaTargets', () =>
		loadOrDefault(BA_KEY, KPI_BA_TARGETS),
	);

	function getTargetsForRole(role: string): Record<MemberLevel, KpiTarget> {
		if (role === 'designer') return designerTargets.value;
		if (role === 'ba') return baTargets.value;
		return devTargets.value;
	}

	function saveDev() { localStorage.setItem(DEV_KEY, JSON.stringify(devTargets.value)); }
	function saveDesigner() { localStorage.setItem(DESIGNER_KEY, JSON.stringify(designerTargets.value)); }
	function saveBa() { localStorage.setItem(BA_KEY, JSON.stringify(baTargets.value)); }
	function resetDev() { devTargets.value = JSON.parse(JSON.stringify(KPI_TARGETS)); localStorage.removeItem(DEV_KEY); }
	function resetDesigner() { designerTargets.value = JSON.parse(JSON.stringify(KPI_DESIGNER_TARGETS)); localStorage.removeItem(DESIGNER_KEY); }
	function resetBa() { baTargets.value = JSON.parse(JSON.stringify(KPI_BA_TARGETS)); localStorage.removeItem(BA_KEY); }

	return { devTargets, designerTargets, baTargets, getTargetsForRole, saveDev, saveDesigner, saveBa, resetDev, resetDesigner, resetBa };
}
