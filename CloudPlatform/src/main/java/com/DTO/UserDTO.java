package com.DTO;

import com.entity.User;
import com.persistence.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.query.NativeQuery;
import org.hibernate.query.Query;

public class UserDTO {

    public void saveUser(User user) {
        if (isUserRegister(user.getEmail(), user.getPassword())) {
            System.out.println("Pashol loginisa, you already have account");
        } else {
            Session session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();
            session.save(user);
            session.getTransaction().commit();
            session.close();
        }
    }

    public boolean isUserRegister(String email, String password) {
        Query query = searchUser(email, password);
        return !query.list().isEmpty();
    }

    public Query searchUser (String email, String password){
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.beginTransaction();
        Query query = session.createSQLQuery("SELECT * FROM finalproject.user WHERE email = :user_email AND password = :user_password")
                .addEntity(User.class);
        query.setParameter("user_email", email);
        query.setParameter("user_password", password);

        return query;
    }

    public Query searchUser (String email){
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.beginTransaction();
        Query query = session.createSQLQuery("SELECT * FROM user WHERE email = :user_email")
                .addEntity(User.class);
        query.setParameter("user_email", email);

        return query;
    }


}
