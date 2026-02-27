export const initialState = {
    budget: 0
}

export const budgetReducer = (state, action) => {
    switch (action.type) {
        case "add-budget":
            return {...state, budget: action.payload.budget}
        default:
            return state;
    }
}