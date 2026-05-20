package kz.iitu.hello.dto;

import kz.iitu.hello.entity.UserFile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class FileResponse {

    private final Long id;
    private final String fileName;
    private final String fileType;
    private final String contentType;
    private final Long size;
    private final Long userId;
    private final LocalDateTime uploadedAt;

    public static FileResponse from(UserFile f) {
        return FileResponse.builder()
                .id(f.getId())
                .fileName(f.getFileName())
                .fileType(f.getFileType())
                .contentType(f.getContentType())
                .size(f.getSize())
                .userId(f.getUser() != null ? f.getUser().getId() : null)
                .uploadedAt(f.getUploadedAt())
                .build();
    }
}
