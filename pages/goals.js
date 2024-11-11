import { useState } from 'react';
import GoalSetting from '../components/goals/GoalSetting';
import ManifestationBoard from '../components/goals/ManifestationBoard';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);

  const addGoal = (newGoal) => {
    setGoals([...goals, newGoal]);
  };

  return (
    <div>
      <GoalSetting onAddGoal={addGoal} />
      <ManifestationBoard goals={goals} />
    </div>
  );
}
