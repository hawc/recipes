import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Image = {
  __typename?: 'Image';
  height: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  size: Scalars['Int']['output'];
  type: Scalars['String']['output'];
  width: Scalars['Int']['output'];
};

export type ImageInput = {
  height: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  size: Scalars['Int']['input'];
  src?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  width: Scalars['Int']['input'];
};

export type Ingredient = {
  __typename?: 'Ingredient';
  amount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  unit: Scalars['String']['output'];
};

export type IngredientInput = {
  amount: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  unit: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addRecipe: Array<Maybe<Recipe>>;
  deleteRecipe: Array<Maybe<Recipe>>;
  editRecipe: Array<Maybe<Recipe>>;
};


export type MutationaddRecipeArgs = {
  categories: Array<InputMaybe<Scalars['String']['input']>>;
  description: Scalars['String']['input'];
  images: Array<InputMaybe<ImageInput>>;
  ingredients: Array<InputMaybe<IngredientInput>>;
  name: Scalars['String']['input'];
  servings: Scalars['Int']['input'];
  source: Scalars['String']['input'];
};


export type MutationdeleteRecipeArgs = {
  id: Scalars['String']['input'];
};


export type MutationeditRecipeArgs = {
  categories: Array<InputMaybe<Scalars['String']['input']>>;
  description: Scalars['String']['input'];
  id: Scalars['String']['input'];
  images: Array<InputMaybe<ImageInput>>;
  ingredients: Array<InputMaybe<IngredientInput>>;
  name: Scalars['String']['input'];
  servings: Scalars['Int']['input'];
  slug: Scalars['String']['input'];
  source: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getRecipe: Recipe;
  getRecipes: Array<Recipe>;
  info: Scalars['String']['output'];
};


export type QuerygetRecipeArgs = {
  slug: Scalars['String']['input'];
};

export type Recipe = {
  __typename?: 'Recipe';
  categories: Array<Maybe<Scalars['String']['output']>>;
  id: Scalars['String']['output'];
  ingredients: Array<Maybe<Ingredient>>;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Image: ResolverTypeWrapper<Image>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  ImageInput: ImageInput;
  Ingredient: ResolverTypeWrapper<Ingredient>;
  IngredientInput: IngredientInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Recipe: ResolverTypeWrapper<Recipe>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Image: Image;
  Int: Scalars['Int']['output'];
  String: Scalars['String']['output'];
  ImageInput: ImageInput;
  Ingredient: Ingredient;
  IngredientInput: IngredientInput;
  Mutation: {};
  Query: {};
  Recipe: Recipe;
  Boolean: Scalars['Boolean']['output'];
};

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = {
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IngredientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Ingredient'] = ResolversParentTypes['Ingredient']> = {
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addRecipe?: Resolver<Array<Maybe<ResolversTypes['Recipe']>>, ParentType, ContextType, RequireFields<MutationaddRecipeArgs, 'categories' | 'description' | 'images' | 'ingredients' | 'name' | 'servings' | 'source'>>;
  deleteRecipe?: Resolver<Array<Maybe<ResolversTypes['Recipe']>>, ParentType, ContextType, RequireFields<MutationdeleteRecipeArgs, 'id'>>;
  editRecipe?: Resolver<Array<Maybe<ResolversTypes['Recipe']>>, ParentType, ContextType, RequireFields<MutationeditRecipeArgs, 'categories' | 'description' | 'id' | 'images' | 'ingredients' | 'name' | 'servings' | 'slug' | 'source'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<QuerygetRecipeArgs, 'slug'>>;
  getRecipes?: Resolver<Array<ResolversTypes['Recipe']>, ParentType, ContextType>;
  info?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type RecipeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Recipe'] = ResolversParentTypes['Recipe']> = {
  categories?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ingredients?: Resolver<Array<Maybe<ResolversTypes['Ingredient']>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Image?: ImageResolvers<ContextType>;
  Ingredient?: IngredientResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Recipe?: RecipeResolvers<ContextType>;
};

