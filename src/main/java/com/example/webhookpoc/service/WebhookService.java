package com.example.webhookpoc.service;

import com.example.webhookpoc.dto.WebhookPayloadDTO;
import com.example.webhookpoc.entity.WebhookSubscription;
import com.example.webhookpoc.repository.WebhookSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebhookService {

    private final WebhookSubscriptionRepository webhookSubscriptionRepository;
    private final WebClient.Builder webClientBuilder;

    public void sendWebhook(Long userId, String eventType, Object payload) {
        Optional<WebhookSubscription> subscription = webhookSubscriptionRepository.findByUserId(userId);
        
        if (subscription.isPresent()) {
            String webhookUrl = subscription.get().getWebhookUrl();
            
            WebhookPayloadDTO webhookPayload = WebhookPayloadDTO.builder()
                    .eventType(eventType)
                    .timestamp(Instant.now())
                    .data(payload)
                    .build();
            
            log.info("Sending webhook to {} for user {} with event type {}", webhookUrl, userId, eventType);
            
            webClientBuilder.build()
                    .post()
                    .uri(webhookUrl)
                    .bodyValue(webhookPayload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .doOnSuccess(response -> log.info("Webhook sent successfully to {} for user {}", webhookUrl, userId))
                    .doOnError(error -> log.error("Error sending webhook to {} for user {}: {}", webhookUrl, userId, error.getMessage()))
                    .onErrorResume(error -> Mono.empty())
                    .subscribe();
        } else {
            log.info("No webhook subscription found for user {}", userId);
        }
    }
}
