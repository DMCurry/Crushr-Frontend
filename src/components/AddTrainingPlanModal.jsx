import React, { useState, useEffect } from "react";
import "./AddTrainingPlanModal.css";


const NewTrainingPlanModal = ({ isOpen, onClose, onSave, trainingPlan }) => {
  const [formData, setFormData] = useState({
    plan_name: ""
  });


  // Populate form when trainingPlan data is provided (for updating)
  useEffect(() => {
    if (trainingPlan) {
      setFormData({
        plan_name: trainingPlan.plan_name || "",
      });
    } else {
      setFormData({ plan_name: ""});
    }
  }, [trainingPlan, isOpen]); // Runs when trainingPlan changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSave = () => {
    onSave(formData);
    onClose();
  };


  if (!isOpen) return null;


  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{trainingPlan ? "Edit Training Plan" : "Add Training Plan"}</h2>
        <div className="form-group">
          <label htmlFor="plan_name">Name:</label>
          <input
            type="text"
            id="plan_name"
            name="plan_name"
            value={formData.plan_name}
            onChange={handleChange}
            placeholder="Enter training plan name"
          />
        </div>
        <div className="modal-actions">
          <button onClick={handleSave} className="save-button">Save</button>
          <button onClick={onClose} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NewTrainingPlanModal;