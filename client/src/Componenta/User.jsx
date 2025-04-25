import { useState } from 'react'

const User = () => {
    const [username, setUsername] = useState('');
    const [userpassword, setuserpassword] = useState('');
    const [userEmail, setuserEmail] = useState('');



    const name = (e) => {
        setUsername(e.target.value);
    };
    const password = (e) => {
        setuserpassword(e.target.value);
    };
    const email = (e) => {
        setuserEmail(e.target.value);
    };
    function handleSaveUser() {
        console.log("המשתמש: ", username);
        console.log("סיסמה: ", userpassword);
        console.log(userEmail);
    }
    return (
        <>
            <input
                type="text"
                placeholder="הכנס שם משתמש"
                value={username}
                onChange={name}
            />
            <input
                type="password"
                placeholder="הכנס סיסמה"
                value={userpassword}
                onChange={password}
            />
             <input
                type="email"
                placeholder="הכנס מייל"
                value={userEmail}
                onChange={email}
            />
            <button onClick={handleSaveUser}>שמירת משתמש</button>

        </>
    )
}
export default User;