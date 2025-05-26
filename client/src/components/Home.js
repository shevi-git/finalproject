const deleteFamily = async (id) => {
    try {
        // בקשת סיסמה מהמשתמש
        const password = prompt("אנא הזן את הסיסמה שלך כדי למחוק את המשפחה:");
        if (!password) {
            return; // המשתמש ביטל את הפעולה
        }

        const response = await axios.delete(`${API_URL}/family/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data: { password } // שליחת הסיסמה בבקשת המחיקה
        });

        if (response.status === 200) {
            alert("המשפחה נמחקה בהצלחה");
            // רענון רשימת המשפחות
            fetchFamilies();
        }
    } catch (error) {
        if (error.response?.status === 401) {
            alert("סיסמה שגויה");
        } else if (error.response?.status === 403) {
            alert("אין לך הרשאה למחוק משפחה זו");
        } else {
            alert("שגיאה במחיקת המשפחה");
        }
        console.error("Error deleting family:", error);
    }
};

const handleDeleteFamily = async () => {
    if (!familyToDelete) return;

    try {
        // בקשת סיסמה מהמשתמש
        const password = prompt("אנא הזן את הסיסמה שלך כדי למחוק את המשפחה:");
        if (!password) {
            return; // המשתמש ביטל את הפעולה
        }

        setLoading(true);
        const response = await axios.delete(`http://localhost:8000/Family/deleteFamily/${familyToDelete._id}`, {
            data: { password } // שליחת הסיסמה בבקשת המחיקה
        });
        
        // עדכון הרשימה המקומית
        setFamilies(prev => prev.filter(family => family._id !== familyToDelete._id));
        
        // סגירת הדיאלוג
        handleCloseDeleteDialog();
        
        // הצגת הודעת הצלחה
        setAlertMessage(
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2, 
                alignItems: 'center',
                p: 2,
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderRadius: 3,
                border: '1px solid rgba(76, 175, 80, 0.2)'
            }}>
                <Typography variant="h6" sx={{ 
                    color: '#2e7d32', 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <CheckCircleOutline sx={{ fontSize: '1.5rem' }} />
                    המשפחה נמחקה בהצלחה
                </Typography>
            </Box>
        );
        setAlertSeverity('success');
        setAlertOpen(true);
    } catch (error) {
        console.error('שגיאה במחיקת המשפחה', error);
        if (error.response?.status === 401) {
            setAlertMessage("סיסמה שגויה");
            setAlertSeverity('error');
            setAlertOpen(true);
        } else if (error.response?.status === 403) {
            setAlertMessage("אין לך הרשאה למחוק משפחה זו");
            setAlertSeverity('error');
            setAlertOpen(true);
        } else {
            setAlertMessage("אירעה שגיאה במחיקת המשפחה. אנא נסה שוב מאוחר יותר.");
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    } finally {
        setLoading(false);
    }
}; 