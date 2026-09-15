package ru.neoflex.depositcalculator.dto;

import java.math.BigDecimal;

public record DepositCalculationResponse(BigDecimal total, BigDecimal profit) {
}
