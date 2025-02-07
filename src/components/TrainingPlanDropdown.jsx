import React, { useState } from "react";
import "./TrainingPlanDropdown.css"

function Dropdown({ plans, onSelectTrainingPlanItems }) {
  const [selectedPlan, setSelectedPlan] = useState(undefined);

  const handlePlanChange = (planId) => {
    setSelectedPlan(planId);
    const selectedPlanData = plans.find((plan) => plan.id === parseInt(planId));
    onSelectTrainingPlanItems(selectedPlanData ? selectedPlanData.exercises : [], selectedPlanData ? selectedPlanData.performance_tests : []);
  };

  return (
    <div className="dropdown-container">
      <select className="custom-select" onChange={(e) => handlePlanChange(e.target.value)} value={selectedPlan}>
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