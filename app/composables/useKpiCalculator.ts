import type { KpiDev, KpiDevJira, KpiDevResult, KpiManager, KpiManagerResult, KpiState, KpiWeights } from '~/models/kpi';
import { KPI_TARGETS } from '~/models/index';

// Clamp actual/target ratio to 0–100 (exceeding target = 100, not more)
function absScore(actual: number, target: number): number {
	if (target <= 0) return 0;
	return Math.min(actual / target, 1) * 100;
}

// Normalize a 1–10 slider value to 0–100
function norm(val: number): number {
	return ((val - 1) / 9) * 100;
}

// Average of 3 group scores, normalized to 0–100
function groupScore(g: { score1: number; score2: number; score3: number }): number {
	return norm((g.score1 + g.score2 + g.score3) / 3);
}

// Estimation accuracy: how close spActual is to spEstimate → 0–100
export function calcEstimationAccuracy(jira: KpiDevJira): number {
	if (jira.spEstimate === 0) return 0;
	const accuracy = 1 - Math.abs(jira.spActual - jira.spEstimate) / jira.spEstimate;
	return Math.max(0, accuracy) * 100;
}

// Piecewise linear tiers mapping SP achievement % → efficiency score
// Each entry means: up to `threshold` fraction of target, score scales linearly to `score`
const SP_EFF_TIERS = [
	{ threshold: 0.4, score: 20,  label: 'Rất thấp (<40%)' },
	{ threshold: 0.6, score: 40,  label: 'Thấp (40–60%)' },
	{ threshold: 0.8, score: 60,  label: 'Trung bình (60–80%)' },
	{ threshold: 1.0, score: 80,  label: 'Khá (80–100%)' },
] as const;

export type EffTierLabel = typeof SP_EFF_TIERS[number]['label'] | 'Đạt SP, chờ time' | 'Đạt KPI ✓';

function calcTieredEffScore(spPct: number): { score: number; label: EffTierLabel } {
	const p = Math.min(Math.max(spPct, 0), 1);
	let prevThreshold = 0, prevScore = 0;
	for (const tier of SP_EFF_TIERS) {
		if (p <= tier.threshold) {
			const ratio = (p - prevThreshold) / (tier.threshold - prevThreshold);
			return { score: prevScore + ratio * (tier.score - prevScore), label: tier.label };
		}
		prevThreshold = tier.threshold;
		prevScore = tier.score;
	}
	return { score: 80, label: 'Khá (80–100%)' };
}

export interface ObjBreakdown {
	spScore: number; compScore: number; effScore: number;
	effLabel: EffTierLabel;
	spTarget: number; timeTarget: number; compTarget: number;
	spPct: number; // sp / spTarget, không capped
	actualSp: number; actualTimeH: number; actualCompRate: number;
}

export interface SubBreakdown {
	response: number; quality: number; bugRate: number; teamwork: number;
}

export function calcObjBreakdown(dev: KpiDev): ObjBreakdown {
	const target = KPI_TARGETS[dev.level];
	const actualCompRate = dev.jira.totalTasks > 0 ? (dev.jira.doneTasks / dev.jira.totalTasks) * 100 : 0;
	const spPct   = target.spPerMonth > 0 ? dev.jira.sp / target.spPerMonth : 0;
	const metSP   = spPct >= 1;
	const metTime = dev.jira.timeSpentHours >= target.timeSpentMinHours;

	let effScore: number;
	let effLabel: EffTierLabel;
	if (metSP && metTime) {
		effScore = 100;
		effLabel = 'Đạt KPI ✓';
	} else if (metSP) {
		// Đạt SP nhưng chưa đủ time: 80–99 tỉ lệ theo time đã log
		const timePct = Math.min(dev.jira.timeSpentHours / target.timeSpentMinHours, 1);
		effScore = 80 + timePct * 20;
		effLabel = 'Đạt SP, chờ time';
	} else {
		const result = calcTieredEffScore(spPct);
		effScore = result.score;
		effLabel = result.label;
	}

	return {
		spScore:     absScore(dev.jira.sp, target.spPerMonth),
		effScore,
		effLabel,
		compScore:   absScore(actualCompRate, target.completionRate),
		spTarget:    target.spPerMonth,
		timeTarget:  target.timeSpentMinHours,
		compTarget:  target.completionRate,
		spPct,
		actualSp:    dev.jira.sp,
		actualTimeH: dev.jira.timeSpentHours,
		actualCompRate,
	};
}

export function calcSubBreakdown(dev: KpiDev): SubBreakdown {
	const s = dev.subjective;
	return {
		response: norm(s.response),
		quality:  norm(s.quality),
		bugRate:  norm(s.bugRate),
		teamwork: norm(s.teamwork),
	};
}

export function calcObjectiveScore(dev: KpiDev, _allDevs: KpiDev[], weights: KpiWeights): number {
	const b = calcObjBreakdown(dev);
	return (
		b.spScore   * (weights.objSp        / 100) +
		b.effScore  * (weights.objEfficiency / 100) +
		b.compScore * (weights.objCompletion / 100)
	);
}

export function calcSubjectiveScore(dev: KpiDev, weights: KpiWeights): number {
	const s = dev.subjective;
	return (
		norm(s.response) * (weights.subResponse / 100) +
		norm(s.quality) * (weights.subQuality / 100) +
		norm(s.bugRate) * (weights.subBugRate / 100) +
		norm(s.teamwork) * (weights.subTeamwork / 100)
	);
}

export function calcDevTotalScore(dev: KpiDev, allDevs: KpiDev[], weights: KpiWeights): number {
	const sub = calcSubjectiveScore(dev, weights);
	if (dev.role === 'tester') return sub;
	const obj = calcObjectiveScore(dev, allDevs, weights);
	return obj * (weights.objective / 100) + sub * (weights.subjective / 100);
}

export function calcManagerScore(manager: KpiManager, weights: KpiWeights): number {
	return (
		groupScore(manager.organization) * (weights.mgrOrganization / 100) +
		groupScore(manager.schedule) * (weights.mgrSchedule / 100) +
		groupScore(manager.quality) * (weights.mgrQuality / 100) +
		groupScore(manager.teamDev) * (weights.mgrTeamDev / 100)
	);
}

export function calcAllResults(state: KpiState): {
	devResults: KpiDevResult[];
	managerResult: KpiManagerResult;
} {
	const devResults: KpiDevResult[] = state.devs.map(dev => ({
		dev,
		objectiveScore: calcObjectiveScore(dev, state.devs, state.weights),
		subjectiveScore: calcSubjectiveScore(dev, state.weights),
		totalScore: calcDevTotalScore(dev, state.devs, state.weights),
		weightedScore: 0,
		contribution: 0,
		bonusAmount: 0,
	}));

	devResults.forEach(r => {
		r.weightedScore = r.totalScore * (r.dev.coefficient ?? 1);
	});

	const totalWeightedScore = devResults.reduce((sum, r) => sum + r.weightedScore, 0);
	const totalDevBonus = state.project.totalBonus * (state.project.devBonusRatio / 100);

	devResults.forEach(r => {
		r.contribution = totalWeightedScore > 0 ? (r.weightedScore / totalWeightedScore) * 100 : 0;
		r.bonusAmount = totalDevBonus * (r.contribution / 100);
	});

	const managerTotalScore = calcManagerScore(state.manager, state.weights);
	const managerBonus = state.project.totalBonus * ((100 - state.project.devBonusRatio) / 100);

	return {
		devResults,
		managerResult: {
			totalScore: managerTotalScore,
			bonusAmount: managerBonus * (managerTotalScore / 100),
		},
	};
}

// Tab completion helpers
export function isConfigComplete(state: KpiState): boolean {
	return !!(
		state.project.name.trim() &&
		state.project.period.trim() &&
		state.project.totalBonus > 0 &&
		state.devs.length > 0
	);
}

export function isDevsComplete(state: KpiState): boolean {
	return state.devs.length > 0 && state.devs.every(d => d.name.trim() !== '');
}

export function isManagerComplete(_state: KpiState): boolean {
	return true; // defaults are always set
}

export function scoreColorClass(score: number): string {
	if (score >= 80) return 'text-green-600 dark:text-green-400';
	if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
	return 'text-red-500 dark:text-red-400';
}

export function scoreBgClass(score: number): string {
	if (score >= 80) return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
	if (score >= 60) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300';
	return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
}

export function scoreBarClass(score: number): string {
	if (score >= 80) return 'bg-green-500';
	if (score >= 60) return 'bg-yellow-400';
	return 'bg-red-400';
}

export function formatVnd(amount: number): string {
	return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}
