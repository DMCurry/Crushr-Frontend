import React, { useState } from "react";

function Dropdown({ plans, onSelectTrainingPlanExercises }) {
  const [selectedPlan, setSelectedPlan] = useState(undefined);

  const handlePlanChange = (planId) => {
    setSelectedPlan(planId);
    const selectedPlanData = plans.find((plan) => plan.id === parseInt(planId));
    onSelectTrainingPlanExercises(selectedPlanData ? selectedPlanData.exercises : []);
  };

  return (
    <div className="dropdown-container">
      <select onChange={(e) => handlePlanChange(e.target.value)} value={selectedPlan}>
        <option value="">Select a workout plan</option>
        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.plan_name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;