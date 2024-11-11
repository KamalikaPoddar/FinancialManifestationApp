// In GoalCard or Dashboard component
const [isEditing, setIsEditing] = useState(false)

const handleUpdateGoal = async (updatedGoal) => {
  // Update goal in state or refetch goals
}

{isEditing && (
  <GoalEditModal 
    goal={goal}
    onUpdate={handleUpdateGoal}
    onClose={() => setIsEditing(false)}
  />
)}
