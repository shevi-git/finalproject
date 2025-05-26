import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    TextField, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Container, 
    Paper,
    Button
} from '@mui/material';

const CreateAnnouncement = () => {
    const navigate = useNavigate();
    const [sex, setSex] = useState("");
    const [announcementType, setAnnouncementType] = useState("");
    const [celebrationType, setCelebrationType] = useState("");
    const [nameFamily, setNameFamily] = useState("");
    const [notes, setNotes] = useState("");
    const [showForm, setShowForm] = useState(false);
    
    // Handle the main announcement type selection
    const handleAnnouncementTypeChange = (e) => {
        const answer = e.target.value;
        setAnnouncementType(answer);
        // Reset celebration type when changing main type
        setCelebrationType("");
        setSex("");
    }
    
    const handleMessageTypeChange = () => {
        navigate('/Announcement', {
            state: {
                sex: null,
                nameFamily: null,
                wedding: null,
                message: notes,
                type: 'הודעות'
            }
        });
    }

    // Handle celebration type selection
    const handleCelebrationTypeChange = (e) => {
        const answer = e.target.value;
        setCelebrationType(answer);
        
        // For Bar Mitzvah, automatically set sex to male and navigate
        if (answer === "בר מצוה") {
            navigate('/Announcement', {
                state: {
                    sex: "בן",
                    nameFamily: nameFamily,
                    wedding: "היכנס בינכם לעול תורה ומצוות",
                    message: null,
                    type: 'שמחות',
                    celebrationType: answer
                }
            });
        }
        // For Bat Mitzvah, automatically set sex to female and navigate
        else if (answer === "בת מצוה") {
            navigate('/Announcement', {
                state: {
                    sex: "בת",
                    nameFamily: nameFamily,
                    wedding: "היכנס בינכם לעול תורה ומצוות",
                    message: null,
                    type: 'שמחות',
                    celebrationType: answer
                }
            });
        }
    }

    // Handle gender selection for birth announcement
    const handleBirthSelection = (e) => {
        const answer = e.target.value;
        setSex(answer);
        navigate('/Announcement', {
            state: {
                sex: answer,
                nameFamily: nameFamily,
                wedding: "הולדת",
                message: null,
                type: 'שמחות',
                celebrationType: 'תינוק/ תינוקת'
            }
        });
    }

    // Handle gender selection for wedding announcement
    const handleWeddingSelection = (e) => {
        const answer = e.target.value;
        setSex(answer);
        navigate('/Announcement', {
            state: {
                sex: answer,
                nameFamily: nameFamily,
                wedding: "אירוסי",
                message: null,
                type: 'שמחות',
                celebrationType: 'חתונה'
            }
        });
    }

    // Toggle the form visibility
    const toggleFormVisibility = () => {
        setShowForm(!showForm);
        // Reset values when toggling form
        if (!showForm) {
            setAnnouncementType("");
            setCelebrationType("");
            setSex("");
        }
    }

    return (
        <Container maxWidth="sm" sx={{ 
            mt: 10,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
        }}>
            {/* Button to create new announcement */}
            <Button
                variant="contained"
                color="primary"
                onClick={toggleFormVisibility}
                sx={{ mb: 3 }}
            >
                {showForm ? "סגור טופס" : "יצירת מודעה חדשה"}
            </Button>
            
            {showForm && (
                <Paper elevation={3} sx={{ 
                    p: 4, 
                    textAlign: 'center', 
                    direction: 'rtl',
                    width: '100%'
                }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        יצירת מודעה חדשה
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
                        <TextField
                            fullWidth
                            label="שם משפחה"
                            value={nameFamily}
                            onChange={(e) => setNameFamily(e.target.value)}
                            variant="outlined"
                            InputProps={{
                                sx: { direction: 'rtl' }
                            }}
                            InputLabelProps={{
                                sx: { direction: 'rtl', right: 0, left: 'auto', transformOrigin: 'right' }
                            }}
                        />
                        
                        {/* Main announcement type selection */}
                        <FormControl fullWidth>
                            <InputLabel id="main-announcement-type-label" sx={{ right: 0, left: 'auto', transformOrigin: 'right' }}>
                                סוג המודעה
                            </InputLabel>
                            <Select
                                labelId="main-announcement-type-label"
                                value={announcementType}
                                onChange={handleAnnouncementTypeChange}
                                label="סוג המודעה"
                            >
                                <MenuItem value="">בחר סוג הודעה</MenuItem>
                                <MenuItem value="הודעות כלליות">הודעות</MenuItem>
                                <MenuItem value="שמחות">שמחות</MenuItem>
                            </Select>
                        </FormControl>

                        {announcementType === "הודעות" && (
                            <>
                                <TextField
                                    fullWidth
                                    label="הערות"
                                    multiline
                                    rows={4}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="הכנס את ההערות שלך כאן..."
                                    variant="outlined"
                                    InputProps={{
                                        sx: { direction: 'rtl' }
                                    }}
                                    InputLabelProps={{
                                        sx: { direction: 'rtl', right: 0, left: 'auto', transformOrigin: 'right' }
                                    }}
                                />
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    onClick={handleMessageTypeChange}
                                >
                                    לשמירת ההודעה
                                </Button>
                            </>
                        )}

                        {/* Celebration type selection (shows only when "שמחות" is selected) */}
                        {announcementType === "שמחות" && (
                            <FormControl fullWidth>
                                <InputLabel id="celebration-type-label" sx={{ right: 0, left: 'auto', transformOrigin: 'right' }}>
                                    סוג השמחה
                                </InputLabel>
                                <Select
                                    labelId="celebration-type-label"
                                    value={celebrationType}
                                    onChange={handleCelebrationTypeChange}
                                    label="סוג השמחה"
                                >
                                    <MenuItem value="">בחר סוג שמחה</MenuItem>
                                    <MenuItem value="חתונה">חתונה</MenuItem>
                                    <MenuItem value="בר מצוה">בר מצוה</MenuItem>
                                    <MenuItem value="בת מצוה">בת מצוה</MenuItem>
                                    <MenuItem value="תינוק/ תינוקת">תינוק/ תינוקת</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        {/* Gender selection for baby announcement */}
                        {celebrationType === "תינוק/ תינוקת" && (
                            <FormControl fullWidth>
                                <InputLabel id="gender-label" sx={{ right: 0, left: 'auto', transformOrigin: 'right' }}>
                                    מין
                                </InputLabel>
                                <Select
                                    labelId="gender-label"
                                    value={sex}
                                    onChange={handleBirthSelection}
                                    label="מין"
                                >
                                    <MenuItem value="">בחר מין</MenuItem>
                                    <MenuItem value="בן">בן</MenuItem>
                                    <MenuItem value="בת">בת</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        {/* Gender selection for wedding announcement */}
                        {celebrationType === "חתונה" && (
                            <FormControl fullWidth>
                                <InputLabel id="gender-label" sx={{ right: 0, left: 'auto', transformOrigin: 'right' }}>
                                    מין
                                </InputLabel>
                                <Select
                                    labelId="gender-label"
                                    value={sex}
                                    onChange={handleWeddingSelection}
                                    label="מין"
                                >
                                    <MenuItem value="">בחר מין</MenuItem>
                                    <MenuItem value="בן">בן</MenuItem>
                                    <MenuItem value="בת">בת</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </Box>
                </Paper>
            )}
        </Container>
    );
}

export default CreateAnnouncement;