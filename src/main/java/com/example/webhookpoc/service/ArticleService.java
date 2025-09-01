package com.example.webhookpoc.service;

import com.example.webhookpoc.dto.ArticleDTO;
import com.example.webhookpoc.entity.Article;
import com.example.webhookpoc.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final WebhookService webhookService;

    public Article createArticle(ArticleDTO articleDto) {
        log.info("Creating article for user {}", articleDto.getUserId());
        
        Article article = new Article();
        article.setTitle(articleDto.getTitle());
        article.setContent(articleDto.getContent());
        article.setUserId(articleDto.getUserId());
        article.setCreatedAt(Instant.now());
        article.setUpdatedAt(Instant.now());
        
        Article savedArticle = articleRepository.save(article);
        
        // Trigger webhook
        webhookService.sendWebhook(savedArticle.getUserId(), "ARTICLE_CREATED", savedArticle);
        
        return savedArticle;
    }

    public Article updateArticle(Long articleId, ArticleDTO articleDto) {
        log.info("Updating article {} for user {}", articleId, articleDto.getUserId());
        
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + articleId));
        
        // Verify ownership
        if (!article.getUserId().equals(articleDto.getUserId())) {
            throw new RuntimeException("User " + articleDto.getUserId() + " is not the owner of article " + articleId);
        }
        
        article.setTitle(articleDto.getTitle());
        article.setContent(articleDto.getContent());
        article.setUpdatedAt(Instant.now());
        
        Article updatedArticle = articleRepository.save(article);
        
        // Trigger webhook
        webhookService.sendWebhook(updatedArticle.getUserId(), "ARTICLE_UPDATED", updatedArticle);
        
        return updatedArticle;
    }

    public void deleteArticle(Long articleId, Long userId) {
        log.info("Deleting article {} for user {}", articleId, userId);
        
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + articleId));
        
        // Verify ownership
        if (!article.getUserId().equals(userId)) {
            throw new RuntimeException("User " + userId + " is not the owner of article " + articleId);
        }
        
        // Trigger webhook before deleting
        webhookService.sendWebhook(article.getUserId(), "ARTICLE_DELETED", article);
        
        articleRepository.delete(article);
    }

    @Transactional(readOnly = true)
    public List<Article> getArticlesByUser(Long userId) {
        log.info("Getting articles for user {}", userId);
        return articleRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Article getArticleById(Long articleId) {
        return articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + articleId));
    }
}
