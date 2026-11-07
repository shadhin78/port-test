import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const css = fs.readFileSync(path.join(process.cwd(), "src", "app", "globals.css"), "utf8");

/** Collect `--token: #hex;` declarations from the first block that starts with `selector`. */
function readTokens(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`Selector not found: ${selector}`);
  const block = css.slice(start, css.indexOf("}", start));
  const tokens: Record<string, string> = {};
  for (const match of block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((index) => {
    const value = parseInt(hex.slice(index, index + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const themes = {
  dark: readTokens(":root"),
  light: readTokens(':root[data-theme="light"]'),
};

// [foreground token, background token, minimum ratio, where it is used]
const pairs: [string, string, number, string][] = [
  ["text-primary", "background", 4.5, "body text"],
  ["text-primary", "surface", 4.5, "text on cards"],
  ["text-primary", "surface-elevated", 4.5, "text on hovered cards"],
  ["text-secondary", "background", 4.5, "muted text"],
  ["text-secondary", "surface", 4.5, "muted text on cards"],
  ["text-secondary", "surface-elevated", 4.5, "muted text on hovered cards"],
  ["primary", "background", 4.5, "link text"],
  ["primary", "surface", 4.5, "link text on cards"],
  ["primary", "surface-elevated", 4.5, "link text on hovered cards"],
  ["on-primary", "primary", 4.5, "primary button text"],
  ["success", "surface", 4.5, "success status text"],
  ["warning", "surface", 4.5, "warning status text"],
  ["primary", "background", 3, "focus indicator (non-text, 3:1)"],
];

describe.each(Object.entries(themes))("%s theme tokens", (_name, tokens) => {
  it("defines every token the tests rely on", () => {
    for (const [foreground, background] of pairs) {
      expect(tokens, foreground).toHaveProperty(foreground);
      expect(tokens, background).toHaveProperty(background);
    }
  });

  it.each(pairs)("%s on %s meets %s:1 (%s)", (foreground, background, minimum) => {
    expect(contrast(tokens[foreground], tokens[background])).toBeGreaterThanOrEqual(minimum);
  });
});
