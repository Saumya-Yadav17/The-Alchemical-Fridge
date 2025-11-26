export type CookingStyle = 'gourmet' | 'hilarious' | 'indian' | 'easy';

export interface Recipe {
  is_grocery: boolean;
  title: string;
  tagline: string;
  ingredients_list: string[];
  steps: string[];
  backstory: string;
  chef_comment: string;
}

export interface GenerateRecipeParams {
  ingredients: string;
  style: CookingStyle;
  includeBackstory: boolean;
}