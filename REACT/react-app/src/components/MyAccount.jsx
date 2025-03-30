import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // adjust path as needed
import styles from './MyAccount.module.css';

export default function AccountPage() {
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Assuming 'name' is stored in the `user_metadata`
        const name = user.user_metadata?.name || "User";
        const email = user.email;
        setUserInfo({ name, email });
      }
    };

    fetchUser();
  }, []);

  return (
    <div className={styles.accountContainer}>
      <h1 className={styles.welcomeText}>Welcome, {userInfo.name}!</h1>
      <p className={styles.emailText}>Email: {userInfo.email}</p>

      <div className={styles.componentCardsContainer}>
        <div className={styles.componentCard}>
          <h3>Sentiment Analysis</h3>
          <p>Understand what your customers are saying about each aspect of your service.</p>
        </div>
        <div className={styles.componentCard}>
          <h3>Customer Segmentation</h3>
          <p>Automatically group your customers based on their behavior and preferences.</p>
        </div>
        <div className={styles.componentCard}>
          <h3>Engagement Prediction</h3>
          <p>Predict which users are likely to engage or churn using machine learning.</p>
        </div>
        <div className={styles.componentCard}>
          <h3>Recommendations</h3>
          <p>Generate personalized product or content suggestions for each user.</p>
        </div>
      </div>
    </div>
  );
}