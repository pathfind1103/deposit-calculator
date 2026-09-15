package ru.neoflex.depositcalculator.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DepositCalculationRequest(
        @NotNull(message = "Amount is required")
        @DecimalMin(value = "1000", message = "Amount must be at least 1000")
        @DecimalMax(value = "10000000", message = "Amount must not exceed 10000000")
        BigDecimal amount,

        @NotNull(message = "Months is required")
        @Min(value = 1, message = "Months must be at least 1")
        @Max(value = 60, message = "Months must not exceed 60")
        Integer months,

        @NotNull(message = "Rate is required")
        @DecimalMin(value = "1", message = "Rate must be at least 1")
        @DecimalMax(value = "20", message = "Rate must not exceed 20")
        BigDecimal rate
) {
}
