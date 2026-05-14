import type { DevReportRow, MemberLevel } from '~/models/index';
export type { DevReportRow, MemberLevel };

export interface KpiProject {
	name: string;
	period: string;
	totalBonus: number;
	devBonusRatio: number; // 0–100
	managerName: string;
}

export interface KpiWeights {
	// Objective vs subjective split (sum = 100)
	objective: number; // default 60
	subjective: number; // default 40
	// Sub-weights within objective (sum = 100)
	objSp: number; // default 50
	objEfficiency: number; // default 30
	objCompletion: number; // default 20
	// Sub-weights within subjective (sum = 100)
	subResponse: number; // default 30
	subQuality: number; // default 35
	subBugRate: number; // default 20
	subTeamwork: number; // default 15
	// Manager group weights (sum = 100)
	mgrOrganization: number; // default 25
	mgrSchedule: number; // default 30
	mgrQuality: number; // default 25
	mgrTeamDev: number; // default 20
}

export interface KpiDevJira {
	sp: number;
	timeSpentHours: number;
	spEstimate: number;
	spActual: number;
	totalTasks: number;
	doneTasks: number;
}

export interface KpiDevSubjective {
	response: number; // 1–10
	quality: number; // 1–10
	bugRate: number; // 1–10 (10 = 0 bugs)
	teamwork: number; // 1–10
	notes: {
		response: string;
		quality: string;
		bugRate: string;
		teamwork: string;
	};
}

export interface KpiDev {
	id: string;
	name: string;
	role: 'dev' | 'tester';
	level: MemberLevel;
	monthsInProject: number;
	coefficient: number; // hệ số cống hiến, default 1.0
	jira: KpiDevJira;
	subjective: KpiDevSubjective;
}

export interface KpiManagerGroup {
	score1: number; // 1–10
	score2: number; // 1–10
	score3: number; // 1–10
	note: string;
}

export interface KpiManager {
	organization: KpiManagerGroup;
	schedule: KpiManagerGroup;
	quality: KpiManagerGroup;
	teamDev: KpiManagerGroup;
}

export interface KpiState {
	project: KpiProject;
	weights: KpiWeights;
	devs: KpiDev[];
	manager: KpiManager;
	// Jira CSV filter
	rawCsvRows: DevReportRow[];   // raw rows từ lần import gần nhất
	availableParents: string[];   // unique parent/sprint names trong CSV
	selectedParents: string[];    // filter — empty = chọn tất cả
}

// Computed results — not persisted
export interface KpiDevResult {
	dev: KpiDev;
	objectiveScore: number; // 0–100
	subjectiveScore: number; // 0–100
	totalScore: number; // 0–100
	weightedScore: number; // totalScore × coefficient
	contribution: number; // % of team (based on weightedScore)
	bonusAmount: number; // VND
}

export interface KpiManagerResult {
	totalScore: number; // 0–100
	bonusAmount: number; // VND
}
