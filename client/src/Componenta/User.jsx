import { useState } from 'react';
import axios from 'axios';
import { saveUser } from '../Store/UserSlice';
import { useDispatch } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';

export const User = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [action, setAction] = useState('register');

    const dispatch = useDispatch();
    const methods = useForm({
        mode: "onChange", // בודק בזמן השינוי ולא רק בזמן השליחה
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const endpoint = action === 'register' ? '/register' : '/login';
            const payload = action === 'register'
                ? { name: data.username, email: data.email, password: data.password }
                : { email: data.email, password: data.password };
            const response = await axios.post(`http://localhost:8000/user${endpoint}`, payload);
            dispatch(saveUser({ name: data.username, email: data.email }));
            if (action === 'register') {
                console.log('נרשמת בהצלחה:', { name: data.username, email: data.email });
            }

            if (response.status === 200 || response.status === 201) {
                console.log(`${action === 'register' ? 'ההרשמה' : 'ההתחברות'} בוצעה בהצלחה!`);
            }
        } catch (error) {
            console.error("שגיאה בחיבור לשרת:", error);
        }
        setIsSubmitting(false);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} autoComplete="on">

                {action === 'register' && (
                    <div>
                        <label htmlFor="username">שם משתמש:</label>
                        <input
                            {...methods.register("username", {
                                required: "שם המשתמש הוא שדה חובה",
                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: "הכנס רק אותיות, ללא מספרים"
                                },
                                minLength: {
                                    value: 3,
                                    message: "שם המשתמש חייב להיות לפחות 3 תווים"
                                }
                            })}
                            id="username"
                            autoComplete="username"
                        />
                        {methods.formState.errors.username && (
                            <span>{methods.formState.errors.username.message}</span>
                        )}
                    </div>
                )}

                <div>
                    <label htmlFor="password">סיסמה:</label>
                    <input
                        {...methods.register("password", {
                            required: "הסיסמה היא שדה חובה",
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                message: "הסיסמה חייבת לכלול לפחות 8 תווים, אות קטנה, אות גדולה, מספר ותו מיוחד"
                            }
                        })}
                        type="password"
                        id="password"
                        autoComplete="new-password" // מורה לדפדפן לא למלא את השדה עם סיסמה ישנה
                    />
                    {methods.formState.errors.password && (
                        <span>{methods.formState.errors.password.message}</span>
                    )}
                </div>

                {/* שדה "סיסמה שוב" במקרה של הרשמה */}
                {action === 'register' && (
                    <div>
                        <label htmlFor="confirmPassword">אשר סיסמה:</label>
                        <input
                            {...methods.register("confirmPassword", {
                                required: "שדה זה הוא שדה חובה",
                                validate: (value) =>
                                    value === methods.getValues("password") || "הסיסמאות אינן תואמות"
                            })}
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                        />
                        {methods.formState.errors.confirmPassword && (
                            <span>{methods.formState.errors.confirmPassword.message}</span>
                        )}
                    </div>
                )}

                <div>
                    <label htmlFor="email">אימייל:</label>
                    <input
                        {...methods.register("email", {
                            required: "האימייל הוא שדה חובה",
                            pattern: {
                                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                message: "האימייל לא תקין"
                            }
                        })}
                        type="email"
                        id="email"
                        autoComplete="email"
                    />
                    {methods.formState.errors.email && (
                        <span>{methods.formState.errors.email.message}</span>
                    )}
                </div>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "שולח..." : action === 'register' ? "הרשם" : "התחבר"}
                </button>

                <div>
                    <button type="button" onClick={() => setAction('register')}>
                        הרשמה
                    </button>
                    <button type="button" onClick={() => setAction('login')}>
                        התחברות
                    </button>
                </div>
            </form>
        </FormProvider>
    );
};

export default User;
