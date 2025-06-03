import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';

// קומפוננטת לוח מודעות עם אנימציות CSS משופרות ואנימציית טעינה
const NoticeBoard = () => {
  // מצב המודעות 
  const [notices, setNotices] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expandedNotice, setExpandedNotice] = useState(null);
  
  // עבור אנימציות
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [shineIndex, setShineIndex] = useState(-1);

  // הגדרת React Hook Form
  const { control, handleSubmit, watch, reset, setValue, formState: { errors, isValid } } = useForm({
    defaultValues: {
      nameFamily: '',
      announcementType: '',
      celebrationType: '',
      sex: '',
      notes: '',
      wedding: '',
      important: false
    },
    mode: 'onChange'
  });

  // מעקב אחר שינויים בשדות מסוימים כדי ליצור לוגיקה תלויה
  const announcementType = watch('announcementType');
  const celebrationType = watch('celebrationType');
  
  // הגדרות CSS לאנימציות
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes shine {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes slideIn {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    
    @keyframes rotateY {
      0% { transform: rotateY(0deg); }
      100% { transform: rotateY(360deg); }
    }
    
    @keyframes scaleAnimation {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
  `;
  
  // סטייט למחיקת מודעה
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState(null);
  
  // פונקציה עזר לקבלת האות הראשונה בשם המחבר בצורה בטוחה
  const getAuthorInitial = (notice) => {
    // בדיקה אם יש שדה author
    if (notice.author && typeof notice.author === 'string' && notice.author.length > 0) {
      return notice.author.charAt(0);
    }
    // בדיקה אם יש שדה createBy
    else if (notice.createBy && typeof notice.createBy === 'string' && notice.createBy.length > 0) {
      return notice.createBy.charAt(0);
    }
    // אם אין שדה מתאים, החזר סימן שאלה
    return '?';
  };

  // פונקציה עזר לקבלת שם המחבר המלא בצורה בטוחה
  const getAuthorName = (notice) => {
    return notice.author || notice.createBy || "אנונימי";
  };

  // טעינת נתונים - אפשר להחליף בקריאת API אמיתית
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get('http://localhost:8000/Announcement/getAnnouncements');
        console.log('תשובה מהשרת:', response.data);
    
        // השרת מחזיר מערך ישירות
        if (Array.isArray(response.data)) {
          setNotices(response.data);
          setLoading(false);
        } else {
          console.error('מבנה תשובה לא צפוי מהשרת:', response.data);
          setNotices([]);
          setLoading(false);
        }
      } catch (error) {
        console.error("שגיאה בטעינת המודעות:", error);
        setNotices([]);
        setLoading(false);
      }
    };
  
    fetchNotices();
  
    // אפקט הברקה כל 5 שניות
    const shineInterval = setInterval(() => {
      if (notices && Array.isArray(notices) && notices.length > 0) {
        const randomIndex = Math.floor(Math.random() * notices.length);
        setShineIndex(randomIndex);
        setTimeout(() => setShineIndex(-1), 1000); // ביטול הברקה לאחר שנייה
      }
    }, 5000);
  
    return () => clearInterval(shineInterval);
  }, [notices.length]);
  
  // פונקציה שמתבצעת כאשר יש שינוי בcelebrationType
  useEffect(() => {
    if (celebrationType === 'בר מצוה') {
      setValue('sex', 'בן');
      setValue('wedding', 'היכנס בינכם לעול תורה ומצוות');
    } else if (celebrationType === 'בת מצוה') {
      setValue('sex', 'בת');
      setValue('wedding', 'היכנס בינכם לעול תורה ומצוות');
    } else if (celebrationType === 'תינוק/ תינוקת') {
      setValue('wedding', 'הולדת');
    } else if (celebrationType === 'חתונה') {
      setValue('wedding', 'אירוסי');
    }
  }, [celebrationType, setValue]);

  // סינון מודעות לפי טאב
  const filteredNotices = activeTab === 'all' 
    ? notices 
    : notices.filter(notice => notice.type === activeTab);
  
  // פורמט תאריך
  const formatDate = (dateString) => {
    try {
      if (!dateString) return null;
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null;
      }
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('he-IL', options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return null;
    }
  };

  // פונקציה לבדיקת תקינות הטופס - משומשת בטופס הישן, לא בReact Hook Form
  const isFormValid = () => {
    // כעת משתמשים ב-isValid של React Hook Form
    return isValid;
  };
  
  // פונקציה לניווט לקומפוננטת Announcement
  const navigate = useNavigate();
  
  const handleNavigateToAnnouncement = (data) => {
    // שמירת ערכי הטופס
    const formData = {
      sex: data.sex,
      nameFamily: data.nameFamily,
      wedding: data.wedding,
      message: data.announcementType === 'הודעות' ? data.notes : null
    };
    
    // ניווט לקומפוננטת Announcement עם הנתונים
    navigate('/Announcement', { state: formData });
    
    // סגירת המודאל
    setShowModal(false);
    
    // איפוס הטופס
    reset();
  };
  
  // עדכון פונקציית טיפול בהוספת מודעה
  const handleAddNotice = (data) => {
    let title = '';
    let content = '';
    let type = 'info';
    
    if (data.announcementType === 'הודעות') {
      title =  'לשכנים היקרים!';
      content = data.notes;
      type = 'info';
    } 
    else if (data.announcementType === 'שמחות') {
      if (data.celebrationType === 'תינוק/ תינוקת') {
        title = `שמחים להודיע על ${data.wedding} ${data.sex}`;
        content = `משפחת ${data.nameFamily} שמחה להודיע על הולדת ${data.sex === 'בן' ? 'בנם' : 'בתם'}.`;
        type = 'celebration';
      } 
      else if (data.celebrationType === 'חתונה') {
        title = `שמחים להודיע על ${data.wedding} ${data.sex === 'בן' ? 'בננו' : 'בתנו'}`;
        content = `משפחת ${data.nameFamily} שמחה להודיע על אירוסי ${data.sex === 'בן' ? 'בנם' : 'בתם'}.`;
        type = 'celebration';
      } 
      else if (data.celebrationType === 'בר מצוה' || data.celebrationType === 'בת מצוה') {
        title = `שמחים להודיע על ${data.celebrationType}`;
        content = `משפחת ${data.nameFamily} שמחה להודיע על ${data.celebrationType} ${data.sex === 'בן' ? 'לבנם' : 'לבתם'}.`;
        type = 'celebration';
      }
    }
    
    const notice = {
      id: Date.now(),
      title: title,
      content: content,
      type: type,
      date: new Date().toISOString().split('T')[0],
      author: "משתמש",
      important: data.important
    };
    
    setNotices([notice, ...notices]);
    
    // איפוס הטופס
    reset();
    
    // סגירת המודאל
    setShowModal(false);
  };

  // קבלת צבע רקע לפי סוג מודעה
  const getTypeColor = (type) => {
    switch(type) {
      case 'info': return '#e3f2fd'; // כחול בהיר
      case 'maintenance': return '#fff3e0'; // כתום בהיר
      case 'meeting': return '#e8f5e9'; // ירוק בהיר
      case 'celebration': return '#f8bbd0'; // ורוד בהיר
      case 'alert': return '#ffebee'; // אדום בהיר
      case 'community': return '#e0f7fa'; // ציאן בהיר
      default: return '#f5f5f5'; // אפור בהיר
    }
  };

  // קבלת צבע גבול לפי סוג מודעה
  const getTypeBorder = (type) => {
    switch(type) {
      case 'info': return '#90caf9'; // כחול
      case 'maintenance': return '#ffcc80'; // כתום
      case 'meeting': return '#a5d6a7'; // ירוק
      case 'celebration': return '#f48fb1'; // ורוד
      case 'alert': return '#ef9a9a'; // אדום
      case 'community': return '#80deea'; // ציאן
      default: return '#e0e0e0'; // אפור
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'info': return 'ℹ️';
      case 'maintenance': return '🔧';
      case 'meeting': return '👥';
      case 'celebration': return '🎉';
      case 'alert': return '⚠️';
      case 'community': return '🌱';
      default: return '📌';
    }
  };

  // פתיחה/סגירה של מודעה
  const toggleExpand = (id) => {
    setExpandedNotice(expandedNotice === id ? null : id);
  };

  // פונקציה להמרת ירידות שורה לתצוגה בהתאם
  const formatContent = (content) => {
    if (!content) return 'אין תוכן';
    
    // מחליף ירידות שורה בתגי HTML מתאימים
    const formattedText = content
      .split('\n')
      .map((text, index) => {
        // אם יש סימון של רשימה עם מקף, נפרמט כרשימה
        if (text.trim().startsWith('-')) {
          return (
            <li key={index} style={{ marginBottom: '4px' }}>
              {text.trim().substring(1)}
            </li>
          );
        }
        
        // אם זו שורה ריקה, נוסיף מרווח
        if (text.trim() === '') {
          return <br key={index} />;
        }
        
        // אחרת, זו פסקה רגילה
        return <div key={index} style={{ marginBottom: '8px' }}>{text}</div>;
      });
    
    return <div>{formattedText}</div>;
  };

  // פונקציה למחיקת מודעה
  const handleDeleteNotice = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/Announcement/deleteAnnouncement/${id}`, {
        data: { password: deletePassword },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.status === 200) {
        setNotices(prev => prev.filter(notice => notice._id !== id));
        setDeleteDialogOpen(false);
        setDeletePassword('');
        setDeleteError(null);
  
        alert('המודעה נמחקה בהצלחה'); 
      }
    } catch (error) {
      setDeleteError(error.response?.data?.message || 'שגיאה במחיקת המודעה');
    }
  };
  
  
  // פותח דיאלוג מחיקה
  const handleOpenDeleteDialog = (notice) => {
    setNoticeToDelete(notice);
    setDeleteDialogOpen(true);
    setDeletePassword('');
    setDeleteError(null);
  };

  return (
    <div dir="rtl" style={{ 
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f0f4f8',
      minHeight: '100vh'
    }}>
      {/* סגנונות אנימציה */}
      <style>
        {animationStyles}
      </style>
      
      {/* כותרת */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '24px',
        textAlign: 'center',
        borderTop: '4px solid #3b82f6',
        animation: isInitialLoad ? 'slideIn 0.5s ease-out' : 'none'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          color: '#1e3a8a', 
          margin: '0 0 10px 0', 
          position: 'relative',
          display: 'inline-block'
        }}>
          לוח מודעות הבניין
          <div style={{
            width: '50%',
            height: '4px',
            background: 'linear-gradient(90deg, #3b82f6, transparent)',
            position: 'absolute',
            bottom: '-8px',
            left: '25%',
            borderRadius: '2px'
          }}></div>
        </h1>
        <p style={{ color: '#64748b', margin: '16px 0 0 0' }}>המקום להתעדכן בכל האירועים והחדשות החשובות של הבניין</p>
      </div>

      {/* תצוגת מודעות */}
      <div style={{ marginBottom: '24px' }}>
        {loading ? (
          // מסך טעינה משופר
          <div style={{ 
            textAlign: 'center', 
            padding: '60px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ 
              fontSize: '60px',
              color: '#3b82f6',
              animation: 'rotateY 2s linear infinite',
              marginBottom: '20px',
              transformStyle: 'preserve-3d'
            }}>
              📋
            </div>
            <div style={{ 
              border: '4px solid #dbeafe', 
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              margin: '0 auto 20px auto',
              animation: 'rotate 1s linear infinite'
            }}></div>
            <p style={{ 
              color: '#475569', 
              fontWeight: 'bold',
              fontSize: '18px',
              animation: 'pulse 2s infinite ease-in-out'
            }}>
              טוען את לוח המודעות...
            </p>
            <p style={{ color: '#64748b', maxWidth: '320px', margin: '10px auto 0' }}>
              אנחנו בודקים מהן המודעות העדכניות ביותר עבורך...
            </p>
          </div>
        ) : (
          // כאשר הטעינה הסתיימה, בדוק אם יש מודעות להצגה
          filteredNotices && Array.isArray(filteredNotices) && filteredNotices.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '24px'
            }}>
              {filteredNotices.map((notice, index) => (
                <div 
                  key={notice.id || index}  
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    border: notice.important ? '2px solid #facc15' : `1px solid ${getTypeBorder(notice.type || 'default')}`,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    animation: isInitialLoad ? `fadeIn 0.5s ease-out ${0.2 + index * 0.1}s both` : 'none',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                  }}
                >
                  {/* אפקט אור בכרטיס */}
                  {shineIndex === index && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '150%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                        transform: 'skewX(-20deg)',
                        zIndex: 1,
                        animation: 'shine 1s forwards'
                      }}
                    ></div>
                  )}
                  
                  {/* סימון מודעה חשובה */}
                  {notice.important && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      zIndex: 2,
                      animation: 'pulse 2s infinite ease-in-out',
                      transformStyle: 'preserve-3d'
                    }}>
                      <div style={{
                        fontSize: '24px',
                        textShadow: '0 0 5px rgba(250, 204, 21, 0.7)',
                        transform: 'rotateZ(20deg) rotateY(20deg)',
                        animation: 'blink 2s infinite'
                      }}>
                        ⭐
                      </div>
                    </div>
                  )}
                  
                  <div style={{ 
                    backgroundColor: getTypeColor(notice.type || 'default'),
                    padding: '16px',
                    borderBottom: `1px solid ${getTypeBorder(notice.type || 'default')}`,
                    position: 'relative',
                    zIndex: 2
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ 
                        margin: '0', 
                        fontSize: '18px', 
                        fontWeight: 'bold', 
                        display: 'flex', 
                        alignItems: 'center',
                        color: '#1e293b'
                      }}>
                        <span style={{ 
                          marginLeft: '8px',
                          display: 'inline-block',
                          transform: 'scale(1.2)' 
                        }}>{getTypeIcon(notice.type || 'default')}</span>
                        {notice.title || 'כותרת חסרה'}
                      </h3>
                      {formatDate(notice.date) && (
                        <span style={{ 
                          fontSize: '12px',
                          backgroundColor: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          fontWeight: 'bold',
                          color: '#475569'
                        }}>
                          {formatDate(notice.date)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div 
                    style={{ 
                      padding: '16px', 
                      flexGrow: 1,
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      maxHeight: expandedNotice === notice.id ? '1000px' : '100px',
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'max-height 0.5s'
                    }}>
                      <div style={{ margin: '0 0 16px 0', color: '#334155', lineHeight: '1.6' }}>
                        {formatContent(notice.content)}
                      </div>
                      
                      {/* אפקט טשטוש לטקסט ארוך */}
                      {expandedNotice !== notice.id && (
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '50px',
                          background: 'linear-gradient(to top, white, transparent)',
                          pointerEvents: 'none'
                        }}></div>
                      )}
                    </div>
                    
                    {/* כפתור הרחבה */}
                    <button 
                      onClick={() => toggleExpand(notice.id)}
                      style={{
                        display: 'block',
                        margin: '12px 0 0 0',
                        padding: '6px 12px',
                        backgroundColor: '#f1f5f9',
                        color: '#3b82f6',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e2e8f0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                      }}
                    >
                      {expandedNotice === notice.id ? 'הסתר תוכן' : 'קרא עוד'}
                      <span style={{ marginRight: '4px' }}>
                        {expandedNotice === notice.id ? '▲' : '▼'}
                      </span>
                    </button>
                  </div>

                  {/* כפתורי פעולה בתחתית */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: '12px',
                    gap: '8px'
                  }}>
                    <button
                      onClick={() => {
                        navigate('/Announcement', {
                          state: {
                            announcementId: notice._id,
                            title: notice.title,
                            content: notice.content,
                            type: notice.type,
                            message: notice.content,
                            isEdit: true,
                            editTitle: notice.title,
                            editContent: notice.content,
                            editType: notice.type,
                            nameFamily: notice.nameFamily,
                            createBy: notice.createBy
                          }
                        });
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#3b82f6',
                        fontSize: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="ערוך מודעה"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleOpenDeleteDialog(notice)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="מחק מודעה"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px', 
              backgroundColor: 'white', 
              borderRadius: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                fontSize: '50px', 
                marginBottom: '16px',
                animation: 'pulse 2s infinite ease-in-out'
              }}>
                🔍
              </div>
              <h3 style={{ margin: '0 0 12px 0', color: '#334155', fontSize: '20px' }}>אין מודעות להצגה בקטגוריה זו</h3>
              <p style={{ margin: '0 0 20px 0', color: '#64748b' }}>נסה לבחור קטגוריה אחרת או לצפות בכל המודעות</p>
              <button 
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.3)';
                }}
              >
                הצג את כל המודעות
              </button>
            </div>
          )
        )}
      </div>

      {/* מודאל להוספת מודעה - עם React Hook Form */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '550px',
              boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15), 0 3px 8px rgba(0, 0, 0, 0.1)',
              maxHeight: '90vh',
              overflow: 'auto',
              animation: 'bounceIn 0.5s ease-out',
              position: 'relative',
              background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
              transform: 'translateZ(0)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* רקע דקורטיבי */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(90deg, #3b82f6, #a855f7, #ec4899, #ef4444)',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              zIndex: 1
            }}></div>
            
            {/* אפקט נקודות רקע אנימטיביות */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              borderRadius: '16px',
              zIndex: 0,
              pointerEvents: 'none'
            }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: `${Math.random() * 8 + 4}px`,
                    height: `${Math.random() * 8 + 4}px`,
                    borderRadius: '50%',
                    backgroundColor: `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 200) + 55}, ${Math.random() * 0.2 + 0.1})`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`
                  }}
                ></div>
              ))}
            </div>

            {/* לוגו/אייקון עם אנימציה */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '16px',
              position: 'relative',
              zIndex: 5
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.1)',
                animation: 'pulseIn 0.6s ease-out'
              }}>
                <div style={{
                  fontSize: '45px',
                  animation: 'rotateIn 1.5s ease-out'
                }}>
                  📋
                </div>
              </div>
            </div>
            
            <h2 style={{ 
              margin: '10px 0 20px 0', 
              fontSize: '26px', 
              color: '#1e293b',
              textAlign: 'center',
              fontWeight: 'bold',
              position: 'relative',
              zIndex: 2
            }}>
              הוספת מודעה חדשה
              <div style={{
                width: '50%',
                height: '3px',
                background: 'linear-gradient(90deg, #3b82f6, transparent)',
                position: 'absolute',
                bottom: '-8px',
                left: '25%',
                borderRadius: '2px',
                margin: '0 auto'
              }}></div>
            </h2>
            
            <form onSubmit={handleSubmit(handleNavigateToAnnouncement)} style={{ 
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold',
                  color: '#475569'
                }}>
                  שם משפחה
                </label>
                <div style={{ position: 'relative' }}>
                  <Controller
                    name="nameFamily"
                    control={control}
                    rules={{ required: 'שדה חובה' }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <input
                          {...field}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            paddingRight: '40px',
                            border: error ? '1px solid #ef4444' : '1px solid #cbd5e1',
                            borderRadius: '8px',
                            fontSize: '16px',
                            transition: 'all 0.3s ease',
                            backgroundColor: '#f8fafc',
                            outline: 'none'
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = error ? '#ef4444' : '#3b82f6';
                            e.currentTarget.style.boxShadow = error 
                              ? '0 0 0 3px rgba(239, 68, 68, 0.2)' 
                              : '0 0 0 3px rgba(59, 130, 246, 0.2)';
                            e.currentTarget.style.backgroundColor = 'white';
                          }}
                          onBlur={(e) => {
                            field.onBlur();
                            e.currentTarget.style.borderColor = error ? '#ef4444' : '#cbd5e1';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                          }}
                          placeholder="הזן שם משפחה..."
                        />
                        {error && (
                          <p style={{ 
                            color: '#ef4444', 
                            fontSize: '14px', 
                            margin: '4px 0 0 0' 
                          }}>
                            {error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '12px',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    fontSize: '20px',
                    color: '#94a3b8'
                  }}>
                    👪
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold',
                  color: '#475569'
                }}>
                  סוג המודעה
                </label>
                <div style={{ position: 'relative' }}>
                  <Controller
                    name="announcementType"
                    control={control}
                    rules={{ required: 'יש לבחור סוג מודעה' }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <select
                          {...field}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            paddingRight: '40px',
                            border: error ? '1px solid #ef4444' : '1px solid #cbd5e1',
                            borderRadius: '8px',
                            fontSize: '16px',
                            backgroundColor: '#f8fafc',
                            appearance: 'none',
                            transition: 'all 0.3s ease',
                            outline: 'none'
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = error ? '#ef4444' : '#3b82f6';
                            e.currentTarget.style.boxShadow = error 
                              ? '0 0 0 3px rgba(239, 68, 68, 0.2)' 
                              : '0 0 0 3px rgba(59, 130, 246, 0.2)';
                            e.currentTarget.style.backgroundColor = 'white';
                          }}
                          onBlur={(e) => {
                            field.onBlur();
                            e.currentTarget.style.borderColor = error ? '#ef4444' : '#cbd5e1';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                          }}
                        >
                          <option value="">בחר סוג הודעה</option>
                          <option value="הודעות">הודעות כלליות</option>
                          <option value="שמחות">שמחות</option>
                        </select>
                        {error && (
                          <p style={{ 
                            color: '#ef4444', 
                            fontSize: '14px', 
                            margin: '4px 0 0 0' 
                          }}>
                            {error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '12px',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    fontSize: '20px',
                    color: '#94a3b8'
                  }}>
                    📢
                  </div>
                </div>
              </div>
              
              {/* תצוגת שדות עבור הודעות כלליות */}
              {announcementType === 'הודעות' && (
                <div style={{ 
                  marginBottom: '20px',
                  animation: 'fadeIn 0.4s ease-out'
                }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: 'bold',
                    color: '#475569'
                  }}>
                    תוכן ההודעה
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Controller
                      name="notes"
                      control={control}
                      rules={{ 
                        required: announcementType === 'הודעות' ? 'שדה חובה' : false 
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <div>
                          <textarea
                            {...field}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              paddingRight: '40px',
                              border: error ? '1px solid #ef4444' : '1px solid #cbd5e1',
                              borderRadius: '8px',
                              fontSize: '16px',
                              minHeight: '150px',
                              resize: 'vertical',
                              transition: 'all 0.3s ease',
                              backgroundColor: '#f8fafc',
                              outline: 'none',
                              lineHeight: '1.5'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = error ? '#ef4444' : '#3b82f6';
                              e.currentTarget.style.boxShadow = error 
                                ? '0 0 0 3px rgba(239, 68, 68, 0.2)' 
                                : '0 0 0 3px rgba(59, 130, 246, 0.2)';
                              e.currentTarget.style.backgroundColor = 'white';
                            }}
                            onBlur={(e) => {
                              field.onBlur();
                              e.currentTarget.style.borderColor = error ? '#ef4444' : '#cbd5e1';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.backgroundColor = '#f8fafc';
                            }}
                            placeholder="הכנס את תוכן ההודעה כאן..."
                          />
                          {error && (
                            <p style={{ 
                              color: '#ef4444', 
                              fontSize: '14px', 
                              margin: '4px 0 0 0' 
                            }}>
                              {error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      pointerEvents: 'none',
                      fontSize: '20px',
                      color: '#94a3b8'
                    }}>
                      ✏️
                    </div>
                  </div>
                </div>
              )}{/* תצוגת שדות עבור שמחות */}
              {announcementType === 'שמחות' && (
                <div style={{ 
                  marginBottom: '20px',
                  animation: 'fadeIn 0.4s ease-out'
                }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: 'bold',
                    color: '#475569'
                  }}>
                    סוג השמחה
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Controller
                      name="celebrationType"
                      control={control}
                      rules={{ 
                        required: announcementType === 'שמחות' ? 'יש לבחור סוג שמחה' : false 
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <div>
                          <select
                            {...field}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              paddingRight: '40px',
                              border: error ? '1px solid #ef4444' : '1px solid #cbd5e1',
                              borderRadius: '8px',
                              fontSize: '16px',
                              backgroundColor: '#f8fafc',
                              appearance: 'none',
                              transition: 'all 0.3s ease',
                              outline: 'none'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = error ? '#ef4444' : '#3b82f6';
                              e.currentTarget.style.boxShadow = error 
                                ? '0 0 0 3px rgba(239, 68, 68, 0.2)' 
                                : '0 0 0 3px rgba(59, 130, 246, 0.2)';
                              e.currentTarget.style.backgroundColor = 'white';
                            }}
                            onBlur={(e) => {
                              field.onBlur();
                              e.currentTarget.style.borderColor = error ? '#ef4444' : '#cbd5e1';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.backgroundColor = '#f8fafc';
                            }}
                          >
                            <option value="">בחר סוג שמחה</option>
                            <option value="חתונה">חתונה</option>
                            <option value="בר מצוה">בר מצוה</option>
                            <option value="בת מצוה">בת מצוה</option>
                            <option value="תינוק/ תינוקת">תינוק/ תינוקת</option>
                          </select>
                          {error && (
                            <p style={{ 
                              color: '#ef4444', 
                              fontSize: '14px', 
                              margin: '4px 0 0 0' 
                            }}>
                              {error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      right: '12px',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      fontSize: '20px',
                      color: '#94a3b8'
                    }}>
                      🎉
                    </div>
                  </div>
                </div>
              )}
              
              {/* מבחר מין עבור תינוק/תינוקת */}
              {announcementType === 'שמחות' && 
              celebrationType === 'תינוק/ תינוקת' && (
                <div style={{ 
                    marginBottom: '20px',
                    animation: 'fadeIn 0.4s ease-out'
                  }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: 'bold',
                      color: '#475569'
                    }}>
                      מין
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Controller
                        name="sex"
                        control={control}
                        rules={{ 
                          required: announcementType === 'שמחות' && celebrationType === 'תינוק/ תינוקת' ? 'יש לבחור מין' : false 
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <div>
                            <select
                              {...field}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                paddingRight: '40px',
                                border: error ? '1px solid #ef4444' : '1px solid #cbd5e1',
                                borderRadius: '8px',
                                fontSize: '16px',
                                backgroundColor: '#f8fafc',
                                appearance: 'none',
                                transition: 'all 0.3s ease',
                                outline: 'none'
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor = error ? '#ef4444' : '#3b82f6';
                                e.currentTarget.style.boxShadow = error 
                                  ? '0 0 0 3px rgba(239, 68, 68, 0.2)' 
                                  : '0 0 0 3px rgba(59, 130, 246, 0.2)';
                                e.currentTarget.style.backgroundColor = 'white';
                              }}
                              onBlur={(e) => {
                                field.onBlur();
                                e.currentTarget.style.borderColor = error ? '#ef4444' : '#cbd5e1';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                              }}
                            >
                              <option value="">בחר מין</option>
                              <option value="בן">בן</option>
                              <option value="בת">בת</option>
                            </select>
                            {error && (
                              <p style={{ 
                                color: '#ef4444', 
                                fontSize: '14px', 
                                margin: '4px 0 0 0' 
                              }}>
                                {error.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        right: '12px',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        fontSize: '20px',
                        color: '#94a3b8'
                      }}>
                        👶
                      </div>
                    </div>
                  </div>
                )}
                
                {/* מבחר מין עבור חתונה */}
                {announcementType === 'שמחות' && 
                celebrationType === 'חתונה' && (
                  <div style={{ 
                    marginBottom: '20px',
                    animation: 'fadeIn 0.4s ease-out'
                  }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: 'bold',
                      color: '#475569'
                    }}>
                      מין
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Controller
                        name="sex"
                        control={control}
                        rules={{ 
                          required: announcementType === 'שמחות' && celebrationType === 'חתונה' ? 'יש לבחור מין' : false 
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <div>
                            <select
                              {...field}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                paddingRight: '40px',
                                border: error ? '1px solid #ef4444' : '1px solid #cbd5e1',
                                borderRadius: '8px',
                                fontSize: '16px',
                                backgroundColor: '#f8fafc',
                                appearance: 'none',
                                transition: 'all 0.3s ease',
                                outline: 'none'
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor = error ? '#ef4444' : '#3b82f6';
                                e.currentTarget.style.boxShadow = error 
                                  ? '0 0 0 3px rgba(239, 68, 68, 0.2)' 
                                  : '0 0 0 3px rgba(59, 130, 246, 0.2)';
                                e.currentTarget.style.backgroundColor = 'white';
                              }}
                              onBlur={(e) => {
                                field.onBlur();
                                e.currentTarget.style.borderColor = error ? '#ef4444' : '#cbd5e1';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                              }}
                            >
                              <option value="">בחר מין</option>
                              <option value="בן">בן</option>
                              <option value="בת">בת</option>
                            </select>
                            {error && (
                              <p style={{ 
                                color: '#ef4444', 
                                fontSize: '14px', 
                                margin: '4px 0 0 0' 
                              }}>
                                {error.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        right: '12px',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        fontSize: '20px',
                        color: '#94a3b8'
                      }}>
                        💍
                      </div>
                    </div>
                  </div>
                )}
  
                {/* שדה hidden עבור wedding */}
                <Controller
                  name="wedding"
                  control={control}
                  render={({ field }) => (
                    <input type="hidden" {...field} />
                  )}
                />
                
                {announcementType && (
                  <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderLeft: '4px solid #3b82f6',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    animation: 'fadeIn 0.5s ease-out'
                  }}>
                    <div style={{ fontSize: '20px', marginLeft: '12px' }}>💡</div>
                    <p style={{ margin: 0, color: '#475569', fontSize: '14px' }}>
                      {announcementType === 'הודעות' 
                        ? 'טיפ: תוכל לעצב את ההודעה באופן מלא בדף הבא. ניתן להשתמש בירידות שורה וסימני "-" ליצירת רשימות מסודרות.'
                        : 'טיפ: תוכל להוסיף תמונה וברכה מותאמת אישית בדף הבא'}
                    </p>
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  gap: '12px', 
                  marginTop: '24px'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: '12px 22px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 22px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: isValid ? 'pointer' : 'not-allowed',
                      fontWeight: 'bold',
                      background: isValid 
                        ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                        : '#94a3b8',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: isValid 
                        ? '0 4px 12px rgba(37, 99, 235, 0.25)' 
                        : 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (isValid) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.35)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isValid) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.25)';
                      }
                    }}
                  >
                    {isValid && (
                      <div 
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '150%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                          transform: 'skewX(-20deg)',
                          animation: 'shine 4s infinite'
                        }}
                      ></div>
                    )}
                    <span style={{ marginLeft: '8px' }}>➡️</span>
                    המשך ליצירת המודעה
                  </button>
                </div>
              </form>
            </div>
      
        </div>
      )}
  
      {/* סגנונות CSS לאנימציות */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes bounceIn {
            0% { transform: scale(0.8); opacity: 0; }
            60% { transform: scale(1.05); }
            80% { transform: scale(0.95); }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @keyframes shine {
            0% { left: -100%; }
            20% { left: 100%; }
            100% { left: 100%; }
          }
          
          @keyframes pulseIn {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @keyframes rotateIn {
            from { transform: rotate(-90deg); opacity: 0; }
            to { transform: rotate(0); opacity: 1; }
          }
          
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(15px, 15px); }
          }
        `}
      </style>
        
  
      {/* כפתור צף להוספת מודעה */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          fontSize: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)',
          cursor: 'pointer',
          transition: 'transform 0.3s, box-shadow 0.3s',
          animation: isInitialLoad ? 'bounce 1s ease 2s' : 'none',
          zIndex: 50
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 15px rgba(37, 99, 235, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(37, 99, 235, 0.3)';
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-5px',
          left: '-5px',
          right: '-5px',
          bottom: '-5px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)',
          animation: 'pulse 2s infinite ease-in-out',
          zIndex: -1
        }}></div>
        
        <span style={{ marginTop: '-5px' }}>+</span>
      </button>

      {/* דיאלוג מחיקה */}
      {deleteDialogOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.35)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            minWidth: 320,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}>
            <h3 style={{margin:0}}>אישור מחיקת מודעה</h3>
            <div>האם אתה בטוח שברצונך למחוק את המודעה?</div>
            <input
              type="password"
              placeholder="הכנס סיסמה"
              value={deletePassword}
              onChange={e => setDeletePassword(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                width: '100%'
              }}
            />
            {deleteError && (
              <div style={{
                color: '#ef4444',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {deleteError}
              </div>
            )}
            <div style={{
              display: 'flex',
              gap: 8,
              marginTop: 8
            }}>
              <button 
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setDeletePassword('');
                  setDeleteError(null);
                }} 
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                ביטול
              </button>
              <button
                onClick={() => handleDeleteNotice(noticeToDelete._id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#ef4444',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                מחק
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
  
export default NoticeBoard;