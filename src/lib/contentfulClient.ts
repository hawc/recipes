if (process.env.NODE_ENV !== `production`) {
  require(`dotenv`).config();
}

export interface ReceipeFields {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly category: string;
  readonly ingredients: string[];
  readonly source: string;
}
