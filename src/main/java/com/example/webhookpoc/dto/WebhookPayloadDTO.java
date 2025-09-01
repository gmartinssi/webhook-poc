package com.example.webhookpoc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookPayloadDTO {
    private String eventType;
    private Instant timestamp;
    private Object data;
}
