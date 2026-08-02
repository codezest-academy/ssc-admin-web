export function oklchToRelativeLuminance(l: number, c: number, h: number): number {
  // Convert Hue from degrees to radians
  const hRad = (h * Math.PI) / 180;

  // OKLCH to OKLAB
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // OKLAB to non-linear LMS
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  // Cube to get linear LMS
  const l_lin = Math.pow(l_, 3);
  const m_lin = Math.pow(m_, 3);
  const s_lin = Math.pow(s_, 3);

  // Linear LMS to Linear sRGB
  let r_lin = 4.0767416621 * l_lin - 3.3077115913 * m_lin + 0.2309699292 * s_lin;
  let g_lin = -1.2684380046 * l_lin + 2.6097574011 * m_lin - 0.3413193965 * s_lin;
  let b_lin = -0.0041960863 * l_lin - 0.7034186147 * m_lin + 1.7076147010 * s_lin;

  // Clamp Linear sRGB between 0 and 1
  r_lin = Math.max(0, Math.min(1, r_lin));
  g_lin = Math.max(0, Math.min(1, g_lin));
  b_lin = Math.max(0, Math.min(1, b_lin));

  // WCAG Relative Luminance
  return 0.2126 * r_lin + 0.7152 * g_lin + 0.0722 * b_lin;
}

export function getContrastRatio(lum1: number, lum2: number): number {
  const l1 = Math.max(lum1, lum2);
  const l2 = Math.min(lum1, lum2);
  return (l1 + 0.05) / (l2 + 0.05);
}

// Helper to parse "oklch(0.96 0.01 250)" strings or similar CSS values
export function parseOklch(value: string): { l: number; c: number; h: number } | null {
  const match = value.match(/oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\)/);
  if (!match) return null;
  return {
    l: parseFloat(match[1]),
    c: parseFloat(match[2]),
    h: parseFloat(match[3]),
  };
}
