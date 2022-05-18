/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-bitwise */

export function rgbToHex(rgb: string): string {
  const newRgb = rgb.trim().match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i) || [];

  const r = newRgb[1];
  const g = newRgb[2];
  const b = newRgb[3];

  const componentToHex = (component: string) => {
    return ("0" + parseInt(component, 10).toString(16)).slice(-2);
  };

  return newRgb && newRgb.length === 4 ? "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) : "";
}

export function hexToRgb(hexColor: string): string {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const newHexColor = hexColor.replace(shorthandRegex, (r: string, g: string, b: string) => {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newHexColor);

  return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : "";
}

export function isHexColor(color: string): boolean {
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i;
  const result = hexPattern.exec(color);

  return !!result;
}

/** @description https://stackoverflow.com/a/6444043/7251821 */
export function increaseBrightness(hexOrRgb: string, percent: number): string {
  const hex = isHexColor(hexOrRgb) ? hexOrRgb : rgbToHex(hexOrRgb);

  let color: string;

  // strip the leading # if it's there
  color = hex.replace(/^\s*#|\s*$/g, "");

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (color.length === 3) {
    color = color.replace(/(.)/g, "$1$1");
  }

  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  return (
    "#" +
    (0 | ((1 << 8) + r + ((256 - r) * percent) / 100)).toString(16).substr(1) +
    (0 | ((1 << 8) + g + ((256 - g) * percent) / 100)).toString(16).substr(1) +
    (0 | ((1 << 8) + b + ((256 - b) * percent) / 100)).toString(16).substr(1)
  );
}
