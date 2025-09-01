package com.example.webhookpoc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebhookSubscriptionDTO {
    private Long userId;
    private String webhookUrl;
}
