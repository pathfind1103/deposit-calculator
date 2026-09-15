package ru.neoflex.depositcalculator.service;

import org.springframework.stereotype.Service;
import ru.neoflex.depositcalculator.dto.DepositCalculationRequest;
import ru.neoflex.depositcalculator.dto.DepositCalculationResponse;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.Objects;

@Service
public class DepositCalculationService {

    private static final BigDecimal ONE_HUNDRED = BigDecimal.valueOf(100);
    private static final BigDecimal MONTHS_IN_YEAR = BigDecimal.valueOf(12);
    private static final MathContext CALCULATION_CONTEXT = MathContext.DECIMAL128;
    private static final int MONEY_SCALE = 2;

    public DepositCalculationResponse calculate(DepositCalculationRequest request) {
        Objects.requireNonNull(request, "Request must not be null");

        BigDecimal monthlyRate = request.rate()
                .divide(ONE_HUNDRED, CALCULATION_CONTEXT)
                .divide(MONTHS_IN_YEAR, CALCULATION_CONTEXT);

        BigDecimal growthFactor = BigDecimal.ONE
                .add(monthlyRate, CALCULATION_CONTEXT)
                .pow(request.months(), CALCULATION_CONTEXT);

        BigDecimal total = request.amount()
                .multiply(growthFactor, CALCULATION_CONTEXT)
                .setScale(MONEY_SCALE, RoundingMode.HALF_UP);

        BigDecimal profit = total
                .subtract(request.amount(), CALCULATION_CONTEXT)
                .setScale(MONEY_SCALE, RoundingMode.HALF_UP);

        return new DepositCalculationResponse(total, profit);
    }
}
