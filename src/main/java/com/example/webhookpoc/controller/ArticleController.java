package com.example.webhookpoc.controller;

import com.example.webhookpoc.dto.ArticleDTO;
import com.example.webhookpoc.entity.Article;
import com.example.webhookpoc.service.ArticleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
@Slf4j
public class ArticleController {

    private final ArticleService articleService;

    @PostMapping
    public ResponseEntity<Article> createArticle(@RequestBody ArticleDTO articleDto) {
        log.info("POST /api/articles - Creating article for user {}", articleDto.getUserId());
        Article article = articleService.createArticle(articleDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(article);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Long id, @RequestBody ArticleDTO articleDto) {
        log.info("PUT /api/articles/{} - Updating article for user {}", id, articleDto.getUserId());
        Article article = articleService.updateArticle(id, articleDto);
        return ResponseEntity.ok(article);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id, @RequestParam Long userId) {
        log.info("DELETE /api/articles/{} - Deleting article for user {}", id, userId);
        articleService.deleteArticle(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Article>> getArticlesByUser(@PathVariable Long userId) {
        log.info("GET /api/articles/user/{} - Getting articles for user", userId);
        List<Article> articles = articleService.getArticlesByUser(userId);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        log.info("GET /api/articles/{} - Getting article by id", id);
        Article article = articleService.getArticleById(id);
        return ResponseEntity.ok(article);
    }
}
