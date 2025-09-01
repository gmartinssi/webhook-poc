package com.example.webhookpoc.service;

import com.example.webhookpoc.dto.WebhookSubscriptionDTO;
import com.example.webhookpoc.entity.WebhookSubscription;
import com.example.webhookpoc.repository.WebhookSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class WebhookSubscriptionService {

    private final WebhookSubscriptionRepository webhookSubscriptionRepository;

    public WebhookSubscription subscribeOrUpdate(WebhookSubscriptionDTO dto) {
        log.info("Subscribe or update webhook for user {}", dto.getUserId());
        
        Optional<WebhookSubscription> existing = webhookSubscriptionRepository.findByUserId(dto.getUserId());
        
        WebhookSubscription subscription;
        if (existing.isPresent()) {
            subscription = existing.get();
            subscription.setWebhookUrl(dto.getWebhookUrl());
            log.info("Updating existing webhook subscription for user {}", dto.getUserId());
        } else {
            subscription = new WebhookSubscription();
            subscription.setUserId(dto.getUserId());
            subscription.setWebhookUrl(dto.getWebhookUrl());
            log.info("Creating new webhook subscription for user {}", dto.getUserId());
        }
        
        return webhookSubscriptionRepository.save(subscription);
    }
}
