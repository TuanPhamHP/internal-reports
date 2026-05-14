export type DevReportRow = {
	Assignee: string;
	'Assignee Id': string;
	'Custom field (Story Points)': string;
	'Custom field (Story point estimate)': string;
	'Due date': string;
	'Issue Type': string;
	'Issue id': string;
	'Issue key': string;
	Sprint: string;
	Status: string;
	Summary: string;
	'Time Spent': string;
	'Parent summary': string;
};

export type MemberLevel = 'intern' | 'fresher' | 'junior' | 'middle' | 'senior';

export type KpiTarget = {
	label: string;
	spPerMonth: number; // SP tối thiểu/tháng
	completionRate: number; // % task hoàn thành tối thiểu
	bugRateMax: number; // % bug rate tối đa (thấp hơn = tốt hơn)
	timeSpentMinHours: number; // Số giờ log tối thiểu/tháng
};

export type OKR = {
	id: number;
	title: string;
	description: string;
	completionRate: number; // 0–100
};

export const KPI_TARGETS: Record<MemberLevel, KpiTarget> = {
	intern: { label: 'Intern', spPerMonth: 25, completionRate: 70, bugRateMax: 20, timeSpentMinHours: 80 },
	fresher: { label: 'Fresher', spPerMonth: 25, completionRate: 70, bugRateMax: 20, timeSpentMinHours: 80 },
	junior: { label: 'Junior', spPerMonth: 30, completionRate: 75, bugRateMax: 15, timeSpentMinHours: 100 },
	middle: { label: 'Middle', spPerMonth: 70, completionRate: 85, bugRateMax: 10, timeSpentMinHours: 120 },
	senior: { label: 'Senior', spPerMonth: 90, completionRate: 90, bugRateMax: 5, timeSpentMinHours: 140 },
};
