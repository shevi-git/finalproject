import { useState, useEffect, useRef, useCallback } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Avatar, Typography, TextField, Button, IconButton, Fade, InputAdornment, Paper, Fab } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import { motion, AnimatePresence } from "framer-motion";
import { logout } from '../Store/UserSlice';



const Chat = () => {
    const dispatch = useDispatch();
    const nameUser = useSelector(state => state.user);
    const [content, setContent] = useState("");
    const [messages, setMessages] = useState([]);
    const [editMessageId, setEditMessageId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeout = useRef(null);
    const messagesEndRef = useRef(null);
    const sendAudioRef = useRef(null);
    const sendSoundUrl = '/sounds/send.mp3';
    const [soundEnabled, setSoundEnabled] = useState(true);
    const audioContextRef = useRef(null);

    // בדיקת התחברות בטעינת הקומפוננטה
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token || !nameUser?.user) {
            console.log("User not authenticated, redirecting to login...");
            alert("יש להתחבר למערכת כדי לשלוח הודעות");
            dispatch(logout());
            window.location.href = '/login'; // או הנתיב המתאים לדף ההתחברות שלך
            return;
        }
    }, [nameUser, dispatch]);

    // Debug logs for Redux state
    useEffect(() => {
        console.log("Current Redux state:", nameUser);
        console.log("User ID from Redux:", nameUser?.user?._id);
        console.log("User name from Redux:", nameUser?.user?.nameFamily || nameUser?.user?.name);
    }, [nameUser]);

    const playNotificationSound = () => {
        if (!soundEnabled) return;
        
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const ctx = audioContextRef.current;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            oscillator.frequency.setValueAtTime(800, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.2);
        } catch (error) {
            console.log("Audio not supported");
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const playSendSound = () => {
        if (sendAudioRef.current) {
            sendAudioRef.current.currentTime = 0;
            sendAudioRef.current.play();
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/ChatMessage/getAllMessages');
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const saveMessageToChat = async (message) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token || !nameUser?.user) {
                alert("יש להתחבר למערכת כדי לשלוח הודעות");
                dispatch(logout());
                window.location.href = '/login'; // או הנתיב המתאים לדף ההתחברות שלך
                return;
            }

            if (!message || !message.message) {
                alert("נא להזין הודעה");
                return;
            }

            const senderName = nameUser.user.nameFamily || nameUser.user.name || "משתמש לא ידוע";
            const payload = {
                sender: nameUser.user._id,
                senderName: senderName,
                message: message.message,
                category: message.category || "כללי"
            };

            console.log("Sending message payload:", payload);
            const response = await axios.post('http://localhost:8000/ChatMessage/createChatMessage', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.newMessage) {
                setMessages(prevMessages => [...prevMessages, response.data.newMessage]);
                playNotificationSound();
            } else {
                throw new Error("No message data received from server");
            }
        } catch (error) {
            console.error('Error saving message:', error);
            if (error.response?.status === 401) {
                alert("הסשן פג תוקף, יש להתחבר מחדש");
                dispatch(logout());
                window.location.href = '/login'; // או הנתיב המתאים לדף ההתחברות שלך
            } else {
                alert("שגיאה בשליחת ההודעה");
            }
        }
    };

    const deleteMessage = async (messageId) => {
        try {
            await axios.delete(`http://localhost:8000/ChatMessage/deleteMessage/${messageId}`);
            setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const editMessage = async (messageId, newMessage) => {
        try {
            const response = await axios.put('http://localhost:8000/ChatMessage/updateChatMessage', {
                messageId,
                newMessage
            });
            setMessages(prevMessages => 
                prevMessages.map(msg => 
                    msg._id === messageId ? response.data.updatedMessage : msg
                )
            );
        } catch (error) {
            console.error('Error editing message:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // Typing animation logic
    const handleTyping = (e) => {
        setContent(e.target.value);
        setIsTyping(true);
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 2000);
    };

    // Animation variants for messages
    const messageVariants = {
        initial: { opacity: 0, y: 30, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
        exit: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2 } }
    };

    console.log('user from Redux:', nameUser);
    console.log('token from localStorage:', localStorage.getItem('authToken'));

    const fetchFamilies = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            console.log('fetchFamilies: token:', token);
            if (!token) {
                dispatch(logout());
                return;
            }
            const response = await axios.get('http://localhost:8000/Family/getAllFamilies');
            console.log('fetchFamilies: response:', response.data);
            setFamilies(response.data);
        } catch (error) {
            console.error('fetchFamilies error:', error);
            // ... existing code ...
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    }, [dispatch]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            bgcolor: 'linear-gradient(135deg, #e0e7ff 0%, #f5f7fa 100%)',
            background: 'linear-gradient(135deg, #e0e7ff 0%, #f5f7fa 100%)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Sound effect */}
            <audio ref={sendAudioRef} src={sendSoundUrl} preload="auto" />

            {/* Header */}
            <Box sx={{
                px: 3, py: 2, bgcolor: 'rgba(255,255,255,0.85)', boxShadow: 1, borderBottom: '1px solid #e0e0e0',
                display: 'flex', alignItems: 'center', gap: 2, position: 'sticky', top: 0, zIndex: 2,
                backdropFilter: 'blur(8px)',
            }}>
                <Avatar sx={{ bgcolor: 'primary.main', boxShadow: '0 2px 8px #b39ddb' }}><PersonIcon /></Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>צ'אט הבניין</Typography>
            </Box>

            {/* Messages List */}
            <Box sx={{
                flex: 1,
                overflowY: 'auto',
                px: { xs: 1, sm: 4 },
                py: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                background: 'linear-gradient(180deg, #e0e7ff 0%, #f5f7fa 100%)',
                position: 'relative',
            }}>
                <AnimatePresence initial={false}>
                    {messages.map((mes) => {
                        const isOwner = mes.sender === nameUser?.user?._id;
                        const isHouseCommittee = nameUser?.user?.role === 'houseCommittee';
                        const isMe = isOwner;
                        return (
                            <motion.div
                                key={mes._id}
                                variants={messageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                layout
                                style={{
                                    display: 'flex',
                                    flexDirection: isMe ? 'row-reverse' : 'row',
                                    alignItems: 'flex-end',
                                    width: '100%',
                                    marginBottom: 12,
                                    position: 'relative',
                                }}
                            >
                                {/* Avatar, to the side */}
                                <Box sx={{ zIndex: 2, position: 'relative', mb: 0.5 }}>
                                    <Avatar sx={{ bgcolor: isMe ? 'primary.main' : 'purple', width: 36, height: 36, boxShadow: isMe ? '0 2px 8px #90caf9' : '0 1px 4px #b39ddb' }}>
                                        {mes.senderName ? mes.senderName[0] : '?'}
                                    </Avatar>
                                </Box>
                                {/* Message area: name above, message in Paper, time below */}
                                <Box
                                    sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: isMe ? 'flex-end' : 'flex-start',
                                        minWidth: 80,
                                        maxWidth: { xs: '80vw', sm: 400 },
                                        ml: isMe ? 0 : 1.5,
                                        mr: isMe ? 1.5 : 0,
                                    }}
                                >
                                    {/* Sender name above */}
                                    <Typography variant="subtitle2" sx={{ color: '#7e57c2', fontWeight: 500, mb: 0.5, fontSize: '0.92rem', px: 0.5, textAlign: isMe ? 'right' : 'left' }}>
                                        {mes.senderName || "משתמש לא ידוע"}
                                    </Typography>
                                    <Box
                                        component={Paper}
                                        elevation={3}
                                        sx={{
                                            px: 5,
                                            py: 0,
                                            bgcolor: isMe ? '#e3f2fd' : '#fff',
                                            color: '#222',
                                            borderRadius: 2,
                                            fontSize: '1.08rem',
                                            letterSpacing: 0.1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: isMe ? 'flex-end' : 'flex-start',
                                            position: 'relative',
                                            minHeight: 0,
                                            boxShadow: '0 2px 8px #b39ddb22',
                                            border: '1px solid #e0e0e0',
                                            transition: 'box-shadow 0.2s, filter 0.2s',
                                            '&:hover': {
                                                filter: 'brightness(1.07)',
                                                boxShadow: '0 4px 16px #b39ddb44',
                                                transform: 'translateY(-2px) scale(1.02)',
                                            },
                                        }}
                                    >
                                        {editMessageId === mes._id ? (
                                            <Box
                                                sx={{
                                                    position: 'sticky',
                                                    bottom: 0,
                                                    backgroundColor: 'white',
                                                    borderTop: '1px solid #ddd',
                                                    padding: '10px',
                                                    display: 'flex',
                                                    gap: 1,
                                                }}
                                            >
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    placeholder="הקלד הודעה..."
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                />

                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={async () => {
                                                        await editMessage(mes._id, editContent);
                                                        setEditMessageId(null);
                                                        setEditContent("");
                                                    }}
                                                    sx={{ minWidth: 0, px: 2 }}
                                                >שמור</Button>
                                                <Button
                                                    variant="outlined"
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => setEditMessageId(null)}
                                                    sx={{ minWidth: 0, px: 2 }}
                                                >ביטול</Button>
                                            </Box>
                                        ) : (
                                            <Typography variant="body1" sx={{ color: '#222', wordBreak: 'break-word', mb: 0.5, fontSize: '1.1rem', letterSpacing: 0.1, alignItems: 'center', display: 'flex', minHeight: 24, fontWeight: 400 }}>
                                                {mes.message}
                                            </Typography>
                                        )}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                            {(isOwner || isHouseCommittee) && editMessageId !== mes._id && (
                                                <>
                                                    <IconButton size="small" onClick={() => {
                                                        console.log('DELETE DEBUG:', { userId: nameUser?.user?._id, sender: mes.sender });
                                                        deleteMessage(mes._id);
                                                    }}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => {
                                                        setEditMessageId(mes._id);
                                                        setEditContent(mes.message);
                                                    }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </>
                                            )}
                                        </Box>
                                    </Box>
                                    {/* Time below */}
                                    <Typography variant="caption" sx={{ color: '#888', mt: 0.5, px: 0.5, textAlign: isMe ? 'right' : 'left', fontWeight: 400 }}>
                                        {mes.createDate ? new Date(mes.createDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </Typography>
                                </Box>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </Box>

            {/* Typing animation */}
            <Fade in={isTyping} unmountOnExit>
                <Box sx={{
                    position: 'absolute',
                    left: 0, right: 0, bottom: 80,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    pointerEvents: 'none',
                }}>
                    <Box sx={{
                        bgcolor: 'rgba(255,255,255,0.8)',
                        px: 2, py: 1, borderRadius: 2, boxShadow: 2, display: 'flex', alignItems: 'center', gap: 1
                    }}>
                        <Box sx={{ width: 8, height: 8, bgcolor: '#7e57c2', borderRadius: '50%', animation: 'typingBlink 1s infinite alternate' }} />
                        <Box sx={{ width: 8, height: 8, bgcolor: '#7e57c2', borderRadius: '50%', animation: 'typingBlink 1s 0.2s infinite alternate' }} />
                        <Box sx={{ width: 8, height: 8, bgcolor: '#7e57c2', borderRadius: '50%', animation: 'typingBlink 1s 0.4s infinite alternate' }} />
                        <Typography variant="caption" sx={{ color: '#7e57c2', fontWeight: 500 }}>מקליד...</Typography>
                    </Box>
                </Box>
            </Fade>

            {/* Input Bar */}
            <Box sx={{
                px: { xs: 1, sm: 4 },
                py: 2,
                bgcolor: 'rgba(255,255,255,0.95)',
                borderTop: '1px solid #e0e0e0',
                boxShadow: '0 -2px 16px #b39ddb',
                position: 'sticky',
                bottom: 0,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 6,
                mx: { xs: 0, sm: 4 },
                mb: 2,
                backdropFilter: 'blur(8px)',
            }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="הקלד הודעה..."
                    value={content}
                    onChange={handleTyping}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && content.trim()) {
                            saveMessageToChat({ 
                                message: content,
                                category: "כללי"
                            });
                            setContent("");
                            setIsTyping(false);
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <motion.div
                                    whileHover={{ scale: 1.15, rotate: 8 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                    style={{ display: 'inline-block' }}
                                >
                                    <IconButton
                                        color="primary"
                                        sx={{
                                            bgcolor: '#7e57c2', color: '#fff',
                                            boxShadow: '0 2px 8px #b39ddb',
                                            '&:hover': { bgcolor: '#5e35b1' },
                                            transition: 'all 0.2s',
                                        }}
                                        onClick={() => {
                                            if (content.trim()) {
                                                saveMessageToChat({ 
                                                    message: content.trim(),
                                                    category: "כללי"
                                                });
                                                setContent("");
                                                setIsTyping(false);
                                            }
                                        }}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </motion.div>
                            </InputAdornment>
                        )
                    }}
                />
            </Box>
            {/* Extra keyframes for typing and glow */}
            <style>{`
                @keyframes typingBlink {
                    0% { opacity: 0.2; }
                    100% { opacity: 1; }
                }
                @keyframes glow {
                    0% { box-shadow: 0 0 0px #b39ddb; }
                    60% { box-shadow: 0 0 16px #b39ddb; }
                    100% { box-shadow: 0 0 0px #b39ddb; }
                }
                html, body {
                    scroll-behavior: smooth;
                    overflow: hidden;
                }
                ::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </Box>
    );
};

export default Chat;