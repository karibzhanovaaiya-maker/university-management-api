package kz.iitu.hello.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import kz.iitu.hello.dto.FileResponse;
import kz.iitu.hello.service.FileStorageService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Lab 8 — multipart file upload. {@code consumes = multipart/form-data} and the file
 * arrives as {@code @RequestParam("file") MultipartFile}.
 */
@RestController
@RequestMapping("/api/files")
@Tag(name = "Files", description = "Avatar upload (multipart) — any authenticated user")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(value = "/{userId}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload avatar", description = "Stores a new avatar and removes the previous one")
    public FileResponse uploadAvatar(@Parameter(description = "User id") @PathVariable Long userId,
                                     @RequestParam("file") MultipartFile file) {
        return FileResponse.from(fileStorageService.saveAvatar(userId, file));
    }

    @GetMapping("/{userId}/avatars")
    @Operation(summary = "List a user's avatars")
    public List<FileResponse> listAvatars(@Parameter(description = "User id") @PathVariable Long userId) {
        return fileStorageService.listAvatars(userId).stream().map(FileResponse::from).toList();
    }
}
