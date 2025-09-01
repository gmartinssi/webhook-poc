package com.example.webhookpoc.repository;

import com.example.webhookpoc.entity.WebhookSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WebhookSubscriptionRepository extends JpaRepository<WebhookSubscription, Long> {
    Optional<WebhookSubscription> findByUserId(Long userId);
}
