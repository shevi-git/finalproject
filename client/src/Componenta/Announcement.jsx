import { useRef, useState, useEffect } from 'react';
import { Box, Typography, Button, Stack, Snackbar } from '@mui/material';
import { Print as PrintIcon, Download as DownloadIcon, Share as ShareIcon } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate, useLocation } from 'react-router-dom';
import NoticeBoard from '../Componenta/NoticeBoard';
import axios from 'axios';

const Announcement = () => {
    const announcementRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { sex, nameFamily, wedding, message } = location.state || {};
    
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [showActionButtons, setShowActionButtons] = useState(false);
    const [isMessageType, setIsMessageType] = useState(false);

    // צבעי זהב
    const goldColors = {
        border: '#c9a04c',        
        softBorder: '#e9cc94',    
        text: '#b38728',          
        background: '#fffcf4'      
    };
    
    // צבעים רשמיים להודעות
    const formalColors = {
        border: '#d9d9d9',
        text: '#2c3e50',
        lightText: '#7f8c8d',
        background: '#ffffff',
        highlight: '#e7e7e7'
    };

    useEffect(() => {
        // בדיקה האם זו מודעת הודעה או מודעת שמחה
        if (message !== null && message !== undefined) {
            setIsMessageType(true);
            setTitle("לשכנים היקרים");
            setContent(message);
        } else {
            setIsMessageType(false);
            setTitle(`למשפחת ${nameFamily} היקרה!`);
            
            // יצירת תוכן מתאים לסוג השמחה
            if (wedding === "הולדת" && sex === "בן") {
                setContent(`מזל טוב לרגל הולדת ה${sex}\nתזכו לגדלו לחופה לתורה ולמעשים טובים\nמאחלים השכנים`);
            } else if (wedding === "הולדת" && sex === "בת") {
                setContent(`מזל טוב לרגל הולדת ה${sex}\nתזכו לגדלה לחופה לתורה ולמעשים טובים\nמאחלים השכנים`);
            } else if (wedding === "אירוסי") {
                setContent(`מזל טוב לרגל אירוסי ה${sex}\nשהשמחה תמיד תשרה במעונכם\nמאחלים השכנים`);
            } else { // בר/בת מצווה
                setContent(`מזל טוב\nלרגל היכנס ${sex === "בן" ? "בנכם" : "בתכם"} לעול תורה ומצוות\nתזכו תמיד לרוב נחת יהודית אמיתית\nמאחלים השכנים`);
            }
        }
    }, [message, sex, nameFamily, wedding]);

    const getEventText = () => {
        if (wedding === "אירוסי") return "אירוסי";
        if (wedding === "הולדת") return "הולדת";
        return wedding; 
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async () => {
        if (announcementRef.current) {
            try {
                const canvas = await html2canvas(announcementRef.current);
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('l', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`announcement-${nameFamily || 'message'}.pdf`);
            } catch (error) {
                console.error("שגיאה ביצירת PDF:", error);
                setSnackbarOpen(true);
            }
        }
    };

    const saveAnnouncement = async () => {
        let announcementData;
        
        if (isMessageType) {
            // נתונים למודעת הודעה
            announcementData = {
                title: "לשכנים היקרים",
                content: message,
                type:"הודעות כלליות",
                createBy: "ועד הבית",
                createDate: new Date().toISOString()
            };
        } else {
            // נתונים למודעת שמחה
            announcementData = {
                title: `למשפחת ${nameFamily} היקרה!`,
                content: content,
                type:"הודעות שמחה",
                createBy: "ועד הבית",
                createDate: new Date().toISOString()
            };
        }
       
        try {
            console.log("שולח נתונים לשרת:", JSON.stringify(announcementData, null, 2));
            const response = await axios.post(`http://localhost:3000/Announcement/CreateAnnouncement`, announcementData);
            console.log("תשובה מהשרת:", JSON.stringify(response.data, null, 2));
            
            if (response.status === 200 || response.status === 201) {
                console.log(`השמירה בוצעה בהצלחה!`);
                setShowActionButtons(true);

                // קבלת כל המודעות אחרי השמירה
                try {
                    const allAnnouncements = await axios.get(`http://localhost:3000/Announcement/getAnnouncements`);
                    console.log("כל המודעות במערכת:", JSON.stringify(allAnnouncements.data, null, 2));
                } catch (error) {
                    console.error("שגיאה בקבלת המודעות:", error.response?.data || error.message);
                }
            }        
        }
        catch(error) {
            console.error("שגיאה בחיבור לשרת:", error.response?.data || error.message);
            setSnackbarOpen(true);
        }
    };

    const handleShare = async () => {
        if (!announcementRef.current || !navigator.share) {
            setSnackbarOpen(true);
            return;
        }
        
        try {
            const canvas = await html2canvas(announcementRef.current);
            
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    throw new Error("Failed to create image blob");
                }
                
                const file = new File([blob], `announcement-${nameFamily || 'message'}.png`, { type: 'image/png' });
                
                try {
                    await navigator.share({
                        title: isMessageType ? 'הודעה חשובה' : `מזל טוב למשפחת ${nameFamily}`,
                        text: isMessageType ? 'הודעה' : 'מזל טוב!',
                        files: [file]
                    });
                } catch (shareError) {
                    console.error("Error in share operation:", shareError);
                    setSnackbarOpen(true);
                }
            }, 'image/png');
        } catch (error) {
            console.error("Error preparing image for sharing:", error);
            setSnackbarOpen(true);
        }
    };

    return (
        <>
            <style>
                {`
                    @media print {
                        @page {
                            size: landscape;
                            margin: 0;
                        }
                        body * {
                            visibility: hidden;
                        }
                        #printArea, #printArea * {
                            visibility: visible !important;
                        }
                        #printArea {
                            position: absolute !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 100% !important;
                            height: 100% !important;
                        }
                        .no-print {
                            display: none !important;
                        }
                    }
                `}
            </style>
            
            {/* עטיפה למודעה - מרוכזת אופקית */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh'  // גובה כמעט מלא של המסך
            }}>
                {/* המודעה עצמה - בפורמט רוחבי */}
                <Box 
                    id="printArea"
                    ref={announcementRef}
                    sx={{ 
                        width: '800px',
                        height: '400px',
                        border: isMessageType 
                            ? `2px solid ${formalColors.border}` 
                            : `5px double ${goldColors.border}`,
                        borderRadius: isMessageType ? '8px' : '15px',
                        padding: '25px',
                        background: isMessageType 
                            ? formalColors.background 
                            : goldColors.background,
                        position: 'relative',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        overflow: 'hidden',
                        boxShadow: isMessageType 
                            ? '0 4px 12px rgba(0,0,0,0.08)' 
                            : 'none'
                    }}
                >
                    {/* מסגרת פנימית */}
                    <Box 
                        sx={{ 
                            border: isMessageType 
                                ? 'none' 
                                : `1px solid ${goldColors.softBorder}`,
                            borderRadius: isMessageType ? '6px' : '10px',
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '15px',
                            boxSizing: 'border-box',
                            overflow: 'hidden'
                        }}
                    >
                        {/* בס"ד בפינה הימנית העליונה - תמיד מוצג */}
                        <Typography
                            sx={{
                                position: 'absolute',
                                top: 20,
                                right: 20,
                                fontFamily: 'David, Arial, sans-serif',
                                color: isMessageType ? formalColors.text : goldColors.text,
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                zIndex: 10,
                                backgroundColor: isMessageType 
                                    ? `${formalColors.background}CC` 
                                    : `${goldColors.background}CC`,
                                padding: '2px 4px',
                                borderRadius: '4px'
                            }}
                        >
                            בס"ד
                        </Typography>

                        {/* דיאמונדים בפינות - רק במודעות שמחה */}
                        {!isMessageType && (
                            <>
                                <Box 
                                    sx={{ 
                                        position: 'absolute',
                                        top: '30px',
                                        right: '30px',
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: goldColors.softBorder,
                                        transform: 'rotate(45deg)',
                                        opacity: 0.7
                                    }}
                                />
                                <Box 
                                    sx={{ 
                                        position: 'absolute',
                                        top: '30px',
                                        left: '30px',
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: goldColors.softBorder,
                                        transform: 'rotate(45deg)',
                                        opacity: 0.7
                                    }}
                                />
                                <Box 
                                    sx={{ 
                                        position: 'absolute',
                                        bottom: '30px',
                                        right: '30px',
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: goldColors.softBorder,
                                        transform: 'rotate(45deg)',
                                        opacity: 0.7
                                    }}
                                />
                                <Box 
                                    sx={{ 
                                        position: 'absolute',
                                        bottom: '30px',
                                        left: '30px',
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: goldColors.softBorder,
                                        transform: 'rotate(45deg)',
                                        opacity: 0.7
                                    }}
                                />
                            </>
                        )}
                        
                        {/* תוכן המודעה - כל התוכן עם מרווחים גמישים */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '35px',
                            paddingBottom: '25px'
                        }}>
                            {isMessageType ? (
                                // תצוגה למודעת הודעה - עיצוב רשמי יותר
                                <Box sx={{ 
                                    textAlign: 'center', 
                                    maxWidth: '100%', 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    overflow: 'hidden',
                                    direction: 'rtl',
                                    padding: '20px',
                                }}>
                                    {/* כותרת המודעה - באנר עליון */}
                                    <Box sx={{
                                        width: '100%',
                                        padding: '10px 0',
                                        borderBottom: `2px solid ${formalColors.highlight}`,
                                        mb: 4
                                    }}>
                                        <Typography
                                            component="h2"
                                            sx={{
                                                fontFamily: 'Arial, sans-serif', // פונט רשמי יותר
                                                color: formalColors.text, // צבע כהה יותר לטקסט
                                                fontWeight: 'bold',
                                                fontSize: '1.8rem',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {title}
                                        </Typography>
                                    </Box>
                                    
                                    {/* תוכן ההודעה */}
                                    <Box sx={{
                                        flex: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '85%',
                                        margin: '0 auto'
                                    }}>
                                        <Typography
                                            sx={{
                                                fontFamily: 'Arial, sans-serif',
                                                color: formalColors.text,
                                                fontSize: '1.4rem',
                                                lineHeight: '1.6',
                                                whiteSpace: 'pre-wrap',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {message}
                                        </Typography>
                                    </Box>
                                    
                                    {/* חתימה בתחתית המודעה */}
                                    <Box sx={{ 
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        mt: 4,
                                        borderTop: `1px solid ${formalColors.highlight}`,
                                        paddingTop: '15px',
                                        paddingRight: '30px'
                                    }}>
                                        <Typography
                                            sx={{
                                                fontFamily: 'Arial, sans-serif',
                                                color: formalColors.lightText,
                                                fontSize: '1rem',
                                                fontStyle: 'italic'
                                            }}
                                        >
                                            בברכה,
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: 'Arial, sans-serif',
                                                color: formalColors.text,
                                                fontSize: '1.1rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            ועד הבית
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : (
                                // תצוגה למודעת שמחה
                                <>
                                    {/* חלק עליון - למשפחת */}
                                    <Box sx={{ 
                                        textAlign: 'center', 
                                        mb: 1.5,
                                        maxWidth: '100%',
                                        overflow: 'hidden',
                                        direction: 'rtl'
                                    }}>
                                        <Typography
                                            component="span"
                                            sx={{
                                                fontFamily: 'David, Arial, sans-serif',
                                                color: goldColors.text,
                                                fontWeight: 'bold',
                                                fontSize: '2rem',
                                                display: 'inline'
                                            }}
                                        >
                                            למשפחת 
                                        </Typography>
                                        
                                        <Typography
                                            component="span"
                                            sx={{
                                                fontFamily: 'David, Arial, sans-serif',
                                                color: goldColors.text,
                                                fontWeight: 'bold',
                                                fontSize: '2rem',
                                                display: 'inline',
                                                mx: 0.5
                                            }}
                                        >
                                            {nameFamily}
                                        </Typography>
                                        
                                        <Typography
                                            component="span"
                                            sx={{
                                                fontFamily: 'David, Arial, sans-serif',
                                                color: goldColors.text,
                                                fontWeight: 'bold',
                                                fontSize: '2rem',
                                                display: 'inline'
                                            }}
                                        >
                                            היקרה!
                                        </Typography>
                                    </Box>
                                    
                                    {/* חלק אמצעי - מזל טוב */}
                                    <Typography
                                        sx={{
                                            fontFamily: 'David, Arial, sans-serif',
                                            color: goldColors.text,
                                            fontWeight: 'bold',
                                            fontSize: '4rem',
                                            mb: 1.5,
                                            textAlign: 'center',
                                            maxWidth: '100%',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        מזל טוב
                                    </Typography>
                                    
                                    {/* חלק תחתון - תוכן הברכה */}
                                    <Box sx={{ 
                                        textAlign: 'center',
                                        maxWidth: '100%',
                                        overflow: 'hidden'
                                    }}>
                                        {/* ברכה בהתאם לסוג האירוע */}
                                        <Box sx={{ mb: 0.5 }}>
                                            <Typography
                                                sx={{
                                                    fontFamily: 'David, Arial, sans-serif',
                                                    color: goldColors.text,
                                                    fontSize: '1.3rem',
                                                    mb: 0.5
                                                }}
                                            >
                                                לרגל {getEventText()} {
                                                    wedding === "הולדת" ? `ה${sex}` : 
                                                    wedding === "אירוסי" ? `ה${sex}` : ""
                                                }
                                            </Typography>
                                            
                                            <Typography
                                                sx={{
                                                    fontFamily: 'David, Arial, sans-serif',
                                                    color: goldColors.text,
                                                    fontSize: '1.3rem'
                                                }}
                                            >
                                                {wedding === "אירוסי" 
                                                ? "תזכו לבנות בית נאמן בישראל" 
                                                : `תזכו ${sex === "בן" ? "להכניסו" : "להכניסה"} לתורה לחופה ולמעשים טובים`
                                                }
                                            </Typography>
                                        </Box>
                                        
                                        {/* חתימה */}
                                        <Box sx={{ mt: 1 }}>
                                            <Typography
                                                sx={{
                                                    fontFamily: 'David, Arial, sans-serif',
                                                    color: goldColors.text,
                                                    fontSize: '1.1rem',
                                                    fontStyle: 'italic'
                                                }}
                                            >
                                                מאחלים 
                                            </Typography>
                                            
                                            <Typography
                                                sx={{
                                                    fontFamily: 'David, Arial, sans-serif',
                                                    color: goldColors.text,
                                                    fontSize: '1.1rem',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                השכנים
                                            </Typography>
                                        </Box>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    onClick={saveAnnouncement}
                    sx={isMessageType ? {
                        backgroundColor: formalColors.text,
                        '&:hover': {
                            backgroundColor: formalColors.lightText,
                        },
                        px: 3,
                        py: 1.2,
                        borderRadius: 1,
                        mb: 2
                    } : {
                        backgroundColor: goldColors.text,
                        '&:hover': {
                            backgroundColor: goldColors.border,
                        },
                        px: 3,
                        py: 1.2,
                        borderRadius: 2,
                        mb: 2
                    }}
                >
                    שמירת המודעה
                </Button>

                {showActionButtons && (
                    <Stack direction="row" spacing={3} className="no-print">
                        <Button
                            variant="contained"
                            startIcon={<PrintIcon />}
                            onClick={handlePrint}
                            sx={isMessageType ? {
                                backgroundColor: formalColors.text,
                                '&:hover': {
                                    backgroundColor: formalColors.lightText,
                                },
                                px: 3,
                                py: 1.2,
                                borderRadius: 1
                            } : {
                                backgroundColor: goldColors.text,
                                '&:hover': {
                                    backgroundColor: goldColors.border,
                                },
                                px: 3,
                                py: 1.2,
                                borderRadius: 2
                            }}
                        >
                            הדפסה
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={handleDownload}
                            sx={isMessageType ? {
                                color: formalColors.text,
                                borderColor: formalColors.text,
                                '&:hover': {
                                    borderColor: formalColors.lightText,
                                    backgroundColor: `${formalColors.text}10`,
                                },
                                px: 3,
                                py: 1.2,
                                borderRadius: 1
                            } : {
                                color: goldColors.text,
                                borderColor: goldColors.text,
                                '&:hover': {
                                    borderColor: goldColors.border,
                                    backgroundColor: `${goldColors.text}10`,
                                },
                                px: 3,
                                py: 1.2,
                                borderRadius: 2
                            }}
                        >
                            הורדה כ-PDF
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {navigate('/NoticeBoard')}}
                            sx={isMessageType ? {
                                backgroundColor: formalColors.text,
                                '&:hover': {
                                    backgroundColor: formalColors.lightText,
                                },
                                px: 3,
                                py: 1.2,
                                borderRadius: 1
                            } : {
                                backgroundColor: goldColors.text,
                                '&:hover': {
                                    backgroundColor: goldColors.border,
                                },
                                px: 3,
                                py: 1.2,
                                borderRadius: 2
                            }}
                        >
                            להוספה ללוח מודעות
                        </Button>
                    </Stack>
                )}
                
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    message="שגיאה בביצוע הפעולה, אנא נסה שוב"
                />
            </Box>
        </>
    );
};

export default Announcement;