/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { getRecipe as Query_getRecipe } from './base/resolvers/Query/getRecipe';
import    { getRecipes as Query_getRecipes } from './base/resolvers/Query/getRecipes';
import    { info as Query_info } from './base/resolvers/Query/info';
import    { addRecipe as Mutation_addRecipe } from './base/resolvers/Mutation/addRecipe';
import    { deleteRecipe as Mutation_deleteRecipe } from './base/resolvers/Mutation/deleteRecipe';
import    { editRecipe as Mutation_editRecipe } from './base/resolvers/Mutation/editRecipe';
    export const resolvers: Resolvers = {
      Query: { getRecipe: Query_getRecipe,getRecipes: Query_getRecipes,info: Query_info },
      Mutation: { addRecipe: Mutation_addRecipe,deleteRecipe: Mutation_deleteRecipe,editRecipe: Mutation_editRecipe },
      
      
    }