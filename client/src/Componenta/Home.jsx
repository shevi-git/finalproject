import axios from 'axios';
import { useEffect, useState } from 'react';



const Home = () => {

    const [users, setUsers] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/Family/getAllFamilies')
            .then(Response => {
                console.log(Response.data);
                
                setUsers(Response.data);
            })
            .catch(error => {
                console.log("שגיאה בקבלת הנתונים",error);

            })
    }, [])
    return (
        <ul>
            {users.map(user => (
                <li key={user.nameFamily}>{user.nameFamily}</li>
            ))}
        </ul>
    )

}
export default Home;