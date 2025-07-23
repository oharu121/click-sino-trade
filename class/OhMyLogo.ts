import figlet from "figlet";
import gradient from "gradient-string";

const DEFAULT_PALETTE: PaletteName = "sunset";
const DEFAULT_FONT: figlet.Fonts = "ANSI Shadow";
const DEFAULT_TEXT_WIDTH = 100;

const PRESET_GRADIENTS = {
  cristal: gradient.cristal,
  teen: gradient.teen,
  mind: gradient.mind,
  morning: gradient.morning,
  vice: gradient.vice,
  passion: gradient.passion,
  fruit: gradient.fruit,
  instagram: gradient.instagram,
  atlas: gradient.atlas,
  retro: gradient.retro,
  summer: gradient.summer,
  pastel: gradient.pastel,
  rainbow: gradient.rainbow,
} as const;

const CUSTOM_GRADIENTS: { [key: string]: string[] } = {
  gradBlue: ["#4ea8ff", "#7f88ff"],
  blackWhite: ["#000000", "#FFFFFF"],
  sunset: ["#ff9966", "#ff5e62", "#ffa34e"],
  dawn: ["#00c6ff", "#0072ff"],
  nebula: ["#654ea3", "#eaafc8"],
  mono: ["#f07178", "#f07178"],
  ocean: ["#667eea", "#764ba2"],
  fire: ["#ff0844", "#ffb199"],
  forest: ["#134e5e", "#71b280"],
  gold: ["#f7971e", "#ffd200"],
  purple: ["#667db6", "#0082c8", "#0078ff"],
  mint: ["#00d2ff", "#3a7bd5"],
  coral: ["#ff9a9e", "#fecfef"],
  matrix: ["#00ff41", "#008f11"],
};

const PALETTE_NAMES = [
  ...Object.keys(CUSTOM_GRADIENTS),
  ...Object.keys(PRESET_GRADIENTS),
] as const;

type CustomeGradient = keyof typeof CUSTOM_GRADIENTS;
type PresetGradient = keyof typeof PRESET_GRADIENTS;
type PaletteName = (typeof PALETTE_NAMES)[number];


class OhMyLogo {
  private text: string = "";

  public createLogo(
    text: string,
    palette: PaletteName = DEFAULT_PALETTE
  ): string {
    return this.setText(text).addFontStyle().addGradient(palette);
  }

  public createRandomLogo(text: string): string {
    const randomIndex = Math.floor(Math.random() * PALETTE_NAMES.length);
    const randomPalette = PALETTE_NAMES[randomIndex]!;
    return this.setText(text).addFontStyle().addGradient(randomPalette);
  }

  public setText(text: string): this {
    this.text = text;
    return this;
  }

  public getText(): string {
    return this.text;
  }

  public addFontStyle(
    font: figlet.Fonts = DEFAULT_FONT,
    width: number = DEFAULT_TEXT_WIDTH
  ): this {
    this.text = figlet.textSync(this.text, {
      font,
      horizontalLayout: "default",
      verticalLayout: "default",
      width,
      whitespaceBreak: true,
    });
    return this;
  }

  public addRandomGradient(): string {
    const randomIndex = Math.floor(Math.random() * PALETTE_NAMES.length);
    const randomPalette = PALETTE_NAMES[randomIndex]!;
    return this.addGradient(randomPalette);
  }

  public addGradient(palette: PaletteName): string {
    let gradientFunc;

    if (palette in PRESET_GRADIENTS) {
      gradientFunc = PRESET_GRADIENTS[palette as PresetGradient];
    } else if (palette in CUSTOM_GRADIENTS) {
      gradientFunc = gradient(CUSTOM_GRADIENTS[palette as CustomeGradient]);
    } else {
      gradientFunc = gradient(CUSTOM_GRADIENTS[DEFAULT_PALETTE]);
    }

    return gradientFunc.multiline(this.text);
  }
}

export default new OhMyLogo();
