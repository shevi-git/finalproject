const deleteAnnouncement = async (id) => {
    try {
        // בקשת סיסמה מהמשתמש
        const password = prompt("אנא הזן את הסיסמה שלך כדי למחוק את המודעה:");
        if (!password) {
            return; // המשתמש ביטל את הפעולה
        }

        const response = await axios.delete(`${API_URL}/announcements/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data: { password } // שליחת הסיסמה בבקשת המחיקה
        });

        if (response.status === 200) {
            alert("המודעה נמחקה בהצלחה");
            // רענון רשימת המודעות
            fetchAnnouncements();
        }
    } catch (error) {
        if (error.response?.status === 401) {
            alert("סיסמה שגויה");
        } else if (error.response?.status === 403) {
            alert("אין לך הרשאה למחוק מודעה זו");
        } else {
            alert("שגיאה במחיקת המודעה");
        }
        console.error("Error deleting announcement:", error);
    }
}; 