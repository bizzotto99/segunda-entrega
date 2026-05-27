package com.ecommerce.camisetas.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path storageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public FileStorageService() {
        try {
            Files.createDirectories(this.storageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("No se pudo crear el directorio para subir archivos.", ex);
        }
    }

    public String saveFile(MultipartFile file) {
        String originalFilename = file.getOriginalFilename() != null ? StringUtils.cleanPath(file.getOriginalFilename()) : "image.jpg";
        String extension = getFileExtension(originalFilename);
        String fileName = UUID.randomUUID().toString() + extension;

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("El nombre del archivo contiene una ruta relativa inválida " + fileName);
            }

            Path targetLocation = this.storageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("No se pudo guardar el archivo " + fileName + ". Por favor intente de nuevo.", ex);
        }
    }

    private String getFileExtension(String filename) {
        int index = filename.lastIndexOf(".");
        if (index > 0) {
            return filename.substring(index);
        }
        return ".jpg";
    }
}
