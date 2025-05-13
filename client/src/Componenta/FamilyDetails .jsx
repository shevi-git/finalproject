import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FamilyDetails = () => {
  const { id } = useParams(); // קבלת ה-id מה-URL
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/Family/${id}`);
        setFamily(response.data);
      } catch (error) {
        console.error("שגיאה בקבלת פרטי המשפחה", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamily();
  }, [id]);

  if (loading) return <p>טוען פרטים...</p>;
  if (!family) return <p>לא נמצאה משפחה</p>;

  return (
    <>
    <div>
      <h2>פרטי משפחה: {family.nameFamily}</h2>
      <p>קומה: {family.floor}</p>
      <p>צריכת חשמל: {family.electricity}</p>
      <p>צריכת מים: {family.water}</p>
      <p>מספר ילדים: {family.amountChildren}</p>
      <p>תפקיד: {family.role}</p>
    </div>
    {/* <button>עדכון משפחה</button> */}
    </>
  );
};

export default FamilyDetails;
