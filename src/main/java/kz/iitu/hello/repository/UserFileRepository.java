package kz.iitu.hello.repository;

import kz.iitu.hello.entity.UserFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Lab 8 — lookup of a user's files by type (e.g. all current "AVATAR" rows).
 */
public interface UserFileRepository extends JpaRepository<UserFile, Long> {

    List<UserFile> findByUserIdAndFileType(Long userId, String fileType);
}
