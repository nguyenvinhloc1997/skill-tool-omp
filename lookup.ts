export type SkillRef = {
	name: string;
	filePath: string;
	baseDir: string;
	hide?: boolean;
};

export type ResolveResult =
	| { ok: true; skill: SkillRef }
	| { ok: false; reason: "invalid" | "unknown" | "hidden"; message: string };

export function resolveSkill(skills: readonly SkillRef[], rawName: string): ResolveResult {
	const trimmed = rawName.trim();
	const name = trimmed.startsWith("skill:") ? trimmed.slice("skill:".length).trim() : trimmed;
	if (!name) {
		return { ok: false, reason: "invalid", message: "skill name is required" };
	}

	const skill = skills.find(entry => entry.name === name);
	if (!skill) {
		const known = skills.filter(entry => !entry.hide).map(entry => entry.name);
		const listed = known.length > 0 ? known.join(", ") : "(none)";
		return {
			ok: false,
			reason: "unknown",
			message: `Unknown skill "${name}". Known skills: ${listed}`,
		};
	}

	if (skill.hide) {
		return {
			ok: false,
			reason: "hidden",
			message: `Skill "${name}" is hidden from model invocation. Use /skill:${name} if you meant to load it yourself.`,
		};
	}

	return { ok: true, skill };
}
