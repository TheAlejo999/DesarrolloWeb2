import { useState } from 'react';

export const BudgetForm = () => {
    const [budget, setBudget] = useState(0);
    const isInvalid = isNaN(budget) || budget <= 0;

    const handleChange=(e)=>{setBudget(e.target.valueAsNumber)}
    return (
        <form className="space-y-5">
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
                value={budget}
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