package kz.iitu.hello.service;

import kz.iitu.hello.entity.User;
import kz.iitu.hello.entity.UserFile;
import kz.iitu.hello.repository.UserFileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

/**
 * Lab 8 — validates and stores uploaded files on disk, tracking metadata in
 * {@link UserFile}. Avatar replacement deletes old files only <b>after</b> the new
 * one is safely saved.
 */
@Service
public class FileStorageService {

    static final String AVATAR_TYPE = "AVATAR";

    private static final long MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
    private static final long MIN_FILE_SIZE_BYTES = 1024;            // 1 KB
    private static final Set<String> ALLOWED_AVATAR_TYPES =
            Set.of("image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp");

    private final UserFileRepository userFileRepository;
    private final UserService userService;
    private final Path uploadDir;

    public FileStorageService(UserFileRepository userFileRepository,
                              UserService userService,
                              @Value("${app.upload.dir}") String uploadDir) {
        this.userFileRepository = userFileRepository;
        this.userService = userService;
        this.uploadDir = Paths.get(uploadDir);
    }

    @Transactional
    public UserFile saveAvatar(Long userId, MultipartFile file) {
        validateNotEmpty(file, "Avatar file is required");
        validateFileSize(file);
        validateAvatarContentType(file.getContentType());

        User user = userService.findById(userId);
        List<UserFile> oldAvatars = userFileRepository.findByUserIdAndFileType(userId, AVATAR_TYPE);

        UserFile newAvatar = saveFile(user, file, AVATAR_TYPE);
        oldAvatars.forEach(this::deleteFileInternal);
        return newAvatar;
    }

    @Transactional(readOnly = true)
    public List<UserFile> listAvatars(Long userId) {
        return userFileRepository.findByUserIdAndFileType(userId, AVATAR_TYPE);
    }

    private UserFile saveFile(User user, MultipartFile file, String fileType) {
        try {
            Files.createDirectories(uploadDir);
            String original = StringUtils.cleanPath(
                    Objects.requireNonNullElse(file.getOriginalFilename(), "file"));
            String stored = UUID.randomUUID() + "_" + original;
            Path target = uploadDir.resolve(stored);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            UserFile userFile = UserFile.builder()
                    .fileName(original)
                    .fileType(fileType)
                    .contentType(file.getContentType())
                    .storagePath(target.toString())
                    .size(file.getSize())
                    .user(user)
                    .build();
            return userFileRepository.save(userFile);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store file", e);
        }
    }

    private void deleteFileInternal(UserFile userFile) {
        try {
            Files.deleteIfExists(Paths.get(userFile.getStoragePath()));
        } catch (IOException ignored) {
            // metadata cleanup proceeds even if the physical file is already gone
        }
        userFileRepository.delete(userFile);
    }

    private void validateNotEmpty(MultipartFile file, String message) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(message);
        }
    }

    private void validateFileSize(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("File size exceeds 2MB limit");
        }
        if (file.getSize() < MIN_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("File too small");
        }
    }

    private void validateAvatarContentType(String contentType) {
        if (contentType == null || !ALLOWED_AVATAR_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Avatar must be an image (png, jpeg, gif, webp)");
        }
    }
}
