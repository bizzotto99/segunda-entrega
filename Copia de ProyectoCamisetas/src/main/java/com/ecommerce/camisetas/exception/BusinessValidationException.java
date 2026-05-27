// Excepción personalizada para errores.
package com.ecommerce.camisetas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST) // 400 Bad Request
public class BusinessValidationException extends RuntimeException {
    public BusinessValidationException(String message) {
        super(message); // Envía el mensaje de error hacia arriba en la cadena
    }
}
