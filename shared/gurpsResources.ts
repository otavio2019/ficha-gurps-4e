export const clampResource = (value: number, maximum: number) => Math.max(0, Math.min(Math.max(0, maximum), Math.round(value)));

export const describeResourceChange = (label: "PV" | "PF", previous: number, next: number) => {
  if (next === previous) return `${label} permaneceu em ${next}.`;
  return `${next > previous ? "Recuperou" : "Perdeu"} ${Math.abs(next - previous)} ${label} (${previous} → ${next}).`;
};
