const initialBudget=()=>{
    const localStorageBudget = localStorage.getItem('budget');
    return localStorageBudget ? parseFloat(localStorageBudget) : 0;
}

const localStorageExpenses=()=>{
    const localStorageExpenses = localStorage.getItem('expenses')
    return localStorageExpenses ? JSON.parse(localStorageExpenses) : []
}

export const initialState = {
    budget: initialBudget(),
    modal: false,
    expenses: localStorageExpenses(),
    editingId: "",
    currentCategory: ""
}

export const budgetReducer = (state, action) => {
    switch (action.type) {
        case "add-budget":
            return {...state, budget: action.payload.budget}
        case "show-modal":
            return {...state, modal: true}
        case "close-modal":
            return {...state, modal: false, editingId: ""}
        case "add-expense": {
            const newExpense = { ...action.payload.expense, id: new Date().getTime() };
            const totalExpenses = state.expenses.reduce((total, expense) => total + expense.amount, 0) + newExpense.amount;
            if (totalExpenses > state.budget) {
                return { ...state, error: "El total de gastos excede el presupuesto." };
            }
            return { ...state, expenses: [...state.expenses, newExpense], modal: false, error: "" };
        }
        case "update-expense": {
            const updatedExpenses = state.expenses.map(expense => expense.id === action.payload.expense.id ? action.payload.expense : expense);
            const totalExpenses = updatedExpenses.reduce((total, expense) => total + expense.amount, 0);
            if (totalExpenses > state.budget) {
                return { ...state, error: "El total de gastos excede el presupuesto." };
            }
            return { ...state, expenses: updatedExpenses, editingId: "", modal: false, error: "" };
        }
        case "remove-expense":
            return {...state, expenses: state.expenses.filter(expense => expense.id != action.payload.id), error: ""}
        case "get-expense-by-id":
            return {...state, editingId: action.payload.id, modal: true}
        case "add-filter-category":
            return {...state, currentCategory: action.payload.categoryId}
        case "RESET_APP":
            return { ...initialState };
        default:
            return state;
    }
}