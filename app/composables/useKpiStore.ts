import type { DevReportRow, KpiDev, KpiDevJira, KpiManager, KpiManagerGroup, KpiState } from '~/models/kpi';

const STORAGE_KEY = 'kpi-bonus-state';

function defaultManagerGroup(): KpiManagerGroup {
	return { score1: 5, score2: 5, score3: 5, note: '' };
}

function defaultManager(): KpiManager {
	return {
		organization: defaultManagerGroup(),
		schedule: defaultManagerGroup(),
		quality: defaultManagerGroup(),
		teamDev: defaultManagerGroup(),
	};
}

function defaultDev(): KpiDev {
	return {
		id: crypto.randomUUID(),
		name: '',
		role: 'dev',
		level: 'junior',
		monthsInProject: 1,
		coefficient: 1,
		jira: { sp: 0, timeSpentHours: 0, spEstimate: 0, spActual: 0, totalTasks: 0, doneTasks: 0 },
		subjective: {
			response: 5,
			quality: 5,
			bugRate: 5,
			teamwork: 5,
			notes: { response: '', quality: '', bugRate: '', teamwork: '' },
		},
	};
}

function defaultState(): KpiState {
	return {
		project: {
			name: '',
			period: '',
			totalBonus: 0,
			devBonusRatio: 70,
			managerName: '',
		},
		weights: {
			objective: 60,
			subjective: 40,
			objSp: 50,
			objEfficiency: 30,
			objCompletion: 20,
			subResponse: 30,
			subQuality: 35,
			subBugRate: 20,
			subTeamwork: 15,
			mgrOrganization: 25,
			mgrSchedule: 30,
			mgrQuality: 25,
			mgrTeamDev: 20,
		},
		devs: [],
		manager: defaultManager(),
		rawCsvRows: [],
		availableParents: [],
		selectedParents: [],
	};
}

// Aggregate KpiDevJira from rows belonging to one assignee, filtered by selected parents
export function aggregateJiraFromRows(rows: DevReportRow[], selectedParents: string[]): KpiDevJira {
	const filtered = selectedParents.length === 0
		? rows
		: rows.filter(r => selectedParents.includes(r['Parent summary'] || r['Sprint']));
	const doneRows = filtered.filter(r => r.Status === 'Done' || r.Status === 'Ready for Test');
	return {
		sp: doneRows.reduce((s, r) => s + (parseFloat(r['Custom field (Story Points)']) || 0), 0),
		timeSpentHours: filtered.reduce((s, r) => s + (parseInt(r['Time Spent']) || 0), 0) / 3600,
		spEstimate: rows.length > 0
			? rows.reduce((s, r) => s + (parseFloat(r['Custom field (Story point estimate)']) || 0), 0) / rows.length
			: 0,
		spActual: doneRows.length > 0
			? doneRows.reduce((s, r) => s + (parseFloat(r['Custom field (Story Points)']) || 0), 0) / doneRows.length
			: 0,
		totalTasks: filtered.length,
		doneTasks: doneRows.length,
	};
}

function loadFromStorage(): KpiState | null {
	if (typeof localStorage === 'undefined') return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as KpiState) : null;
	} catch {
		return null;
	}
}

export function useKpiStore() {
	const state = ref<KpiState>(defaultState());

	onMounted(() => {
		const stored = loadFromStorage();
		if (stored) {
			// Backfill fields missing in older persisted state
			state.value = {
				...defaultState(),
				...stored,
			};
		}
	});

	watch(
		state,
		val => {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
			}
		},
		{ deep: true },
	);

	function addDev() {
		state.value.devs.push(defaultDev());
	}

	function removeDev(id: string) {
		state.value.devs = state.value.devs.filter(d => d.id !== id);
	}

	function resetState() {
		state.value = defaultState();
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem(STORAGE_KEY);
		}
	}

	function exportJson() {
		const blob = new Blob([JSON.stringify(state.value, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `kpi-bonus-${state.value.project.period || 'export'}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function importJson(file: File) {
		const reader = new FileReader();
		reader.onload = e => {
			try {
				const data = JSON.parse(e.target?.result as string) as KpiState;
				state.value = { ...defaultState(), ...data };
			} catch {
				// silently ignore parse errors
			}
		};
		reader.readAsText(file);
	}

	return { state, addDev, removeDev, resetState, exportJson, importJson };
}
