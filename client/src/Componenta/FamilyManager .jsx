import { useState } from 'react';
import { Button } from "@/components/ui/button"; // אם את משתמשת ב-shadcn או דומה
import axios from 'axios';

const FamilyManager = ({ family }) => {
  const [showForm, setShowForm] = useState(false);
  const [updatedFamily, setUpdatedFamily] = useState({ ...family });

  const Updatefamily = () => {
    setShowForm(true);
  };

  const handleChange = (e) => {
    setUpdatedFamily({ ...updatedFamily, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/api/families/${family._id}`, updatedFamily);
      console.log("עודכן בהצלחה:", res.data);
      setShowForm(false);
    } catch (err) {
      console.error("שגיאה בעדכון:", err);
    }
  };

  return (
    <div>
      <Button onClick={Updatefamily}>עדכון משפחה</Button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input name="nameFamily" value={updatedFamily.nameFamily} onChange={handleChange} placeholder="שם משפחה" />
          <input name="floor" value={updatedFamily.floor} onChange={handleChange} placeholder="קומה" />
          <input name="electricity" value={updatedFamily.electricity} onChange={handleChange} placeholder="חשמל" />
          <input name="water" value={updatedFamily.water} onChange={handleChange} placeholder="מים" />
          <input name="amountChildren" value={updatedFamily.amountChildren} onChange={handleChange} placeholder="מס' ילדים" />
          <select name="role" value={updatedFamily.role} onChange={handleChange}>
            <option value="שכן רגיל">שכן רגיל</option>
            <option value="ועד בית">ועד בית</option>
          </select>
          <input name="password" type="password" value={updatedFamily.password} onChange={handleChange} placeholder="סיסמה" />
          <button type="submit">שמור</button>
          <button type="button" onClick={() => setShowForm(false)}>ביטול</button>
        </form>
      )}
    </div>
  );
};

export default FamilyManager;
