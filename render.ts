import type { Theme } from "@oh-my-pi/pi-coding-agent/modes/theme/theme";
import { getMarkdownTheme } from "@oh-my-pi/pi-coding-agent/modes/theme/theme";
import type { Component } from "@oh-my-pi/pi-tui";
import { Box, Markdown, Spacer, Text } from "@oh-my-pi/pi-tui";
import type { SkillToolDetails, SkillToolParams } from "./run.ts";
import { skillCallView, skillResultView } from "./view.ts";

type SkillResult = {
	content: Array<{ type: string; text?: string }>;
	details?: SkillToolDetails;
	isError?: boolean;
};

type RenderOptions = {
	expanded: boolean;
};

export function renderSkillCall(args: SkillToolParams, _options: RenderOptions, theme: Theme): Component {
	const view = skillCallView(args);
	return new Text(formatChipHeader(theme, view.name, view.args), 0, 0);
}

export function renderSkillResult(
	result: SkillResult,
	options: RenderOptions,
	theme: Theme,
	_args?: SkillToolParams,
): Component {
	const view = skillResultView(result);
	if (view.kind === "error") {
		return new Text(theme.fg("error", view.text), 0, 0);
	}

	const box = new Box(1, 1, text => theme.bg("customMessageBg", text));
	box.setIgnoreTight(true);
	box.setBorder({
		chars: theme.boxRound,
		color: text => theme.fg("borderMuted", text),
	});
	box.addChild(new Text(formatChipHeader(theme, view.name, view.args), 0, 0));

	const count = `${view.lineCount} ${view.lineCount === 1 ? "line" : "lines"}`;
	const sep = theme.sep?.dot ?? "·";
	box.addChild(new Text(`  ${theme.fg("accent", view.displayPath)}${theme.fg("muted", ` ${sep} ${count}`)}`, 0, 0));

	if (!options.expanded || !view.body) {
		return box;
	}

	box.addChild(new Spacer(1));
	box.addChild(new Text(theme.fg("muted", "prompt"), 0, 0));
	box.addChild(new Spacer(1));
	box.addChild(
		new Markdown(view.body, 0, 0, getMarkdownTheme(), {
			color: (value: string) => theme.fg("customMessageText", value),
		}),
	);
	return box;
}

function formatChipHeader(theme: Theme, name: string, args: string): string {
	const icon = theme.icon?.extensionSkill ?? "✦";
	const tag = theme.fg("customMessageLabel", theme.bold(`${icon} skill`));
	let header = `${tag} ${theme.fg("customMessageText", theme.bold(name))}`;
	if (args) {
		header += ` ${theme.fg("dim", args)}`;
	}
	return header;
}
