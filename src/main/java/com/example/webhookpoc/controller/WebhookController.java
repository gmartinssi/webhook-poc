package com.example.webhookpoc.controller;

import com.example.webhookpoc.dto.WebhookSubscriptionDTO;
import com.example.webhookpoc.entity.WebhookSubscription;
import com.example.webhookpoc.service.WebhookSubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {

    private final WebhookSubscriptionService webhookSubscriptionService;

    @PostMapping("/subscribe")
    public ResponseEntity<WebhookSubscription> subscribe(@RequestBody WebhookSubscriptionDTO dto) {
        log.info("POST /api/webhooks/subscribe - Subscribing webhook for user {}", dto.getUserId());
        WebhookSubscription subscription = webhookSubscriptionService.subscribeOrUpdate(dto);
        return ResponseEntity.ok(subscription);
    }
}
