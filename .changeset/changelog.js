const changelogModule = require("@changesets/cli/changelog");

const defaultChangelog = changelogModule.default || changelogModule;

const TYPE_LABELS = {
  build: "Build",
  chore: "Chore",
  ci: "CI",
  docs: "Docs",
  feat: "Feature",
  fix: "Bug Fix",
  perf: "Performance",
  refactor: "Refactor",
  revert: "Revert",
  style: "Style",
  test: "Test",
};

const CONVENTIONAL_RE =
  /^(?<type>[a-z]+)(?:\((?<scope>[^)]+)\))?(?<breaking>!)?:\s*(?<description>.+)$/i;

function formatReleaseLine(changeset) {
  const [firstLineRaw, ...futureLinesRaw] = changeset.summary
    .split("\n")
    .map((line) => line.trimEnd());
  const match = firstLineRaw.match(CONVENTIONAL_RE);

  const commitPrefix = changeset.commit
    ? `${changeset.commit.slice(0, 7)}: `
    : "";
  const details =
    futureLinesRaw.length > 0
      ? "\n" + futureLinesRaw.map((line) => "  " + line).join("\n")
      : "";

  if (!match || !match.groups) {
    return `- ${commitPrefix}${firstLineRaw}${details}`;
  }

  const type = match.groups.type.toLowerCase();
  const label = TYPE_LABELS[type] || "Other";
  const scope = match.groups.scope ? `(${match.groups.scope}) ` : "";
  const breaking = match.groups.breaking ? "BREAKING " : "";
  const description = match.groups.description;

  return `- ${commitPrefix}[${breaking}${label}] ${scope}${description}${details}`;
}

module.exports = {
  getReleaseLine: async (changeset) => formatReleaseLine(changeset),
  getDependencyReleaseLine: defaultChangelog.getDependencyReleaseLine,
};
