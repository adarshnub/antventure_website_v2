/** Stylized bilateral cerebral surface with a central fissure and folded cortex. */
export function brainPoint(index: number, count: number): [number, number, number] {
  const side = index % 2 ? 1 : -1;
  const sample = Math.floor(index / 2);
  const columns = 180;
  const rows = Math.ceil(count / 2 / columns);
  const u = (sample % columns) / (columns - 1);
  const v = (Math.floor(sample / columns) + .5) / rows;
  const latitude = v * Math.PI;
  const longitude = (u - .5) * Math.PI;
  const fold = .10 * Math.sin(latitude * 17 + Math.sin(longitude * 7) * 2.5)
    + .065 * Math.cos(longitude * 19 + Math.sin(latitude * 9) * 2);
  const surface = 1 + fold;
  const width = 1.9 * Math.sin(latitude) * (.88 + .12 * Math.cos(latitude));
  return [
    side * (.14 + width * Math.cos(longitude) * surface),
    Math.cos(latitude) * 1.95 * surface,
    Math.sin(latitude) * Math.sin(longitude) * 1.7 * surface,
  ];
}
