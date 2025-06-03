import { useState } from 'react';
import { Button } from "@/components/ui/button";
import axios from 'axios';

const FamilyManager = ({ family }) => {
  const [showForm, setShowForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [updatedFamily, setUpdatedFamily] = useState({ ...family });

  const Updatefamily = () => {
    setShowPasswordModal(true);
    setError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Attempting to verify password for family:', family._id);
      
      const response = await axios.post('http://localhost:8000/Family/verifyPassword', {
        familyId: family._id,
        password: password
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        console.log('Password verified successfully');
        setShowPasswordModal(false);
        setShowForm(true);
        setError('');
      }
    } catch (err) {
      console.error('Error in password verification:', err.response?.data);
      setError(err.response?.data?.message || 'סיסמה שגויה');
    }
  };

  const handleChange = (e) => {
    setUpdatedFamily({ ...updatedFamily, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const dataToSend = {
        ...updatedFamily,
        password: password
      };

      console.log('Sending update request with data:', { ...dataToSend, password: '***' });

      const res = await axios.put(
        `http://localhost:8000/Family/updateFamily/${family._id}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("עודכן בהצלחה:", res.data);
      setShowForm(false);
      setPassword('');
      alert('המשפחה עודכנה בהצלחה');
      // אופציונלי: רענון הדף או עדכון state
      window.location.reload();
    } catch (err) {
      console.error("שגיאה בעדכון:", err.response?.data);
      alert(err.response?.data?.message || 'שגיאה בעדכון המשפחה');
    }
  };

  return (
    <div className="relative">
      <Button onClick={Updatefamily}>עדכון משפחה</Button>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-center">אנא הכנס סיסמה לאימות</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="הכנס סיסמה"
                className="w-full p-2 border rounded text-right"
                dir="rtl"
              />
              {error && <p className="text-red-500 text-center">{error}</p>}
              <div className="flex justify-center space-x-2 space-x-reverse">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  אישור
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPassword('');
                    setError('');
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-center">עדכון פרטי משפחה</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="nameFamily"
                value={updatedFamily.nameFamily}
                onChange={handleChange}
                placeholder="שם משפחה"
                className="w-full p-2 border rounded text-right"
                dir="rtl"
              />
              <input
                name="floor"
                type="number"
                value={updatedFamily.floor}
                onChange={handleChange}
                placeholder="קומה"
                className="w-full p-2 border rounded text-right"
                dir="rtl"
              />
              <input
                name="amountChildren"
                type="number"
                value={updatedFamily.amountChildren}
                onChange={handleChange}
                placeholder="מס' ילדים"
                className="w-full p-2 border rounded text-right"
                dir="rtl"
              />
              <select
                name="role"
                value={updatedFamily.role}
                onChange={handleChange}
                className="w-full p-2 border rounded text-right"
                dir="rtl"
              >
                <option value="שכן רגיל">שכן רגיל</option>
                <option value="ועד בית">ועד בית</option>
              </select>
              <div className="flex justify-center space-x-2 space-x-reverse">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  שמור
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyManager;
