const BASE_URL = `http:${window.location.href.split(":")[1]}:3000/kitchenflow`;

const getAllRecipes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/recipes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Errore nel recupero delle ricette");
    }

    const recipes = await response.json();
    return recipes;
  } catch (error) {
    console.error("Errore nell'API:", error);
    throw error;
  }
};

const getRecipe = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/recipes/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Errore nel recupero delle ricette");
    }

    const recipe = await response.json();
    return recipe;
  } catch (error) {
    console.error("Errore nell'API:", error);
    throw error;
  }
};

const setCreatedTrue = async (recipeId) => {
  try {
    const response = await fetch(`${BASE_URL}/recipes/${recipeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ created: true }),
    });

    if (!response.ok) {
      throw new Error("Errore nell'aggiornamento della ricetta");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Errore nell'API:", error);
    throw error;
  }
};

const deleteRecipe = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/recipes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Errore nella cancellazione della ricetta");
    }

    const recipe = await response.json();
    return recipe;
  } catch (error) {
    console.error("Errore nell'API:", error);
    throw error;
  }
};

const createIngredient = async (recipeId, ingredient) => {
  try {
    await fetch(`${BASE_URL}/recipes/${recipeId}/ingredients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: ingredient.name,
        unit: ingredient.unit,
        value: ingredient.value,
      }),
    });
  } catch (error) {
    console.error("Errore durante la creazione dell'ingrediente:", error);
    throw error;
  }
};

const updateIngredient = async (recipeId, updatedIngredient) => {
  try {
    const response = await fetch(
      `${BASE_URL}/recipes/${recipeId}/ingredients/${updatedIngredient.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updatedIngredient, id: undefined }),
      },
    );

    if (!response.ok) {
      throw new Error(`Errore nell'aggiornamento: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Errore durante l'aggiornamento dell'ingrediente:", error);
    throw error;
  }
};

const deleteIngredient = async (recipeId, ingredientId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/recipes/${recipeId}/ingredients/${ingredientId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Errore nella cancellazione dell'ingredient");
    }
  } catch (error) {
    console.error("Errore nell'API:", error);
    throw error;
  }
};

const createStep = async (recipeId, step) => {
  try {
    await fetch(`${BASE_URL}/recipes/${recipeId}/steps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...step,
        id: undefined,
      }),
    });
  } catch (error) {
    console.error("Errore durante la creazione dello step:", error);
    throw error;
  }
};

const updateStep = async (recipeId, updatedStep) => {
  try {
    const response = await fetch(
      `${BASE_URL}/recipes/${recipeId}/steps/${updatedStep.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedStep.name }),
      },
    );

    if (!response.ok) {
      throw new Error(`Errore nell'aggiornamento: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Errore durante l'aggiornamento dello step:", error);
    throw error;
  }
};

// Funzione per ottenere tutti i badges
const getAllBadges = async () => {
  try {
    const response = await fetch(`${BASE_URL}/badges`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Errore nel recupero dei badges");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Errore nell'API:", error);
    throw error;
  }
};

// Funzione per l'aggiornamento dello stato 'redeemable'
const updateRedeemable = async (badgeId, redeemableStatus) => {
  try {
    const response = await fetch(`${BASE_URL}/badges/${badgeId}/redeemable`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        redeemable: redeemableStatus,
      }),
    });

    if (!response.ok) {
      throw new Error("Errore nell'aggiornamento dello stato redeemable");
    }

    const updatedBadge = await response.json();
    return updatedBadge;
  } catch (error) {
    console.error("Errore nell'API:", error);
    throw error;
  }
};

// Funzione per l'aggiornamento dello stato 'unlocked'
const updateUnlocked = async (badgeId, unlockedStatus) => {
  try {
    const response = await fetch(`${BASE_URL}/badges/${badgeId}/unlocked`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ unlocked: unlockedStatus }),
    });

    if (!response.ok) {
      throw new Error("Errore nell'aggiornamento dello stato del badge");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Errore nell'API:", error);
    throw error;
  }
};

const API = {
  getAllRecipes,
  getRecipe,
  setCreatedTrue,
  deleteRecipe,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  createStep,
  updateStep,
  getAllBadges,
  updateRedeemable,
  updateUnlocked,
};
export default API;
