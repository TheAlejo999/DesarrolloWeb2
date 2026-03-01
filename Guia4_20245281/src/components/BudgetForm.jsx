import { useContext, useState } from 'react';
import { BudgetDispatchContext } from '../context/BudgetContext';
import { BudgetStateContext } from '../context/BudgetContext';

export const BudgetForm = () => {
    const [budget, setBudget] = useState(0);
    const isInvalid = isNaN(budget) || budget <= 0;

    const handleChange=(e)=>{setBudget(e.target.valueAsNumber)}

    const dispatch = useContext(BudgetDispatchContext);

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch({ type: "add-budget", payload: { budget } })
    }

    const state=useContext(BudgetStateContext)
    const isValidBudget= state.budget>0;

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-5">
                <label
                htmlFor="budget" className="text-4xl text-blue-600 font-bold text-center">
                    Definir presupuesto
                </label>
            </div>
            <input
                type="number"
                id="budget"
                name="budget"
                className="w-full bg-white border border-gray-300 p-2"
                placeholder="Define tu presupuesto"
                value={isNaN(budget) ? "" : budget}
                onChange={handleChange}
            />
            <input
                type="submit"
                value="Definir presupuesto"
                disabled={isInvalid}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-full p-2 text-white
                font-black uppercase disabled:opacity-40"
            />
        </form>
    )
}