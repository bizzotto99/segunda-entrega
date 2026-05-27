//Este archivo es el "portero" de toda la aplicación.
// Evita que el usuario vea errores técnicos de Java (NullPointerException, etc.)

package com.ecommerce.camisetas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice // Con @ControllerAdvice, Spring le aplica este manejador a TODOS los
                  // controladores automáticamente.
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class) // cuando un Club, Producto u Orden no existe en la BD
    public ResponseEntity<Object> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return buildResponseEntity(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(BusinessValidationException.class) // cuando se viola una regla de negocio (sin stock, carrito
                                                         // cerrado, etc.)
    public ResponseEntity<Object> handleBusinessValidationException(BusinessValidationException ex) {
        return buildResponseEntity(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class) // cuando los DTOs no pasan las validaciones (@NotBlank,
                                                             // @Email, etc.) Une todos los mensajes de error en un solo
                                                             // texto
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {

        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(". "));

        return buildResponseEntity(HttpStatus.BAD_REQUEST, errorMessage);
    }

    @ExceptionHandler(BadCredentialsException.class) // cuando el login falla (contraseña incorrecta)
    public ResponseEntity<Object> handleBadCredentialsException(BadCredentialsException ex) {
        return buildResponseEntity(HttpStatus.UNAUTHORIZED,
                "Usuario o contraseña incorrectos. Por favor, intente nuevamente.");
    }

    @ExceptionHandler(AccessDeniedException.class) // cuando un COMPRADOR intenta hacer algo de VENDEDOR (403 Forbidden)
    public ResponseEntity<Object> handleAccessDeniedException(AccessDeniedException ex) {
        return buildResponseEntity(HttpStatus.FORBIDDEN, "No tienes permisos para realizar esta acción.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGlobalException(Exception ex) {
        // solo imprimimos el error en consola para desarrolladores
        ex.printStackTrace();

        // al usuario le damos un mensaje genérico protector
        return buildResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR,
                "Ha ocurrido un error inesperado. Por favor, intente más tarde.");
    }

    private ResponseEntity<Object> buildResponseEntity(HttpStatus status, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return new ResponseEntity<>(body, status);
    }
}
