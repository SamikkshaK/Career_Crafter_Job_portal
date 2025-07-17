package com.careercrafter.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ksamikksha@gmail.com");
        message.setTo("ksamikksha@gmail.com");
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
        System.out.println("✅ Mail sent to: " + to);
    }
}

